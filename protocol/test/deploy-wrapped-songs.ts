import { expect } from "chai";
import fs from "fs";
import { ethers, network } from "hardhat";
import path from "path";

describe("Deploy Wrapped Songs Script", function () {
  it("should run the deploy script without errors", async function () {
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
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    console.log('Loaded contract addresses:', contractAddresses);

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

    let distributorWalletAddress =
      await DistributorWalletFactory.distributorToWallet(deployer.address);
    if (distributorWalletAddress === zeroAddress) {
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

    console.log('Creating Wrapped Songs with metadata...');
    const songURI1 = `https://nftstorage.link/ipfs/bafkreibhvbqnsxahxqcn2cvkfi3e6lahqx3elgkquvkpvwvxodvirrqnhm`;
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
      expect.fail(`Failed to create Wrapped Song 1: ${error.message}`);
    }
  });
});