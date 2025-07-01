import { ethers, network, artifacts } from 'hardhat';
import fs from 'fs';
import path from 'path';

const addressesFile = path.join(__dirname, '../abis/contract-addresses.json');
const abisDirectory = path.join(__dirname, '../abis');
const localAbisDirectory = path.join(__dirname, '../subgraph/abis');

let contractAddresses: any = {};

// Load existing contract addresses if file exists
if (fs.existsSync(addressesFile)) {
  contractAddresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));
}

/**
 * @dev Script to deploy MetadataRendererV2 with embedded StorageDetect library
 * This script will:
 * 1. Deploy the new MetadataRendererV2 contract (StorageDetect is embedded)
 * 2. Provide integration instructions for ProtocolModule
 * 3. Save ABIs and contract addresses
 */
async function main() {
  console.log(`\n🚀 Starting MetadataRendererV2 deployment on ${network.name}...`);
  
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  console.log(`Account balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);

  // Ensure directories exist
  if (!fs.existsSync(abisDirectory)) {
    fs.mkdirSync(abisDirectory, { recursive: true });
  }
  if (!fs.existsSync(localAbisDirectory)) {
    fs.mkdirSync(localAbisDirectory, { recursive: true });
  }

  /******************************************************************************
   *                                                                             *
   *                         DEPLOY METADATA RENDERER V2                        *
   *                         (StorageDetect is embedded automatically)           *
   *                                                                             *
   ******************************************************************************/

  /******************************************************************************
   *                                                                             *
   *                         DEPLOY METADATA RENDERER V2                        *
   *                                                                             *
   ******************************************************************************/

  console.log('\n🎨 Deploying MetadataRendererV2...');
  const MetadataRendererV2 = await ethers.getContractFactory('MetadataRendererV2');
  const metadataRendererV2 = await MetadataRendererV2.deploy(
    deployer.address, // initialOwner
    "ipfs://", // _ipfsBaseURI
    "ar://" // _arweaveBaseURI
  );
  await metadataRendererV2.waitForDeployment();
  console.log('✅ MetadataRendererV2 deployed to:', await metadataRendererV2.getAddress());
  console.log('   - Initial Owner:', deployer.address);
  console.log('   - Default IPFS Base URI:', "ipfs://");
  console.log('   - Default Arweave Base URI:', "ar://");
  await saveAbi('MetadataRendererV2', await metadataRendererV2.getAddress());
  await saveLibraryAbi('StorageDetect'); // Save StorageDetect ABI for reference

  /******************************************************************************
   *                                                                             *
   *                         PROTOCOL MODULE INTEGRATION                        *
   *                                                                             *
   ******************************************************************************/

  console.log('\n🔄 Protocol Module Integration Instructions:');
  
  if (contractAddresses.ProtocolModule) {
    console.log(`Found existing ProtocolModule at: ${contractAddresses.ProtocolModule}`);
    console.log('\n📋 To integrate the new MetadataRendererV2:');
    console.log(`   1. Call setMetadataRenderer("${await metadataRendererV2.getAddress()}") on ProtocolModule`);
    console.log(`   2. Only the owner of ProtocolModule can perform this operation`);
    console.log(`   3. You can use Hardhat console or any contract interaction tool`);
  } else {
    console.log('⚠️  No existing ProtocolModule found in contract addresses');
    console.log('   You will need to manually integrate this renderer with your ProtocolModule');
  }

  /******************************************************************************
   *                                                                             *
   *                         DEPLOYMENT SUMMARY                                 *
   *                                                                             *
   ******************************************************************************/

  console.log('\n📋 Deployment Summary:');
  console.log('==========================================');
  console.log(`Network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`StorageDetect Library: Embedded in MetadataRendererV2`);
  console.log(`MetadataRendererV2: ${await metadataRendererV2.getAddress()}`);
  
  if (contractAddresses.ProtocolModule) {
    console.log(`ProtocolModule: ${contractAddresses.ProtocolModule}`);
  }

  console.log('\n🎉 MetadataRendererV2 deployment completed successfully!');
  console.log('\n📝 Key Features:');
  console.log('   • Automatic IPFS hash detection (CID v0/v1)');
  console.log('   • Automatic Arweave hash detection');
  console.log('   • Fallback to baseURI for unknown formats');
  console.log('   • Backward compatible with existing metadata');
  
  console.log('\n🔧 Usage Instructions:');
  console.log('   1. The new renderer automatically detects storage types');
  console.log('   2. IPFS hashes will use "ipfs://" prefix');
  console.log('   3. Arweave hashes will use "ar://" prefix');
  console.log('   4. Unknown formats fall back to baseURI concatenation');
  console.log('   5. You can change these prefixes using setIPFSBaseURI() and setArweaveBaseURI()');

  // Save final contract addresses
  fs.writeFileSync(addressesFile, JSON.stringify(contractAddresses, null, 2));
  console.log(`\n💾 Contract addresses saved to: ${addressesFile}`);
}

/**
 * @dev Saves contract ABI and address to files
 * @param contractName The name of the contract
 * @param contractAddress The deployed contract address
 */
async function saveAbi(contractName: string, contractAddress: string) {
  try {
    const artifact = await artifacts.readArtifact(contractName);
    const abiContent = JSON.stringify(artifact.abi, null, 2);

    fs.writeFileSync(path.join(abisDirectory, `${contractName}.json`), abiContent);
    fs.writeFileSync(path.join(localAbisDirectory, `${contractName}.json`), abiContent);

    contractAddresses[contractName] = contractAddress;
    console.log(`   📄 ABI saved for ${contractName}`);
  } catch (error) {
    console.error(`❌ Error saving ABI for ${contractName}:`, error);
  }
}

/**
 * @dev Saves library ABI (for embedded libraries that don't have addresses)
 * @param libraryName The name of the library
 */
async function saveLibraryAbi(libraryName: string) {
  try {
    const artifact = await artifacts.readArtifact(libraryName);
    const abiContent = JSON.stringify(artifact.abi, null, 2);

    fs.writeFileSync(path.join(abisDirectory, `${libraryName}.json`), abiContent);
    fs.writeFileSync(path.join(localAbisDirectory, `${libraryName}.json`), abiContent);

    console.log(`   📄 ABI saved for ${libraryName} (embedded library)`);
  } catch (error) {
    console.error(`❌ Error saving ABI for ${libraryName}:`, error);
  }
}

// Handle script execution
main()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  }); 