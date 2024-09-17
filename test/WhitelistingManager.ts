import { ethers } from "hardhat";
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe("WhitelistingManager", function () {
    async function deployContractFixture() {
        const [deployer, initialOwner, user] = await ethers.getSigners();
        const WhitelistingManagerFactory = await ethers.getContractFactory("WhitelistingManager");
        const whitelistingManager = (await WhitelistingManagerFactory.deploy(initialOwner.address));
        await whitelistingManager.waitForDeployment();

        // Deploy a mock NFT contract for testing
        const MockNFT = await ethers.getContractFactory("MockNFT");
        const mockNFT = await MockNFT.deploy();
        await mockNFT.waitForDeployment();

        return { deployer, initialOwner, user, whitelistingManager, mockNFT };
    }

    describe("Ownership", function () {
        it("should set the initial owner correctly", async function () {
            const { initialOwner, whitelistingManager } = await loadFixture(deployContractFixture);
            expect(await whitelistingManager.owner()).to.equal(initialOwner.address);
        });

        it("should not set the deployer as the owner", async function () {
            const { deployer, whitelistingManager } = await loadFixture(deployContractFixture);
            expect(await whitelistingManager.owner()).to.not.equal(deployer.address);
        });
    });

    describe("NFT Contract", function () {
        it("should have no NFT contract set initially", async function () {
            const { whitelistingManager } = await loadFixture(deployContractFixture);
            expect(await whitelistingManager.nftContract()).to.equal(ethers.ZeroAddress);
        });

        it("should allow owner to set NFT contract", async function () {
            const { initialOwner, whitelistingManager, mockNFT } = await loadFixture(deployContractFixture);
            await whitelistingManager.connect(initialOwner).setNFTContract(mockNFT.target);
            expect(await whitelistingManager.nftContract()).to.equal(mockNFT.target);
        });

        it("should not allow non-owner to set NFT contract", async function () {
            const { user, whitelistingManager, mockNFT } = await loadFixture(deployContractFixture);
            await expect(whitelistingManager.connect(user).setNFTContract(mockNFT.target))
                .to.be.reverted;
        });
    });

    describe("NFT Requirement", function () {
        it("should have NFT requirement disabled initially", async function () {
            const { whitelistingManager } = await loadFixture(deployContractFixture);
            expect(await whitelistingManager.nftRequirementEnabled()).to.be.false;
        });

        it("should allow owner to toggle NFT requirement", async function () {
            const { initialOwner, whitelistingManager } = await loadFixture(deployContractFixture);
            await whitelistingManager.connect(initialOwner).toggleNFTRequirement(true);
            expect(await whitelistingManager.nftRequirementEnabled()).to.be.true;
        });

        it("should not allow non-owner to toggle NFT requirement", async function () {
            const { user, whitelistingManager } = await loadFixture(deployContractFixture);
            await expect(whitelistingManager.connect(user).toggleNFTRequirement(true))
                .to.be.reverted;
        });
    });

    describe("isValidToCreateWrappedSong", function () {
        it("should return true when NFT requirement is disabled", async function () {
            const { user, whitelistingManager } = await loadFixture(deployContractFixture);
            expect(await whitelistingManager.isValidToCreateWrappedSong(user.address)).to.be.true;
        });

        it("should return false when NFT requirement is enabled and user has no NFT", async function () {
            const { initialOwner, user, whitelistingManager, mockNFT } = await loadFixture(deployContractFixture);
            await whitelistingManager.connect(initialOwner).setNFTContract(mockNFT.target);
            await whitelistingManager.connect(initialOwner).toggleNFTRequirement(true);
            expect(await whitelistingManager.isValidToCreateWrappedSong(user.address)).to.be.false;
        });

        it("should return true when NFT requirement is enabled and user has NFT", async function () {
            const { initialOwner, user, whitelistingManager, mockNFT } = await loadFixture(deployContractFixture);
            await whitelistingManager.connect(initialOwner).setNFTContract(mockNFT.target);
            await whitelistingManager.connect(initialOwner).toggleNFTRequirement(true);
            await mockNFT.mint(user.address);
            expect(await whitelistingManager.isValidToCreateWrappedSong(user.address)).to.be.true;
        });
    });
});