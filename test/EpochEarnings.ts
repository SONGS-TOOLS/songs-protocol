import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture } from './fixtures/protocolFixture';

describe("Epoch-based Earnings Distribution", function () {
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
        
        await distributorWallet.connect(distributor).createDistributionEpochChunk(
            1, // first epoch
            0,
            [firstAmount],
            firstAmount,
            true,
            true
        );

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
        
        await distributorWallet.connect(distributor).createDistributionEpochChunk(
            2, // second epoch
            0,
            [secondAmount],
            secondAmount,
            true,
            true
        );

        // Get initial balances before claiming
        const artistInitialBalance = await mockStablecoin.balanceOf(artist.address);
        const collectorInitialBalance = await mockStablecoin.balanceOf(collector.address);

        // Claim both epochs
        await distributorWallet.connect(artist).claimMultipleEpochs(wrappedSong.target, [1, 2]);
        await distributorWallet.connect(collector).claimMultipleEpochs(wrappedSong.target, [1, 2]);

        // Get final balances
        const artistFinalBalance = await mockStablecoin.balanceOf(artist.address);
        const collectorFinalBalance = await mockStablecoin.balanceOf(collector.address);

        // Calculate expected earnings
        const artistExpected = firstAmount + (secondAmount * BigInt(5000)) / BigInt(10000);
        const collectorExpected = (secondAmount * BigInt(5000)) / BigInt(10000);

        // Verify earnings distribution
        expect(artistFinalBalance - artistInitialBalance).to.equal(artistExpected);
        expect(collectorFinalBalance - collectorInitialBalance).to.equal(collectorExpected);

        // Verify epochs are claimed
        expect(await distributorWallet.epochClaims(1, artist.address)).to.be.true;
        expect(await distributorWallet.epochClaims(2, artist.address)).to.be.true;
        expect(await distributorWallet.epochClaims(1, collector.address)).to.be.true;
        expect(await distributorWallet.epochClaims(2, collector.address)).to.be.true;
    });

    it("should handle multiple chunks in distribution epoch", async function () {
        const {
            artist,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSong,
            distributorWallet
        } = await setupWrappedSongAndDistributor();

        // Create a large distribution with multiple chunks
        const amountPerSong = ethers.parseUnits("100", 18);
        const chunksCount = 3;
        const songsPerChunk = 500;
        const totalAmount = amountPerSong * BigInt(chunksCount * songsPerChunk);

        // Transfer and approve tokens
        await mockStablecoin.connect(deployer).transfer(distributor.address, totalAmount);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, totalAmount);

        // Create distribution in chunks
        for (let i = 0; i < chunksCount; i++) {
            const amounts = Array(songsPerChunk).fill(amountPerSong);
            await distributorWallet.connect(distributor).createDistributionEpochChunk(
                1, // epoch id
                i, // chunk index
                amounts,
                i === 0 ? totalAmount : 0, // only send total on first chunk
                i === 0, // isFirstChunk
                i === chunksCount - 1 // isLastChunk
            );
        }

        // Verify chunk storage
        const wsIndex = await distributorWallet.wsRedeemIndexList(wrappedSong.target);
        const amount = await distributorWallet.getAmountForWS(1, wsIndex);
        expect(amount).to.equal(amountPerSong);

        // Claim and verify earnings
        const initialBalance = await mockStablecoin.balanceOf(artist.address);
        await distributorWallet.connect(artist).claimEpochEarnings(wrappedSong.target, 1);
        const finalBalance = await mockStablecoin.balanceOf(artist.address);

        expect(finalBalance - initialBalance).to.equal(amountPerSong);
    });
}); 