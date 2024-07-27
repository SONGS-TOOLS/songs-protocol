import fs from 'fs';
import { artifacts, ethers, network, upgrades } from "hardhat";
import path from 'path';

const abisDirectory = path.join(__dirname, '..', '..', 'app', 'src', 'contracts');
const networkName = network.name;

// Adjust the path to save each network's contract addresses with the network name
const addressesFile = path.join(abisDirectory, `protocolContractAddresses-${networkName}.json`);

// Object to hold contract addresses
let contractAddresses: any = {};

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
  await whitelistingManager.deployed();
  console.log("WhitelistingManager deployed to:", whitelistingManager.address);
  await saveAbi("WhitelistingManager", whitelistingManager.address);

  // Deploy DistributorWalletFactory contract
  console.log("Deploying DistributorWalletFactory...");
  const DistributorWalletFactory = await ethers.getContractFactory("DistributorWalletFactory");
  const distributorWalletFactory = await DistributorWalletFactory.deploy();
  await distributorWalletFactory.deployed();
  console.log("DistributorWalletFactory deployed to:", distributorWalletFactory.address);
  await saveAbi("DistributorWalletFactory", distributorWalletFactory.address);

  // Deploy ProtocolModule contract
  console.log("Deploying ProtocolModule...");
  const ProtocolModule = await ethers.getContractFactory("ProtocolModule");
  const protocolModule = await upgrades.deployProxy(
    ProtocolModule,
    [distributorWalletFactory.address, whitelistingManager.address],
    { initializer: 'initialize' }
  );
  await protocolModule.deployed();
  console.log("ProtocolModule deployed to:", protocolModule.address);
  await saveAbi("ProtocolModule", protocolModule.address);

  // Deploy WrappedSongSmartAccount contract
  console.log("Deploying WrappedSongSmartAccount...");
  const WrappedSongSmartAccount = await ethers.getContractFactory("WrappedSongSmartAccount");
  const wrappedSongSmartAccount = await upgrades.deployProxy(
    WrappedSongSmartAccount,
    ["SongManagementAddress", "StablecoinAddress", deployer.address, protocolModule.address],
    { initializer: 'initialize' }
  );
  await wrappedSongSmartAccount.deployed();
  console.log("WrappedSongSmartAccount deployed to:", wrappedSongSmartAccount.address);
  await saveAbi("WrappedSongSmartAccount", wrappedSongSmartAccount.address);

  // Deploy WrappedSongFactory contract
  console.log("Deploying WrappedSongFactory...");
  const WrappedSongFactory = await ethers.getContractFactory("WrappedSongFactory");
  const wrappedSongFactory = await WrappedSongFactory.deploy(protocolModule.address, wrappedSongSmartAccount.address);
  await wrappedSongFactory.deployed();
  console.log("WrappedSongFactory deployed to:", wrappedSongFactory.address);
  await saveAbi("WrappedSongFactory", wrappedSongFactory.address);

  // Deploy WSTokenManagement contract
  console.log("Deploying WSTokenManagement...");
  const WSTokenManagement = await ethers.getContractFactory("WSTokenManagement");
  const wsTokenManagement = await upgrades.deployProxy(WSTokenManagement, [deployer.address], { initializer: 'initialize' });
  await wsTokenManagement.deployed();
  console.log("WSTokenManagement deployed to:", wsTokenManagement.address);
  await saveAbi("WSTokenManagement", wsTokenManagement.address);

  // Deploy DistributorWallet contract
  console.log("Deploying DistributorWallet...");
  const DistributorWallet = await ethers.getContractFactory("DistributorWallet");
  const distributorWallet = await upgrades.deployProxy(
    DistributorWallet,
    ["StablecoinAddress", protocolModule.address],
    { initializer: 'initialize' }
  );
  await distributorWallet.deployed();
  console.log("DistributorWallet deployed to:", distributorWallet.address);
  await saveAbi("DistributorWallet", distributorWallet.address);

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