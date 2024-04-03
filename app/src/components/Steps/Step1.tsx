"use client";

import { useContractAddressLoader } from "@/app/hooks/contractLoader";
import { usePageContext } from "@/context/PageContext";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import React, { useState } from "react";
import MusicMetadataForm from "../FormMetadata";
import CustomModal from "../Modal";
// Ensure environment variables are loaded properly (e.g., from .env.local)
const alchemyApiKey = process.env.NE;
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
);

const Step1: React.FC = () => {

  const contractsAddresses = useContractAddressLoader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]);

  const { setStep }: any = usePageContext(); 

  return (
    <section>
      <div className="w-full flex flex-col gap-3 border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-lg p-5 mb-28">
        <MusicMetadataForm />
      </div>
      {/* 
      
      <div className="col-start-1 col-end-13 w-full flex flex-col border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-lg p-2">
        <h2 className="mb-6">Or select an existing music NFT to distribute:</h2>
        <button
          onClick={() => false && setIsModalOpen(true)}
          className="opacity-20 text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
          Check NFTs
        </button>
      </div> 
      
      */}

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
    </section>
  );
};

export default Step1;
