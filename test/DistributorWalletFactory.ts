import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { deployProtocolFixture as deployContractFixture } from './fixtures/protocolFixture';
import { ethers } from "hardhat";

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
            const creationFee = ethers.parseEther("0.1");

            await expect(distributorWalletFactory.connect(deployer).createDistributorWallet(
                mockStablecoin.target,
                protocolModule.target,
                distributor.address,
                { value: creationFee }
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

    describe("Pause functionality", function () {
        it("should not allow creating distributor wallet when protocol is paused", async function () {
            const { deployer, distributor, distributorWalletFactory, protocolModule, mockStablecoin } = await loadFixture(deployContractFixture);
            
            // Pause the protocol using Pause
            await protocolModule.connect(deployer).pause();
            
            await expect(
                distributorWalletFactory.connect(deployer).createDistributorWallet(
                    mockStablecoin.target,
                    protocolModule.target,
                    distributor.address
                )
            ).to.be.revertedWith("Protocol is paused");
        });

        it("should allow creating distributor wallet after unpausing", async function () {
            const { deployer, distributor, distributorWalletFactory, protocolModule, mockStablecoin } = await loadFixture(deployContractFixture);
            const creationFee = ethers.parseEther("0.1");
            // Pause and then unpause the protocol using setPaused
            await protocolModule.connect(deployer).pause();
            await protocolModule.connect(deployer).unpause();
            
            await expect(
                distributorWalletFactory.connect(deployer).createDistributorWallet(
                    mockStablecoin.target,
                    protocolModule.target,
                    distributor.address,
                    { value: creationFee }
                )
            ).to.emit(distributorWalletFactory, "DistributorWalletCreated");
        });
    });

    describe("withdrawAccumulatedFees", function () {
        it("should withdraw accumulated fees", async function () {
            const { deployer, distributor, distributorWalletFactory, protocolModule, mockStablecoin } = await loadFixture(deployContractFixture);
            
            // Create 5 distributor wallets with incrementing fees
            for (let i = 0; i < 5; i++) {
                // Set new creation fee before each wallet creation (0.1 increment)
                const newFee = ethers.parseEther((0.1 * (i + 1)).toString());
                await protocolModule.connect(deployer).setDistributorCreationFee(newFee);
                
                // Create distributor wallet
                await distributorWalletFactory.connect(deployer).createDistributorWallet(
                    mockStablecoin.target,
                    protocolModule.target,
                    distributor.address,
                    { value: newFee }
                );
            }

            // Calculate total accumulated fees (0.1 + 0.2 + 0.3 + 0.4 + 0.5 = 1.5 ETH)
            const expectedTotalFees = ethers.parseEther("1.5");

            // Get initial balance of the owner
            const initialBalance = await ethers.provider.getBalance(deployer.address);

            // Withdraw accumulated fees
            const withdrawTx = await distributorWalletFactory.connect(deployer).withdrawAccumulatedFees(ethers.ZeroAddress, deployer.address, protocolModule.target);
            const receipt = await withdrawTx.wait();
            
            // Calculate gas cost
            const gasCost = receipt!.gasUsed * receipt!.gasPrice;

            // Get final balance of the owner
            const finalBalance = await ethers.provider.getBalance(deployer.address);

            // Verify the balance difference (considering gas costs)
            const actualBalanceDifference = BigInt(finalBalance) - BigInt(initialBalance) + BigInt(gasCost);
            
            // Check if the balance difference matches expected fees (with small margin for gas price fluctuations)
            expect(actualBalanceDifference).to.be.closeTo(
                expectedTotalFees,
                ethers.parseEther("0.01") // Allow for small deviation due to gas costs
            );

            // Verify factory contract balance is zero after withdrawal
            expect(await ethers.provider.getBalance(distributorWalletFactory.target)).to.equal(0);
        });

        it("should not allow non-owner to withdraw fees", async function () {
            const { deployer, distributor, distributorWalletFactory, protocolModule } = await loadFixture(deployContractFixture);
            
            await expect(
                distributorWalletFactory.connect(distributor).withdrawAccumulatedFees(ethers.ZeroAddress, deployer.address, protocolModule.target)
            ).to.be.revertedWith("Only protocol owner can withdraw fees");
        });
    });
})