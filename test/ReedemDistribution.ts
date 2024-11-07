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

        // Deploy LegalContractMetadata
        const LegalContractMetadata = await ethers.getContractFactory("LegalContractMetadata");
        const legalContractMetadata = await LegalContractMetadata.deploy();
        await legalContractMetadata.waitForDeployment();

        // Deploy MetadataModule
        const MetadataModule = await ethers.getContractFactory("MetadataModule");
        const metadataModule = await MetadataModule.deploy();
        await metadataModule.waitForDeployment();

        // Deploy ProtocolModule
        const ProtocolModule = await ethers.getContractFactory("ProtocolModule");
        const protocolModule = await ProtocolModule.deploy(
            distributorWalletFactory.target,
            whitelistingManager.target,
            erc20Whitelist.target,
            metadataModule.target,
            legalContractMetadata.target
        );
        await protocolModule.waitForDeployment();
        
        // Set MetadataModule as authorized caller for ProtocolModule
        await metadataModule.setProtocolModule(await protocolModule.getAddress());

        // Set ProtocolModule as authorized caller for ERC20Whitelist
        await erc20Whitelist.connect(deployer).setAuthorizedCaller(protocolModule.target);

        // Deploy WSUtils
        const WSUtils = await ethers.getContractFactory("WSUtils");
        const wsUtils = await WSUtils.deploy(protocolModule.target, deployer.address);
        await wsUtils.waitForDeployment();

        // Deploy WrappedSongFactory
        const WrappedSongFactory = await ethers.getContractFactory("WrappedSongFactory");
        const wrappedSongFactory = await WrappedSongFactory.deploy(protocolModule.target);
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
                .to.be.revertedWith("No payment to claim");
        });

        it("should allow multiple share holders to claim earnings proportionally", async function () {
            const { deployer, user, address2, address3, wrappedSongFactory, mockStablecoin, protocolModule, distributorWallet } = await loadFixture(deployContractFixture);
            
            // Create a wrapped song
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const totalShares = 10000;
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
                totalShares,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);
            const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", await wrappedSong.getWSTokenManagementAddress());

            // Transfer shares to other users (user keeps 5000, address2 gets 3000, address3 gets 2000)
            await wsTokenManagement.connect(user).safeTransferFrom(user.address, address2.address, 1, 3000, "0x");
            await wsTokenManagement.connect(user).safeTransferFrom(user.address, address3.address, 1, 2000, "0x");

            // Setup distributor and send earnings
            await wrappedSong.connect(user).requestWrappedSongRelease(distributorWallet[0]);
            const distributorWalletContract = await ethers.getContractAt("DistributorWallet", distributorWallet[0]);
            await distributorWalletContract.connect(deployer).confirmWrappedSongRelease(wrappedSongAddress);

            // Send earnings to distributor wallet
            const earningsAmount = ethers.parseUnits("1000", 18);
            await mockStablecoin.connect(deployer).approve(distributorWallet[0], earningsAmount);
            await distributorWalletContract.connect(deployer).receivePaymentStablecoin(wrappedSongAddress, earningsAmount);

            // Get initial balances
            const userInitialBalance = await mockStablecoin.balanceOf(user.address);
            const address2InitialBalance = await mockStablecoin.balanceOf(address2.address);
            const address3InitialBalance = await mockStablecoin.balanceOf(address3.address);

            // Calculate expected earnings based on share percentages
            const user1Expected = (earningsAmount * BigInt(5000)) / BigInt(10000); // 50%
            const user2Expected = (earningsAmount * BigInt(3000)) / BigInt(10000); // 30%
            const user3Expected = (earningsAmount * BigInt(2000)) / BigInt(10000); // 20%

            // Redeem earnings from distributor to wrapped song
            await distributorWalletContract.connect(deployer).redeemWrappedSongEarnings(wrappedSongAddress);
            
            // Claim earnings for all shareholders
            await wrappedSong.connect(user).claimEarnings();
            await wrappedSong.connect(address2).claimEarnings();
            await wrappedSong.connect(address3).claimEarnings();

            // Get final balances
            const userFinalBalance = await mockStablecoin.balanceOf(user.address);
            const address2FinalBalance = await mockStablecoin.balanceOf(address2.address);
            const address3FinalBalance = await mockStablecoin.balanceOf(address3.address);

            // Calculate actual earnings
            const user1Earned = userFinalBalance - userInitialBalance;
            const user2Earned = address2FinalBalance - address2InitialBalance;
            const user3Earned = address3FinalBalance - address3InitialBalance;

            // Calculate total distributed
            const totalDistributed = user1Earned + user2Earned + user3Earned;

            // Verify each user received their proportional share
            expect(user1Earned).to.equal(user1Expected);
            expect(user2Earned).to.equal(user2Expected);
            expect(user3Earned).to.equal(user3Expected);
            expect(totalDistributed).to.equal(earningsAmount);
        });

        it("should allow multiple share holders to claim ETH earnings proportionally", async function () {
            const { deployer, user, address2, address3, wrappedSongFactory, mockStablecoin, protocolModule, distributorWallet } = await loadFixture(deployContractFixture);
            
            // Create a wrapped song
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const totalShares = 10000;
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
                totalShares,
                { value: creationFee }
            );
        
            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);
            const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", await wrappedSong.getWSTokenManagementAddress());
        
            // Transfer shares to other users (user keeps 5000, address2 gets 3000, address3 gets 2000)
            await wsTokenManagement.connect(user).safeTransferFrom(user.address, address2.address, 1, 3000, "0x");
            await wsTokenManagement.connect(user).safeTransferFrom(user.address, address3.address, 1, 2000, "0x");
        
            // Setup distributor and send earnings
            await wrappedSong.connect(user).requestWrappedSongRelease(distributorWallet[0]);
            const distributorWalletContract = await ethers.getContractAt("DistributorWallet", distributorWallet[0]);
            await distributorWalletContract.connect(deployer).confirmWrappedSongRelease(wrappedSongAddress);
        
            // Send ETH earnings directly to wrapped song
            const earningsAmount = ethers.parseEther("1.0"); // 1 ETH
            await deployer.sendTransaction({
                to: wrappedSongAddress,
                value: earningsAmount
            });
        
            // Get initial balances
            const userInitialBalance = await ethers.provider.getBalance(user.address);
            const address2InitialBalance = await ethers.provider.getBalance(address2.address);
            const address3InitialBalance = await ethers.provider.getBalance(address3.address);
        
            // Calculate expected earnings based on share percentages
            const user1Expected = (earningsAmount * BigInt(5000)) / BigInt(10000); // 50%
            const user2Expected = (earningsAmount * BigInt(3000)) / BigInt(10000); // 30%
            const user3Expected = (earningsAmount * BigInt(2000)) / BigInt(10000); // 20%
        
            // No need for redemption since ETH is sent directly to the wrapped song
            // Remove this line:
            // await distributorWalletContract.connect(deployer).redeemWrappedSongEarnings(wrappedSongAddress);
        
            // Claim earnings for all shareholders
            const tx1 = await wrappedSong.connect(user).claimETHEarnings();
            const tx2 = await wrappedSong.connect(address2).claimETHEarnings();
            const tx3 = await wrappedSong.connect(address3).claimETHEarnings();
        
            // Get gas costs
            const receipt1 = await tx1.wait();
            const receipt2 = await tx2.wait();
            const receipt3 = await tx3.wait();

            if (!receipt1 || !receipt2 || !receipt3) {
                throw new Error("Transaction receipt is null");
            }

            const gasCost1 = receipt1.gasUsed * receipt1.gasPrice;
            const gasCost2 = receipt2.gasUsed * receipt2.gasPrice;
            const gasCost3 = receipt3.gasUsed * receipt3.gasPrice;
        
            // Get final balances
            const userFinalBalance = await ethers.provider.getBalance(user.address);
            const address2FinalBalance = await ethers.provider.getBalance(address2.address);
            const address3FinalBalance = await ethers.provider.getBalance(address3.address);
        
            // Calculate actual earnings (accounting for gas costs)
            const user1Earned = userFinalBalance - userInitialBalance + gasCost1;
            const user2Earned = address2FinalBalance - address2InitialBalance + gasCost2;
            const user3Earned = address3FinalBalance - address3InitialBalance + gasCost3;
        
            // Calculate total distributed
            const totalDistributed = user1Earned + user2Earned + user3Earned;
        
            // Verify each user received their proportional share
            expect(user1Earned).to.equal(user1Expected);
            expect(user2Earned).to.equal(user2Expected);
            expect(user3Earned).to.equal(user3Expected);
            expect(totalDistributed).to.equal(earningsAmount);
        });

        it("should handle multiple ETH claim attempts correctly", async function () {
            const { deployer, user, address2, wrappedSongFactory, mockStablecoin, protocolModule, distributorWallet } = await loadFixture(deployContractFixture);
            
            // Create a wrapped song
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const totalShares = 10000;
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
                totalShares,
                { value: creationFee }
            );
        
            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);
            const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", await wrappedSong.getWSTokenManagementAddress());
        
            // Transfer some shares to address2
            await wsTokenManagement.connect(user).safeTransferFrom(user.address, address2.address, 1, 5000, "0x");
        
            // Send initial ETH earnings
            const ethAmount = ethers.parseEther("1.0");
            await deployer.sendTransaction({
                to: wrappedSongAddress,
                value: ethAmount
            });
        
            // First ETH claim should succeed
            await wrappedSong.connect(user).claimETHEarnings();
        
            // Second ETH claim should fail
            await expect(
                wrappedSong.connect(user).claimETHEarnings()
            ).to.be.revertedWith("No ETH to claim");
        
            // Send more ETH earnings
            await deployer.sendTransaction({
                to: wrappedSongAddress,
                value: ethAmount
            });
        
            // Should be able to claim new ETH earnings
            await wrappedSong.connect(user).claimETHEarnings();
        
            // But not twice
            await expect(
                wrappedSong.connect(user).claimETHEarnings()
            ).to.be.revertedWith("No ETH to claim");
        
            // Test claiming with zero shares
            await wsTokenManagement.connect(user).safeTransferFrom(user.address, address2.address, 1, 5000, "0x");
            
            await expect(
                wrappedSong.connect(user).claimETHEarnings()
            ).to.be.revertedWith("No shares owned");
        });

        it("should handle multiple distribution flows and partial claims correctly", async function () {
            const { deployer, user, address2, address3, wrappedSongFactory, mockStablecoin, protocolModule, distributorWallet } = await loadFixture(deployContractFixture);
            
            // Create a wrapped song
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const totalShares = 10000;
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
                totalShares,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);
            const wsTokenManagement = await ethers.getContractAt("WSTokenManagement", await wrappedSong.getWSTokenManagementAddress());

            // Transfer shares to other users (user keeps 5000, address2 gets 3000, address3 gets 2000)
            await wsTokenManagement.connect(user).safeTransferFrom(user.address, address2.address, 1, 3000, "0x");
            await wsTokenManagement.connect(user).safeTransferFrom(user.address, address3.address, 1, 2000, "0x");

            // First distribution flow
            const firstEarningsAmount = ethers.parseUnits("1000", 18);
            await mockStablecoin.connect(deployer).approve(wrappedSongAddress, firstEarningsAmount);
            // Use receiveERC20 instead of direct transfer
            await wrappedSong.connect(deployer).receiveERC20(mockStablecoin.target, firstEarningsAmount);

            // Get initial balances
            const userInitialBalance = await mockStablecoin.balanceOf(user.address);
            const address2InitialBalance = await mockStablecoin.balanceOf(address2.address);
            const address3InitialBalance = await mockStablecoin.balanceOf(address3.address);

            // Calculate expected earnings for first distribution
            const user1FirstExpected = (firstEarningsAmount * BigInt(5000)) / BigInt(10000); // 50%
            const user2FirstExpected = (firstEarningsAmount * BigInt(3000)) / BigInt(10000); // 30%
            const user3FirstExpected = (firstEarningsAmount * BigInt(2000)) / BigInt(10000); // 20%

            // Only user1 and user2 claim their earnings
            await wrappedSong.connect(user).claimEarnings();
            await wrappedSong.connect(address2).claimEarnings();

            // Second distribution flow
            const secondEarningsAmount = ethers.parseUnits("500", 18);
            await mockStablecoin.connect(deployer).approve(wrappedSongAddress, secondEarningsAmount);
            // Use receiveERC20 for second distribution
            await wrappedSong.connect(deployer).receiveERC20(mockStablecoin.target, secondEarningsAmount);

            // Calculate expected earnings for second distribution
            const user1SecondExpected = (secondEarningsAmount * BigInt(5000)) / BigInt(10000); // 50%
            const user2SecondExpected = (secondEarningsAmount * BigInt(3000)) / BigInt(10000); // 30%
            const user3TotalExpected = user3FirstExpected + ((secondEarningsAmount * BigInt(2000)) / BigInt(10000)); // 20% of both distributions

            // User1 claims second distribution
            await wrappedSong.connect(user).claimEarnings();

            // User3 claims both distributions at once
            await wrappedSong.connect(address3).claimEarnings();

            // Get final balances
            const userFinalBalance = await mockStablecoin.balanceOf(user.address);
            const address2FinalBalance = await mockStablecoin.balanceOf(address2.address);
            const address3FinalBalance = await mockStablecoin.balanceOf(address3.address);

            // Calculate actual earnings
            const user1TotalEarned = userFinalBalance - userInitialBalance;
            const user2TotalEarned = address2FinalBalance - address2InitialBalance;
            const user3TotalEarned = address3FinalBalance - address3InitialBalance;

            // Verify earnings
            expect(user1TotalEarned).to.equal(user1FirstExpected + user1SecondExpected);
            expect(user2TotalEarned).to.equal(user2FirstExpected); // Only claimed first distribution
            expect(user3TotalEarned).to.equal(user3TotalExpected); // Claimed both distributions at once

            // Verify user2 can still claim their second distribution
            await wrappedSong.connect(address2).claimEarnings();
            const address2FinalBalance2 = await mockStablecoin.balanceOf(address2.address);
            const user2AdditionalEarned = address2FinalBalance2 - address2FinalBalance;
            expect(user2AdditionalEarned).to.equal(user2SecondExpected);
        });

    });
});