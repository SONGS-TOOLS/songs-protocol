import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture } from './fixtures/protocolFixture';

describe("Epoch-based Earnings Distribution", function () {
    this.timeout(300000); // 5 minutes

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
        const distributorCreationFee = await protocolModule.distributorCreationFee();

        // Create and setup distributor wallet
        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            protocolModule.target,
            distributor.address,
            { value: distributorCreationFee }
        );
        const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
        const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

        // Setup release
        const releaseFee = await protocolModule.releaseFee();
        await protocolModule.connect(artist).requestWrappedSongRelease(wrappedSong.target, distributorWallet.target, { value: releaseFee });
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
        expect(await distributorWallet.epochClaims(1, artist.address, wrappedSong.target)).to.be.true;
        expect(await distributorWallet.epochClaims(2, artist.address, wrappedSong.target)).to.be.true;
        expect(await distributorWallet.epochClaims(1, collector.address, wrappedSong.target)).to.be.true;
        expect(await distributorWallet.epochClaims(2, collector.address, wrappedSong.target)).to.be.true;
    });

    it("should handle multiple chunks in distribution epoch", async function () {
        this.timeout(300000);
        const {
            artist,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSong,
            distributorWallet
        } = await setupWrappedSongAndDistributor();

        // Reduce the test data size
        const amountPerSong = ethers.parseUnits("100", 18);
        const chunksCount = 2;
        const songsPerChunk = 100;
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

    it("should handle claiming from multiple wrapped songs in the same epoch", async function () {
        this.timeout(300000); // 5 minutes
        const fixture = await loadFixture(deployProtocolFixture);
        const {
            artist,
            collector,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSongFactory,
            protocolModule,
            distributorWalletFactory
        } = fixture;

        // Create two wrapped songs
        const creationFee = await protocolModule.wrappedSongCreationFee();
        await wrappedSongFactory.connect(artist).createWrappedSong(
            mockStablecoin.target,
            {
                name: "Test Song 1",
                description: "Test Description 1",
                image: "ipfs://image1",
                externalUrl: "https://example1.com",
                animationUrl: "ipfs://animation1",
                attributesIpfsHash: "ipfs://attributes1"
            },
            10000, // Total shares
            { value: creationFee }
        );

        await wrappedSongFactory.connect(artist).createWrappedSong(
            mockStablecoin.target,
            {
                name: "Test Song 2",
                description: "Test Description 2",
                image: "ipfs://image2",
                externalUrl: "https://example2.com",
                animationUrl: "ipfs://animation2",
                attributesIpfsHash: "ipfs://attributes2"
            },
            10000, // Total shares
            { value: creationFee }
        );

        // Get wrapped song instances
        const artistWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
        const wrappedSong1 = await ethers.getContractAt("WrappedSongSmartAccount", artistWrappedSongs[0]);
        const wrappedSong2 = await ethers.getContractAt("WrappedSongSmartAccount", artistWrappedSongs[1]);

        // Create and setup distributor wallet
        const distributorCreationFee = await protocolModule.distributorCreationFee();
        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            protocolModule.target,
            distributor.address,
            { value: distributorCreationFee }
        );
        const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
        const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

        // Setup release for both wrapped songs
        const releaseFee = await protocolModule.releaseFee();   
        await protocolModule.connect(artist).requestWrappedSongRelease(wrappedSong1.target, distributorWallet.target, { value: releaseFee });
        await protocolModule.connect(artist).requestWrappedSongRelease(wrappedSong2.target, distributorWallet.target, { value: releaseFee });
        await distributorWallet.connect(distributor).confirmWrappedSongRelease(wrappedSong1.target);
        await distributorWallet.connect(distributor).confirmWrappedSongRelease(wrappedSong2.target);

        // Transfer half shares of both songs to collector BEFORE creating the epoch
        const wsTokenManagement1 = await ethers.getContractAt(
            "WSTokenManagement", 
            await wrappedSong1.getWSTokenManagementAddress()
        );
        const wsTokenManagement2 = await ethers.getContractAt(
            "WSTokenManagement", 
            await wrappedSong2.getWSTokenManagementAddress()
        );

        await wsTokenManagement1.connect(artist).safeTransferFrom(
            artist.address,
            collector.address,
            1, // SONG_SHARES_ID
            5000, // Transfer 50% of shares
            "0x"
        );
        await wsTokenManagement2.connect(artist).safeTransferFrom(
            artist.address,
            collector.address,
            1, // SONG_SHARES_ID
            5000, // Transfer 50% of shares
            "0x"
        );

        // Verify initial share distribution
        expect(await wsTokenManagement1.balanceOf(artist.address, 1)).to.equal(5000);
        expect(await wsTokenManagement1.balanceOf(collector.address, 1)).to.equal(5000);
        expect(await wsTokenManagement2.balanceOf(artist.address, 1)).to.equal(5000);
        expect(await wsTokenManagement2.balanceOf(collector.address, 1)).to.equal(5000);

        // Create distribution for both wrapped songs AFTER transferring shares
        const amount1 = ethers.parseUnits("1000", 18);
        const amount2 = ethers.parseUnits("500", 18);
        const totalAmount = amount1 + amount2;

        await mockStablecoin.connect(deployer).transfer(distributor.address, totalAmount);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, totalAmount);

        await distributorWallet.connect(distributor).createDistributionEpochChunk(
            1, // first epoch
            0,
            [amount1, amount2],
            totalAmount,
            true,
            true
        );

        // Verify total shares and balances at epoch timestamp
        const totalShares1 = await wsTokenManagement1.totalShares();
        const totalShares2 = await wsTokenManagement2.totalShares();
        expect(totalShares1).to.equal(10000);
        expect(totalShares2).to.equal(10000);

        // Get balances at epoch timestamp
        const epochTimestamp = (await distributorWallet.distributionEpochs(1)).timestamp;
        const artistBalance1 = await wsTokenManagement1.balanceOfAt(artist.address, 1, epochTimestamp);
        const artistBalance2 = await wsTokenManagement2.balanceOfAt(artist.address, 1, epochTimestamp);
        expect(artistBalance1).to.equal(5000, "Artist should have 5000 shares of song 1 at epoch timestamp");
        expect(artistBalance2).to.equal(5000, "Artist should have 5000 shares of song 2 at epoch timestamp");

        // Claim earnings for both wrapped songs in the same epoch
        const artistInitialBalance = await mockStablecoin.balanceOf(artist.address);
        const collectorInitialBalance = await mockStablecoin.balanceOf(collector.address);

        await distributorWallet.connect(artist).claimMultipleWrappedSongsEarnings(
            [wrappedSong1.target, wrappedSong2.target], 
            1
        );
        await distributorWallet.connect(collector).claimMultipleWrappedSongsEarnings(
            [wrappedSong1.target, wrappedSong2.target], 
            1
        );

        const artistFinalBalance = await mockStablecoin.balanceOf(artist.address);
        const collectorFinalBalance = await mockStablecoin.balanceOf(collector.address);

        // Calculate expected earnings (50% of each song's amount)
        const artistExpected = (amount1 / BigInt(2)) + (amount2 / BigInt(2));
        const collectorExpected = (amount1 / BigInt(2)) + (amount2 / BigInt(2));

        // Verify earnings distribution
        expect(artistFinalBalance - artistInitialBalance).to.equal(artistExpected);
        expect(collectorFinalBalance - collectorInitialBalance).to.equal(collectorExpected);

        // Verify epochs are claimed for both wrapped songs
        expect(await distributorWallet.epochClaims(1, artist.address, wrappedSong1.target)).to.be.true;
        expect(await distributorWallet.epochClaims(1, artist.address, wrappedSong2.target)).to.be.true;
        expect(await distributorWallet.epochClaims(1, collector.address, wrappedSong1.target)).to.be.true;
        expect(await distributorWallet.epochClaims(1, collector.address, wrappedSong2.target)).to.be.true;
    });

    it("should handle complex epoch system with multiple songs and redistributions", async function () {
        this.timeout(300000); // 5 minutes
        const fixture = await loadFixture(deployProtocolFixture);
        const {
            artist,
            collector,
            collector2,
            distributor,
            deployer,
            mockStablecoin,
            wrappedSongFactory,
            protocolModule,
            distributorWalletFactory
        } = fixture;

        // Create WS1 and setup distributor
        const creationFee = await protocolModule.wrappedSongCreationFee();
        await wrappedSongFactory.connect(artist).createWrappedSong(
            mockStablecoin.target,
            {
                name: "Song 1",
                description: "Description 1",
                image: "ipfs://image1",
                externalUrl: "https://example1.com",
                animationUrl: "ipfs://animation1",
                attributesIpfsHash: "ipfs://attributes1"
            },
            10000,
            { value: creationFee }
        );

        // Setup distributor
        const distributorCreationFee = await protocolModule.distributorCreationFee();
        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            protocolModule.target,
            distributor.address,
            { value: distributorCreationFee }
        );
        const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
        const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

        // Get WS1 instance and setup
        const artistWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
        const ws1 = await ethers.getContractAt("WrappedSongSmartAccount", artistWrappedSongs[0]);
        const releaseFee = await protocolModule.releaseFee();
        await protocolModule.connect(artist).requestWrappedSongRelease(ws1.target, distributorWallet.target, { value: releaseFee });
        await distributorWallet.connect(distributor).confirmWrappedSongRelease(ws1.target);

        // Create Epoch 1 with only WS1
        const amount1Epoch1 = ethers.parseUnits("1000", 18);
        await mockStablecoin.connect(deployer).transfer(distributor.address, amount1Epoch1);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, amount1Epoch1);
        await distributorWallet.connect(distributor).createDistributionEpochChunk(
            1,
            0,
            [amount1Epoch1],
            amount1Epoch1,
            true,
            true
        );

        // Create WS2 and WS3
        await wrappedSongFactory.connect(artist).createWrappedSong(
            mockStablecoin.target,
            {
                name: "Song 2",
                description: "Description 2",
                image: "ipfs://image2",
                externalUrl: "https://example2.com",
                animationUrl: "ipfs://animation2",
                attributesIpfsHash: "ipfs://attributes2"
            },
            10000,
            { value: creationFee }
        );

        await wrappedSongFactory.connect(artist).createWrappedSong(
            mockStablecoin.target,
            {
                name: "Song 3",
                description: "Description 3",
                image: "ipfs://image3",
                externalUrl: "https://example3.com",
                animationUrl: "ipfs://animation3",
                attributesIpfsHash: "ipfs://attributes3"
            },
            10000,
            { value: creationFee }
        );

        // Get WS2 and WS3 instances and setup
        const allWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
        const ws2 = await ethers.getContractAt("WrappedSongSmartAccount", allWrappedSongs[1]);
        const ws3 = await ethers.getContractAt("WrappedSongSmartAccount", allWrappedSongs[2]);

        await protocolModule.connect(artist).requestWrappedSongRelease(ws2.target, distributorWallet.target, { value: releaseFee });
        await protocolModule.connect(artist).requestWrappedSongRelease(ws3.target, distributorWallet.target, { value: releaseFee });
        await distributorWallet.connect(distributor).confirmWrappedSongRelease(ws2.target);
        await distributorWallet.connect(distributor).confirmWrappedSongRelease(ws3.target);

        // Get token management contracts
        const wsTokenManagement1 = await ethers.getContractAt("WSTokenManagement", await ws1.getWSTokenManagementAddress());
        const wsTokenManagement2 = await ethers.getContractAt("WSTokenManagement", await ws2.getWSTokenManagementAddress());
        const wsTokenManagement3 = await ethers.getContractAt("WSTokenManagement", await ws3.getWSTokenManagementAddress());

        // Distribute shares before Epoch 2
        await wsTokenManagement1.connect(artist).safeTransferFrom(artist.address, collector.address, 1, 3000, "0x");
        await wsTokenManagement1.connect(artist).safeTransferFrom(artist.address, collector2.address, 1, 2000, "0x");
        await wsTokenManagement2.connect(artist).safeTransferFrom(artist.address, collector.address, 1, 4000, "0x");
        await wsTokenManagement3.connect(artist).safeTransferFrom(artist.address, collector2.address, 1, 6000, "0x");

        // Create Epoch 2 with all three songs
        const amount1Epoch2 = ethers.parseUnits("2000", 18);
        const amount2Epoch2 = ethers.parseUnits("1500", 18);
        const amount3Epoch2 = ethers.parseUnits("1000", 18);
        const totalAmountEpoch2 = amount1Epoch2 + amount2Epoch2 + amount3Epoch2;

        await mockStablecoin.connect(deployer).transfer(distributor.address, totalAmountEpoch2);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, totalAmountEpoch2);
        await distributorWallet.connect(distributor).createDistributionEpochChunk(
            2,
            0,
            [amount1Epoch2, amount2Epoch2, amount3Epoch2],
            totalAmountEpoch2,
            true,
            true
        );

        // Redistribute shares before Epoch 3
        await wsTokenManagement1.connect(collector).safeTransferFrom(collector.address, collector2.address, 1, 1000, "0x");
        await wsTokenManagement2.connect(collector).safeTransferFrom(collector.address, artist.address, 1, 2000, "0x");
        await wsTokenManagement3.connect(collector2).safeTransferFrom(collector2.address, collector.address, 1, 3000, "0x");

        // Create Epoch 3
        const amount1Epoch3 = ethers.parseUnits("3000", 18);
        const amount2Epoch3 = ethers.parseUnits("2000", 18);
        const amount3Epoch3 = ethers.parseUnits("1500", 18);
        const totalAmountEpoch3 = amount1Epoch3 + amount2Epoch3 + amount3Epoch3;

        await mockStablecoin.connect(deployer).transfer(distributor.address, totalAmountEpoch3);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, totalAmountEpoch3);
        await distributorWallet.connect(distributor).createDistributionEpochChunk(
            3,
            0,
            [amount1Epoch3, amount2Epoch3, amount3Epoch3],
            totalAmountEpoch3,
            true,
            true
        );

        // Claim and verify earnings for each epoch
        const initialBalances = {
            artist: await mockStablecoin.balanceOf(artist.address),
            collector: await mockStablecoin.balanceOf(collector.address),
            collector2: await mockStablecoin.balanceOf(collector2.address)
        };

        // Partial claims after Epoch 2 (before share redistribution)
        await distributorWallet.connect(artist).claimMultipleWrappedSongsEarnings([ws1.target, ws2.target], 2);
        await distributorWallet.connect(collector).claimEpochEarnings(ws2.target, 2);
        // Note: collector2 hasn't claimed Epoch 2 for ws3 yet

        // Verify intermediate balances after partial claims
        const intermediateBalances = {
            artist: await mockStablecoin.balanceOf(artist.address),
            collector: await mockStablecoin.balanceOf(collector.address),
            collector2: await mockStablecoin.balanceOf(collector2.address)
        };

        // Calculate expected intermediate earnings
        const artistExpectedEpoch2Partial = (amount1Epoch2 * BigInt(5000) / BigInt(10000)) + 
                                          (amount2Epoch2 * BigInt(6000) / BigInt(10000));
        const collectorExpectedEpoch2Partial = amount2Epoch2 * BigInt(4000) / BigInt(10000);

        // Verify intermediate earnings
        expect(intermediateBalances.artist - initialBalances.artist).to.equal(
            artistExpectedEpoch2Partial
        );
        expect(intermediateBalances.collector - initialBalances.collector).to.equal(
            collectorExpectedEpoch2Partial
        );
        expect(intermediateBalances.collector2 - initialBalances.collector2).to.equal(0);

        // Collector2 claims remaining Epoch 2 earnings for ws3 after share transfer but before Epoch 3
        await distributorWallet.connect(collector2).claimEpochEarnings(ws3.target, 2);

        const postEpoch2Balances = {
            artist: await mockStablecoin.balanceOf(artist.address),
            collector: await mockStablecoin.balanceOf(collector.address),
            collector2: await mockStablecoin.balanceOf(collector2.address)
        };

        // Verify collector2's delayed claim was based on original share distribution
        const collector2ExpectedEpoch2 = amount3Epoch2 * BigInt(6000) / BigInt(10000);
        expect(postEpoch2Balances.collector2 - intermediateBalances.collector2).to.equal(
            collector2ExpectedEpoch2
        );

        // Claim remaining songs for Epoch 2
        await distributorWallet.connect(artist).claimEpochEarnings(ws3.target, 2);
        await distributorWallet.connect(collector).claimEpochEarnings(ws1.target, 2);
        await distributorWallet.connect(collector2).claimEpochEarnings(ws1.target, 2);

        // Claim Epoch 1
        await distributorWallet.connect(artist).claimEpochEarnings(ws1.target, 1);

        // Claim Epoch 3 (all songs)
        await distributorWallet.connect(artist).claimMultipleWrappedSongsEarnings([ws1.target, ws2.target, ws3.target], 3);
        await distributorWallet.connect(collector).claimMultipleWrappedSongsEarnings([ws1.target, ws2.target, ws3.target], 3);
        await distributorWallet.connect(collector2).claimMultipleWrappedSongsEarnings([ws1.target, ws2.target, ws3.target], 3);

        const finalBalances = {
            artist: await mockStablecoin.balanceOf(artist.address),
            collector: await mockStablecoin.balanceOf(collector.address),
            collector2: await mockStablecoin.balanceOf(collector2.address)
        };

        // Calculate and verify expected earnings
        // Epoch 1: WS1 only - Artist: 5000, Collector: 3000, Collector2: 2000
        // Epoch 2: All three songs with initial distribution
        // Epoch 3: All three songs with redistributed shares

        const artistEarnings = finalBalances.artist - initialBalances.artist;
        const collectorEarnings = finalBalances.collector - initialBalances.collector;
        const collector2Earnings = finalBalances.collector2 - initialBalances.collector2;

        expect(artistEarnings).to.be.gt(0);
        expect(collectorEarnings).to.be.gt(0);
        expect(collector2Earnings).to.be.gt(0);

        // Verify all epochs are claimed
        expect(await distributorWallet.epochClaims(1, artist.address, ws1.target)).to.be.true;
        expect(await distributorWallet.epochClaims(2, artist.address, ws1.target)).to.be.true;
        expect(await distributorWallet.epochClaims(3, artist.address, ws1.target)).to.be.true;
        
        expect(await distributorWallet.epochClaims(2, collector.address, ws2.target)).to.be.true;
        expect(await distributorWallet.epochClaims(3, collector.address, ws2.target)).to.be.true;
        
        expect(await distributorWallet.epochClaims(2, collector2.address, ws3.target)).to.be.true;
        expect(await distributorWallet.epochClaims(3, collector2.address, ws3.target)).to.be.true;

        // Verify total distribution matches sum of all claims
        const totalDistributed = (finalBalances.artist - initialBalances.artist) +
                                (finalBalances.collector - initialBalances.collector) +
                                (finalBalances.collector2 - initialBalances.collector2);
        expect(totalDistributed).to.equal(amount1Epoch1 + totalAmountEpoch2 + totalAmountEpoch3);
    });
}); 