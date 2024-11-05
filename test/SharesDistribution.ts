import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";

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

        // Deploy SongSharesMarketPlace instead of MarketPlace
        const SongSharesMarketPlace = await ethers.getContractFactory("SongSharesMarketPlace");
        const songSharesMarketPlace = await SongSharesMarketPlace.deploy(protocolModule.target);
        await songSharesMarketPlace.waitForDeployment();

        return { deployer, user, address2, address3, address4, address5, wrappedSongFactory, protocolModule, mockStablecoin, distributorWallet, wsUtils, songSharesMarketPlace };
    }

    describe("create shares sale", function () {
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
        });

        it("should put on sale 50 shares through marketplace", async function () {
            const { user, wrappedSongFactory, mockStablecoin, protocolModule, songSharesMarketPlace } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const totalSharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            // Create a wrapped song first
            await wrappedSongFactory.connect(user).createWrappedSong(
                mockStablecoin.target,
                metadata,
                totalSharesAmount,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const wsTokenManagement = await wrappedSong.newWSTokenManagement();
            const wsTokenManagementContract = await ethers.getContractAt("WSTokenManagement", wsTokenManagement);

            // Approve marketplace to handle tokens
            await wsTokenManagementContract.connect(user).setApprovalForAll(songSharesMarketPlace.target, true);

            const sharesAmount = 50;
            const pricePerShare = ethers.parseUnits("100", 6); // Assuming 6 decimals for the stablecoin
            const maxSharesPerWallet = 1000;

            // Start the sale through marketplace
            await songSharesMarketPlace.connect(user).startSale(
                wsTokenManagement,
                sharesAmount,
                pricePerShare,
                maxSharesPerWallet,
                mockStablecoin.target
            );

            const sale = await songSharesMarketPlace.getSale(wsTokenManagement);
            expect(sale.active).to.be.true;
            expect(sale.sharesForSale).to.equal(sharesAmount);
            expect(sale.pricePerShare).to.equal(pricePerShare);
            expect(sale.maxSharesPerWallet).to.equal(maxSharesPerWallet);
            expect(sale.stableCoin).to.equal(mockStablecoin.target);
        });

        it("should buy shares with stablecoin through marketplace", async function () {
            const { deployer, user, address2, address3, wrappedSongFactory, mockStablecoin, protocolModule, songSharesMarketPlace } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const totalSharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            // Create wrapped song
            await wrappedSongFactory.connect(user).createWrappedSong(
                mockStablecoin.target,
                metadata,
                totalSharesAmount,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);
            const wsTokenManagement = await wrappedSong.newWSTokenManagement();
            const wsTokenManagementContract = await ethers.getContractAt("WSTokenManagement", wsTokenManagement);

            // Approve marketplace
            await wsTokenManagementContract.connect(user).setApprovalForAll(songSharesMarketPlace.target, true);

            const sharesAmount = 50;
            const pricePerShare = ethers.parseUnits("100", 6);
            const maxSharesPerWallet = 1000;

            // Start sale
            await songSharesMarketPlace.connect(user).startSale(
                wsTokenManagement,
                sharesAmount,
                pricePerShare,
                maxSharesPerWallet,
                mockStablecoin.target
            );

            // Transfer stablecoin to buyers
            const buyers = [deployer, address2, address3];
            const sharesToBuy = 10; // Each buyer buys 10 shares
            const totalPrice = BigInt(sharesToBuy) * pricePerShare;

            for (const buyer of buyers) {
                await mockStablecoin.connect(deployer).transfer(buyer.address, totalPrice);
                await mockStablecoin.connect(buyer).approve(songSharesMarketPlace.target, totalPrice);

                await songSharesMarketPlace.connect(buyer).buyShares(
                    wsTokenManagement,
                    sharesToBuy,
                    buyer.address
                );

                const buyerBalance = await wsTokenManagementContract.balanceOf(buyer.address, 1);
                expect(buyerBalance).to.equal(BigInt(sharesToBuy));
            }

            const sale = await songSharesMarketPlace.getSale(wsTokenManagement);
            expect(sale.sharesForSale).to.equal(20); // 50 - (3 * 10) = 20 shares remaining
        });

        // it("should buy shares with ETH through marketplace", async function () {
            // ... (implement similar to stablecoin test but using ETH)
            // Will provide if you want the implementation
        // });
    });
});