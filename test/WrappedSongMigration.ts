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
        } = v1Fixture;
        
        // Create wrapped song in V1
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
            const { artist, mockStablecoin, metadataModule, protocolModule: v1ProtocolModule } = v1Protocol;
            const { wrappedSongFactoryV2, protocolModule: v2ProtocolModule } = v2Protocol;

            console.log("\nInitial State:");
            console.log("V1 Protocol Module:", v1ProtocolModule.target);
            console.log("V2 Protocol Module:", v2ProtocolModule.target);
            console.log("Artist:", artist.address);
            console.log("V1 Song:", wrappedSongV1.target);
            console.log("V1 Song Owner:", await wrappedSongV1.owner());
            console.log("V2 Factory:", wrappedSongFactoryV2.target);

            // Additional checks before migration
            console.log("\nPre-migration checks:");
            console.log("V1 Protocol Module:", await wrappedSongV1.protocolModule());
            console.log("V1 Protocol Module Owner:", await v1ProtocolModule.owner());
            console.log("V2 Factory authorized in V1:", await v1ProtocolModule.isAuthorizedContract(wrappedSongFactoryV2.target));
            
            // Ensure V2 factory is authorized in V1 protocol
            await v1ProtocolModule.connect(v1Protocol.deployer).setAuthorizedContract(wrappedSongFactoryV2.target, true);
            // Check authorization status after setting
            const isAuthorized = await v1ProtocolModule.isAuthorizedContract(wrappedSongFactoryV2.target);
            console.log("\nAuthorization check:" , wrappedSongFactoryV2.target);
            console.log("V2 Factory authorized in V1:", isAuthorized);
            expect(isAuthorized).to.be.true;

            // Ensure the artist has proper permissions on V1 song
            const isOwner = await wrappedSongV1.owner() === artist.address;
            console.log("Artist is owner of V1 song:", isOwner);

            console.log("\nAdditional Checks:");
            console.log("Protocol Paused:", await v2ProtocolModule.paused());
            console.log("V1 Song Migrated:", await wrappedSongV1.migrated());
            console.log("V1 Song Stablecoin:", await wrappedSongV1.stablecoin());
            console.log("V1 Song WSToken:", await wrappedSongV1.getWSTokenManagementAddress());
            console.log("V2 Protocol Owner:", await v2ProtocolModule.owner());
            console.log("V2 Factory Protocol Module:", await wrappedSongFactoryV2.protocolModule());

            // Setup event listener with promise
            const eventPromise = new Promise((resolve) => {
                const steps: string[] = [];
                wrappedSongFactoryV2.on("MigrationStep", (step: string, wrappedSong: string) => {
                    console.log(`\nMigration step: ${step} for ${wrappedSong}`);
                    steps.push(step);
                });
                // Resolve after a timeout to ensure we catch all events
                setTimeout(() => resolve(steps), 1000);
            });

            try {
                console.log("\nStarting migration...");
                const tx = await wrappedSongFactoryV2.connect(artist).migrateWrappedSong(
                    wrappedSongV1.target,
                    metadataModule.target,
                    { gasLimit: 2000000 } // Increased gas limit
                );
                
                // Wait for both transaction and events
                const [receipt] = await Promise.all([
                    tx.wait(),
                    eventPromise
                ]);

                console.log("Migration transaction sent:", tx.hash);
                console.log("\nMigration complete. Receipt:", {
                    status: receipt.status,
                    gasUsed: receipt.gasUsed.toString(),
                    blockNumber: receipt.blockNumber
                });

                // Parse events
                const events = receipt.logs.map(log => {
                    try {
                        return wrappedSongFactoryV2.interface.parseLog(log);
                    } catch (e) {
                        return null;
                    }
                }).filter(Boolean);

                console.log("\nEvents emitted:", events.map(e => e?.name));

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
            console.log("\nVerifying migration steps:");

            console.log("1. Checking if V1 contract is marked as migrated...");
            expect(await wrappedSongV1.migrated()).to.be.true;
            console.log("✓ V1 contract is marked as migrated");
            
            console.log("\n2. Getting new V2 wrapped song address from events...");
            const migrateEvent = await wrappedSongFactoryV2.queryFilter(wrappedSongFactoryV2.filters.WrappedSongMigrated());
            console.log(`Found ${migrateEvent.length} migration events`);
            expect(migrateEvent.length).to.equal(1);
            const newWrappedSongAddress = migrateEvent[0].args.newWrappedSong;
            console.log("✓ New V2 address found:", newWrappedSongAddress);
            
            console.log("\n3. Getting V2 wrapped song instance...");
            const wrappedSongV2 = await ethers.getContractAt("WrappedSongSmartAccount", newWrappedSongAddress);
            console.log("✓ V2 contract instance created");
            
            console.log("\n4. Verifying ownership and configuration...");
            const ownerAddress = await wrappedSongV2.owner();
            console.log("Owner address:", ownerAddress);
            console.log("Expected owner:", artist.address);
            expect(ownerAddress).to.equal(artist.address);
            
            const stablecoinAddress = await wrappedSongV2.stablecoin();
            console.log("Stablecoin address:", stablecoinAddress);
            console.log("Expected stablecoin:", mockStablecoin.target);
            expect(stablecoinAddress).to.equal(mockStablecoin.target);
            console.log("✓ Ownership and configuration verified");
            
            console.log("\n5. Verifying WSTokenManagement transfer...");
            const initialWSTokenManagement = await wrappedSongV2.getWSTokenManagementAddress();
            console.log("Initial WSTokenManagement address:", initialWSTokenManagement);
            const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", initialWSTokenManagement);
            
            const wsTokenOwner = await wsTokenManagement.owner();
            console.log("WSToken owner:", wsTokenOwner);
            console.log("Expected owner:", wrappedSongV2.target);
            expect(wsTokenOwner).to.equal(wrappedSongV2.target);
            
            const wsTokenMetadataModule = await wsTokenManagement.metadataModule();
            console.log("WSToken metadata module:", wsTokenMetadataModule);
            console.log("Expected metadata module:", metadataModule.target);
            expect(wsTokenMetadataModule).to.equal(metadataModule.target);
            console.log("✓ WSTokenManagement transfer verified");
            
            console.log("\n6. Verifying V1 contract is locked...");
            await expect(
                wrappedSongV1.createStablecoinDistributionEpoch()
            ).to.be.revertedWith("Contract has been migrated");
            console.log("✓ V1 contract is locked");
            
            console.log("\n7. Verifying V2 contract functionality...");
            const newAmount = ethers.parseEther("1.0");
            console.log("Minting test amount:", newAmount.toString());
            await mockStablecoin.mint(artist.address, newAmount);
            
            console.log("Approving V2 contract to spend tokens...");
            await mockStablecoin.connect(artist).approve(wrappedSongV2.target, newAmount);
            
            console.log("Testing ERC20 receive functionality...");
            await expect(
                wrappedSongV2.connect(artist).receiveERC20(mockStablecoin.target, newAmount)
            ).to.not.be.reverted;
            console.log("✓ V2 contract is functional");

            // After migration, before the assertion
            console.log("Expected new wrapped song address:", newWrappedSongAddress);
            console.log("Actual address from event:", migrateEvent[0].args.newWrappedSong);
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
