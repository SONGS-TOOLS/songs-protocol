import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture } from './fixtures/protocolFixture';

describe("Epoch-based Earnings Distribution - Basic", function () {
    this.timeout(120000); // 2 minutes

    async function setupWrappedSongAndDistributor() {
        const fixture = await loadFixture(deployProtocolFixture);
        const {
            artist,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSongFactory,
            protocolModule,
            distributorWalletFactory
        } = fixture;
        
        // Create wrapped song
        const creationFee = await protocolModule.wrappedSongCreationFee();
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
            { value: creationFee }
        );

        // Get wrapped song instance
        const artistWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
        const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", artistWrappedSongs[0]);

        // Create and setup distributor wallet
        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            protocolModule.target,
            distributor.address
        );
        const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
        const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

        // Setup release
        await protocolModule.connect(artist).requestWrappedSongRelease(wrappedSong.target, distributorWallet.target);
        await distributorWallet.connect(distributor).confirmWrappedSongRelease(wrappedSong.target);

        return {
            ...fixture,
            wrappedSong,
            distributorWallet
        };
    }

    it("should allow wrapped song to redeem earnings from distributor wallet", async function () {
        const {
            artist,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSong,
            distributorWallet
        } = await setupWrappedSongAndDistributor();

        // Setup earnings
        const earningsAmount = ethers.parseUnits("1000", 18);
        await mockStablecoin.connect(deployer).transfer(distributor.address, earningsAmount);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, earningsAmount);

        // Process earnings
        await distributorWallet.connect(distributor).receiveBatchPaymentStablecoin(
            [wrappedSong.target],
            [earningsAmount],
            earningsAmount,
            "Spotify"
        );

        // Track balances before redemption
        const initialWSBalance = await mockStablecoin.balanceOf(wrappedSong.target);
        const initialArtistBalance = await mockStablecoin.balanceOf(artist.address);

        // Redeem and claim earnings
        await distributorWallet.connect(distributor).redeemWrappedSongEarnings(wrappedSong.target);

        // Verify wrapped song received the funds
        const midWSBalance = await mockStablecoin.balanceOf(wrappedSong.target);
        expect(midWSBalance - initialWSBalance).to.equal(earningsAmount, "Wrapped song should have received tokens");

        // Then proceed with claiming
        await wrappedSong.connect(artist).claimEarnings(mockStablecoin.target, 1);

        // Verify final balances
        const finalWSBalance = await mockStablecoin.balanceOf(wrappedSong.target);
        const finalArtistBalance = await mockStablecoin.balanceOf(artist.address);

        // Verify earnings distribution
        expect(finalWSBalance).to.equal(initialWSBalance, "All earnings should be claimed"); // Should be back to initial balance
        expect(finalArtistBalance - initialArtistBalance).to.equal(earningsAmount, "Artist should have received all earnings");

        // Verify no more epochs to claim
        const [hasMore, , totalEpochs] = await wrappedSong.hasMoreEpochsToClaim(
            artist.address,
            mockStablecoin.target
        );
        expect(hasMore).to.be.false;
        expect(totalEpochs).to.equal(0);
    });

    it("should handle earnings correctly when shares are transferred between epochs", async function () {
        const {
            artist,
            collector,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSong,
            distributorWallet
        } = await setupWrappedSongAndDistributor();

        const wsTokenManagement = await ethers.getContractAt(
            "WSTokenManagement", 
            await wrappedSong.getWSTokenManagementAddress()
        );

        // First distribution (artist owns all shares)
        const firstAmount = ethers.parseUnits("1000", 18);
        await mockStablecoin.connect(deployer).transfer(distributor.address, firstAmount);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, firstAmount);
        
        await distributorWallet.connect(distributor).receiveBatchPaymentStablecoin(
            [wrappedSong.target],
            [firstAmount],
            firstAmount,
            "First Distribution"
        );
        await distributorWallet.connect(distributor).redeemWrappedSongEarnings(wrappedSong.target);

        // Transfer half shares to collector before second distribution
        await wsTokenManagement.connect(artist).safeTransferFrom(
            artist.address,
            collector.address,
            1, // SONG_SHARES_ID
            5000, // Transfer 50% of shares
            "0x"
        );

        // Second distribution (artist and collector each own half)
        const secondAmount = ethers.parseUnits("500", 18);
        await mockStablecoin.connect(deployer).transfer(distributor.address, secondAmount);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, secondAmount);
        
        await distributorWallet.connect(distributor).receiveBatchPaymentStablecoin(
            [wrappedSong.target],
            [secondAmount],
            secondAmount,
            "Second Distribution"
        );
        await distributorWallet.connect(distributor).redeemWrappedSongEarnings(wrappedSong.target);

        // Get initial balances before claiming
        const artistInitialBalance = await mockStablecoin.balanceOf(artist.address);
        const collectorInitialBalance = await mockStablecoin.balanceOf(collector.address);

        // Claim earnings for both users
        await wrappedSong.connect(artist).claimEarnings(mockStablecoin.target, 0);
        await wrappedSong.connect(collector).claimEarnings(mockStablecoin.target, 0);

        // Get final balances
        const artistFinalBalance = await mockStablecoin.balanceOf(artist.address);
        const collectorFinalBalance = await mockStablecoin.balanceOf(collector.address);

        // Calculate expected earnings
        // Artist should get:
        // - 100% of first distribution (1000)
        // - 50% of second distribution (500 * 0.5 = 250)
        const artistExpected = firstAmount + (secondAmount * BigInt(5000)) / BigInt(10000);

        // Collector should get:
        // - 0% of first distribution (0)
        // - 50% of second distribution (500 * 0.5 = 250)
        const collectorExpected = (secondAmount * BigInt(5000)) / BigInt(10000);

        // Verify earnings distribution
        expect(artistFinalBalance - artistInitialBalance).to.equal(
            artistExpected,
            "Artist should get 1000 from first distribution + 250 from second distribution = 1250"
        );
        
        expect(collectorFinalBalance - collectorInitialBalance).to.equal(
            collectorExpected,
            "Collector should get 250 from second distribution only"
        );

        // Verify total distributed matches total earnings
        const totalDistributed = (artistFinalBalance - artistInitialBalance) + 
                               (collectorFinalBalance - collectorInitialBalance);
        expect(totalDistributed).to.equal(
            firstAmount + secondAmount,
            "Total distributed should be 1500 (1000 from first + 500 from second distribution)"
        );

        // Verify no more epochs to claim for either user
        const [hasMoreArtist, , totalEpochsArtist] = await wrappedSong.hasMoreEpochsToClaim(
            artist.address,
            mockStablecoin.target
        );
        expect(hasMoreArtist).to.be.false;
        expect(totalEpochsArtist).to.equal(0);

        const [hasMoreCollector, , totalEpochsCollector] = await wrappedSong.hasMoreEpochsToClaim(
            collector.address,
            mockStablecoin.target
        );
        expect(hasMoreCollector).to.be.false;
        expect(totalEpochsCollector).to.equal(0);
    });






    it("should allow multiple share holders to claim ETH earnings proportionally", async function () {
        const {
            artist,
            collector,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSongFactory,
            protocolModule
        } = await loadFixture(deployProtocolFixture);
        
        // Create wrapped song
        const creationFee = await protocolModule.wrappedSongCreationFee();
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
            { value: creationFee }
        );

        // Get wrapped song instance
        const artistWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
        const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", artistWrappedSongs[0]);
        const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", await wrappedSong.getWSTokenManagementAddress());

        // Transfer shares to other users (artist keeps 5000, collector gets 3000, distributor gets 2000)
        await wsTokenManagement.connect(artist).safeTransferFrom(
            artist.address,
            collector.address,
            1, // SONG_SHARES_ID
            3000,
            "0x"
        );
        await wsTokenManagement.connect(artist).safeTransferFrom(
            artist.address,
            distributor.address,
            1, // SONG_SHARES_ID
            2000,
            "0x"
        );

        // Send ETH earnings directly to wrapped song
        const earningsAmount = ethers.parseEther("1.0"); // 1 ETH
        await deployer.sendTransaction({
            to: wrappedSong.target,
            value: earningsAmount
        });

        // Calculate expected earnings
        const artistExpected = (earningsAmount * BigInt(5000)) / BigInt(10000); // 50%
        const collectorExpected = (earningsAmount * BigInt(3000)) / BigInt(10000); // 30%
        const distributorExpected = (earningsAmount * BigInt(2000)) / BigInt(10000); // 20%

        // Get initial balances
        const artistInitialBalance = await ethers.provider.getBalance(artist.address);
        const collectorInitialBalance = await ethers.provider.getBalance(collector.address);
        const distributorInitialBalance = await ethers.provider.getBalance(distributor.address);

        // Claim earnings for all shareholders
        const tx1 = await wrappedSong.connect(artist).claimEarnings(ethers.ZeroAddress, 0);
        const tx2 = await wrappedSong.connect(collector).claimEarnings(ethers.ZeroAddress, 0);
        const tx3 = await wrappedSong.connect(distributor).claimEarnings(ethers.ZeroAddress, 0);

        // Get gas costs
        const receipt1 = await tx1.wait();
        const receipt2 = await tx2.wait();
        const receipt3 = await tx3.wait();

        if (!receipt1 || !receipt2 || !receipt3) {
            throw new Error("Transaction receipt is null");
        }

        const gasCost1 = receipt1.gasUsed * receipt1.gasPrice;
        const gasCost2 = receipt2.gasUsed * receipt2.gasPrice;
        const gasCost3 = receipt3.gasUsed * receipt3.gasPrice;

        // Get final balances
        const artistFinalBalance = await ethers.provider.getBalance(artist.address);
        const collectorFinalBalance = await ethers.provider.getBalance(collector.address);
        const distributorFinalBalance = await ethers.provider.getBalance(distributor.address);

        // Calculate actual earnings (accounting for gas costs)
        const artistEarned = artistFinalBalance - artistInitialBalance + BigInt(gasCost1);
        const collectorEarned = collectorFinalBalance - collectorInitialBalance + BigInt(gasCost2);
        const distributorEarned = distributorFinalBalance - distributorInitialBalance + BigInt(gasCost3);

        // Verify earnings distribution
        expect(artistEarned).to.equal(artistExpected);
        expect(collectorEarned).to.equal(collectorExpected);
        expect(distributorEarned).to.equal(distributorExpected);

        // Verify all epochs are claimed
        const [hasMore, , totalEpochs] = await wrappedSong.hasMoreEpochsToClaim(
            artist.address,
            ethers.ZeroAddress
        );
        expect(hasMore).to.be.false;
        expect(totalEpochs).to.equal(0);

        // Try to claim again - should fail
        await expect(
            wrappedSong.connect(artist).claimEarnings(ethers.ZeroAddress, 0)
        ).to.be.revertedWith("No new epochs");

        // Check wrapped song balance - should be 0 after all claims
        const wrappedSongBalance = await ethers.provider.getBalance(wrappedSong.target);
        expect(wrappedSongBalance).to.equal(0, "Wrapped song should have 0 balance after all claims");
    });





    it("should allow multiple share holders to claim earnings proportionally", async function () {
        const {
            artist,
            collector,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSongFactory,
            protocolModule,
            distributorWalletFactory
        } = await loadFixture(deployProtocolFixture);
        
        // Create wrapped song
        const creationFee = await protocolModule.wrappedSongCreationFee();
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
            { value: creationFee }
        );

        // Get wrapped song instance
        const artistWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
        const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", artistWrappedSongs[0]);
        const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", await wrappedSong.getWSTokenManagementAddress());

        // Transfer shares to other users (artist keeps 5000, collector gets 3000, distributor gets 2000)
        await wsTokenManagement.connect(artist).safeTransferFrom(
            artist.address,
            collector.address,
            1, // SONG_SHARES_ID
            3000,
            "0x"
        );
        await wsTokenManagement.connect(artist).safeTransferFrom(
            artist.address,
            distributor.address,
            1, // SONG_SHARES_ID
            2000,
            "0x"
        );

        // Create and setup distributor wallet
        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            protocolModule.target,
            distributor.address
        );
        const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
        const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

        // Request and confirm release
        await protocolModule.connect(artist).requestWrappedSongRelease(wrappedSong.target, distributorWallet.target);
        await distributorWallet.connect(distributor).confirmWrappedSongRelease(wrappedSong.target);

        // Send earnings through distributor
        const earningsAmount = ethers.parseUnits("1000", 18);
        
        // Transfer tokens to distributor
        await mockStablecoin.connect(deployer).transfer(distributor.address, earningsAmount);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, earningsAmount);
        
        // Send batch payment
        await distributorWallet.connect(distributor).receiveBatchPaymentStablecoin(
            [wrappedSong.target],
            [earningsAmount],
            earningsAmount,
            "Spotify"
        );

        // Redeem earnings from distributor to wrapped song
        await distributorWallet.connect(distributor).redeemWrappedSongEarnings(wrappedSong.target);

        // Calculate expected earnings
        const artistExpected = (earningsAmount * BigInt(5000)) / BigInt(10000); // 50%
        const collectorExpected = (earningsAmount * BigInt(3000)) / BigInt(10000); // 30%
        const distributorExpected = (earningsAmount * BigInt(2000)) / BigInt(10000); // 20%

        // Get initial balances
        const artistInitialBalance = await mockStablecoin.balanceOf(artist.address);
        const collectorInitialBalance = await mockStablecoin.balanceOf(collector.address);
        const distributorInitialBalance = await mockStablecoin.balanceOf(distributor.address);

        // Claim earnings for all shareholders
        await wrappedSong.connect(artist).claimEarnings(mockStablecoin.target, 0);
        await wrappedSong.connect(collector).claimEarnings(mockStablecoin.target, 0);
        await wrappedSong.connect(distributor).claimEarnings(mockStablecoin.target, 0);

        // Get final balances
        const artistFinalBalance = await mockStablecoin.balanceOf(artist.address);
        const collectorFinalBalance = await mockStablecoin.balanceOf(collector.address);
        const distributorFinalBalance = await mockStablecoin.balanceOf(distributor.address);

        // Verify earnings distribution
        expect(artistFinalBalance - artistInitialBalance).to.equal(artistExpected);
        expect(collectorFinalBalance - collectorInitialBalance).to.equal(collectorExpected);
        expect(distributorFinalBalance - distributorInitialBalance).to.equal(distributorExpected);

        // Verify all epochs are claimed
        const [hasMore, , totalEpochs] = await wrappedSong.hasMoreEpochsToClaim(
            artist.address,
            mockStablecoin.target
        );
        expect(hasMore).to.be.false;
        expect(totalEpochs).to.equal(0);

        // Check wrapped song balance
        const wrappedSongBalance = await mockStablecoin.balanceOf(wrappedSong.target);
        expect(wrappedSongBalance).to.equal(0, "Wrapped song should have 0 balance after all claims");
    });
}); 