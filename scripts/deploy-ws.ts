import fs from 'fs';
import { ethers, network } from 'hardhat';
import path from 'path';

const abisDirectory = path.join(__dirname, '..', 'abis');
const networkName = network.name;
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
// Load the contract addresses from the previously saved file
const addressesFile = path.join(
  abisDirectory,
  `protocolContractAddresses-${networkName}.json`
);

if (!fs.existsSync(addressesFile)) {
  throw new Error(`Addresses file not found: ${addressesFile}`);
}

const contractAddresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));
const zeroAddress = '0x0000000000000000000000000000000000000000';

console.log('Loaded contract addresses:', contractAddresses);

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Account address:', deployer.address);

  // Get the deployed contract instances
  const DistributorWalletFactory = await ethers.getContractAt(
    'DistributorWalletFactory',
    contractAddresses.DistributorWalletFactory
  );
  const WrappedSongFactory = await ethers.getContractAt(
    'WrappedSongFactory',
    contractAddresses.WrappedSongFactory
  );
  const ProtocolModule = await ethers.getContractAt(
    'ProtocolModule',
    contractAddresses.ProtocolModule
  );

  // Check if the distributor wallet already exists
  let distributorWalletAddresses =
    await DistributorWalletFactory.getDistributorWallets(deployer.address);
  if (distributorWalletAddresses.length === 0) {
    // Create a distributor wallet if it doesn't exist
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
    console.log('Distributor Wallet created at:', distributorWalletAddresses[0]);
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

  // Create 3 Wrapped Songs with metadata
  console.log('Creating Wrapped Songs with metadata...');
  const songURIs = [
    `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`,
    `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`,
    `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`,
  ];
  const sharesAmount = 10000; // Example shares amount

  for (let i = 0; i < songURIs.length; i++) {
    const songURI = songURIs[i];
    console.log(
      `Creating Wrapped Song ${
        i + 1
      } with URI: ${songURI} and shares amount: ${sharesAmount}`
    );
    try {
      const createWrappedSongTx =
        await WrappedSongFactory.createWrappedSongWithMetadata(
          USDC_ADDRESS,
          songURI,
          sharesAmount
        );
      await createWrappedSongTx.wait();

      const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(
        deployer.address
      );
      const wrappedSongAddress =
        ownerWrappedSongs[ownerWrappedSongs.length - 1];
      console.log(`Wrapped Song created at:`, wrappedSongAddress);
      console.log(`Wrapped Song ${i + 1} created at:`, wrappedSongAddress);
    } catch (error) {
      console.error(`Failed to create Wrapped Song ${i + 1}:`, error);
      return; // Exit if creation fails
    }
  }

  console.log('Requesting release for Wrapped Songs...');
  for (let i = 0; i < 2; i++) {
    // Request release for the first two songs
    const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(
      deployer.address
    );
    const wrappedSongAddress = ownerWrappedSongs[i];
    try {
      const requestReleaseTx = await ProtocolModule.requestWrappedSongRelease(
        wrappedSongAddress,
        distributorWalletAddress
      );
      await requestReleaseTx.wait();
      console.log(
        `Release requested for Wrapped Song ${i + 1} at:`,
        wrappedSongAddress
      );
    } catch (error) {
      console.error(
        `Failed to request release for Wrapped Song ${i + 1}:`,
        error
      );
    }
  }

  const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(
    deployer.address
  );
  try {
    const rejectReleaseTx = await DistributorWallet.rejectWrappedSongRelease(
      ownerWrappedSongs[0]
    );
    await rejectReleaseTx.wait();
    console.log(
      `Release rejected for Wrapped Song 1 at:`,
      ownerWrappedSongs[0]
    );
  } catch (error) {
    console.error(`Failed to reject release for Wrapped Song 1:`, error);
  }

  try {
    const confirmReleaseTx = await DistributorWallet.confirmWrappedSongRelease(
      ownerWrappedSongs[1]
    );
    await confirmReleaseTx.wait();
    console.log(
      `Release confirmed for Wrapped Song 2 at:`,
      ownerWrappedSongs[1]
    );
  } catch (error) {
    console.error(`Failed to confirm release for Wrapped Song 2:`, error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });