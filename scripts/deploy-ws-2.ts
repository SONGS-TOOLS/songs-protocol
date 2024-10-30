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
if (!USDC_ADDRESS) {
  throw new Error('USDC address not found in contract addresses file');
}
console.log('Using USDC address:', USDC_ADDRESS);

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

  if (network.name === 'localhost' || network.name === 'hardhat') {
    const ethAmount = ethers.parseEther('10');
    const tx = await deployer.sendTransaction({
      to: newWallet.address,
      value: ethAmount,
    });
    await tx.wait();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const balance = await provider.getBalance(newWallet.address);
  }

  const DistributorWalletFactory = await ethers.getContractAt(
    'DistributorWalletFactory',
    contractAddresses.DistributorWalletFactory,
    deployer
  );
  const WrappedSongFactory = await ethers.getContractAt(
    'WrappedSongFactory',
    contractAddresses.WrappedSongFactory,
    newWallet
  );
  const ProtocolModule = await ethers.getContractAt(
    'ProtocolModule',
    contractAddresses.ProtocolModule,
    newWallet
  );
  const MetadataModule = await ethers.getContractAt(
    'MetadataModule',
    contractAddresses.MetadataModule,
    newWallet
  );

  const existingWallets = await DistributorWalletFactory.getDistributorWallets(
    newWallet.address
  );
  let distributorWalletAddress;

  if (existingWallets.length > 0) {
    distributorWalletAddress = existingWallets[0];
  } else {
    try {
      const createDistributorWalletTx =
        await DistributorWalletFactory.createDistributorWallet(
          USDC_ADDRESS,
          contractAddresses.ProtocolModule,
          newWallet.address
        );
      await createDistributorWalletTx.wait();
      const newWallets = await DistributorWalletFactory.getDistributorWallets(
        newWallet.address
      );
      distributorWalletAddress = newWallets[newWallets.length - 1];
      console.log('Distributor Wallet created at:', distributorWalletAddress);
    } catch (error) {
      console.error('Error creating Distributor Wallet:', error);
      return;
    }
  }

  const DistributorWallet = await ethers.getContractAt(
    'DistributorWallet',
    distributorWalletAddress,
    newWallet
  );

  const songMetadatas = [
    {
      name: 'Moonlight',
      description: '',
      image: 'QmcpB2wEwLDKsu7jKBb1EDqgQCCBeL29VAx6M9bFepyGyj',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Moonlight',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    },
    {
      name: 'Starlight',
      description: '',
      image: 'Qmf3X24XbgAzc7bhiGESbzVW3upJoGYHMnDxgxkQcJ8dHC',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Starlight',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    },
    {
      name: 'Sunlight',
      description: '',
      image: 'QmX9jf3NM5BAkBnUrrpqVTP1yg3CdkYBwdqVPjJBdszwQD',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Sunlight',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    },
  ];

  const sharesAmount = 10000;

  for (let i = 0; i < songMetadatas.length; i++) {
    console.log(`Creating Wrapped Song ${i} with metadata:`, songMetadatas[i]);
    try {
      const createWrappedSongTx =
        await WrappedSongFactory.createWrappedSong(
          USDC_ADDRESS,
          songMetadatas[i],
          sharesAmount
        );
      await createWrappedSongTx.wait();

      const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(
        newWallet.address
      );
      const wrappedSongAddress =
        ownerWrappedSongs[ownerWrappedSongs.length - 1];
      console.log(`Wrapped Song ${i} created at:`, wrappedSongAddress);
    } catch (error) {
      console.error(`Failed to create Wrapped Song ${i}:`, error);
      return;
    }
  }

  const ownerWrappedSongs = await WrappedSongFactory.getOwnerWrappedSongs(
    newWallet.address
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
