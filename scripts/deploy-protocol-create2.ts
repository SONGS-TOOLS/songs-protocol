import fs from 'fs';
import { artifacts, ethers, network } from 'hardhat';
import path from 'path';

const abisDirectory = path.join(
  __dirname,
  '..',
  '..',
  'songs-app',
  'src',
  'contracts'
);
const localAbisDirectory = path.join(__dirname, '..', 'abis');
const networkName = network.name;

// Adjust the path to save each network's contract addresses with the network name
const addressesFile = path.join(
  abisDirectory,
  `protocolContractAddresses-${networkName}.json`
);
const addressesFile2 = path.join(
  localAbisDirectory,
  `protocolContractAddresses-${networkName}.json`
);

// Object to hold contract addresses
let contractAddresses: any = {};

// USDC stablecoin address on mainnet
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

// Utility function to compute CREATE2 address
function getCreate2Address(
  factoryAddress: string,
  salt: string,
  bytecode: string
): string {
  return ethers.utils.getCreate2Address(factoryAddress, salt, ethers.utils.keccak256(bytecode));
}

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

  // Factory contract for CREATE2 deployments
  const Create2Factory = await ethers.getContractFactory('Create2Factory');
  const create2Factory = await Create2Factory.deploy();
  await create2Factory.deployed();

  /* ////////////////////////////////////////////
  ////////  WhitelistingManager contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying WhitelistingManager...');
  const WhitelistingManager = await ethers.getContractFactory('WhitelistingManager');
  const whitelistingManagerBytecode = WhitelistingManager.bytecode;
  const whitelistingManagerSalt = ethers.utils.id('WhitelistingManager');
  const whitelistingManagerAddress = getCreate2Address(
    create2Factory.address,
    whitelistingManagerSalt,
    whitelistingManagerBytecode
  );
  await create2Factory.deploy(whitelistingManagerBytecode, whitelistingManagerSalt);
  console.log('WhitelistingManager deployed to:', whitelistingManagerAddress);
  await saveAbi('WhitelistingManager', whitelistingManagerAddress);

  /* ////////////////////////////////////////////
  ////////  DistributorWalletFactory contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying DistributorWalletFactory...');
  const DistributorWalletFactory = await ethers.getContractFactory('DistributorWalletFactory');
  const distributorWalletFactoryBytecode = DistributorWalletFactory.bytecode;
  const distributorWalletFactorySalt = ethers.utils.id('DistributorWalletFactory');
  const distributorWalletFactoryAddress = getCreate2Address(
    create2Factory.address,
    distributorWalletFactorySalt,
    distributorWalletFactoryBytecode
  );
  await create2Factory.deploy(distributorWalletFactoryBytecode, distributorWalletFactorySalt);
  console.log('DistributorWalletFactory deployed to:', distributorWalletFactoryAddress);
  await saveAbi('DistributorWalletFactory', distributorWalletFactoryAddress);

  /* ////////////////////////////////////////////
  ////////  ProtocolModule contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying ProtocolModule...');
  const ProtocolModule = await ethers.getContractFactory('ProtocolModule');
  const protocolModuleBytecode = ProtocolModule.bytecode;
  const protocolModuleSalt = ethers.utils.id('ProtocolModule');
  const protocolModuleAddress = getCreate2Address(
    create2Factory.address,
    protocolModuleSalt,
    protocolModuleBytecode
  );
  await create2Factory.deploy(protocolModuleBytecode, protocolModuleSalt);
  console.log('ProtocolModule deployed to:', protocolModuleAddress);
  await saveAbi('ProtocolModule', protocolModuleAddress);

  /* ////////////////////////////////////////////
  ////////  WrappedSongFactory contract  ////////
  //////////////////////////////////////////// */

  console.log('Deploying WrappedSongFactory...');
  const WrappedSongFactory = await ethers.getContractFactory('WrappedSongFactory');
  const wrappedSongFactoryBytecode = WrappedSongFactory.bytecode;
  const wrappedSongFactorySalt = ethers.utils.id('WrappedSongFactory');
  const wrappedSongFactoryAddress = getCreate2Address(
    create2Factory.address,
    wrappedSongFactorySalt,
    wrappedSongFactoryBytecode
  );
  await create2Factory.deploy(wrappedSongFactoryBytecode, wrappedSongFactorySalt);
  console.log('WrappedSongFactory deployed to:', wrappedSongFactoryAddress);
  await saveAbi('WrappedSongFactory', wrappedSongFactoryAddress);

  // Save the ABI of WrappedSongSmartAccount without deploying it
  await saveAbi('WrappedSongSmartAccount', '0x0000000000000000000000000000000000000000');

  // After all deployments, save the contract addresses to a file
  fs.writeFileSync(addressesFile, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile}`);

  fs.writeFileSync(addressesFile2, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile2}`);
}

async function saveAbi(contractName: string, contractAddress: any) {
  const artifact = await artifacts.readArtifact(contractName);
  const abiContent = JSON.stringify(artifact.abi, null, 2); // Pretty print the JSON

  // Save ABI in the app directory
  fs.writeFileSync(
    path.join(abisDirectory, `${contractName}.json`),
    abiContent
  );
  console.log(
    `ABI for ${contractName} saved to ${abisDirectory}/${contractName}-${networkName}.json`
  );

  // Save ABI in the local protocol directory
  fs.writeFileSync(
    path.join(localAbisDirectory, `${contractName}.json`),
    abiContent
  );
  console.log(
    `ABI for ${contractName} saved to ${localAbisDirectory}/${contractName}-${networkName}.json`
  );

  // Update the contract addresses object
  contractAddresses[contractName] = contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });