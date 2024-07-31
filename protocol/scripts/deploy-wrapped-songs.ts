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
  // const wrappedSongs = [];
  const songURI1 = `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`;
  const songURI2 = `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`;
  const songURI3 = `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`;
  const sharesAmount = 10000; // Example shares amount

  console.log(`Creating Wrapped Song 1 with URI: ${songURI1} and shares amount: ${sharesAmount}`);
  try {
    const createWrappedSongTx1 = await WrappedSongFactory.createWrappedSong(
      contractAddresses.WSTokenManagement,
      USDC_ADDRESS,
      // songURI1,
      // sharesAmount,
      // { value: ethers.parseEther('0.3'), gasLimit: 10000000 }
    );
    // await createWrappedSongTx1.wait();
    // const ownerWrappedSongs1 = await WrappedSongFactory.getOwnerWrappedSongs(deployer.address);
    // const wrappedSongAddress1 = ownerWrappedSongs1[ownerWrappedSongs1.length - 1];
    // wrappedSongs.push(wrappedSongAddress1);
    // console.log(`Wrapped Song 1 created at:`, wrappedSongAddress1);
  } catch (error) {
    console.error(`Failed to create Wrapped Song 1:`, error);
    return; // Exit if creation fails
  }

/*   console.log(`Creating Wrapped Song 2 with URI: ${songURI2} and shares amount: ${sharesAmount}`);
  try {
    const createWrappedSongTx2 = await WrappedSongFactory.createWrappedSongWithMetadata(
      contractAddresses.WSTokenManagement,
      USDC_ADDRESS,
      songURI2,
      sharesAmount,
      { value: ethers.parseEther('0.1'), gasLimit: 1000000 }
    );
    await createWrappedSongTx2.wait();
    const ownerWrappedSongs2 = await WrappedSongFactory.getOwnerWrappedSongs(deployer.address);
    const wrappedSongAddress2 = ownerWrappedSongs2[ownerWrappedSongs2.length - 1];
    wrappedSongs.push(wrappedSongAddress2);
    console.log(`Wrapped Song 2 created at:`, wrappedSongAddress2);
  } catch (error) {
    console.error(`Failed to create Wrapped Song 2:`, error);
  }

  console.log(`Creating Wrapped Song 3 with URI: ${songURI3} and shares amount: ${sharesAmount}`);
  try {
    const createWrappedSongTx3 = await WrappedSongFactory.createWrappedSongWithMetadata(
      contractAddresses.WSTokenManagement,
      USDC_ADDRESS,
      songURI3,
      sharesAmount,
      { value: ethers.parseEther('0.1'), gasLimit: 1000000 }
    );
    await createWrappedSongTx3.wait();
    const ownerWrappedSongs3 = await WrappedSongFactory.getOwnerWrappedSongs(deployer.address);
    const wrappedSongAddress3 = ownerWrappedSongs3[ownerWrappedSongs3.length - 1];
    wrappedSongs.push(wrappedSongAddress3);
    console.log(`Wrapped Song 3 created at:`, wrappedSongAddress3);
  } catch (error) {
    console.error(`Failed to create Wrapped Song 3:`, error);
  } */

/*   // Request to release 2 Wrapped Songs
  console.log('Requesting Wrapped Song releases...');
  for (let i = 0; i < 2; i++) {
    const wrappedSong = await ethers.getContractAt(
      'WrappedSongSmartAccount',
      wrappedSongs[i]
    );
    const requestReleaseTx = await wrappedSong.requestWrappedSongRelease(
      distributorWalletAddress
    );
    await requestReleaseTx.wait();
    console.log(
      `Release requested for Wrapped Song ${i + 1} at:`,
      wrappedSongs[i]
    );
  } */

  // Reject the release of the first Wrapped Song
/*   console.log('Rejecting release of the first Wrapped Song...');
  const rejectReleaseTx = await ProtocolModule.rejectWrappedSongRelease(
    wrappedSongs[0]
  );
  await rejectReleaseTx.wait();
  console.log('Release rejected for Wrapped Song 1');

  // Confirm the release of the second Wrapped Song
  console.log('Confirming release of the second Wrapped Song...');
  const confirmReleaseTx = await ProtocolModule.confirmWrappedSongRelease(
    wrappedSongs[1]
  );
  await confirmReleaseTx.wait(); 
  console.log('Release confirmed for Wrapped Song 2');
  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });