import fs, { writeFileSync } from 'fs';
import { artifacts, ethers, network } from 'hardhat';
import path from 'path';

const abisDirectory = path.join(__dirname, '..', '..', 'songs-app', 'src', 'contracts');
const localAbisDirectory = path.join(__dirname, '..', 'abis');
const networkName = network.name;

// Adjust the path to save each network's contract addresses with the network name
const addressesFile = path.join(abisDirectory, `protocolContractAddresses-${networkName}.json`);
const addressesFile2 = path.join(localAbisDirectory, `protocolContractAddresses-${networkName}.json`);

// Object to hold contract addresses
let contractAddresses: any = {};

// USDC stablecoin address on mainnet
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Account address:', deployer.address);
  console.log('Account balance:', balance.toString());

  // Ensure the ABIs directories exist
  if (!fs.existsSync(abisDirectory)) {
    fs.mkdirSync(abisDirectory, { recursive: true });
  }
  if (!fs.existsSync(localAbisDirectory)) {
    fs.mkdirSync(localAbisDirectory, { recursive: true });
  }

  /* ////////////////////////////////////////////
  ////////  WhitelistingManager contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying WhitelistingManager...');
  const WhitelistingManager = await ethers.getContractFactory('WhitelistingManager');
  const whitelistingManager = await WhitelistingManager.deploy(deployer.address);
  await whitelistingManager.waitForDeployment();
  console.log('WhitelistingManager deployed to:', await whitelistingManager.getAddress());
  await saveAbi('WhitelistingManager', await whitelistingManager.getAddress());

  /* ////////////////////////////////////////////
  ////////  DistributorWalletFactory contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying DistributorWalletFactory...');
  const DistributorWalletFactory = await ethers.getContractFactory('DistributorWalletFactory');
  const distributorWalletFactory = await DistributorWalletFactory.deploy(deployer.address);
  await distributorWalletFactory.waitForDeployment();
  console.log('DistributorWalletFactory deployed to:', await distributorWalletFactory.getAddress());
  await saveAbi('DistributorWalletFactory', await distributorWalletFactory.getAddress());

    /* ////////////////////////////////////////////
  ////////  ERC20Whitelist contract  ////////
  //////////////////////////////////////////// */
  
  console.log('Deploying ERC20Whitelist...');
  const ERC20Whitelist = await ethers.getContractFactory('ERC20Whitelist');
  const erc20Whitelist = await ERC20Whitelist.deploy(deployer.address);
  await erc20Whitelist.waitForDeployment();
  console.log('ERC20Whitelist deployed to:', await erc20Whitelist.getAddress());
  await saveAbi('ERC20Whitelist', await erc20Whitelist.getAddress());

  /* ////////////////////////////////////////////
  ////////  ProtocolModule contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying ProtocolModule...');
  const ProtocolModule = await ethers.getContractFactory('ProtocolModule');
  const protocolModule = await ProtocolModule.connect(deployer).deploy(
    await distributorWalletFactory.getAddress(),
    await whitelistingManager.getAddress(),
    await erc20Whitelist.getAddress()
  );
  await protocolModule.waitForDeployment();
  console.log('ProtocolModule deployed to:', await protocolModule.getAddress());
  await saveAbi('ProtocolModule', await protocolModule.getAddress());

  // Set ProtocolModule as authorized caller for ERC20Whitelist
  await erc20Whitelist.connect(deployer).setAuthorizedCaller(protocolModule.target);
  
  // Whitelist USDC using the protocolModule
  console.log('Whitelisting USDC...');
  await protocolModule.connect(deployer).whitelistToken(USDC_ADDRESS);
  console.log('USDC whitelisted');
  
  /* ////////////////////////////////////////////
  ////////  MetadataModule contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying MetadataModule...');
  const MetadataModule = await ethers.getContractFactory('MetadataModule');
  const metadataModule = await MetadataModule.deploy(await protocolModule.getAddress());
  await metadataModule.waitForDeployment();
  console.log('MetadataModule deployed to:', await metadataModule.getAddress());
  await saveAbi('MetadataModule', await metadataModule.getAddress());

  /* ////////////////////////////////////////////
  ////////  WSUtils contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying WSUtils...');
  const WSUtils = await ethers.getContractFactory('WSUtils');
  const wsUtils = await WSUtils.deploy(await protocolModule.getAddress(), deployer.address);
  await wsUtils.waitForDeployment();
  console.log('WSUtils deployed to:', await wsUtils.getAddress());
  await saveAbi('WSUtils', await wsUtils.getAddress());

  /* ////////////////////////////////////////////
  ////////  WrappedSongFactory contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying WrappedSongFactory...');
  const WrappedSongFactory = await ethers.getContractFactory('WrappedSongFactory');
  const wrappedSongFactory = await WrappedSongFactory.deploy(
    await protocolModule.getAddress(), 
    await metadataModule.getAddress()
  );
  await wrappedSongFactory.waitForDeployment();
  console.log('WrappedSongFactory deployed to:', await wrappedSongFactory.getAddress());
  await saveAbi('WrappedSongFactory', await wrappedSongFactory.getAddress());

  // Set MetadataModule in ProtocolModule
  await protocolModule.setMetadataModule(await metadataModule.getAddress());

  // Save the ABI of WrappedSongSmartAccount without deploying it
  await saveAbi('WrappedSongSmartAccount', '0x0000000000000000000000000000000000000000');

  // Save the ABI of WSTokensManagement without deploying it
  await saveAbi('WSTokenManagement', '0x0000000000000000000000000000000000000000');

  // After all deployments, save the contract addresses to a file
  fs.writeFileSync(addressesFile, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile}`);

  fs.writeFileSync(addressesFile2, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile2}`);

  // Update deployment-info.json
  const deploymentInfo = {
    network: network.name,
    protocolModuleAddress: await protocolModule.getAddress(),
    protocolModuleStartBlock: (await protocolModule.deploymentTransaction()?.wait())?.blockNumber || 0,
    wrappedSongFactoryAddress: await wrappedSongFactory.getAddress(),
    wrappedSongFactoryStartBlock: (await wrappedSongFactory.deploymentTransaction()?.wait())?.blockNumber || 0,
    metadataModuleAddress: await metadataModule.getAddress(),
    metadataModuleStartBlock: (await metadataModule.deploymentTransaction()?.wait())?.blockNumber || 0,
  };

  fs.writeFileSync(
    path.join(__dirname, '../subgraph/deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Save deployment info for subgraph
  const deploymentBlockNumber = await ethers.provider.getBlockNumber();
  const subgraphDeployInfo = {
    networkName: networkName,
    chainId: network.config.chainId,
    protocolModuleAddress: await protocolModule.getAddress(),
    wrappedSongFactoryAddress: await wrappedSongFactory.getAddress(),
    metadataModuleAddress: await metadataModule.getAddress(),
    startBlock: deploymentBlockNumber
  };

  const subgraphDeployInfoPath = path.join(__dirname, '..', 'subgraph', 'deployment-info.json');
  writeFileSync(subgraphDeployInfoPath, JSON.stringify(subgraphDeployInfo, null, 2));
  console.log(`Subgraph deployment info saved to ${subgraphDeployInfoPath}`);
}

async function saveAbi(contractName: string, contractAddress: string) {
  const artifact = await artifacts.readArtifact(contractName);
  const abiContent = JSON.stringify(artifact.abi, null, 2); // Pretty print the JSON

  // Save ABI in the app directory
  fs.writeFileSync(path.join(abisDirectory, `${contractName}.json`), abiContent);
  console.log(`ABI for ${contractName} saved to ${abisDirectory}/${contractName}-${networkName}.json`);

  // Save ABI in the local protocol directory
  fs.writeFileSync(path.join(localAbisDirectory, `${contractName}.json`), abiContent);
  console.log(`ABI for ${contractName} saved to ${localAbisDirectory}/${contractName}-${networkName}.json`);

  // Update the contract addresses object
  contractAddresses[contractName] = contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
