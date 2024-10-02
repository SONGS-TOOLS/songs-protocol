import { ethers } from "hardhat";
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe("SharesDistribution", function () {
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

    describe("create shares sale", function () {
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
        });

        it("should put on sale 50 shares", async function () {
            const { user, wrappedSongFactory, mockStablecoin, protocolModule } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const songURI = "ipfs://song-metadata";
            const totalSharesAmount = 10000;
            const sharesURI = "ipfs://shares-metadata";

            // Create a wrapped song first
            await wrappedSongFactory.connect(user).createWrappedSongWithMetadata(
                mockStablecoin.target,
                songURI,
                totalSharesAmount,
                sharesURI,
                { value: creationFee }
            );

            const userWrappedSongs = await wrappedSongFactory.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
            const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

            const sharesAmount = 50;
            const pricePerShare = ethers.parseUnits("100", 6); // Assuming 6 decimals for the stablecoin
            const maxSharesPerWallet = 1000;

            // connect the user to the contract
            await newWSTokenManagementContract.connect(user).startSharesSale(sharesAmount, pricePerShare, maxSharesPerWallet, mockStablecoin.target);

            // Start the shares sale using the WSTokensManagement contract
            // await newWSTokenManagementContract.startSharesSale(sharesAmount, pricePerShare, maxSharesPerWallet, mockStablecoin.target);

            const sharesForSale = await newWSTokenManagementContract.sharesForSale();
            expect(sharesForSale).to.equal(sharesAmount);

            const sharesPrice = await newWSTokenManagementContract.pricePerShare();
            expect(sharesPrice).to.equal(pricePerShare);

            const sharesMaxPerWallet = await newWSTokenManagementContract.maxSharesPerWallet();
            expect(sharesMaxPerWallet).to.equal(maxSharesPerWallet);

            const saleActive = await newWSTokenManagementContract.saleActive();
            expect(saleActive).to.equal(true);
        });
    });
});