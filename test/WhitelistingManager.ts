import { ethers } from "hardhat";

const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe("WhitelistingManager", function () {
    async function deployContractFixture() {
        const [deployer, initialOwner] = await ethers.getSigners();
        const WhitelistingManager = await ethers.getContractFactory("WhitelistingManager");
        const whitelistingManager = await WhitelistingManager.deploy(initialOwner.address);
        await whitelistingManager.waitForDeployment();

        return { deployer, initialOwner, whitelistingManager };
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
});