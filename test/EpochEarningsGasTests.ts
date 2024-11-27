import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from "hardhat";
import { deployProtocolFixture } from './fixtures/protocolFixture';
import { expect } from 'chai';

describe("Epoch Distribution Gas Tests", function () {
    // Move constants to a configuration object for better maintainability
    const GAS_CONFIG = {
        GWEI_PRICE: 0.001, // Base L2 gas price in gwei
        ETH_PRICE_USD: 3500,
        L2_GAS_MULTIPLIER: 0.0001, // Base is ~1/10000 of L1 gas costs
    };

    function calculateCosts(gasUsed: bigint) {
        const gasPrice = BigInt(Math.floor(GAS_CONFIG.GWEI_PRICE * 10 ** 9));
        const baseGasCost = Number(gasUsed * gasPrice) / 10 ** 18;
        const ethCost = baseGasCost * GAS_CONFIG.L2_GAS_MULTIPLIER;
        const usdCost = ethCost * GAS_CONFIG.ETH_PRICE_USD;

        return {
            gasUsed,
            ethCost: ethCost.toFixed(8),
            usdCost: usdCost.toFixed(4),
            gasPrice
        };
    }

    async function setupDistributor() {
        const fixture = await loadFixture(deployProtocolFixture);
        const {
            distributor,
            mockStablecoin,
            distributorWalletFactory
        } = fixture;

        // Create distributor wallet
        const distributorCreationFee = await fixture.protocolModule.distributorCreationFee();
        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            fixture.protocolModule.target,
            distributor.address,
            { value: distributorCreationFee }
        );
        
        const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
        expect(distributorWallets.length).to.be.greaterThan(0, "No distributor wallet created");
        
        const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

        return {
            ...fixture,
            distributorWallet
        };
    }

    it("should measure gas consumption and costs for different chunk sizes", async function () {
        const {
            distributor,
            deployer,
            mockStablecoin,
            distributorWallet
        } = await setupDistributor();

        const chunkSizes = [100, 500, 1000];
        const results: Array<{size: number, costs: ReturnType<typeof calculateCosts>}> = [];

        console.log("\nGas Consumption Analysis for Different Chunk Sizes");
        console.log("================================================");
        console.log(`Current rates: ${GAS_CONFIG.GWEI_PRICE} gwei on Base, ETH price: $${GAS_CONFIG.ETH_PRICE_USD}`);

        let currentEpoch = await distributorWallet.currentEpochId() + 1n;

        for (const size of chunkSizes) {
            const amountPerSong = ethers.parseUnits("100", 18);
            const amounts = Array(size).fill(amountPerSong);
            const totalAmount = amountPerSong * BigInt(size);

            // Setup token approvals
            await mockStablecoin.connect(deployer).transfer(distributor.address, totalAmount);
            await mockStablecoin.connect(distributor).approve(distributorWallet.target, totalAmount);

            const tx = await distributorWallet.connect(distributor).createDistributionEpochChunk(
                currentEpoch,
                0,
                amounts,
                totalAmount,
                true,
                true
            );

            const receipt = await tx.wait();
            expect(receipt).to.not.be.null;
            
            const costs = calculateCosts(receipt?.gasUsed || 0n);
            results.push({ size, costs });

            currentEpoch++;
        }

        // Log results in a structured format
        console.table(results.map(({ size, costs }) => ({
            'Chunk Size': size,
            'Gas Used': costs.gasUsed.toString(),
            'ETH Cost': costs.ethCost,
            'USD Cost': costs.usdCost,
            'Gas/Song': Math.floor(Number(costs.gasUsed) / size),
            'USD/Song': (Number(costs.usdCost) / size).toFixed(6)
        })));
    });

    it("should measure gas consumption and costs for multi-chunk distribution", async function () {
        const {
            distributor,
            deployer,
            mockStablecoin,
            distributorWallet
        } = await setupDistributor();

        const testConfig = {
            amountPerSong: ethers.parseUnits("100", 18),
            chunksCount: 3,
            songsPerChunk: 1000
        };

        const totalAmount = testConfig.amountPerSong * 
            BigInt(testConfig.chunksCount * testConfig.songsPerChunk);

        const startingEpoch = await distributorWallet.currentEpochId() + 1n;

        // Setup token approvals
        await mockStablecoin.connect(deployer).transfer(distributor.address, totalAmount);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, totalAmount);

        console.log("\nMulti-Chunk Distribution Analysis");
        console.log(`Total songs: ${testConfig.chunksCount * testConfig.songsPerChunk}`);

        const chunkResults = [];
        let totalGasUsed = 0n;

        for (let i = 0; i < testConfig.chunksCount; i++) {
            const amounts = Array(testConfig.songsPerChunk).fill(testConfig.amountPerSong);
            const tx = await distributorWallet.connect(distributor).createDistributionEpochChunk(
                startingEpoch,
                i,
                amounts,
                i === 0 ? totalAmount : 0,
                i === 0,
                i === testConfig.chunksCount - 1
            );

            const receipt = await tx.wait();
            expect(receipt).to.not.be.null;
            
            const gasUsed = receipt?.gasUsed || 0n;
            totalGasUsed += gasUsed;
            const costs = calculateCosts(gasUsed);
            chunkResults.push({ chunkIndex: i, costs });
        }

        // Log individual chunk results
        console.table(chunkResults.map(({ chunkIndex, costs }) => ({
            'Chunk': chunkIndex + 1,
            'Gas Used': costs.gasUsed.toString(),
            'ETH Cost': costs.ethCost,
            'USD Cost': costs.usdCost
        })));

        // Log aggregate results
        const totalCosts = calculateCosts(totalGasUsed);
        const totalSongs = testConfig.chunksCount * testConfig.songsPerChunk;
        
        console.log("\nAggregate Results:");
        console.table({
            'Total Gas': totalGasUsed.toString(),
            'Total ETH': totalCosts.ethCost,
            'Total USD': totalCosts.usdCost,
            'Avg Gas/Song': Math.floor(Number(totalGasUsed) / totalSongs),
            'Avg USD/Song': (Number(totalCosts.usdCost) / totalSongs).toFixed(6)
        });
    });
}); 