import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture } from './fixtures/protocolFixture';

describe("DistributorWallet Security Tests", function () {
    this.timeout(120000);

    async function setupDistributorAndSong() {
        const fixture = await loadFixture(deployProtocolFixture);
        const {
            artist,
            collector,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSongFactory,
            protocolModule,
            feesModule,
            releaseModule,
            distributorWalletFactory
        } = fixture;
        const distributorCreationFee = await feesModule.distributorCreationFee();

        // Create distributor wallet
        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            protocolModule.target,
            distributor.address,
            { value: distributorCreationFee }
        );
        const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
        const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

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
            10000,
            { value: creationFee }
        );

        const artistWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
        const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", artistWrappedSongs[0]);

        // Setup release
        const releaseFee = await feesModule.releaseFee();
        await releaseModule.connect(artist).requestWrappedSongRelease(wrappedSong.target, distributorWallet.target, { value: releaseFee });
        await distributorWallet.connect(distributor).confirmWrappedSongRelease(wrappedSong.target);

        return {
            ...fixture,
            wrappedSong,
            distributorWallet
        };
    }

    describe("Double Spending Prevention", function () {
        it("should prevent double claiming of the same epoch", async function () {
            const {
                artist,
                distributor,
                deployer,
                mockStablecoin,
                wrappedSong,
                distributorWallet
            } = await setupDistributorAndSong();

            // Setup distribution
            const amount = ethers.parseUnits("1000", 18);
            await mockStablecoin.connect(deployer).transfer(distributor.address, amount);
            await mockStablecoin.connect(distributor).approve(distributorWallet.target, amount);
            
            await distributorWallet.connect(distributor).createDistributionEpochChunk(
                1,
                0,
                [amount],
                amount,
                true,
                true
            );

            // First claim should succeed
            await distributorWallet.connect(artist).claimEpochEarnings(wrappedSong.target, 1);

            // Second claim should fail
            await expect(
                distributorWallet.connect(artist).claimEpochEarnings(wrappedSong.target, 1)
            ).to.be.revertedWith("Already claimed");
        });

        it("should prevent double claiming in multiple epochs claim", async function () {
            const {
                artist,
                distributor,
                deployer,
                mockStablecoin,
                wrappedSong,
                distributorWallet
            } = await setupDistributorAndSong();

            // Setup two epochs
            const amount = ethers.parseUnits("1000", 18);
            const totalAmount = amount * 2n;
            await mockStablecoin.connect(deployer).transfer(distributor.address, totalAmount);
            await mockStablecoin.connect(distributor).approve(distributorWallet.target, totalAmount);

            // Create epoch 1
            await distributorWallet.connect(distributor).createDistributionEpochChunk(
                1,
                0,
                [amount],
                amount,
                true,
                true
            );

            // Create epoch 2
            await distributorWallet.connect(distributor).createDistributionEpochChunk(
                2,
                0,
                [amount],
                amount,
                true,
                true
            );

            // Claim both epochs
            await distributorWallet.connect(artist).claimMultipleEpochs(wrappedSong.target, [1, 2]);

            // Try to claim again
            await expect(
                distributorWallet.connect(artist).claimMultipleEpochs(wrappedSong.target, [1, 2])
            ).to.be.revertedWith("Epoch already claimed");
        });
    });

    describe("Epoch Sequence and Timing", function () {
        it("should prevent creating epochs out of sequence", async function () {
            const {
                distributor,
                deployer,
                mockStablecoin,
                distributorWallet
            } = await setupDistributorAndSong();

            const amount = ethers.parseUnits("1000", 18);
            await mockStablecoin.connect(deployer).transfer(distributor.address, amount);
            await mockStablecoin.connect(distributor).approve(distributorWallet.target, amount);

            // Try to create epoch 2 before epoch 1
            await expect(
                distributorWallet.connect(distributor).createDistributionEpochChunk(
                    2,
                    0,
                    [amount],
                    amount,
                    true,
                    true
                )
            ).to.be.revertedWith("Invalid epoch id");
        });

        it("should handle balance snapshots correctly across epochs", async function () {
            const {
                artist,
                collector,
                distributor,
                deployer,
                mockStablecoin,
                wrappedSong,
                distributorWallet
            } = await setupDistributorAndSong();

            const wsTokenManagement = await ethers.getContractAt(
                "WSTokenManagement",
                await wrappedSong.getWSTokenManagementAddress()
            );

            // First epoch
            const amount = ethers.parseUnits("1000", 18);
            await mockStablecoin.connect(deployer).transfer(distributor.address, amount);
            await mockStablecoin.connect(distributor).approve(distributorWallet.target, amount);
            
            await distributorWallet.connect(distributor).createDistributionEpochChunk(
                1,
                0,
                [amount],
                amount,
                true,
                true
            );

            // Transfer shares
            await wsTokenManagement.connect(artist).safeTransferFrom(
                artist.address,
                collector.address,
                1,
                5000,
                "0x"
            );

            // Advance time
            await time.increase(86400); // 1 day

            // Second epoch
            await mockStablecoin.connect(deployer).transfer(distributor.address, amount);
            await mockStablecoin.connect(distributor).approve(distributorWallet.target, amount);
            
            await distributorWallet.connect(distributor).createDistributionEpochChunk(
                2,
                0,
                [amount],
                amount,
                true,
                true
            );

            // Verify correct balances for both epochs
            const artistEpoch1 = await distributorWallet.getClaimableAmount(wrappedSong.target, artist.address, 1);
            const artistEpoch2 = await distributorWallet.getClaimableAmount(wrappedSong.target, artist.address, 2);
            const collectorEpoch1 = await distributorWallet.getClaimableAmount(wrappedSong.target, collector.address, 1);
            const collectorEpoch2 = await distributorWallet.getClaimableAmount(wrappedSong.target, collector.address, 2);

            expect(artistEpoch1).to.equal(amount);
            expect(artistEpoch2).to.equal(amount / 2n);
            expect(collectorEpoch1).to.equal(0);
            expect(collectorEpoch2).to.equal(amount / 2n);
        });
    });

    describe("Access Control and Emergency Functions", function () {
        it("should prevent non-owners from creating distributions", async function () {
            const {
                artist,
                distributor,
                mockStablecoin,
                distributorWallet
            } = await setupDistributorAndSong();

            const amount = ethers.parseUnits("1000", 18);
            
            await expect(
                distributorWallet.connect(artist).createDistributionEpochChunk(
                    1,
                    0,
                    [amount],
                    amount,
                    true,
                    true
                )
            ).to.be.revertedWithCustomError(distributorWallet, "OwnableUnauthorizedAccount")
             .withArgs(artist.address);
        });

        it("should prevent recovering stablecoin through recovery function", async function () {
            const {
                distributor,
                mockStablecoin,
                distributorWallet
            } = await setupDistributorAndSong();

            await expect(
                distributorWallet.connect(distributor).recoverTokens(mockStablecoin.target)
            ).to.be.revertedWith("Cannot recover stablecoin");
        });
    });

    describe("Chunk Management", function () {
        it("should prevent chunks larger than CHUNK_SIZE", async function () {
            const {
                distributor,
                deployer,
                mockStablecoin,
                distributorWallet
            } = await setupDistributorAndSong();

            const CHUNK_SIZE = await distributorWallet.CHUNK_SIZE();
            const amount = ethers.parseUnits("1", 18);
            const amounts = Array(Number(CHUNK_SIZE) + 1).fill(amount);
            
            await expect(
                distributorWallet.connect(distributor).createDistributionEpochChunk(
                    1,
                    0,
                    amounts,
                    amount,
                    true,
                    true
                )
            ).to.be.revertedWith("Chunk too large");
        });
    });
}); 