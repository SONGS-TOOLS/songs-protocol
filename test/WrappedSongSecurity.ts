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

    describe("Migration Security", function () {
        it("should handle migration through factory V2 correctly", async function () {
            const { wrappedSong, artist, mockStablecoin, protocolModule, metadataModule } = await loadFixture(setupWrappedSongAndDistributor);
            
            // Initialize some earnings
            const amount = ethers.parseEther("1.0");
            await mockStablecoin.connect(artist).approve(wrappedSong.target, amount);
            await wrappedSong.connect(artist).receiveERC20(mockStablecoin.target, amount);
            
            // Deploy V2 template
            const WrappedSongV2 = await ethers.getContractFactory("WrappedSongSmartAccount");
            const wrappedSongV2Template = await WrappedSongV2.deploy(protocolModule.target);
            
            // Deploy mock factory V2
            const MockFactoryV2 = await ethers.getContractFactory("MockWrappedSongFactoryV2");
            const mockFactoryV2 = await MockFactoryV2.deploy(
                protocolModule.target,
                wrappedSongV2Template.target
            );
            
            // Set factory V2 as authorized contract
            const protocolOwner = await ethers.getSigner(await protocolModule.owner());
            await protocolModule.connect(protocolOwner).setAuthorizedContract(mockFactoryV2.target, true);

            // Get initial balances and state
            const initialStablecoinBalance = await mockStablecoin.balanceOf(wrappedSong.target);
            const initialWSTokenManagement = await wrappedSong.getWSTokenManagementAddress();
            
            // Perform migration through factory V2
            const migrateTx = await mockFactoryV2.connect(artist).migrateOldWrappedSong(
                wrappedSong.target,
                metadataModule.target
            );
            const migrateReceipt = await migrateTx.wait();

            // Get migration event∫
            const migrationEvent = migrateReceipt?.logs.find(
                (log: any) => mockFactoryV2.interface.parseLog(log)?.name === "WrappedSongMigrated"
            );
            const newWrappedSongAddress = migrationEvent ? 
                mockFactoryV2.interface.parseLog(migrationEvent)?.args.newWrappedSong : 
                null;
            
            expect(newWrappedSongAddress).to.not.be.null;
            
            // Get new wrapped song instance
            const newWrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", newWrappedSongAddress);
            
            // Verify migration results
            expect(await wrappedSong.migrated()).to.be.true;
            expect(await newWrappedSong.owner()).to.equal(artist.address);
            expect(await newWrappedSong.stablecoin()).to.equal(mockStablecoin.target);
            
            // Verify WSTokenManagement ownership transfer
            const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", initialWSTokenManagement);
            expect(await wsTokenManagement.owner()).to.equal(newWrappedSongAddress);
            expect(await wsTokenManagement.metadataModule()).to.equal(metadataModule.target);
            
            // Verify balance transfers
            expect(await mockStablecoin.balanceOf(wrappedSong.target)).to.equal(0);
            expect(await mockStablecoin.balanceOf(newWrappedSongAddress)).to.equal(initialStablecoinBalance);
            
            // Verify old contract is locked
            await expect(
                wrappedSong.createStablecoinDistributionEpoch()
            ).to.be.revertedWith("Contract has been migrated");
            
            await expect(
                wrappedSong.connect(artist).receiveERC20(mockStablecoin.target, amount)
            ).to.be.revertedWith("Contract has been migrated");
            
            // Verify new contract is functional
            await mockStablecoin.connect(artist).approve(newWrappedSongAddress, amount);
            await expect(
                newWrappedSong.connect(artist).receiveERC20(mockStablecoin.target, amount)
            ).to.not.be.reverted;
        });
    });

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
            
            // Verify that the artist (owner of WrappedSongSmartAccount) cannot directly call WSTokenManagement owner functions
            await expect(
                wsTokenManagement.connect(artist).createSongShares(1000)
            ).to.be.reverted;
            
            // Verify that the WrappedSongSmartAccount can call WSTokenManagement owner functions
            await expect(
                wrappedSong.connect(artist).createSongShares(1000)
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