import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";

describe("WrappedSongFactory", function () {
    async function deployContractFixture() {
        const [deployer, user, address2, address3, address4, address5] = await ethers.getSigners();

        // Deploy WhitelistingManager
        const WhitelistingManager = await ethers.getContractFactory("WhitelistingManager");
        const whitelistingManager = await WhitelistingManager.deploy(deployer.address);
        await whitelistingManager.waitForDeployment();

        // Deploy DistributorWalletFactory
        const DistributorWalletFactory = await ethers.getContractFactory("DistributorWalletFactory");
        const distributorWalletFactory = await DistributorWalletFactory.deploy(deployer.address);
        await distributorWalletFactory.waitForDeployment();

        // Deploy ERC20Whitelist
        const ERC20Whitelist = await ethers.getContractFactory("ERC20Whitelist");
        const erc20Whitelist = await ERC20Whitelist.deploy(deployer.address);
        await erc20Whitelist.waitForDeployment();

        // Deploy ProtocolModule
        const ProtocolModule = await ethers.getContractFactory("ProtocolModule");
        const protocolModule = await ProtocolModule.deploy(
            distributorWalletFactory.target,
            whitelistingManager.target,
            erc20Whitelist.target
        );
        await protocolModule.waitForDeployment();

        // Set ProtocolModule as authorized caller for ERC20Whitelist
        await erc20Whitelist.connect(deployer).setAuthorizedCaller(protocolModule.target);

        // Deploy WSUtils
        const WSUtils = await ethers.getContractFactory("WSUtils");
        const wsUtils = await WSUtils.deploy(protocolModule.target, deployer.address);
        await wsUtils.waitForDeployment();

        // Deploy MetadataModule
        const MetadataModule = await ethers.getContractFactory("MetadataModule");
        const metadataModule = await MetadataModule.deploy(protocolModule.target);
        await metadataModule.waitForDeployment();

        // Deploy WrappedSongFactory
        const WrappedSongFactory = await ethers.getContractFactory("WrappedSongFactory");
        const wrappedSongFactory = await WrappedSongFactory.deploy(protocolModule.target, metadataModule.target);
        await wrappedSongFactory.waitForDeployment();

        // Set MetadataModule as authorized caller for WrappedSongFactory
        await protocolModule.setMetadataModule(await metadataModule.getAddress());

        // Set WrappedSongFactory as authorized caller for ProtocolModule
        await protocolModule.setWrappedSongFactory(await wrappedSongFactory.getAddress());

        // Deploy a mock stablecoin for testing
        const MockToken = await ethers.getContractFactory("MockToken");
        const mockStablecoin = await MockToken.deploy("Mock USDC", "MUSDC");
        await mockStablecoin.waitForDeployment();

        // Set creation fee in ProtocolModule
        await protocolModule.setWrappedSongCreationFee(ethers.parseEther("0.1"));

        // Whitelist the mock stablecoin using ProtocolModule
        await protocolModule.whitelistToken(mockStablecoin.target);

        // Deploy DistributorWallet
        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            protocolModule.target,
            deployer.address
        );

        const distributorWallet = await distributorWalletFactory.getDistributorWallets(deployer.address);

        return { deployer, user, address2, address3, address4, address5, wrappedSongFactory, protocolModule, mockStablecoin, distributorWallet, wsUtils, metadataModule };
    }

    describe("createWrappedSong", function () {
        it("should create a wrapped song with new metadata module", async function () {
            const { user, wrappedSongFactory, mockStablecoin, protocolModule } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const sharesAmount = 1;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            await expect(wrappedSongFactory.connect(user).createWrappedSong(mockStablecoin.target, metadata, sharesAmount, { value: creationFee }))
                .to.emit(wrappedSongFactory, "WrappedSongCreated");

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            expect(userWrappedSongs.length).to.equal(1);
        });

        it("should fail to create a wrapped song with metadata with insufficient fee", async function () {
            const { user, wrappedSongFactory, mockStablecoin } = await loadFixture(deployContractFixture);
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            await expect(wrappedSongFactory.connect(user).createWrappedSong(mockStablecoin.target, metadata, 1000, { value: 0 }))
                .to.be.revertedWith("Insufficient creation fee");
        });

        it("should create a wrapped song with metadata and 10000 song shares", async function () {
            const { user, wrappedSongFactory, mockStablecoin, protocolModule } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const sharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            await expect(wrappedSongFactory.connect(user).createWrappedSong(
                mockStablecoin.target,
                metadata,
                sharesAmount,
                { value: creationFee }
            )).to.emit(wrappedSongFactory, "WrappedSongCreated");

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            expect(userWrappedSongs.length).to.equal(1);

            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
            const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

            const balance = await newWSTokenManagementContract.balanceOf(user.address, 1);
            expect(balance).to.equal(sharesAmount);

            // TODO: Test that the metadata is set correctly
            // const songMetadata = await newWSTokenManagementContract.uri(songId);
            // const sharesMetadata = await newWSTokenManagementContract.uri(songSharesId);

            // console.log('songMetadata: ', songMetadata || null)
            // console.log('sharesMetadata: ', sharesMetadata || null)

            // expect(songMetadata).to.equal(songURI);
            // expect(sharesMetadata).to.equal(sharesURI);
        });

        it("should create 5 wrapped songs with different owners", async function () {
            const { user, address2, address3, address4, address5, wrappedSongFactory, mockStablecoin, protocolModule /* , wsUtils */ } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const sharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };
            const users = [user, address2, address3, address4, address5];

            for (const user of users) {
                await expect(wrappedSongFactory.connect(user).createWrappedSong(
                    mockStablecoin.target,
                    metadata,
                    sharesAmount,
                    { value: creationFee }
                )).to.emit(wrappedSongFactory, "WrappedSongCreated");

                const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
                expect(userWrappedSongs.length).to.equal(1);

                const wrappedSongAddress = userWrappedSongs[0];
                const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

                const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
                const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

                const balance = await newWSTokenManagementContract.balanceOf(user.address, 1);
                expect(balance).to.equal(sharesAmount);

                // TODO: Test that the metadata is set correctly
                // const songMetadata = await wsUtils.getTokenURI(newWSTokenManagementAddress, songId);
                // const sharesMetadata = await wsUtils.getTokenURI(newWSTokenManagementAddress, songSharesId);

                // console.log('songMetadata: ', songMetadata || null)
                // console.log('sharesMetadata: ', sharesMetadata || null)

                // expect(songMetadata).to.equal(songURI);
                // expect(sharesMetadata).to.equal(sharesURI);
            }

        });


        it("should request the release of the wrapped songs", async function () {
            const { user, address2, address3, address4, address5, wrappedSongFactory, mockStablecoin, protocolModule, distributorWallet } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const sharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };
            const users = [user, address2, address3, address4, address5];

            for (const user of users) {
                await expect(wrappedSongFactory.connect(user).createWrappedSong(
                    mockStablecoin.target,
                    metadata,
                    sharesAmount,
                    { value: creationFee }
                )).to.emit(wrappedSongFactory, "WrappedSongCreated");

                const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
                expect(userWrappedSongs.length).to.equal(1);

                const wrappedSongAddress = userWrappedSongs[0];
                const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

                await expect(wrappedSong.connect(user).requestWrappedSongRelease(distributorWallet[0])).to.emit(protocolModule, "WrappedSongReleaseRequested");
            }
        });
    });
});