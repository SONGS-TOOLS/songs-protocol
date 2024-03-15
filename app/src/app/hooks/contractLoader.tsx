import { useEffect, useState } from 'react';
import { useChainId } from 'wagmi';

// Hook to dynamically load contract addresses based on the network
export const useContractAddressLoader = () => {
  const [contractsAddresses, setContracts] = useState<{
    UMDP:string, 
    MusicERC721:string
}>({
    UMDP: "",
    MusicERC721:""
  });
  const chainId = useChainId()

  useEffect(() => {
    async function loadContractAddresses() {
        let contractAddresses = {
            UMDP: "",
            MusicERC721:""
          };
      if (chainId) {
        try {
          // Switch statement to determine which network's addresses to load
          switch(chainId) {
            // case 1: // Mainnet
            //   contractAddresses = await import('@/contracts/contractAddresses-mainnet.json');
            //   break;
            // case 5: // Goerli
            //   contractAddresses = await import('@/contracts/contractAddresses-goerli.json');
            //   break;
            case 11155111: // Sepolia
              contractAddresses = await import('@/contracts/contractAddresses-sepolia.json');
              break;
            // Add more cases for other networks you support
            default: // Localhost or unspecified network
              contractAddresses = await import('@/contracts/contractAddresses-localhost.json');
              break;
          }
          // Set contract configuration using the dynamic address and static ABI
          setContracts(contractAddresses);
        } catch (error) {
          console.error("Failed to load contract addresses", error);
          setContracts(contractAddresses); // Handle error by setting to undefined or a default value
        }
      }
    }

    loadContractAddresses();
  }, [chainId]);

  return contractsAddresses;
};
