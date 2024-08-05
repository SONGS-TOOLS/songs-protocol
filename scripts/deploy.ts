import fs from 'fs';
import { artifacts, ethers, network, run } from "hardhat";
import path from 'path';

const abisDirectory = path.join(__dirname, '..', '..', 'app', 'src', 'contracts');
const networkName = network.name;

// Adjust the path to save each network's contract addresses with the network name
const addressesFile = path.join(abisDirectory, `contractAddresses-${networkName}.json`);

// Object to hold contract addresses
let contractAddresses: any = {};

// Load existing contract addresses if the file exists
if (fs.existsSync(addressesFile)) {
  contractAddresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));
}

async function main() {
  const [deployer, deployer2, deployer3, deployer4] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account address:", deployer.address);
  // console.log("Account address:", deployer2.address, deployer3.address, deployer4.address);
  console.log("Account balance:", balance.toString());

  // Ensure the ABIs directory exists
  if (!fs.existsSync(abisDirectory)) {
    fs.mkdirSync(abisDirectory, { recursive: true });
  }

  // Deploy UMDP contract if not already deployed
  if (!contractAddresses.UMDP) {
    console.log("Deploying UMDP...");
    const UMDP = await ethers.getContractFactory("UMDP");
    const umdp = await UMDP.deploy(deployer.address);
    await umdp.deployed();
    console.log("UMDP deployed to:", await umdp.getAddress());
    await saveAbi("UMDP", await umdp.getAddress());
    await verifyContract("UMDP", await umdp.getAddress(), [deployer.address]);
  } else {
    console.log("UMDP already deployed at:", contractAddresses.UMDP);
  }

  // Deploy MusicERC721 contract if not already deployed
  if (!contractAddresses.MusicERC721) {
    console.log("Deploying MusicERC721...");
    const MusicERC721 = await ethers.getContractFactory("MusicERC721");
    const musicERC721 = await MusicERC721.deploy("MufiBase", "MUFI");
    await musicERC721.deployed();
    console.log("MusicERC721 deployed to:", await musicERC721.getAddress());
    await saveAbi("MusicERC721", await musicERC721.getAddress());
    await verifyContract("MusicERC721", await musicERC721.getAddress(), ["MufiBase", "MUFI"]);
  } else {
    console.log("MusicERC721 already deployed at:", contractAddresses.MusicERC721);
  }

  // Deploy MusicERC721 Factory contract if not already deployed
  if (!contractAddresses.MusicERC721Factory) {
    console.log("Deploying MusicERC721 Factory...");
    const MusicERC721Factory = await ethers.getContractFactory("MusicERC721Factory");
    const musicERC721Factory = await MusicERC721Factory.deploy();
    await musicERC721Factory.deployed();
    console.log("MusicERC721Factory deployed to:", await musicERC721Factory.getAddress());
    await saveAbi("MusicERC721Factory", await musicERC721Factory.getAddress());
    await verifyContract("MusicERC721Factory", await musicERC721Factory.getAddress(), []);
  } else {
    console.log("MusicERC721Factory already deployed at:", contractAddresses.MusicERC721Factory);
  }

  // After all deployments, save the contract addresses to a file
  fs.writeFileSync(addressesFile, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile}`);
}

async function saveAbi(contractName: string, contractAddress: any) {
  const artifact = await artifacts.readArtifact(contractName);
  fs.writeFileSync(
    path.join(abisDirectory, `${contractName}.json`),
    JSON.stringify(artifact.abi, null, 2) // Pretty print the JSON
  );
  console.log(`ABI for ${contractName} saved to ${abisDirectory}/${contractName}-${networkName}.json`);

  // Update the contract addresses object
  contractAddresses[contractName] = contractAddress;
}

async function verifyContract(contractName: string, contractAddress: string, constructorArguments: any[]) {
  console.log(`Verifying ${contractName} at ${contractAddress}...`);
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
    console.log(`${contractName} verified successfully`);
  } catch (error) {
    console.error(`Failed to verify ${contractName}:`, error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });