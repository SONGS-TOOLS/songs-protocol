import fs from 'fs';
import { ethers, network } from 'hardhat';
import path from 'path';

const abisDirectory = path.join(__dirname, '..', 'abis');
const networkName = network.name;
const addressesFile = path.join(
  abisDirectory,
  `protocolContractAddresses-${networkName}.json`
);

async function main() {
  // Load contract addresses
  const contractAddresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));
  const [deployer] = await ethers.getSigners();
  console.log('Account address:', deployer.address);

  // Get contract instances
  const WrappedSongFactory = await ethers.getContractAt(
    'WrappedSongFactory',
    contractAddresses.WrappedSongFactory
  );
  const ProtocolModule = await ethers.getContractAt(
    'ProtocolModule',
    contractAddresses.ProtocolModule
  );

  // Test metadata
  const songMetadata = {
    name: 'Tamago',
    description: 'holi',
    image: 'QmcpB2wEwLDKsu7jKBb1EDqgQCCBeL29VAx6M9bFepyGyj',
    externalUrl: 'https://app.songs-tools.com/wrapped-songs/Tamago',
    animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
    attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
  };

  const sharesAmount = 10000;

  try {
    // Create Wrapped Song
    console.log('Creating Wrapped Song with metadata:', songMetadata);
    const createWrappedSongTx = await WrappedSongFactory.createWrappedSong(
      contractAddresses.USDC,
      songMetadata,
      sharesAmount
    );
    await createWrappedSongTx.wait();

    // Get the created Wrapped Song address
    const ownerWrappedSongs = await ProtocolModule.getOwnerWrappedSongs(deployer.address);
    const wrappedSongAddress = ownerWrappedSongs[ownerWrappedSongs.length - 1];
    console.log('Wrapped Song created at:', wrappedSongAddress);

    // Get WSTokenManagement instance
    const wrappedSong = await ethers.getContractAt(
      'WrappedSongSmartAccount',
      wrappedSongAddress
    );
    const wsTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
    const wsTokenManagement = await ethers.getContractAt(
      'WSTokenManagement',
      wsTokenManagementAddress
    );

    // Test URI for all token types
    console.log('\nTesting token URIs:');
    const tokenIds = [0, 1]; // SONG_CONCEPT_ID, SONG_SHARES_ID, BUYOUT_TOKEN_ID
    for (const tokenId of tokenIds) {
      try {
        const uri = await wsTokenManagement.uri(tokenId);
        console.log(`Token ID ${tokenId} URI:`, uri);
      } catch (error) {
        console.error(`Error getting URI for token ID ${tokenId}:`, error);
      }
    }

  } catch (error) {
    console.error('Error:', error);
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