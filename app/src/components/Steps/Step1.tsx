"use client";

import { useStep } from "@/context/PageContext";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import contracts from "../../contracts/contractAddresses.json";
import CustomModal from "../Modal";
// Ensure environment variables are loaded properly (e.g., from .env.local)
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY;
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
);

const Step1: React.FC = () => {
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]);
  const [selectedNft, setSelectedNft] = useState({
    contractAddress: "",
    tokenId: "",
  });

  const { selectNft, setStep }: any = useStep(); // Use the updated context to access the selectNft function
  const [selectedAddress, setselectedAddress] = useState(contracts.MusicERC721); //
  const [tokenId, setTokenId] = useState<string>("0");

  const handleNftSelection = (e: any) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    selectNft(address, tokenId); // Use the selectNft function from the context
    setStep(1);
  };
  const fetchNFTs = async () => {
    if (!address) return; // Only proceed if the address is available
    try {
      const fetchedNfts = await web3.alchemy.getNfts({ owner: address });
      setNfts(fetchedNfts.ownedNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [address]); // Re-fetch NFTs whenever the address changes

  return (
    <React.Fragment>
      <div className="col-start-1 col-end-13 w-full flex flex-col border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-lg p-2">
        <h2 className="mb-6">Select a music NFT to distribute:</h2>
        <form onSubmit={handleNftSelection}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Token collection address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setselectedAddress(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-500 dark:focus:border-rose-500"
              required
            />
          </div>
          <div className="mb-0">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Token ID
            </label>
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-500 dark:focus:border-rose-500"
              required
            />
          </div>
          <button
            type="submit"
            className="text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800">
            Select NFT
          </button>
        </form>
      </div>

      <div className="col-start-1 col-end-13 w-full flex flex-col border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-lg p-2">
        <h2 className="mb-6">Or select an existing music NFT to distribute:</h2>
        <button
          onClick={() => false && setIsModalOpen(true)}
          className="opacity-20 text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800">
          Check NFTs
        </button>
      </div>

      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Select Your NFT</h2>
        {nfts.map((nft, index) => (
          <div key={index} onClick={() => setIsModalOpen(false)}>
            <img
              src={nft.media[0]?.gateway}
              alt={nft.title}
              style={{ width: "100px", height: "100px" }}
            />
            <p>{nft.title}</p>
          </div>
        ))}
      </CustomModal>
    </React.Fragment>
  );
};

export default Step1;
