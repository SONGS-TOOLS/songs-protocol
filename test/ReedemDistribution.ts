import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";

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

    describe("redemption process", function () {
        it("should allow wrapped song to redeem earnings from distributor wallet", async function () {
            const { deployer, user, wrappedSongFactory, mockStablecoin, protocolModule, distributorWallet } = await loadFixture(deployContractFixture);
            
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

            await wrappedSongFactory.connect(user).createWrappedSong(
                mockStablecoin.target,
                metadata,
                sharesAmount,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            // Request release
            await wrappedSong.connect(user).requestWrappedSongRelease(distributorWallet[0]);
            
            // Get distributor wallet contract instance
            const distributorWalletContract = await ethers.getContractAt("DistributorWallet", distributorWallet[0]);

            // Confirm release by distributor
            await distributorWalletContract.connect(deployer).confirmWrappedSongRelease(wrappedSongAddress);

            // Send earnings to distributor wallet
            const earningsAmount = ethers.parseUnits("1000", 18);
            await mockStablecoin.connect(deployer).approve(distributorWallet[0], earningsAmount);
            await distributorWalletContract.connect(deployer).receivePaymentStablecoin(wrappedSongAddress, earningsAmount);

            // Verify distributor wallet received the funds
            const wrappedSongTreasury = await distributorWalletContract.wrappedSongTreasury(wrappedSongAddress);
            expect(wrappedSongTreasury).to.equal(earningsAmount);

            // Get initial balance of wrapped song contract
            const initialBalance = await mockStablecoin.balanceOf(wrappedSongAddress);

            // Redeem earnings from distributor wallet to wrapped song contract
            await distributorWalletContract.connect(user).redeemWrappedSongEarnings(wrappedSongAddress);

            // Verify wrapped song contract received the funds
            const newBalance = await mockStablecoin.balanceOf(wrappedSongAddress);
            expect(newBalance).to.be.gt(initialBalance);
            expect(newBalance - initialBalance).to.equal(earningsAmount);
        });

        // TODO: send batch of WrappedSongEarnings and their accounting to DistributorWallet

        it("should allow share holders to claim earnings from wrapped song", async function () {
            const { deployer, user, wrappedSongFactory, mockStablecoin, protocolModule, distributorWallet } = await loadFixture(deployContractFixture);
            
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

            await wrappedSongFactory.connect(user).createWrappedSong(
                mockStablecoin.target,
                metadata,
                sharesAmount,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            // Setup distributor and send earnings
            await wrappedSong.connect(user).requestWrappedSongRelease(distributorWallet[0]);
            const distributorWalletContract = await ethers.getContractAt("DistributorWallet", distributorWallet[0]);
            await distributorWalletContract.connect(deployer).confirmWrappedSongRelease(wrappedSongAddress);

            // Send earnings to distributor wallet
            const earningsAmount = ethers.parseUnits("1000", 18);
            await mockStablecoin.connect(deployer).approve(distributorWallet[0], earningsAmount);
            await distributorWalletContract.connect(deployer).receivePaymentStablecoin(wrappedSongAddress, earningsAmount);

            // Get initial balance of user
            const userInitialBalance = await mockStablecoin.balanceOf(user.address);

            // Use redeemShares instead of direct redemption
            await distributorWalletContract.connect(deployer).redeemWrappedSongEarnings(wrappedSongAddress);

            // Update earnings before claiming
            // await wrappedSong.connect(user).updateEarnings();

            // Now claim earnings as a shareholder
            await wrappedSong.connect(user).claimEarnings();

            // Verify user received the funds
            const userNewBalance = await mockStablecoin.balanceOf(user.address);
            expect(userNewBalance).to.be.gt(userInitialBalance);
            expect(userNewBalance - userInitialBalance).to.equal(earningsAmount);
        });

        it("should fail to redeem if no earnings are available", async function () {
            const { deployer, user, wrappedSongFactory, mockStablecoin, protocolModule, distributorWallet } = await loadFixture(deployContractFixture);
            
            // Create a wrapped song
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            await wrappedSongFactory.connect(user).createWrappedSong(
                mockStablecoin.target,
                metadata,
                10000,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            // Request and confirm release
            await wrappedSong.connect(user).requestWrappedSongRelease(distributorWallet[0]);
            const distributorWalletContract = await ethers.getContractAt("DistributorWallet", distributorWallet[0]);
            await distributorWalletContract.connect(deployer).confirmWrappedSongRelease(wrappedSongAddress);

            // Try to claim earnings without any earnings available
            await expect(wrappedSong.connect(user).claimEarnings())
                .to.be.revertedWith("No earnings to claim");
        });
    });
});