import { ethers } from "hardhat";
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe("DistributorWalletFactory", function () {
    async function deployContractFixture() {
        const [deployer, initialOwner, user] = await ethers.getSigners();

        // Deploy WhitelistingManager
        const WhitelistingManager = await ethers.getContractFactory("WhitelistingManager");
        const whitelistingManager = await WhitelistingManager.deploy(initialOwner.address);
        await whitelistingManager.waitForDeployment();

        // Deploy DistributorWalletFactory
        const DistributorWalletFactory = await ethers.getContractFactory("DistributorWalletFactory");
        const distributorWalletFactory = await DistributorWalletFactory.deploy(initialOwner.address);
        await distributorWalletFactory.waitForDeployment();

        // Deploy ERC20Whitelist
        const ERC20Whitelist = await ethers.getContractFactory("ERC20Whitelist");
        const erc20Whitelist = await ERC20Whitelist.deploy(initialOwner.address);
        await erc20Whitelist.waitForDeployment();

        // Deploy ProtocolModule
        const ProtocolModule = await ethers.getContractFactory("ProtocolModule");
        const protocolModule = await ProtocolModule.connect(deployer).deploy(
            distributorWalletFactory.target,
            whitelistingManager.target,
            erc20Whitelist.target
        );
        await protocolModule.waitForDeployment();
        // Set ProtocolModule as authorized caller for ERC20Whitelist
        await erc20Whitelist.connect(initialOwner).setAuthorizedCaller(protocolModule.target);
        
        // Deploy a mock stablecoin for testing
        const MockToken = await ethers.getContractFactory("MockToken");
        const mockStablecoin = await MockToken.deploy("Mock USDC", "MUSDC");
        await mockStablecoin.waitForDeployment();


        // Whitelist the mock stablecoin using ProtocolModule
        await protocolModule.connect(deployer).whitelistToken(mockStablecoin.target);

        return { deployer, initialOwner, user, distributorWalletFactory, protocolModule, mockStablecoin };
    }

    describe("Ownership", function () {
        it("should set the initial owner correctly", async function () {
            const { initialOwner, distributorWalletFactory } = await loadFixture(deployContractFixture);
            expect(await distributorWalletFactory.owner()).to.equal(initialOwner.address);
        });

        it("should not set the deployer as the owner", async function () {
            const { deployer, distributorWalletFactory } = await loadFixture(deployContractFixture);
            expect(await distributorWalletFactory.owner()).to.not.equal(deployer.address);
        });
    });

    describe("createDistributorWallet", function () {
        it("should create a distributor wallet", async function () {
            const { initialOwner, user, distributorWalletFactory, protocolModule, mockStablecoin } = await loadFixture(deployContractFixture);
            
            // Whitelist the mock stablecoin
            await protocolModule.connect(initialOwner).whitelistToken(mockStablecoin.target);

            await expect(distributorWalletFactory.connect(initialOwner).createDistributorWallet(
                mockStablecoin.target,
                protocolModule.target,
                user.address
            )).to.emit(distributorWalletFactory, "DistributorWalletCreated");

            const wallets = await distributorWalletFactory.getDistributorWallets(user.address);
            expect(wallets.length).to.equal(1);
            expect(await distributorWalletFactory.checkIsDistributorWallet(wallets[0])).to.be.true;
        });

        it("should not allow non-owner to create a distributor wallet", async function () {
            const { user, distributorWalletFactory, protocolModule, mockStablecoin } = await loadFixture(deployContractFixture);
            
            await expect(distributorWalletFactory.connect(user).createDistributorWallet(
                mockStablecoin.target,
                protocolModule.target,
                user.address
            )).to.be.reverted;
        });
    });
})
