import { ethers } from "hardhat";
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { deployProtocolFixture as deployContractFixture } from './fixtures/protocolFixture';

describe("DistributorWalletFactory", function () {

    describe("Ownership", function () {
        it("should set the initial owner correctly", async function () {
            const { deployer, distributorWalletFactory } = await loadFixture(deployContractFixture);
            expect(await distributorWalletFactory.owner()).to.equal(deployer.address);
        });

        it("should not set the distributor as the owner", async function () {
            const { distributor, distributorWalletFactory } = await loadFixture(deployContractFixture);
            expect(await distributorWalletFactory.owner()).to.not.equal(distributor.address);
        });
    });

    describe("createDistributorWallet", function () {
        it("should create a distributor wallet", async function () {
            const { deployer, distributor, distributorWalletFactory, protocolModule, mockStablecoin } = await loadFixture(deployContractFixture);

            await expect(distributorWalletFactory.connect(deployer).createDistributorWallet(
                mockStablecoin.target,
                protocolModule.target,
                distributor.address
            )).to.emit(distributorWalletFactory, "DistributorWalletCreated");

            const wallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
            expect(wallets.length).to.equal(1);
            expect(await distributorWalletFactory.checkIsDistributorWallet(wallets[0])).to.be.true;
        });

        it("should not allow non-owner to create a distributor wallet", async function () {
            const { distributor, distributorWalletFactory, protocolModule, mockStablecoin } = await loadFixture(deployContractFixture);
            
            await expect(distributorWalletFactory.connect(distributor).createDistributorWallet(
                mockStablecoin.target,
                protocolModule.target,
                distributor.address
            )).to.be.reverted;
        });
    });
})
