import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployProtocolFixture } from "./fixtures/protocolFixture";
import { deployProtocolV2Fixture } from "./fixtures/protocolV2Fixture";

describe("WrappedSong Migration", function () {
    async function setupWrappedSongAndV2Protocol() {
        // First deploy V1 protocol and create a wrapped song
        const v1Fixture = await deployProtocolFixture();
        const {
            artist,
            mockStablecoin,
            wrappedSongFactory,
            protocolModule,
            metadataModule,
            feesModule
        } = v1Fixture;
        
        // Create wrapped song in V1
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

        // Get V1 wrapped song instance
        const artistWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
        const wrappedSongV1 = await ethers.getContractAt("WrappedSongSmartAccount", artistWrappedSongs[0]);
        // Log wrapped song V1 protocol address
        console.log("WrappedSongV1 Protocol Address:", await wrappedSongV1.protocolModule());
        // Get WSTokenManagement address from V1 wrapped song
        const wsTokenManagementAddr = await wrappedSongV1.getWSTokenManagementAddress();
        const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", wsTokenManagementAddr);
        console.log("WSTokenManagement Address:", wsTokenManagementAddr);

        // Initialize some earnings in V1
        const amount = ethers.parseEther("1.0");
        await mockStablecoin.mint(artist.address, amount);
        await mockStablecoin.connect(artist).approve(wrappedSongV1.target, amount);
        await wrappedSongV1.connect(artist).receiveERC20(mockStablecoin.target, amount);

        // Deploy V2 protocol
        const v2Fixture = await deployProtocolV2Fixture();

        return { 
            wrappedSongV1,
            v1Protocol: v1Fixture,
            v2Protocol: v2Fixture
        };
    }

    describe("Migration Process", function () {
        it("should successfully migrate a wrapped song from V1 to V2", async function () {
            const { wrappedSongV1, v1Protocol, v2Protocol } = await loadFixture(setupWrappedSongAndV2Protocol);
            const { artist, mockStablecoin, protocolModule: v1ProtocolModule, metadataModule: v1metadataModule  } = v1Protocol;
            const { wrappedSongFactoryV2, protocolModule: v2ProtocolModule, metadataModule: v2metadataModule } = v2Protocol;

            await v1ProtocolModule.connect(v1Protocol.deployer).setAuthorizedContract(wrappedSongFactoryV2.target, true);
            console.log("authorized contract set");
            console.log("WrappedSongFactoryV2 Address:", wrappedSongFactoryV2.target);

            // Check authorization status after setting
            const isAuthorized = await v1ProtocolModule.isAuthorizedContract(wrappedSongFactoryV2.target);
            expect(isAuthorized).to.be.true;

            // Ensure the artist has proper permissions on V1 song
            const isOwner = await wrappedSongV1.owner() === artist.address;


            try {
                console.log("\nStarting migration...");
                const tx = await wrappedSongFactoryV2.connect(artist).migrateWrappedSong(
                    wrappedSongV1.target,
                    v1metadataModule.target,
                    { gasLimit: 2000000 } // Increased gas limit
                );
                

            } catch (error: any) {
                console.error("\nMigration failed with error:", {
                    message: error.message,
                    data: error.data,
                    code: error.code,
                    reason: error.reason
                });
                
                if (error.transaction) {
                    try {
                        await ethers.provider.call(error.transaction);
                    } catch (callError: any) {
                        console.error("Revert reason:", callError.reason);
                    }
                }
                throw error;
            }

            // Verify V1 contract is migrated
            expect(await wrappedSongV1.migrated()).to.be.true;
            
            const migrateEvent = await wrappedSongFactoryV2.queryFilter(wrappedSongFactoryV2.filters.WrappedSongMigrated());
            expect(migrateEvent.length).to.equal(1);
            const newWrappedSongAddress = migrateEvent[0].args.newWrappedSong;
            
            const wrappedSongV2 = await ethers.getContractAt("WrappedSongSmartAccount", newWrappedSongAddress);
            
            // Verify ownership and configuration
            const ownerAddress = await wrappedSongV2.owner();
            expect(ownerAddress).to.equal(artist.address);
            
            const stablecoinAddress = await wrappedSongV2.stablecoin();
            expect(stablecoinAddress).to.equal(mockStablecoin.target);
            
            // Verify WSTokenManagement transfer
            const initialWSTokenManagement = await wrappedSongV2.getWSTokenManagementAddress();
            const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", initialWSTokenManagement);
            
            // Check ownership
            const wsTokenOwner = await wsTokenManagement.owner();
            expect(wsTokenOwner).to.equal(wrappedSongV2.target);
            
            // Check metadata module
            const wsTokenMetadataModule = await wsTokenManagement.metadataModule();
            expect(wsTokenMetadataModule).to.equal(v2metadataModule.target);
            
            // Verify V1 contract is locked
            await expect(
                wrappedSongV1.createStablecoinDistributionEpoch()
            ).to.be.revertedWith("Contract has been migrated");
            
            // Verify V2 contract functionality
            const newAmount = ethers.parseEther("1.0");
            await mockStablecoin.mint(artist.address, newAmount);
            await mockStablecoin.connect(artist).approve(wrappedSongV2.target, newAmount);
            await expect(
                wrappedSongV2.connect(artist).receiveERC20(mockStablecoin.target, newAmount)
            ).to.not.be.reverted;
        });

        it("should fail migration if V2 factory is not authorized", async function () {
            const { wrappedSongV1, v1Protocol, v2Protocol } = await loadFixture(setupWrappedSongAndV2Protocol);
            const { artist, metadataModule } = v1Protocol;
            const { wrappedSongFactoryV2 } = v2Protocol;

            // Attempt migration should fail
            await expect(
                wrappedSongFactoryV2.connect(artist).migrateWrappedSong(
                    wrappedSongV1.target,
                    metadataModule.target
                )
            ).to.be.revertedWith("Caller not authorized");
        });
    });
});
