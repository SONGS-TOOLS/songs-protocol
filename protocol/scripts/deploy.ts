import fs from 'fs';
import { artifacts, ethers, network } from "hardhat";
import path from 'path';

const abisDirectory = path.join(__dirname, '..', '..', 'app', 'src', 'contracts');
const networkName = network.name;

// Adjust the path to save each network's contract addresses with the network name
const addressesFile = path.join(abisDirectory, `contractAddresses-${networkName}.json`);

// Object to hold contract addresses
let contractAddresses: any = {};

async function main() {


  const [deployer, deployer2, deployer3, deployer4] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account address:", deployer.address);
  console.log("Account address:", deployer2.address, deployer3.address, deployer4.address);
  console.log("Account balance:", balance.toString());

  // Ensure the ABIs directory exists
  if (!fs.existsSync(abisDirectory)) {
    fs.mkdirSync(abisDirectory, { recursive: true });
  }

  // Deploy UMDP contract
  console.log("Deploying UMDP...");
  const UMDP = await ethers.getContractFactory("UMDP");
  const umdp = await UMDP.deploy(deployer.address);
  console.log("UMDP deployed to:", await umdp.getAddress());
  await saveAbi("UMDP", await umdp.getAddress());

  // Deploy MusicERC721 contract
  console.log("Deploying MusicERC721...");
  const MusicERC721 = await ethers.getContractFactory("MusicERC721");
  const musicERC721 = await MusicERC721.deploy("MufiBase", "MUFI", deployer.address);
  console.log("MusicERC721 deployed to:", await musicERC721.getAddress());
  await saveAbi("MusicERC721", await musicERC721.getAddress());


// Assuming the metadata.json is in the same directory as this script
const metadataPath = path.join(__dirname, "nft-metadata.json");
const metadataURI = "ipfs://QmXZVM2kj9r2uF1599eyona4pyNRBz3pa3j1RfgoLRNUBT"; // Placeholder, replace with actual URI after uploading to IPFS

// Mint the first NFT with the metadata URI
await musicERC721.mint(deployer.address, metadataURI);

console.log("First NFT minted with metadata:", metadataURI);

  // After all deployments, save the contract addresses to a file
  fs.writeFileSync(addressesFile, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile}`);

}

async function saveAbi(contractName:string, contractAddress: any) {
  const artifact = await artifacts.readArtifact(contractName);
  fs.writeFileSync(
    path.join(abisDirectory, `${contractName}.json`),
    JSON.stringify(artifact.abi, null, 2) // Pretty print the JSON
  );
  console.log(`ABI for ${contractName} saved to ${abisDirectory}/${contractName}-${networkName}.json`);
  
  // Update the contract addresses object
  contractAddresses[contractName] = contractAddress;
}

// Additional functions remain unchanged...

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
