import fs from 'fs';
import { ethers, run } from 'hardhat';
import path from 'path';

async function verifyContract(address: string, constructorArguments: any[] = [], contractPath?: string) {
  try {
    await run('verify:verify', {
      address,
      constructorArguments,
      contract: contractPath
    });
    console.log(`Successfully verified contract at ${address}`);
  } catch (error: any) {
    if (error.message.includes('Already Verified')) {
      console.log(`Contract at ${address} already verified!`);
    } else {
      console.error(`Error verifying contract at ${address}:`, error);
    }
  }
}

async function main() {
  const network = process.env.NETWORK || 'base'; // Default to baseSepolia
  const [deployer] = await ethers.getSigners();
  console.log(`Verifying contracts on ${network} network deployed by:`, deployer.address);

  // Read deployment addresses
  const deploymentPath = path.join(__dirname, `../abis/protocolContractAddresses-${network}.json`);
  
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Deployment info file not found at ${deploymentPath}`);
  }

  const contracts = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));

  console.log('Starting contract verification...');

  // Core Protocol Contracts
  console.log('Verifying FeesModule...');
  await verifyContract(
    contracts.FeesModule,
    [deployer.address],
    'contracts/protocol/Modules/FeesModule.sol:FeesModule'
  );

  console.log('Verifying ReleaseModule...');
  await verifyContract(
    contracts.ReleaseModule,
    [],
    'contracts/protocol/Modules/ReleaseModule.sol:ReleaseModule'
  );

  console.log('Verifying IdentityModule...');
  await verifyContract(
    contracts.IdentityModule,
    [contracts.ReleaseModule],
    'contracts/protocol/Modules/IdentityModule.sol:IdentityModule'
  );

  console.log('Verifying RegistryModule...');
  await verifyContract(
    contracts.RegistryModule,
    [],
    'contracts/protocol/Modules/RegistryModule.sol:RegistryModule'
  );

  console.log('Verifying WhitelistingManager...');
  await verifyContract(
    contracts.WhitelistingManager,
    [deployer.address],
    'contracts/protocol/NonUpgradable/WhitelistingManager.sol:WhitelistingManager'
  );

  console.log('Verifying DistributorWalletFactory...');
  await verifyContract(
    contracts.DistributorWalletFactory,
    [deployer.address],
    'contracts/protocol/NonUpgradable/DistributorWalletFactory.sol:DistributorWalletFactory'
  );

  console.log('Verifying ERC20Whitelist...');
  await verifyContract(
    contracts.ERC20Whitelist,
    [deployer.address],
    'contracts/protocol/NonUpgradable/ERC20Whitelist.sol:ERC20Whitelist'
  );

  console.log('Verifying MetadataRenderer...');
  await verifyContract(
    contracts.MetadataRenderer,
    [],
    'contracts/protocol/NonUpgradable/MetadataRenderer.sol:MetadataRenderer'
  );

  console.log('Verifying MetadataModule...');
  await verifyContract(
    contracts.MetadataModule,
    [deployer.address],
    'contracts/protocol/NonUpgradable/MetadataModule.sol:MetadataModule'
  );

  console.log('Verifying LegalContractMetadata...');
  await verifyContract(
    contracts.LegalContractMetadata,
    [],
    'contracts/protocol/NonUpgradable/LegalContractMetadata.sol:LegalContractMetadata'
  );

  console.log('Verifying ProtocolModule...');
  await verifyContract(
    contracts.ProtocolModule,
    [
      contracts.DistributorWalletFactory,
      contracts.WhitelistingManager,
      contracts.ERC20Whitelist,
      contracts.MetadataModule,
      contracts.LegalContractMetadata
    ],
    'contracts/protocol/NonUpgradable/ProtocolModule.sol:ProtocolModule'
  );

  console.log('Verifying SongSharesMarketPlace...');
  await verifyContract(
    contracts.SongSharesMarketPlace,
    [contracts.ProtocolModule],
    'contracts/protocol/NonUpgradable/SongSharesMarketPlace.sol:SongSharesMarketPlace'
  );

  console.log('Verifying BuyoutTokenMarketPlace...');
  await verifyContract(
    contracts.BuyoutTokenMarketPlace,
    [contracts.ProtocolModule],
    'contracts/protocol/NonUpgradable/BuyoutTokenMarketPlace.sol:BuyoutTokenMarketPlace'
  );

  console.log('Verifying WrappedSongSmartAccount...');
  await verifyContract(
    contracts.WrappedSongSmartAccount,
    [],
    'contracts/protocol/NonUpgradable/WrappedSongSmartAccount.sol:WrappedSongSmartAccount'
  );

  console.log('Verifying WSTokenManagement...');
  await verifyContract(
    contracts.WSTokenManagement,
    [],
    'contracts/protocol/NonUpgradable/WSTokenManagement.sol:WSTokenManagement'
  );

  console.log('Verifying WrappedSongFactory...');
  await verifyContract(
    contracts.WrappedSongFactory,
    [
      contracts.WrappedSongSmartAccount,
      contracts.WSTokenManagement,
      contracts.ProtocolModule
    ],
    'contracts/protocol/NonUpgradable/WrappedSongFactory.sol:WrappedSongFactory'
  );

  console.log('Contract verification completed!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 