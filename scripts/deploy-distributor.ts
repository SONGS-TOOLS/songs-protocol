import fs from 'fs';
import { ethers, network } from 'hardhat';
import path from 'path';

const abisDirectory = path.join(__dirname, '..', 'abis');
const networkName = network.name;


const addressesFile = path.join(
  abisDirectory,
  `protocolContractAddresses-${networkName}.json`
);

if (!fs.existsSync(addressesFile)) {
  throw new Error(`Addresses file not found: ${addressesFile}`);
}

const contractAddresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));
console.log('Loaded contract addresses:', contractAddresses);

const USDC_ADDRESS = contractAddresses.USDC;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Account address:', deployer.address);

  const DistributorWalletFactory = await ethers.getContractAt(
    'DistributorWalletFactory',
    contractAddresses.DistributorWalletFactory
  );

  let distributorWalletAddresses =
    await DistributorWalletFactory.getDistributorWallets(deployer.address);
  if (distributorWalletAddresses.length === 0) {
    console.log('Creating Distributor Wallet...');
    const distributorWalletTx =
      await DistributorWalletFactory.createDistributorWallet(
        USDC_ADDRESS,
        contractAddresses.ProtocolModule,
        deployer.address
      );
    await distributorWalletTx.wait();
    distributorWalletAddresses =
      await DistributorWalletFactory.getDistributorWallets(deployer.address);
    console.log(
      'Distributor Wallet created at:',
      distributorWalletAddresses[0]
    );
  } else {
    console.log(
      'Distributor Wallet already exists at:',
      distributorWalletAddresses
    );
  }

  const distributorWalletAddress = distributorWalletAddresses[0];
  const DistributorWallet = await ethers.getContractAt(
    'DistributorWallet',
    distributorWalletAddress
  );

  const NEW_OWNER_ADDRESS = process.env.DISTRIBUTOR_ADDRESS;
  if (!NEW_OWNER_ADDRESS) {
    throw new Error('NEW_OWNER_ADDRESS not set in environment variables');
  }

  console.log('Changing owner to:', NEW_OWNER_ADDRESS);
  const transferOwnershipTx = await DistributorWallet.transferOwnership(NEW_OWNER_ADDRESS);
  await transferOwnershipTx.wait();
  console.log('Ownership transferred successfully');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
