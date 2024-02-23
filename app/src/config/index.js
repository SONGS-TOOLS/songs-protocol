import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { mainnet, optimism, sepolia } from 'wagmi/chains';

// Define Hardhat network configuration
const hardhat = {
  id: 31337, // Network ID for Hardhat is commonly 31337
  name: 'Hardhat',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: 'http://localhost:8545',
  },
  blockExplorers: {
    default: { name: 'Hardhat', url: 'http://localhost:8545' },
  },
  testnet: true,
};

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const config = defaultWagmiConfig({
  chains: [sepolia, mainnet, optimism, hardhat],
  projectId, // Required
  metadata, // Required
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
  //   ...wagmiOptions // Optional - Override createConfig parameters
});
