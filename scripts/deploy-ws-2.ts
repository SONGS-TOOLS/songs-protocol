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
  console.log('Deployer address:', deployer.address);

  const provider = deployer.provider;
  if (!provider) {
    throw new Error('No provider available');
  }

  const privateKey2 = process.env.PRIVATE_KEY_2;
  if (!privateKey2) {
    throw new Error('PRIVATE_KEY_2 environment variable is not set');
  }

  const newWallet = new ethers.Wallet(privateKey2, provider);
  console.log('New wallet address:', newWallet.address);

  // Send ETH to the new wallet if on localhost network
  if (network.name === 'localhost' || network.name === 'hardhat') {
    const ethAmount = ethers.parseEther('10'); // Send 10 ETH
    const tx = await deployer.sendTransaction({
      to: newWallet.address,
      value: ethAmount
    });
    await tx.wait();
    console.log(`Sent ${ethers.formatEther(ethAmount)} ETH to ${newWallet.address}`);

    // Wait for a moment to ensure the transaction is processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the new balance
    const balance = await provider.getBalance(newWallet.address);
    console.log(`New balance of ${newWallet.address}: ${ethers.formatEther(balance)} ETH`);
  }

  // Get the deployed contract instances
  const DistributorWalletFactory = await ethers.getContractAt(
    'DistributorWalletFactory',
    contractAddresses.DistributorWalletFactory,
    deployer // Use the original deployer
  );
  const WrappedSongFactory = await ethers.getContractAt(
    'WrappedSongFactory',
    contractAddresses.WrappedSongFactory,
    newWallet // Use the new wallet for WrappedSongFactory
  );
  const ProtocolModule = await ethers.getContractAt(
    'ProtocolModule',
    contractAddresses.ProtocolModule,
    newWallet // Use the new wallet for ProtocolModule
  );

  // Before creating a new Distributor Wallet
  const existingWallets = await DistributorWalletFactory.getDistributorWallets(newWallet.address);
  let distributorWalletAddress;
  
  if (existingWallets.length > 0) {
    distributorWalletAddress = existingWallets[0];
  } else {
    // Proceed with creating a new wallet
    try {

      const createDistributorWalletTx = await DistributorWalletFactory.createDistributorWallet(
        USDC_ADDRESS,
        contractAddresses.ProtocolModule,
        newWallet.address // Set the new wallet as the owner
      );
      const receipt = await createDistributorWalletTx.wait();

      // Get the newly created wallet address
      const newWallets = await DistributorWalletFactory.getDistributorWallets(newWallet.address);
      distributorWalletAddress = newWallets[newWallets.length - 1];
      console.log('Distributor Wallet created at:', distributorWalletAddress);
    } catch (error) {
      console.error('Error creating Distributor Wallet:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      return; // Exit if creation fails
    }
  }

  const DistributorWallet = await ethers.getContractAt(
    'DistributorWallet',
    distributorWalletAddress,
    deployer
  );

  // CREATE WRAPPED SONGS
  const songURIs = [
    "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmYokwEwRiSHtfukgtZ5LTBSnTQfp1JALYXhK7uASk9Y88",
    "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmVBkGMe2fwWLH6aNcfcXsA14NG4gcTvZi3zmUWtxHhsTv",
    "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmXmNYqFmqCseAE2PLoK9is4A68Vg8QGFy1Se3kL94xYf7"
  ];

  const sharesAmount = 10000; // Example shares amount

  for (let i = 0; i < songURIs.length; i++) {
    const songURI = songURIs[i];
    console.log(
      `Creating Wrapped Song ${i} with URI: ${songURI} and shares amount: ${sharesAmount}`
    );
    try {
      const createWrappedSongTx =
        await WrappedSongFactory.createWrappedSongWithMetadata(
          USDC_ADDRESS,
          songURI, // SONG URI
          sharesAmount,
          songURI // SONG SHARES URI 
        );
      await createWrappedSongTx.wait();

      const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(
        newWallet.address // Use the new wallet address
      );
      const wrappedSongAddress =
        ownerWrappedSongs[ownerWrappedSongs.length - 1];
      console.log(`Wrapped Song ${i} created at:`, wrappedSongAddress);
    } catch (error) {
      console.error(`Failed to create Wrapped Song ${i}:`, error);
      return; // Exit if creation fails
    }
  }

  // RELEASE WRAPPED SONGS 0 - 1
  for (let i = 0; i < 2; i++) {
    const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(
      newWallet.address // Use the new wallet address
    );
    const wrappedSongAddress = ownerWrappedSongs[i];
    try {
      const requestReleaseTx = await ProtocolModule.requestWrappedSongRelease(
        wrappedSongAddress,
        distributorWalletAddress
      );
      await requestReleaseTx.wait();
      console.log(
        `Release requested for Wrapped Song ${i} at:`,
        wrappedSongAddress
      );
    } catch (error) {
      console.error(
        `Failed to request release for Wrapped Song ${i}:`,
        error
      );
    }
  }

  // CONFIRM RELEASE FOR WRAPPED SONG 0
  const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(
    newWallet.address // Use the new wallet address
  );
  try {
    // Connect the DistributorWallet contract to the newWallet
    const DistributorWalletAsOwner = DistributorWallet.connect(newWallet);
    
    // @ts-ignore
    const confirmReleaseTx = await DistributorWalletAsOwner.confirmWrappedSongRelease(
      ownerWrappedSongs[0]
    );
    await confirmReleaseTx.wait();
    console.log(
      `Release confirmed for Wrapped Song ${0} at:`,
      ownerWrappedSongs[0]
    );
  } catch (error) {
    console.error(`Failed to confirm release for Wrapped Song ${0}:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });