import "@nomicfoundation/hardhat-ethers";

// import '@nomiclabs/hardhat-etherscan';
// import '@nomiclabs/hardhat-waffle';

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
        version: '0.8.20', // Add this line
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
        viaIR: true, // Enable Yul optimizer
      },
    ],
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 5000,
      },
      /*            forking: {
                url: "http://127.0.0.1:8545/",
                blockNumber: 18120
            },*/
      /*            forking: {
                url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            }*/
      forking: {
        url: process.env.MAINNET,
      },
    },
    ropsten: {
      url: process.env.ROPSTEN || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    /*     mainnet: {
      url: process.env.MAINNET || '',
      accounts:
        process.env.MAINNET_KEY !== undefined ? [process.env.MAINNET_KEY] : [],
    }, */
    rinkeby: {
      url: process.env.RINKEBY || '',
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
    gasPrice: 21,
    coinMarketCap: process.env.COINMARKETCAP,
    showTimeSpent: true,
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
      goerli: process.env.ETHERSCAN_MAINNET,
      optimisticEthereum: 'YOUR_OPTIMISTIC_ETHERSCAN_API_KEY',
      arbitrumOne: 'YOUR_ARBISCAN_API_KEY',
      polygon: process.env.POLYGONSCAN_MUMBAI,
    },
  },
};
