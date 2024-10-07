import { ethers } from "hardhat";
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

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

        // Deploy ProtocolModule
        const ProtocolModule = await ethers.getContractFactory("ProtocolModule");
        const protocolModule = await ProtocolModule.deploy(
            distributorWalletFactory.target,
            whitelistingManager.target
        );
        await protocolModule.waitForDeployment();

        // Deploy WSUtils
        const WSUtils = await ethers.getContractFactory("WSUtils");
        const wsUtils = await WSUtils.deploy(protocolModule.target, deployer.address);
        await wsUtils.waitForDeployment();

        // Deploy WrappedSongFactory
        const WrappedSongFactory = await ethers.getContractFactory("WrappedSongFactory");
        const wrappedSongFactory = await WrappedSongFactory.deploy(protocolModule.target);
        await wrappedSongFactory.waitForDeployment();

        // Deploy a mock stablecoin for testing
        const MockToken = await ethers.getContractFactory("MockToken");
        const mockStablecoin = await MockToken.deploy("Mock USDC", "MUSDC");
        await mockStablecoin.waitForDeployment();

        // Set creation fee in ProtocolModule
        await protocolModule.setWrappedSongCreationFee(ethers.parseEther("0.1"));

        // Deploy DistributorWallet
        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            protocolModule.target,
            deployer.address
        );

        const distributorWallet = await distributorWalletFactory.getDistributorWallets(deployer.address);

        return { deployer, user, address2, address3, address4, address5, wrappedSongFactory, protocolModule, mockStablecoin, distributorWallet, wsUtils };
    }

    describe("createWrappedSong", function () {
        it("should create a wrapped song", async function () {
            const { user, wrappedSongFactory, mockStablecoin, protocolModule } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();

            await expect(wrappedSongFactory.connect(user).createWrappedSong(mockStablecoin.target, { value: creationFee }))
                .to.emit(wrappedSongFactory, "WrappedSongCreated");

            const userWrappedSongs = await wrappedSongFactory.getOwnerWrappedSongs(user.address);
            expect(userWrappedSongs.length).to.equal(1);
        });

        it("should fail to create a wrapped song with insufficient fee", async function () {
            const { user, wrappedSongFactory, mockStablecoin } = await loadFixture(deployContractFixture);

            await expect(wrappedSongFactory.connect(user).createWrappedSong(mockStablecoin.target, { value: 0 }))
                .to.be.revertedWith("Insufficient creation fee");
        });

        it("should create a wrapped song with metadata and 10000 song shares", async function () {
            const { user, wrappedSongFactory, mockStablecoin, protocolModule } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const songURI = "ipfs://song-metadata";
            const sharesAmount = 10000;
            const sharesURI = "ipfs://shares-metadata";

            await expect(wrappedSongFactory.connect(user).createWrappedSongWithMetadata(
                mockStablecoin.target,
                songURI,
                sharesAmount,
                sharesURI,
                { value: creationFee }
            )).to.emit(wrappedSongFactory, "WrappedSongCreatedWithMetadata");

            const userWrappedSongs = await wrappedSongFactory.getOwnerWrappedSongs(user.address);
            expect(userWrappedSongs.length).to.equal(1);

            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const songId = await wrappedSong.wrappedSongTokenId();
            const songSharesId = await wrappedSong.songSharesId();

            expect(songId).to.equal(0);
            expect(songSharesId).to.equal(1);

            const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
            const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

            const balance = await newWSTokenManagementContract.balanceOf(user.address, songSharesId);
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
            const { user, address2, address3, address4, address5, wrappedSongFactory, mockStablecoin, protocolModule /* , wsUtils */} = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const songURI = "ipfs://song-metadata";
            const sharesAmount = 10000;
            const sharesURI = "ipfs://shares-metadata";
            const users = [user, address2, address3, address4, address5];

            for (const user of users) {
                await expect(wrappedSongFactory.connect(user).createWrappedSongWithMetadata(
                    mockStablecoin.target,
                    songURI,
                    sharesAmount,
                    sharesURI,
                    { value: creationFee }
                )).to.emit(wrappedSongFactory, "WrappedSongCreatedWithMetadata");

                const userWrappedSongs = await wrappedSongFactory.getOwnerWrappedSongs(user.address);
                expect(userWrappedSongs.length).to.equal(1);

                const wrappedSongAddress = userWrappedSongs[0];
                const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

                const songId = await wrappedSong.wrappedSongTokenId();
                const songSharesId = await wrappedSong.songSharesId();

                expect(songId).to.equal(0);
                expect(songSharesId).to.equal(1);

                const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
                const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);
                
                const balance = await newWSTokenManagementContract.balanceOf(user.address, songSharesId);
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
            const songURI = "ipfs://song-metadata";
            const sharesAmount = 10000;
            const sharesURI = "ipfs://shares-metadata";
            const users = [user, address2, address3, address4, address5];

            for (const user of users) {
                await expect(wrappedSongFactory.connect(user).createWrappedSongWithMetadata(
                    mockStablecoin.target,
                    songURI,
                    sharesAmount,
                    sharesURI,
                    { value: creationFee }
                )).to.emit(wrappedSongFactory, "WrappedSongCreatedWithMetadata");

                const userWrappedSongs = await wrappedSongFactory.getOwnerWrappedSongs(user.address);
                expect(userWrappedSongs.length).to.equal(1);

                const wrappedSongAddress = userWrappedSongs[0];
                const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

                await expect(wrappedSong.connect(user).requestWrappedSongRelease(distributorWallet[0])).to.emit(protocolModule, "WrappedSongReleaseRequested");
            }
        });
    });
});