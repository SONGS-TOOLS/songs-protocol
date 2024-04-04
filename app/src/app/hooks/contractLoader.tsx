import { useEffect, useState } from "react";
import { useChainId } from "wagmi";

// Pre-imported contract addresses
import contractAddressesBaseSepolia from "@/contracts/contractAddresses-baseSepolia.json";
import contractAddressesLocalhost from "@/contracts/contractAddresses-localhost.json";
import contractAddressesSepolia from "@/contracts/contractAddresses-sepolia.json";
// Add more imports as needed

export const useContractAddressLoader = () => {
  const [contractsAddresses, setContracts] = useState({
    UMDP: "",
    MusicERC721: "",
    MusicERC721Factory: "",
  });
  
  const chainId = useChainId();

  useEffect(() => {
    // Function to select and set contract addresses based on the current chain ID
    function selectContractAddresses() {
      switch (chainId) {
        // case 1: // Example for Mainnet
        //   setContracts(contractAddressesMainnet);
        //   break;
        // case 5: // Example for Goerli
        //   setContracts(contractAddressesGoerli);
        //   break;
        case 31337: // Example for Localhost
          setContracts(contractAddressesLocalhost);
          break;
        case 84532: // Example for Localhost
          setContracts(contractAddressesBaseSepolia);
          break;
        case 11155111: // Example for Sepolia
          setContracts(contractAddressesSepolia);
          break;
        // Add more cases as needed
        default:
          // Consider having a default or error state
          setContracts(contractAddressesLocalhost); // Defaulting to localhost for safety
          break;
      }
    }

    selectContractAddresses();
  }, [chainId]);

  return contractsAddresses;
};
