import fs from 'fs';
import { ethers, network } from 'hardhat';
import path from 'path';
import wrappedSongs from './current_wrapped_songs.json';

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
  const ReleaseModule = await ethers.getContractAt(
    'ReleaseModule',
    contractAddresses.ReleaseModule
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

  for (const song of wrappedSongs) {
    console.log(`Creating Wrapped Song with metadata:`, song.songMetadata);
    try {
      const totalShares = song.shareholders.reduce((acc, shareholder) => 
        acc + parseInt(shareholder.shares), 0);

      console.log(`Using USDC address:`, USDC_ADDRESS);
      console.log(`Total shares amount:`, totalShares);

      const createWrappedSongTx = await WrappedSongFactory.createWrappedSong(
        USDC_ADDRESS,
        {
          name: song.songMetadata.name,
          description: song.songMetadata.description,
          image: song.songMetadata.image,
          animationUrl: song.songMetadata.animationUrl,
          attributesIpfsHash: song.songMetadata.attributesIpfsHash
        },
        totalShares,
        song.owner || deployer.address
      );

      console.log(`Transaction hash:`, createWrappedSongTx.hash);
      await createWrappedSongTx.wait();

      console.log(`Fetching owner's wrapped songs...`);
      const ownerWrappedSongs = await ProtocolModule.getOwnerWrappedSongs(
        deployer.address
      );
      console.log(`Total wrapped songs for owner:`, ownerWrappedSongs.length);

      const wrappedSongAddress =
        ownerWrappedSongs[ownerWrappedSongs.length - 1];
      console.log(`Wrapped Song created at:`, wrappedSongAddress);

    } catch (error) {
      console.error(`Failed to create Wrapped Song:`, error);
      return;
    }
  }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
