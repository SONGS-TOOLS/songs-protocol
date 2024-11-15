import { run } from 'hardhat';

async function verifyWithSettings(
  address: string,
  deployer: string,
  runs: number,
  evmVersion: string
) {
  try {
    console.log(`Attempting verification with settings:`);
    console.log(`- Optimizer runs: ${runs}`);
    console.log(`- EVM Version: ${evmVersion}`);
    console.log(`- Constructor args: [${deployer}]`);
    
    await run("verify:verify", {
      address,
      constructorArguments: [deployer],
      contract: "contracts/protocol/NonUpgradable/WhitelistingManager.sol:WhitelistingManager",
      // Force specific compiler settings
      compilerVersion: "v0.8.20",
      optimizationUsed: true,
      runs,
      evmVersion
    });
    
    console.log('Verification successful!');
    return true;
  } catch (error: any) {
    if (error.message.includes('Already Verified')) {
      console.log('Contract already verified!');
      return true;
    }
    console.log(`Failed verification with current settings:`, error.message);
    return false;
  }
}

async function main() {
  // WhitelistingManager contract address from your deployment
  const CONTRACT_ADDRESS = "0x4d685faaBacf53aEa2ea30Bc02bB924955DD3888";
  const DEPLOYER_ADDRESS = "0xFc788cA9aBC5a900693AFE9F8Dd20c80f9BD9617";
  
  // Try different combinations of settings
  const settings = [
    { runs: 200, evmVersion: "paris" },
    { runs: 200, evmVersion: "london" },
    { runs: 1000, evmVersion: "paris" },
    { runs: 999999, evmVersion: "paris" },
  ];

  console.log('Starting WhitelistingManager verification...');
  console.log('Contract address:', CONTRACT_ADDRESS);
  console.log('Deployer address:', DEPLOYER_ADDRESS);

  for (const setting of settings) {
    console.log('\nTrying new settings combination...');
    const success = await verifyWithSettings(
      CONTRACT_ADDRESS,
      DEPLOYER_ADDRESS,
      setting.runs,
      setting.evmVersion
    );
    
    if (success) {
      console.log(`\nSuccessful settings found!`);
      console.log(`Optimizer runs: ${setting.runs}`);
      console.log(`EVM Version: ${setting.evmVersion}`);
      break;
    }
    
    // Wait between attempts to avoid rate limiting
    console.log('Waiting 5 seconds before next attempt...');
    await new Promise(r => setTimeout(r, 5000));
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });