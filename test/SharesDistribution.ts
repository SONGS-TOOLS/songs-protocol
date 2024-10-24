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

        return { deployer, user, address2, address3, address4, address5, wrappedSongFactory, protocolModule, mockStablecoin, distributorWallet, wsUtils };
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

            await expect(wrappedSongFactory.connect(user).createWrappedSongWithMetadata(
                mockStablecoin.target,
                metadata,
                sharesAmount,
                { value: creationFee }
            )).to.emit(wrappedSongFactory, "WrappedSongCreated");

            const userWrappedSongs = await wrappedSongFactory.getOwnerWrappedSongs(user.address);
            expect(userWrappedSongs.length).to.equal(1);

            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
            const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

            const balance = await newWSTokenManagementContract.balanceOf(user.address, 1);
            expect(balance).to.equal(sharesAmount);
        });

        it("should put on sale 50 shares", async function () {
            const { user, wrappedSongFactory, mockStablecoin, protocolModule } = await loadFixture(deployContractFixture);
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
            await wrappedSongFactory.connect(user).createWrappedSongWithMetadata(
                mockStablecoin.target,
                metadata,
                totalSharesAmount,
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

            const sharesForSale = await newWSTokenManagementContract.sharesForSale();
            expect(sharesForSale).to.equal(sharesAmount);

            const sharesPrice = await newWSTokenManagementContract.pricePerShare();
            expect(sharesPrice).to.equal(pricePerShare);

            const sharesMaxPerWallet = await newWSTokenManagementContract.maxSharesPerWallet();
            expect(sharesMaxPerWallet).to.equal(maxSharesPerWallet);

            const saleActive = await newWSTokenManagementContract.saleActive();
            expect(saleActive).to.equal(true);
        });

        it("should buy 30 shares with different wallets using stablecoin and then transfer 20 remaining to distributor wallet", async function () {
            const { deployer, user, address2, address3, wrappedSongFactory, mockStablecoin, protocolModule } = await loadFixture(deployContractFixture);
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
            await wrappedSongFactory.connect(user).createWrappedSongWithMetadata(
                mockStablecoin.target,
                metadata,
                totalSharesAmount,
                { value: creationFee }
            );

            const userWrappedSongs = await wrappedSongFactory.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
            const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

            const sharesAmount = 50;
            const pricePerShare = ethers.parseUnits("100", 18); // Assuming 18 decimals for the stablecoin
            const maxSharesPerWallet = 1000;

            // Connect the user to the contract and start the shares sale
            await newWSTokenManagementContract.connect(user).startSharesSale(sharesAmount, pricePerShare, maxSharesPerWallet, mockStablecoin.target);

            // Transfer stablecoin to buyers
            const bigSharesAmount = BigInt(sharesAmount);
            const totalPrice = bigSharesAmount * pricePerShare;
            await mockStablecoin.connect(deployer).approve(newWSTokenManagementAddress, totalPrice); // Approve transfer
            await mockStablecoin.connect(deployer).transfer(address2.address, totalPrice);
            await mockStablecoin.connect(deployer).transfer(address3.address, totalPrice);

            // Three different wallets will buy shares using stablecoin
            const buyers = [deployer, address2, address3];
            const sharesToBuy = 10; // Each buyer will buy 10 shares

            for (const buyer of buyers) {
                const totalPrice = BigInt(sharesToBuy) * pricePerShare;
                await mockStablecoin.connect(buyer).approve(newWSTokenManagementAddress, totalPrice); // Approve transfer

                await newWSTokenManagementContract.connect(buyer).buyShares(sharesToBuy); // Buy shares with stablecoin

                const buyerBalance = await newWSTokenManagementContract.balanceOf(buyer.address, 1); // Assuming songSharesId is 1
                expect(buyerBalance).to.equal(BigInt(sharesToBuy));
            }

            // Verify that 30 shares were sold
            const sharesForSale = await newWSTokenManagementContract.sharesForSale();
            expect(sharesForSale).to.equal(20);

            // Transfer remaining shares to distributor wallet
            const transferTx = await newWSTokenManagementContract.connect(user).safeTransferFrom(user.address, deployer.address, 1, 20, "0x"); // Save the transaction
            await transferTx.wait(); // Wait for the transaction to be mined

            // Verify that all shares have been sold or transferred
            const finalSharesForSale = await newWSTokenManagementContract.sharesForSale();
            expect(finalSharesForSale).to.equal(20);

            // Verify that the distributor wallet received the remaining shares
            const distributorBalance = await newWSTokenManagementContract.balanceOf(deployer.address, 1); // Assuming songSharesId is 1
            expect(distributorBalance).to.equal(30);

            // Verify that the sale is still active
            const saleActive = await newWSTokenManagementContract.saleActive();
            expect(saleActive).to.equal(true);
        });

        it("should buy shares with ETH from different wallets", async function () {
            const { deployer, user, address2, address3, address4, wrappedSongFactory, protocolModule, mockStablecoin } = await loadFixture(deployContractFixture);
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
            await wrappedSongFactory.connect(user).createWrappedSongWithMetadata(
                mockStablecoin, // Use mock stablecoin
                metadata,
                totalSharesAmount,
                { value: creationFee }
            );

            const userWrappedSongs = await wrappedSongFactory.getOwnerWrappedSongs(user.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
            const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

            const sharesAmount = 50;
            const pricePerShare = ethers.parseEther("0.05"); // 0.1 ETH per share
            const maxSharesPerWallet = 1000;

            // Start the shares sale with ETH as payment method
            await newWSTokenManagementContract.connect(user).startSharesSale(sharesAmount, pricePerShare, maxSharesPerWallet, ethers.ZeroAddress);

            // Three different wallets will buy shares using ETH
            const buyers = [deployer, address2, address3, address4];
            const sharesToBuy = [10, 10, 20, 10]; // Each buyer will buy a different number of shares

            for (let i = 0; i < buyers.length; i++) {
                const buyer = buyers[i];
                const amount = sharesToBuy[i];
                const totalPrice = BigInt(amount) * pricePerShare;

                const initialContractBalance = await ethers.provider.getBalance(newWSTokenManagementAddress);

                // Buy shares with ETH
                const buySharesTx = await newWSTokenManagementContract.connect(buyer).buyShares(amount, { value: totalPrice });
                await buySharesTx.wait();

                // Verify correct number of shares transferred
                const buyerBalance = await newWSTokenManagementContract.balanceOf(buyer.address, 1); // Assuming songSharesId is 1
                expect(buyerBalance).to.equal(BigInt(amount));

                // Verify contract's ETH balance increased correctly
                const finalContractBalance = await ethers.provider.getBalance(newWSTokenManagementAddress);
                expect(finalContractBalance - initialContractBalance).to.equal(totalPrice);
            }

            // Verify that all shares were sold
            const sharesForSale = await newWSTokenManagementContract.sharesForSale();
            expect(sharesForSale).to.equal(0);

            // Verify that the sale is no longer active
            const saleActive = await newWSTokenManagementContract.saleActive();
            expect(saleActive).to.equal(false);
        });
    });
});