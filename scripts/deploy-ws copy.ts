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
  const WrappedSongFactory = await ethers.getContractAt(
    'WrappedSongFactory',
    contractAddresses.WrappedSongFactory
  );
  const ProtocolModule = await ethers.getContractAt(
    'ProtocolModule',
    contractAddresses.ProtocolModule
  );
  const MetadataModule = await ethers.getContractAt(
    'MetadataModule',
    contractAddresses.MetadataModule
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

  const songMetadatas = [
    {
      name: 'Tamago',
      description: '',
      image: 'QmcpB2wEwLDKsu7jKBb1EDqgQCCBeL29VAx6M9bFepyGyj',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Tamago',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    },
    {
      name: 'Crystals',
      description: '',
      image: 'Qmf3X24XbgAzc7bhiGESbzVW3upJoGYHMnDxgxkQcJ8dHC',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Crystals',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    },
    {
      name: 'Twilight',
      description: '',
      image: 'QmX9jf3NM5BAkBnUrrpqVTP1yg3CdkYBwdqVPjJBdszwQD',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Twilight',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    },
    {
      name: 'Crystals',
      description: '',
      image: 'Qmf3X24XbgAzc7bhiGESbzVW3upJoGYHMnDxgxkQcJ8dHC',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Crystals',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    },
    {
      name: 'Twilight',
      description: '',
      image: 'QmX9jf3NM5BAkBnUrrpqVTP1yg3CdkYBwdqVPjJBdszwQD',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Twilight',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    },
  ];

  const sharesAmount = 10000;

  for (let i = 0; i < songMetadatas.length; i++) {
    console.log(`Creating Wrapped Song ${i} with metadata:`, songMetadatas[i]);
    try {
      console.log(
        `Creating Wrapped Song ${i} with metadata:`,
        songMetadatas[i]
      );
      console.log(`Using USDC address:`, USDC_ADDRESS);
      console.log(`Shares amount:`, sharesAmount);

      const createWrappedSongTx =
        await WrappedSongFactory.createWrappedSong(
          USDC_ADDRESS,
          songMetadatas[i],
          sharesAmount
        );
      console.log(`Transaction hash:`, createWrappedSongTx.hash);

      console.log(`Waiting for transaction confirmation...`);
      await createWrappedSongTx.wait();
      console.log(`Transaction confirmed`);

      console.log(`Fetching owner's wrapped songs...`);
      const ownerWrappedSongs = await ProtocolModule.getOwnerWrappedSongs(
        deployer.address
      );
      console.log(`Total wrapped songs for owner:`, ownerWrappedSongs.length);

      const wrappedSongAddress =
        ownerWrappedSongs[ownerWrappedSongs.length - 1];
      console.log(`Wrapped Song ${i} created at:`, wrappedSongAddress);

      const wrappedSong = await ethers.getContractAt(
        'WrappedSongSmartAccount',
        wrappedSongAddress
      );
      const wsTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
      const wsTokenManagement = await ethers.getContractAt(
        'WSTokenManagement',
        wsTokenManagementAddress
      );

      const tokenIds = [0, 1];
      for (const tokenId of tokenIds) {
        try {
          const uri = await wsTokenManagement.uri(tokenId);
          console.log(`URI for token ID ${tokenId}:`, uri);
        } catch (error) {
          console.log(`Failed to get URI for token ID ${tokenId}:`, error);
        }
      }
    } catch (error) {
      console.error(`Failed to create Wrapped Song ${i}:`, error);
      return;
    }
  }

  const ownerWrappedSongs = await ProtocolModule.getOwnerWrappedSongs(
    deployer.address
  );

  for (let i = 0; i < 2; i++) {
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
      console.error(`Failed to request release for Wrapped Song ${i}:`, error);
    }
  }

  try {
    const confirmReleaseTx = await DistributorWallet.confirmWrappedSongRelease(
      ownerWrappedSongs[0]
    );
    await confirmReleaseTx.wait();
    console.log(
      `Release confirmed for Wrapped Song 0 at:`,
      ownerWrappedSongs[0]
    );
  } catch (error) {
    console.error(`Failed to confirm release for Wrapped Song 0:`, error);
  }

  const newMetadata = {
    name: 'Updated Tamago',
    description: 'Updated version of Tamago',
    image: 'QmUpdatedImageHash',
    externalUrl: 'https://app.songs-tools.com/wrapped-songs/UpdatedTamago',
    animationUrl: 'QmUpdatedAnimationHash',
    attributesIpfsHash:
      'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
  };

  try {
    const wrappedSongAddress = ownerWrappedSongs[0];
    const wrappedSong = await ethers.getContractAt(
      'WrappedSongSmartAccount',
      wrappedSongAddress
    );

    console.log(
      `Requesting metadata update for Wrapped Song at: ${wrappedSongAddress}`
    );
    const requestUpdateTx =
      await MetadataModule.requestUpdateMetadata(wrappedSongAddress, newMetadata);
    console.log(`Transaction hash: ${requestUpdateTx.hash}`);

    console.log(`Waiting for transaction confirmation...`);
    await requestUpdateTx.wait();
    console.log(`Metadata update requested successfully`);

    const confirmUpdateTx1 = await MetadataModule.confirmUpdateMetadata(
      ownerWrappedSongs[0]
    );
    await confirmUpdateTx1.wait();
    console.log(`Metadata update confirmed for Wrapped Song:`);
  } catch (error) {
    console.error(`Failed to request metadata update for Wrapped Song:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
