import { http } from "@wagmi/core";
import { mainnet, optimism, sepolia } from "@wagmi/core/chains";
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { defineChain } from "viem";
import { cookieStorage, createStorage } from "wagmi";


// Define Hardhat network configuration
export const hardhat = defineChain({
  id: 31337, // Network ID for Hardhat is commonly 31337
  name: "Hardhat",
  nativeCurrency: { name: "Ether", symbol: "HETH", decimals: 18 },
  rpcUrls: {
    default: "http://localhost:8545",
  },
  blockExplorers: {
    default: { name: "Hardhat", url: "http://localhost:8545" },
  },
  testnet: true,
  contracts: {
    ensRegistry: {
      address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    },
    ensUniversalResolver: {
      address: "0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da",
      blockCreated: 16773775,
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 14353601,
    },
  },
});

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const config = defaultWagmiConfig({
  chains: [hardhat, sepolia, optimism, mainnet],
  transports: {
    [hardhat.id]: http("http://localhost:8545"),
    [mainnet.id]: http(process.env.URL_MAINNET),
    [sepolia.id]: http(process.env.URL_SEPOLIA),
    [optimism.id]: http(process.env.URL_OPTIMISM),
  },
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
  enableEmail: true
});

