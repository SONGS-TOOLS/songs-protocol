import { ethers } from "hardhat";
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe("ReedemDistribution", function () {
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

    describe("redemption process", function () {
        it("should handle the complete redemption flow", async function () {
            const { deployer, user, address2, wrappedSongFactory, mockStablecoin, protocolModule, distributorWallet } = await loadFixture(deployContractFixture);
            
            // Create a wrapped song
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

            await wrappedSongFactory.connect(user).createWrappedSongWithMetadata(
                mockStablecoin.target,
                metadata,
                sharesAmount,
                { value: creationFee }
            );

            const userWrappedSongs = await wrappedSongFactory.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            // Request and confirm release
            await wrappedSong.connect(user).requestWrappedSongRelease(distributorWallet[0]);
            const distributorWalletContract = await ethers.getContractAt("DistributorWallet", distributorWallet[0]);
            await distributorWalletContract.connect(deployer).confirmWrappedSongRelease(wrappedSongAddress);

            // Send money to distributor wallet (simulating earnings)
            const earningsAmount = ethers.parseUnits("1000", 18); // 1000 tokens
            await mockStablecoin.connect(deployer).approve(distributorWallet[0], earningsAmount);
            await distributorWalletContract.connect(deployer).receivePaymentStablecoin(wrappedSongAddress, earningsAmount);

            // Verify distributor wallet received the funds
            const wrappedSongTreasury = await distributorWalletContract.wrappedSongTreasury(wrappedSongAddress);
            expect(wrappedSongTreasury).to.equal(earningsAmount);

            // Start a sale of 50 shares
            const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
            const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);
            
            const sharesForSale = 50;
            const pricePerShare = ethers.parseUnits("100", 18);
            const maxSharesPerWallet = 1000;

            await newWSTokenManagementContract.connect(user).startSharesSale(
                sharesForSale,
                pricePerShare,
                maxSharesPerWallet,
                mockStablecoin.target
            );

            // Buy shares with address2
            const sharesToBuy = 20;
            const totalPrice = BigInt(sharesToBuy) * pricePerShare;
            await mockStablecoin.connect(deployer).transfer(address2.address, totalPrice);
            await mockStablecoin.connect(address2).approve(newWSTokenManagementAddress, totalPrice);
            await newWSTokenManagementContract.connect(address2).buyShares(sharesToBuy);

            // Redeem earnings from distributor wallet to wrapped song
            await wrappedSong.connect(user).redeemShares();

            // Verify the wrapped song received the earnings
            const wrappedSongBalance = await mockStablecoin.balanceOf(wrappedSongAddress);
            expect(wrappedSongBalance).to.equal(earningsAmount);

            // TODO: Implement share holder earnings redemption once the contract method is available
            // This part would involve:
            // 1. Calculating earnings per share
            // 2. Address2 claiming their portion of earnings based on their share ownership
            // 3. Verifying the correct amount was received
        });
    });
});