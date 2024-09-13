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


  //
  // CREATE WRAPPED SONGS
  //

  // Create 5 Wrapped Songs with metadata
  console.log('...');
  console.log('Creating Wrapped Songs with metadata...');
  console.log('...');
  
  const songURIs = [
    "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmYokwEwRiSHtfukgtZ5LTBSnTQfp1JALYXhK7uASk9Y88",
    "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmVBkGMe2fwWLH6aNcfcXsA14NG4gcTvZi3zmUWtxHhsTv",
    "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmXmNYqFmqCseAE2PLoK9is4A68Vg8QGFy1Se3kL94xYf7",
    "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmbEyaQCsc1ggzzAKLwHqspBCjUCbpKrXkSmDL8SLtd7xH",
    "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmVBkGMe2fwWLH6aNcfcXsA14NG4gcTvZi3zmUWtxHhsTv",
    "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmRMwtdxLkkAVtKanXNv9sPrF8ycfAakxUGnfvHAREkSHv"
  ]

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
        deployer.address
      );
      const wrappedSongAddress =
        ownerWrappedSongs[ownerWrappedSongs.length - 1];
      console.log(`Wrapped Song ${i} created at:`, wrappedSongAddress);
    } catch (error) {
      console.error(`Failed to create Wrapped Song ${i}:`, error);
      return; // Exit if creation fails
    }
  }

  console.log('...');
  console.log('Creating one more Wrapped Song and setting it to review state...');
  console.log('...');

  const additionalSongURI = "https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/QmVBkGMe2fwWLH6aNcfcXsA14NG4gcTvZi3zmUWtxHhsTv";
  
  try {
    const createAdditionalSongTx = await WrappedSongFactory.createWrappedSongWithMetadata(
      USDC_ADDRESS,
      additionalSongURI,
      sharesAmount,
      additionalSongURI
    );
    await createAdditionalSongTx.wait();

    const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(deployer.address);
    const additionalSongAddress = ownerWrappedSongs[ownerWrappedSongs.length - 1];
    console.log(`Additional Wrapped Song created at:`, additionalSongAddress);

    // Request release for the additional song
    const requestReleaseTx = await ProtocolModule.requestWrappedSongRelease(
      additionalSongAddress,
      distributorWalletAddress
    );
    await requestReleaseTx.wait();
    console.log(`Release requested for Additional Wrapped Song at:`, additionalSongAddress);

    // Accept the wrapped song for review
    const acceptForReviewTx = await DistributorWallet.acceptWrappedSongForReview(additionalSongAddress);
    await acceptForReviewTx.wait();
    console.log(`Additional Wrapped Song accepted for review at:`, additionalSongAddress);

  } catch (error) {
    console.error(`Failed to create and set Additional Wrapped Song to review state:`, error);
  }

  //
  // RELEASE WRAPPED SONGS 0 - 3
  //
  console.log('...');
  console.log('Requesting release for Wrapped Songs...');
  console.log('...');


  for (let i = 0; i < 5; i++) {
    // Request release for the first five songs
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

  //
  // RELEASE REJECTIONS
  //

  const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(
    deployer.address
  );
  try {
    const rejectReleaseTx = await DistributorWallet.rejectWrappedSongRelease(
      ownerWrappedSongs[0]
    );
    await rejectReleaseTx.wait();
    console.log(
      `Release rejected for Wrapped Song ${0} at:`,
      ownerWrappedSongs[0]
    );
  } catch (error) {
    console.error(`Failed to reject release for Wrapped Song ${0}:`, error);
  }

  //
  // RELEASE CONFIRMATIONS
  //

  try {
    const confirmReleaseTx1 = await DistributorWallet.confirmWrappedSongRelease(
      ownerWrappedSongs[1]
    );
    await confirmReleaseTx1.wait();
    console.log(
      `Release confirmed for Wrapped Song ${1} at:`,
      ownerWrappedSongs[1]
    );
  } catch (error) {
    console.error(`Failed to confirm release for Wrapped Song ${1}:`, error);
  }

  // TODO: Confirm release for Wrapped Songs 3 and 4
  try {
    const confirmReleaseTx2 = await DistributorWallet.confirmWrappedSongRelease(
      ownerWrappedSongs[2]
    );
    await confirmReleaseTx2.wait();
    console.log(
      `Release confirmed for Wrapped Song ${2} at:`,
      ownerWrappedSongs[2]
    );
  } catch (error) {
    console.error(`Failed to confirm release for Wrapped Song ${2}:`, error);
  }

  try {
    const confirmReleaseTx3 = await DistributorWallet.confirmWrappedSongRelease(
      ownerWrappedSongs[3]
    );
    await confirmReleaseTx3.wait();
    console.log(
      `Release confirmed for Wrapped Song ${3} at:`,
      ownerWrappedSongs[3]
    );
  } catch (error) {
    console.error(`Failed to confirm release for Wrapped Song ${3}:`, error);
  }

  //
  // METADATA CHANGES
  //

  console.log('...');
  console.log('Requesting metadata changes...');
  console.log('...');

  // Handle metadata updates for the two new Wrapped Songs
  const newWrappedSongs = ownerWrappedSongs.slice(2, 4);
  const newMetadata1 =
    'https://nftstorage.link/ipfs/bafkreihdwdcef7z7xqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm';
  const newMetadata2 =
    'https://nftstorage.link/ipfs/bafkreihdwdcef7z7xqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm';

  // for (let i = 0; i < newWrappedSongs.length; i++) {
  //   // SELECT THE WRAPPED SONG ACCOUNT
  //   const wrappedSongAddress = newWrappedSongs[i];
  //   const WrappedSongSmartAccount = await ethers.getContractAt(
  //     'WrappedSongSmartAccount',
  //     wrappedSongAddress
  //   );
  //   try {
  //     // Request metadata update
  //     const requestUpdateTx1 =
  //       await WrappedSongSmartAccount.requestUpdateMetadata(
  //         0, // TOKEN ID TARGETS THE RELEASE NFT , tokenId 2 is the SONGSHARES NFTs
  //         newMetadata1
  //       );
  //     await requestUpdateTx1.wait();
  //     console.log(
  //       `Metadata update requested for Wrapped Song ${i + 2} at:`,
  //       wrappedSongAddress
  //     );

  //     // Confirm or reject metadata updates
  //     if (i === 0) {
  //       // Reject the first metadata update
  //       const rejectUpdateTx = await DistributorWallet.rejectUpdateMetadata(
  //         wrappedSongAddress,
  //         0 // TOKEN ID TARGETS THE RELEASE NFT , tokenId 2 is the SONGSHARES NFTs
  //       );
  //       await rejectUpdateTx.wait();
  //       console.log(
  //         `Metadata update rejected for Wrapped Song ${i + 2} at:`,
  //         wrappedSongAddress
  //       );

  //     } else {
  //       // Confirm both metadata updates for the second new Wrapped Song
  //       const confirmUpdateTx1 = await DistributorWallet.confirmUpdateMetadata(
  //         wrappedSongAddress,
  //         0
  //       );
  //       await confirmUpdateTx1.wait();
  //       console.log(
  //         `Metadata update confirmed for Wrapped Song ${i + 2} at:`,
  //         wrappedSongAddress
  //       );
  //     }
  //   } catch (error) {
  //     console.error(
  //       `Failed to handle metadata updates for Wrapped Song ${i + 2}:`,
  //       error
  //     );
  //   }
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });