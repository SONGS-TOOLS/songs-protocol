import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@openzeppelin/hardhat-upgrades";

import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import './tasks/faucet';

import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

export default {
  solidity: {
    compilers: [
      {
        version: '0.7.3',
      },
      {
        version: '0.8.4',
      },
      {
        version: '0.8.7',
      },
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true, // Enable Yul optimizer
        },
      },
    ],
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 5000,
      },
      forking: {
        url: process.env.MAINNET,
      },
    },
    ropsten: {
      url: process.env.ROPSTEN || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.RINKEBY || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      url: process.env.SEPOLIA || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    base: {
      url: process.env.BASE || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    optimism: {
      url: process.env.OPTIMISM || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: process.env.MUMBAI || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    coinMarketCap: process.env.COINMARKETCAP,
    showTimeSpent: true,
    enabled: true,
    currency: 'USD',
    gasPrice: 20,
    remoteContracts: [],
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_MAINNET,
      base: process.env.ETHERSCAN_MAINNET,
      sepolia: process.env.ETHERSCAN_MAINNET,
      optimisticEthereum: 'YOUR_OPTIMISTIC_ETHERSCAN_API_KEY',
      arbitrumOne: 'YOUR_ARBISCAN_API_KEY',
      polygon: process.env.POLYGONSCAN_MUMBAI,
    },
  },
  defender: {
    apiKey: process.env.DEFENDER_API_KEY,
    apiSecret: process.env.DEFENDER_API_SECRET,
    useDefenderDeploy: false,
  }
  // external: {
  //   contracts: [
  //     {
  //       artifacts: "node_modules/@openzeppelin/contracts-upgradeable"
  //     }
  //   ]
  // }
};
