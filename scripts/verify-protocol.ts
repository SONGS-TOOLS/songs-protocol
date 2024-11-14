import fs from 'fs';
import { ethers, run } from 'hardhat';
import path from 'path';

async function verifyContract(address: string, constructorArguments: any[] = []) {
  try {
    await run('verify:verify', {
      address,
      constructorArguments,
    });
  } catch (error: any) {
    if (error.message.includes('Already Verified')) {
      console.log('Contract already verified!');
    } else {
      console.error(error);
    }
  }
}

async function main() {
  // Read deployment addresses
  const deploymentPath = path.join(__dirname, '../subgraph/deployment-info.json');
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contracts = deployment.contracts;

  console.log('Starting contract verification...');

  // Get deployer address from the first signer
  const [deployer] = await ethers.getSigners();

  // Verify contracts in order of deployment
  
  // Core contracts
  await verifyContract(contracts.protocolModule.address, [
    contracts.wrappedSongFactory.address,
    contracts.metadataModule.address,
    contracts.legalContractMetadata.address,
    contracts.metadataRenderer.address
  ]);

  // Metadata contracts
  await verifyContract(contracts.metadataRenderer.address, []);
  await verifyContract(contracts.metadataModule.address, []);
  await verifyContract(contracts.legalContractMetadata.address, []);

  // Template contracts
  await verifyContract(contracts.wrappedSongTemplate.address, [
    contracts.protocolModule.address
  ]);
  await verifyContract(contracts.wsTokenTemplate.address, []);

  // Factory contract
  await verifyContract(contracts.wrappedSongFactory.address, [
    contracts.protocolModule.address,
    contracts.wrappedSongTemplate.address,
    contracts.wsTokenTemplate.address
  ]);

  // Marketplace contracts
  await verifyContract(contracts.songSharesMarketPlace.address, [
    contracts.protocolModule.address
  ]);
  await verifyContract(contracts.buyoutTokenMarketPlace.address, [
    contracts.protocolModule.address
  ]);

  console.log('Contract verification completed!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 