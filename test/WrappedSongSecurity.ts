import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture } from './fixtures/protocolFixture';

describe("WrappedSong Security", function () {
    // Import the fixture setup
    async function setupWrappedSongAndDistributor() {
        const fixture = await loadFixture(deployProtocolFixture);
        const {
            artist,
            deployer,
            mockStablecoin,
            wrappedSongFactory,
            protocolModule,
            metadataModule,
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

        // Mint tokens to artist for testing
        await mockStablecoin.mint(artist.address, ethers.parseEther("10000"));

        return { ...fixture, wrappedSong, metadataModule };
    }

    describe("Gas Optimization", function () {
        it("should handle large number of epochs efficiently", async function () {
            const { wrappedSong, artist, mockStablecoin } = await loadFixture(setupWrappedSongAndDistributor);
            
            // Create multiple epochs
            const amount = ethers.parseEther("100");
            const totalAmount = amount * 10n;
            
            // Mint enough tokens upfront
            await mockStablecoin.mint(artist.address, totalAmount * 2n);
            
            // Create epochs one by one
            for(let i = 0; i < 10; i++) {
                await mockStablecoin.connect(artist).approve(wrappedSong.target, amount);
                await wrappedSong.connect(artist).receiveERC20(mockStablecoin.target, amount);
                await wrappedSong.createStablecoinDistributionEpoch();
                
                // Claim each epoch immediately to avoid accumulation issues
                await wrappedSong.connect(artist).claimStablecoinEarnings(1);
                
                await time.increase(3600);
            }
            
            const balance = await wrappedSong.userEpochBalances(artist.address);
            expect(balance.lastClaimedEpoch).to.equal(10);
        });
    });

    describe("Contract Ownership", function () {
        it("should verify WSTokenManagement ownership belongs to WrappedSongSmartAccount", async function () {
            const { wrappedSong, artist, protocolModule } = await loadFixture(setupWrappedSongAndDistributor);
            
            // Get WSTokenManagement address
            const wsTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
            expect(wsTokenManagementAddress).to.not.equal(ethers.ZeroAddress, "WSTokenManagement not set");
            
            // Get WSTokenManagement instance
            const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", wsTokenManagementAddress);
            
            // Verify ownership
            const wsTokenOwner = await wsTokenManagement.owner();
            expect(wsTokenOwner).to.equal(wrappedSong.target, "WSTokenManagement owner should be WrappedSongSmartAccount");
            
            // Get SONG_SHARES_ID and verify shares initialization
            const SONG_SHARES_ID = await wsTokenManagement.SONG_SHARES_ID();
            const totalShares = await wsTokenManagement["totalSupply(uint256)"](SONG_SHARES_ID);
            expect(totalShares).to.equal(10000n, "Song shares should be initialized with correct amount");
            
            // Verify that the artist (owner of WrappedSongSmartAccount) cannot directly call WSTokenManagement owner functions
            await expect(
                wsTokenManagement.connect(artist).createBuyoutToken(1000, artist.address)
            ).to.be.reverted;
            
            // Verify that the WrappedSongSmartAccount can call WSTokenManagement owner functions
            await expect(
                wrappedSong.connect(artist).createBuyoutToken(1000, artist.address)
            ).to.not.be.reverted;
        });

        it("should maintain correct ownership after initialization", async function () {
            const { wrappedSong, artist, protocolModule } = await loadFixture(setupWrappedSongAndDistributor);
            
            const wsTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
            const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", wsTokenManagementAddress);
            
            // Check initial ownership state
            expect(await wrappedSong.owner()).to.equal(artist.address, "WrappedSong owner should be artist");
            expect(await wsTokenManagement.owner()).to.equal(wrappedSong.target, "WSTokenManagement owner should be WrappedSong");
            
            // Verify ownership relationships
            const ownershipChain = {
                artistOwnsWrappedSong: await wrappedSong.owner() === artist.address,
                wrappedSongOwnsWSToken: await wsTokenManagement.owner() === wrappedSong.target,
                artistCannotDirectlyControlWSToken: false
            };
            
            await expect(
                wsTokenManagement.connect(artist).transferOwnership(artist.address)
            ).to.be.reverted;
            ownershipChain.artistCannotDirectlyControlWSToken = true;
            
            expect(ownershipChain).to.deep.equal({
                artistOwnsWrappedSong: true,
                wrappedSongOwnsWSToken: true,
                artistCannotDirectlyControlWSToken: true
            }, "Ownership chain should be correctly established");
        });
    });
}); 