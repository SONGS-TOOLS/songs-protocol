import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture } from './fixtures/protocolFixture';

describe("WrappedSong Earnings", function () {
    async function setupWrappedSongAndDistributor() {
        const fixture = await loadFixture(deployProtocolFixture);
        const {
            artist,
            deployer,
            mockStablecoin,
            wrappedSongFactory,
            protocolModule,
            feesModule
        } = fixture;
        
        // Create wrapped song
        const creationFee = await feesModule.wrappedSongCreationFee();
        await wrappedSongFactory.connect(artist).createWrappedSong(
            mockStablecoin.target,
            {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            },
            10000, // Total shares
            artist.address,
            { value: creationFee }
        );

        // Get wrapped song instance
        const artistWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
        const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", artistWrappedSongs[0]);

        // Mint tokens to artist for testing
        await mockStablecoin.mint(artist.address, ethers.parseEther("10000"));

        return { ...fixture, wrappedSong };
    }

    describe("Basic Functionality", function () {
        it("should initialize with correct state", async function () {
            const { wrappedSong, artist, mockStablecoin } = await loadFixture(setupWrappedSongAndDistributor);
            
            expect(await wrappedSong.owner()).to.equal(artist.address);
            expect(await wrappedSong.stablecoin()).to.equal(mockStablecoin.target);
            expect(await wrappedSong.migrated()).to.equal(false);
        });

        it("should track epoch balances correctly", async function () {
            const { wrappedSong, artist, mockStablecoin } = await loadFixture(setupWrappedSongAndDistributor);

            const initialBalance = await wrappedSong.userEpochBalances(artist.address);
            expect(initialBalance.lastClaimedEpoch).to.equal(0);
            expect(initialBalance.lastClaimedETHEpoch).to.equal(0);

            // Create and process a distribution epoch
            const amount = ethers.parseEther("1.0");
            await mockStablecoin.connect(artist).approve(wrappedSong.target, amount);
            await wrappedSong.connect(artist).receiveERC20(mockStablecoin.target, amount);
            await wrappedSong.createStablecoinDistributionEpoch();
            await wrappedSong.connect(artist).claimStablecoinEarnings(1);

            const updatedBalance = await wrappedSong.userEpochBalances(artist.address);
            expect(updatedBalance.lastClaimedEpoch).to.equal(1);
            expect(updatedBalance.lastClaimedETHEpoch).to.equal(0);
        });
    });

    describe("Edge Cases", function () {
        it("should handle zero amount distributions", async function () {
            const { wrappedSong } = await loadFixture(setupWrappedSongAndDistributor);
            
            await expect(
                wrappedSong.createStablecoinDistributionEpoch()
            ).to.be.revertedWith("No new earnings to distribute");
            
            await expect(
                wrappedSong.createETHDistributionEpoch()
            ).to.be.revertedWith("No ETH to distribute");
        });

        it("should handle multiple claims in same epoch", async function () {
            const { wrappedSong, artist, mockStablecoin } = await loadFixture(setupWrappedSongAndDistributor);
            
            const amount = ethers.parseEther("1.0");
            await mockStablecoin.connect(artist).approve(wrappedSong.target, amount);
            await wrappedSong.connect(artist).receiveERC20(mockStablecoin.target, amount);
            await wrappedSong.createStablecoinDistributionEpoch();
            
            // First claim should succeed
            await wrappedSong.connect(artist).claimStablecoinEarnings(1);
            
            // Second claim should fail
            await expect(
                wrappedSong.connect(artist).claimStablecoinEarnings(1)
            ).to.be.revertedWith("No new epochs");
        });

        it("should handle claims after share transfers", async function () {
            const { wrappedSong, artist, collector, mockStablecoin } = await loadFixture(setupWrappedSongAndDistributor);
            
            // First distribution - direct transfer to wrapped song
            const firstAmount = ethers.parseEther("1000");
            await mockStablecoin.mint(artist.address, firstAmount * 2n);
            await mockStablecoin.connect(artist).approve(wrappedSong.target, firstAmount);
            await wrappedSong.connect(artist).receiveERC20(mockStablecoin.target, firstAmount);
            
            // Verify pending amount
            expect(await wrappedSong.getPendingStablecoinDistribution()).to.equal(firstAmount);
            
            await wrappedSong.createStablecoinDistributionEpoch();
            
            // Verify pending amount is reset
            expect(await wrappedSong.getPendingStablecoinDistribution()).to.equal(0);
            
            // Artist claims first epoch before transfer
            await wrappedSong.connect(artist).claimStablecoinEarnings(1);
            
            // Transfer half shares to collector
            const wsTokenManagement = await ethers.getContractAt(
                "WSTokenManagement",
                await wrappedSong.getWSTokenManagementAddress()
            );
            
            await wsTokenManagement.connect(artist).safeTransferFrom(
                artist.address,
                collector.address,
                1, // songSharesId
                5000, // 50% of shares
                "0x"
            );
            
            // Second distribution - direct transfer to wrapped song
            const secondAmount = ethers.parseEther("500");
            await mockStablecoin.connect(artist).approve(wrappedSong.target, secondAmount);
            await wrappedSong.connect(artist).receiveERC20(mockStablecoin.target, secondAmount);
            
            // Verify new pending amount
            expect(await wrappedSong.getPendingStablecoinDistribution()).to.equal(secondAmount);
            
            await wrappedSong.createStablecoinDistributionEpoch();
            
            // Verify pending amount is reset again
            expect(await wrappedSong.getPendingStablecoinDistribution()).to.equal(0);
            
            // Both claim second epoch
            const artistInitialBalance = await mockStablecoin.balanceOf(artist.address);
            const collectorInitialBalance = await mockStablecoin.balanceOf(collector.address);
            
            await wrappedSong.connect(artist).claimStablecoinEarnings(2);
            await wrappedSong.connect(collector).claimStablecoinEarnings(2);
            
            // Get final balances
            const artistFinalBalance = await mockStablecoin.balanceOf(artist.address);
            const collectorFinalBalance = await mockStablecoin.balanceOf(collector.address);
            
            // Artist should receive 50% of second epoch
            expect(artistFinalBalance - artistInitialBalance).to.equal(secondAmount / 2n);
            // Collector should receive 50% of second epoch
            expect(collectorFinalBalance - collectorInitialBalance).to.equal(secondAmount / 2n);
        });

        it("should handle ETH distributions correctly", async function () {
            const { wrappedSong, artist } = await loadFixture(setupWrappedSongAndDistributor);
            
            // Send ETH directly to contract
            await artist.sendTransaction({
                to: wrappedSong.target,
                value: ethers.parseEther("1.0")
            });

            await wrappedSong.createETHDistributionEpoch();
            await wrappedSong.connect(artist).claimETHEarnings(1);

            const balance = await wrappedSong.userEpochBalances(artist.address);
            expect(balance.lastClaimedETHEpoch).to.equal(1);
        });
    });

}); 