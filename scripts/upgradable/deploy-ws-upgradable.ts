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
  let distributorWalletAddress =
    await DistributorWalletFactory.distributorToWallet(deployer.address);
  if (distributorWalletAddress === zeroAddress) {
    // Create a distributor wallet if it doesn't exist
    console.log('Creating Distributor Wallet...');
    const distributorWalletTx =
      await DistributorWalletFactory.createDistributorWallet(deployer.address);
    await distributorWalletTx.wait();
    distributorWalletAddress =
      await DistributorWalletFactory.distributorToWallet(deployer.address);
    console.log('Distributor Wallet created at:', distributorWalletAddress);
  } else {
    console.log(
      'Distributor Wallet already exists at:',
      distributorWalletAddress
    );
  }

  // Create 3 Wrapped Songs with metadata
  console.log('Creating Wrapped Songs with metadata...');
  const songURIs = [
    `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`,
    `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`,
    `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`
  ];
  const sharesAmount = 10000; // Example shares amount

  // for (let i = 0; i < songURIs.length; i++) {
  //   const songURI = songURIs[i];
  //   console.log(`Creating Wrapped Song ${i + 1} with URI: ${songURI} and shares amount: ${sharesAmount}`);
  //   try {
      // const createWrappedSongTx = await WrappedSongFactory.createWrappedSongWithMetadata(
      //   USDC_ADDRESS,
      //   songURIs[0],
      //   sharesAmount
      // );
      const createWrappedSongTx = await WrappedSongFactory.createWrappedSong(
        USDC_ADDRESS,
      );
      await createWrappedSongTx.wait();

      const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(deployer.address);
      const wrappedSongAddress = ownerWrappedSongs[ownerWrappedSongs.length - 1];
      console.log(`Wrapped Song created at:`, wrappedSongAddress);
      // console.log(`Wrapped Song ${i + 1} created at:`, wrappedSongAddress);
  //   } catch (error) {
  //     console.error(`Failed to create Wrapped Song ${i + 1}:`, error);
  //     return; // Exit if creation fails
  //   }
  // }

  // TODO: Add any additional logic for requesting releases, rejecting, or confirming releases
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });