import fs from 'fs';
import { ethers, network } from 'hardhat';
import path from 'path';

const abisDirectory = path.join(__dirname, '..', 'abis');
const networkName = network.name;
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const addressesFile = path.join(
  abisDirectory,
  `protocolContractAddresses-${networkName}.json`
);

if (!fs.existsSync(addressesFile)) {
  throw new Error(`Addresses file not found: ${addressesFile}`);
}

const contractAddresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));
console.log('Loaded contract addresses:', contractAddresses);

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

  let distributorWalletAddresses = await DistributorWalletFactory.getDistributorWallets(deployer.address);
  if (distributorWalletAddresses.length === 0) {
    console.log('Creating Distributor Wallet...');
    const distributorWalletTx = await DistributorWalletFactory.createDistributorWallet(
      USDC_ADDRESS,
      contractAddresses.ProtocolModule,
      deployer.address
    );
    await distributorWalletTx.wait();
    distributorWalletAddresses = await DistributorWalletFactory.getDistributorWallets(deployer.address);
    console.log('Distributor Wallet created at:', distributorWalletAddresses[0]);
  } else {
    console.log('Distributor Wallet already exists at:', distributorWalletAddresses);
  }

  const distributorWalletAddress = distributorWalletAddresses[0];
  const DistributorWallet = await ethers.getContractAt(
    'DistributorWallet',
    distributorWalletAddress
  );

  const songMetadatas = [
    {
      name: "Tamago",
      description: "",
      image: "QmcpB2wEwLDKsu7jKBb1EDqgQCCBeL29VAx6M9bFepyGyj",
      externalUrl: "https://app.songs-tools.com/wrapped-songs/Tamago",
      animationUrl: "QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR",
      attributesIpfsHash: "https://ipfs.io/ipfs/QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim?filename=attributes_1.json"
    },
    {
      name: "Crystals",
      description: "",
      image: "Qmf3X24XbgAzc7bhiGESbzVW3upJoGYHMnDxgxkQcJ8dHC",
      externalUrl: "https://app.songs-tools.com/wrapped-songs/Crystals",
      animationUrl: "QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR",
      attributesIpfsHash: "https://ipfs.io/ipfs/QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim?filename=attributes_1.json"
    },
    {
      name: "Twilight",
      description: "",
      image: "QmX9jf3NM5BAkBnUrrpqVTP1yg3CdkYBwdqVPjJBdszwQD",
      externalUrl: "https://app.songs-tools.com/wrapped-songs/Twilight",
      animationUrl: "QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR",
      attributesIpfsHash: "https://ipfs.io/ipfs/QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim?filename=attributes_1.json"
    }
  ];

  const sharesAmount = 10000;

  for (let i = 0; i < songMetadatas.length; i++) {
    console.log(`Creating Wrapped Song ${i} with metadata:`, songMetadatas[i]);
    try {
      const createWrappedSongTx = await WrappedSongFactory.createWrappedSongWithMetadata(
        USDC_ADDRESS,
        songMetadatas[i],
        sharesAmount
      );
      await createWrappedSongTx.wait();

      const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(deployer.address);
      const wrappedSongAddress = ownerWrappedSongs[ownerWrappedSongs.length - 1];
      console.log(`Wrapped Song ${i} created at:`, wrappedSongAddress);
    } catch (error) {
      console.error(`Failed to create Wrapped Song ${i}:`, error);
      return;
    }
  }

  const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(deployer.address);

  for (let i = 0; i < 2; i++) {
    const wrappedSongAddress = ownerWrappedSongs[i];
    try {
      const requestReleaseTx = await ProtocolModule.requestWrappedSongRelease(
        wrappedSongAddress,
        distributorWalletAddress
      );
      await requestReleaseTx.wait();
      console.log(`Release requested for Wrapped Song ${i} at:`, wrappedSongAddress);
    } catch (error) {
      console.error(`Failed to request release for Wrapped Song ${i}:`, error);
    }
  }

  try {
    const confirmReleaseTx = await DistributorWallet.confirmWrappedSongRelease(ownerWrappedSongs[0]);
    await confirmReleaseTx.wait();
    console.log(`Release confirmed for Wrapped Song 0 at:`, ownerWrappedSongs[0]);
  } catch (error) {
    console.error(`Failed to confirm release for Wrapped Song 0:`, error);
  }

  const newMetadata = {
    name: "Updated Tamago",
    description: "Updated version of Tamago",
    image: "QmUpdatedImageHash",
    externalUrl: "https://app.songs-tools.com/wrapped-songs/UpdatedTamago",
    animationUrl: "QmUpdatedAnimationHash",
    attributesIpfsHash: "https://ipfs.io/ipfs/QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim?filename=attributes_1.json"
  };

  try {
    const requestUpdateTx = await MetadataModule.requestUpdateMetadata(ownerWrappedSongs[0], newMetadata);
    await requestUpdateTx.wait();
    console.log(`Metadata update requested for Wrapped Song 0 at:`, ownerWrappedSongs[0]);

    const confirmUpdateTx = await DistributorWallet.confirmUpdateMetadata(ownerWrappedSongs[0]);
    await confirmUpdateTx.wait();
    console.log(`Metadata update confirmed for Wrapped Song 0 at:`, ownerWrappedSongs[0]);
  } catch (error) {
    console.error(`Failed to update metadata for Wrapped Song 0:`, error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
