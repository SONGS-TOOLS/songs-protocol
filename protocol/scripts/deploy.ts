import { ethers, network, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", balance);

    // Deploy UMDP contract
    console.log("Deploying UMDP...");
    const UMDP = await ethers.getContractFactory("UMDP");
    const umdp = await UMDP.deploy(deployer.address);
    // Wait for the contract to be deployed
    console.log("UMDP deployed to:", await umdp.getAddress());

    // Deploy MusicERC721 contract with the deployer as the initial owner
    const MusicERC721 = await ethers.getContractFactory("MusicERC721");
    const musicERC721 = await MusicERC721.deploy("MufiBase", "MUFI", deployer.address); // Updated to include deployer.address as initialOwner
    console.log("MusicERC721 deployed to:", await musicERC721.getAddress());

    // Optional: Verify contracts after deployment
    // await verifyContracts(umdp.address, [deployer.address]);
    // await verifyContracts(musicERC721.address, ["MufiBase", "MUFI", deployer.address]);
}

async function verifyContracts(contractAddress: string, constructorArguments: any[]) {
    if (network.name !== "hardhat" && network.name !== "localhost") {
        console.log(`Sleeping before verification for contract at ${contractAddress}...`);
        await sleep(30000); // Wait for the network to acknowledge the deployment
        try {
            await run("verify:verify", {
                address: contractAddress,
                constructorArguments: constructorArguments,
            });
        } catch (error) {
            console.error(`Verification failed for contract at ${contractAddress}`, error);
        }
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
