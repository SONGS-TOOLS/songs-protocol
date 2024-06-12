import fs from 'fs';
import { artifacts, ethers, network, run } from 'hardhat';
import path from 'path';

const networkName = network.name;
const abisDirectory = path.join(
  __dirname,
  '..',
  '..',
  'app',
  'src',
  'contracts'
);
const abisWebDirectory = path.join(
  __dirname,
  '..',
  '..',
  'web',
  'src',
  'contracts'
);
const songsLicenseDir = path.join(__dirname, '..', '..', 'songs-lic', 'src');

// Adjust the path to save each network's contract addresses with the network name
const addressesFile = path.join(
  abisDirectory,
  `contractAddresses-${networkName}.json`
);
const addressesFile2 = path.join(
  abisWebDirectory,
  `contractAddresses-${networkName}.json`
);
const addressesFile3 = path.join(
  songsLicenseDir,
  `contractAddresses-${networkName}.json`
);

// Object to hold contract addresses
let contractAddresses: any = {};

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Account address:', deployer.address);
  console.log('Account balance:', balance.toString());

  // Ensure the ABIs directory exists
  if (!fs.existsSync(abisDirectory)) {
    fs.mkdirSync(abisDirectory, { recursive: true });
  }

  // Deploy TokenURIProvider contract
  console.log('Deploying TokenURIProvider...');
  const TokenURIProvider = await ethers.getContractFactory('ITokenURIProvider');
  const tokenURIProvider = await TokenURIProvider.deploy();
  console.log('ITokenURIProvider deployed to:', await tokenURIProvider.getAddress());
  await saveAbi('ITokenURIProvider', await tokenURIProvider.getAddress());

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Deploy SongsLicense contract
  console.log('Deploying SongsLicense...');
  const SongsLicense = await ethers.getContractFactory('SongsLicense');
  const songsLicense = await SongsLicense.deploy(
    'SONGS Licenses',
    '◒',
    await tokenURIProvider.getAddress()
  );
  console.log('SongsLicense deployed to:', await songsLicense.getAddress());
  await saveAbi('SongsLicense', await songsLicense.getAddress());

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await songsLicense.mintFor(deployer.address, 'Gordo');
  console.log('Minted to:', deployer.address);

  // After all deployments, save the contract addresses to a file
  contractAddresses['TokenURIProvider'] = await tokenURIProvider.getAddress();
  contractAddresses['SongsLicense'] = await songsLicense.getAddress();

  fs.writeFileSync(addressesFile, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile}`);

  fs.writeFileSync(addressesFile2, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile2}`);

  fs.writeFileSync(addressesFile3, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile3}`);

  await verifyContract(await songsLicense.getAddress(), [
    'SONGS Licenses',
    '◒',
    await tokenURIProvider.getAddress()
  ]);
}

async function saveAbi(contractName: string, contractAddress: any) {
  const artifact = await artifacts.readArtifact(contractName);
  const abiContent = JSON.stringify(artifact.abi, null, 2); // Pretty print the JSON

  // Save ABI to app folder
  fs.writeFileSync(
    path.join(abisDirectory, `${contractName}.json`),
    abiContent
  );
  console.log(
    `ABI for ${contractName} saved to ${abisDirectory}/${contractName}.json`
  );

  // Save ABI to web folder
  fs.writeFileSync(
    path.join(abisWebDirectory, `${contractName}.json`),
    abiContent
  );
  console.log(
    `ABI for ${contractName} saved to ${abisWebDirectory}/${contractName}.json`
  );

  // Save ABI to songs-license folder
  fs.writeFileSync(
    path.join(songsLicenseDir, `${contractName}.json`),
    abiContent
  );
  console.log(
    `ABI for ${contractName} saved to ${songsLicenseDir}/${contractName}.json`
  );

  // Update the contract addresses object
  contractAddresses[contractName] = contractAddress;
}

async function verifyContract(address: string, constructorArguments: any[]) {
  console.log('Verifying contract on Etherscan...');
  try {
    await run('verify:verify', {
      address,
      constructorArguments,
    });
    console.log('Contract verified on Etherscan!');
  } catch (error) {
    console.error('Error verifying contract:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
