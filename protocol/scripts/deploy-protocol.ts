import fs from 'fs';
import { artifacts, ethers, network, upgrades } from "hardhat";
import path from 'path';

const abisDirectory = path.join(__dirname, '..', '..', 'app', 'src', 'contracts');
const networkName = network.name;

// Adjust the path to save each network's contract addresses with the network name
const addressesFile = path.join(abisDirectory, `protocolContractAddresses-${networkName}.json`);

// Object to hold contract addresses
let contractAddresses: any = {};

// USDC stablecoin address on mainnet
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account address:", deployer.address);
  console.log("Account balance:", balance.toString());

  // Ensure the ABIs directory exists
  if (!fs.existsSync(abisDirectory)) {
    fs.mkdirSync(abisDirectory, { recursive: true });
  }

  // Deploy WhitelistingManager contract
  console.log("Deploying WhitelistingManager...");
  const WhitelistingManager = await ethers.getContractFactory("WhitelistingManager");
  const whitelistingManager = await upgrades.deployProxy(WhitelistingManager, [deployer.address], { initializer: 'initialize' });
  await whitelistingManager.waitForDeployment();
  console.log("WhitelistingManager deployed to:", await whitelistingManager.getAddress());
  await saveAbi("WhitelistingManager", await whitelistingManager.getAddress());

  // Deploy DistributorWalletFactory contract
  console.log("Deploying DistributorWalletFactory...");
  const DistributorWalletFactory = await ethers.getContractFactory("DistributorWalletFactory");
  const distributorWalletFactory = await DistributorWalletFactory.deploy(deployer.address);
  await distributorWalletFactory.waitForDeployment();
  console.log("DistributorWalletFactory deployed to:", await distributorWalletFactory.getAddress());
  await saveAbi("DistributorWalletFactory", await distributorWalletFactory.getAddress());

  // Deploy ProtocolModule contract
  console.log("Deploying ProtocolModule...");
  const ProtocolModule = await ethers.getContractFactory("ProtocolModule");
  const protocolModule = await upgrades.deployProxy(
    ProtocolModule,
    [
      await distributorWalletFactory.getAddress(),
      await whitelistingManager.getAddress()
    ],
    { initializer: 'initialize' }
  );
  await protocolModule.waitForDeployment();
  console.log("ProtocolModule deployed to:", await protocolModule.getAddress());
  await saveAbi("ProtocolModule", await protocolModule.getAddress());

  // Deploy WSTokenManagement contract
  console.log("Deploying WSTokenManagement...");
  const WSTokenManagement = await ethers.getContractFactory("WSTokenManagement");
  const wsTokenManagement = await upgrades.deployProxy(WSTokenManagement, [
    deployer.address, // initial owner
     deployer.address //minter
    ], { initializer: 'initialize' });
  await wsTokenManagement.waitForDeployment();
  console.log("WSTokenManagement deployed to:", await wsTokenManagement.getAddress());
  await saveAbi("WSTokenManagement", await wsTokenManagement.getAddress());

  // Deploy DistributorWallet contract
  console.log("Deploying DistributorWallet...");
  const DistributorWallet = await ethers.getContractFactory("DistributorWallet");
  const distributorWallet = await upgrades.deployProxy(
    DistributorWallet,
    [
      USDC_ADDRESS, // Use the USDC stablecoin address
      await protocolModule.getAddress()
    ],
    { initializer: 'initialize' }
  );
  await distributorWallet.waitForDeployment();
  console.log("DistributorWallet deployed to:", await distributorWallet.getAddress());
  await saveAbi("DistributorWallet", await distributorWallet.getAddress());

  // Deploy WrappedSongSmartAccount contract
  console.log("Deploying WrappedSongSmartAccount...");
  const WrappedSongSmartAccount = await ethers.getContractFactory("WrappedSongSmartAccount");
  const wrappedSongSmartAccount = await upgrades.deployProxy(
    WrappedSongSmartAccount,
    [
      await wsTokenManagement.getAddress(), // Use the WSTokenManagement address
      USDC_ADDRESS, // Use the USDC stablecoin address
      deployer.address,
      await protocolModule.getAddress()
    ],
    { initializer: 'initialize' }
  );
  await wrappedSongSmartAccount.waitForDeployment();
  console.log("WrappedSongSmartAccount deployed to:", await wrappedSongSmartAccount.getAddress());
  await saveAbi("WrappedSongSmartAccount", await wrappedSongSmartAccount.getAddress());

  // Deploy WrappedSongFactory contract
  console.log("Deploying WrappedSongFactory...");
  const WrappedSongFactory = await ethers.getContractFactory("WrappedSongFactory");
  const wrappedSongFactory = await WrappedSongFactory.deploy(await protocolModule.getAddress(), await wrappedSongSmartAccount.getAddress());
  await wrappedSongFactory.waitForDeployment();
  console.log("WrappedSongFactory deployed to:", await wrappedSongFactory.getAddress());
  await saveAbi("WrappedSongFactory", await wrappedSongFactory.getAddress());

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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });