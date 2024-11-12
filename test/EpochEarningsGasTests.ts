import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from "hardhat";
import { deployProtocolFixture } from './fixtures/protocolFixture';

describe("Epoch Distribution Gas Tests", function () {
    this.timeout(120000);

    // Current market rates
    const GWEI_PRICE = 0.001; // 0.001 gwei on Base
    const ETH_PRICE_USD = 3500; // $3,500 per ETH
    const L2_GAS_MULTIPLIER = 0.0001; // Base is ~1/10000 of L1 gas costs

    function calculateCosts(gasUsed: bigint) {
        const gasPrice = BigInt(Math.floor(GWEI_PRICE * 10 ** 9)); // Convert gwei to wei
        const baseGasCost = Number(gasUsed * gasPrice) / 10 ** 18;
        const ethCost = baseGasCost * L2_GAS_MULTIPLIER;
        const usdCost = ethCost * ETH_PRICE_USD;

        return {
            ethCost: ethCost.toFixed(8),
            usdCost: usdCost.toFixed(4)
        };
    }

    async function setupDistributor() {
        const fixture = await loadFixture(deployProtocolFixture);
        const {
            distributor,
            deployer,
            mockStablecoin,
            distributorWalletFactory
        } = fixture;

        await distributorWalletFactory.createDistributorWallet(
            mockStablecoin.target,
            fixture.protocolModule.target,
            distributor.address
        );
        const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
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

        // Test different chunk sizes
        const chunkSizes = [100, 500, 1000];
        console.log("\nGas Consumption Analysis for Different Chunk Sizes");
        console.log("================================================");
        console.log(`Current rates: ${GWEI_PRICE} gwei on Base, ETH price: $${ETH_PRICE_USD}`);
        console.log(`L2 gas multiplier: ${L2_GAS_MULTIPLIER} (Base vs L1)`);
        console.log("------------------------------------------------");

        let currentEpoch = 1; // Start with epoch 1

        for (const size of chunkSizes) {
            const amountPerSong = ethers.parseUnits("100", 18);
            const amounts = Array(size).fill(amountPerSong);
            const totalAmount = amountPerSong * BigInt(size);

            await mockStablecoin.connect(deployer).transfer(distributor.address, totalAmount);
            await mockStablecoin.connect(distributor).approve(distributorWallet.target, totalAmount);

            const tx = await distributorWallet.connect(distributor).createDistributionEpochChunk(
                currentEpoch, // Use incrementing epoch
                0,
                amounts,
                totalAmount,
                true,
                true
            );

            const receipt = await tx.wait();
            const gasUsed = receipt?.gasUsed || 0n;
            const costs = calculateCosts(gasUsed);

            console.log(`\nChunk size: ${size} songs`);
            console.log(`Gas used: ${gasUsed.toString()} units`);
            console.log(`Cost in ETH: ${costs.ethCost} ETH`);
            console.log(`Cost in USD: $${costs.usdCost}`);
            console.log(`Gas per song: ${(Number(gasUsed) / size).toFixed(0)} units`);
            console.log(`USD per song: $${(Number(costs.usdCost) / size).toFixed(6)}`);

            currentEpoch++; // Increment epoch for next test
        }
    });

    it("should measure gas consumption and costs for multi-chunk distribution", async function () {
        const {
            distributor,
            deployer,
            mockStablecoin,
            distributorWallet
        } = await setupDistributor();

        const amountPerSong = ethers.parseUnits("100", 18);
        const chunksCount = 3;
        const songsPerChunk = 1000;
        const totalAmount = amountPerSong * BigInt(chunksCount * songsPerChunk);

        // Get current epoch from contract and convert to bigint
        const startingEpoch = await distributorWallet.currentEpochId() + BigInt(1);

        await mockStablecoin.connect(deployer).transfer(distributor.address, totalAmount);
        await mockStablecoin.connect(distributor).approve(distributorWallet.target, totalAmount);

        console.log("\nGas Consumption Analysis for Multi-Chunk Distribution");
        console.log("=================================================");
        console.log(`Total songs: ${chunksCount * songsPerChunk}`);
        console.log(`Chunks: ${chunksCount}, Songs per chunk: ${songsPerChunk}`);
        console.log(`Current rates: ${GWEI_PRICE} gwei on Base, ETH price: $${ETH_PRICE_USD}`);
        console.log("-------------------------------------------------");

        let totalGasUsed = 0n;

        for (let i = 0; i < chunksCount; i++) {
            const amounts = Array(songsPerChunk).fill(amountPerSong);
            const tx = await distributorWallet.connect(distributor).createDistributionEpochChunk(
                startingEpoch,
                i,
                amounts,
                i === 0 ? totalAmount : 0,
                i === 0,
                i === chunksCount - 1
            );

            const receipt = await tx.wait();
            const gasUsed = receipt?.gasUsed || 0n;
            totalGasUsed += gasUsed;
            const costs = calculateCosts(gasUsed);

            console.log(`\nChunk ${i + 1}/${chunksCount}:`);
            console.log(`Gas used: ${gasUsed.toString()} units`);
            console.log(`Cost in ETH: ${costs.ethCost} ETH`);
            console.log(`Cost in USD: $${costs.usdCost}`);
        }

        const totalCosts = calculateCosts(totalGasUsed);
        console.log("\nTotal Distribution Costs:");
        console.log(`Total gas used: ${totalGasUsed.toString()} units`);
        console.log(`Total cost in ETH: ${totalCosts.ethCost} ETH`);
        console.log(`Total cost in USD: $${totalCosts.usdCost}`);
        console.log(`Average gas per song: ${(Number(totalGasUsed) / (chunksCount * songsPerChunk)).toFixed(0)} units`);
        console.log(`Average USD per song: $${(Number(totalCosts.usdCost) / (chunksCount * songsPerChunk)).toFixed(6)}`);
    });
}); 