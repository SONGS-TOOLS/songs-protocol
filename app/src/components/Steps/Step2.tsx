"use client";

import { usePageContext } from "@/context/PageContext";
import React, { FormEvent, useEffect, useState } from "react";
import { Address } from "viem";
import { BaseError, useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import UMDPAbi from "../../contracts/UMDP.json";
import contracts from "../../contracts/contractAddresses-sepolia.json";

export interface Royalty {
  recipient: string;
  share: number;
}

const Step2: React.FC = () => {
  const { address } = useAccount();
  const { selectedNft, setStep } = usePageContext();
  const [royalties, setRoyalties] = useState<Royalty[]>([
    { recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", share: 20 },
    { recipient: "0x3F7a3b5A7ad399E3bEbe072Ec20aC6795f8aBCD8", share: 30 },
    { recipient: "0xd278714499E76d58a28f57727A5545a006FF2985", share: 50 },
  ]);

  const { data: hash, isPending, writeContract, error, isSuccess } = useWriteContract({
    
  });

  const handleAddRoyalty = () => {
    setRoyalties([...royalties, { recipient: "", share: 0 }]);
  };

  const handleRoyaltyChange = (index: number, key: keyof Royalty, value: string) => {
    const newRoyalties = royalties.map((royalty, i) =>
      i === index ? { ...royalty, [key]: value } : royalty
    );
    setRoyalties(newRoyalties);
  };

  const handleRemoveRoyalty = (index: number) => {
    const newRoyalties = royalties.filter((_, i) => i !== index);
    setRoyalties(newRoyalties);
  };

  const handleResetRoyalties = () => {
    setRoyalties([]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedNft ||  royalties.length === 0) {
      alert("no data");
      return;
    }

    const args = [
      selectedNft.address,
      BigInt(selectedNft.tokenId),
      royalties.map((royalty) => ({
        recipient: royalty.recipient,
        share: royalty.share * 100, // Convert share to basis points
      })),
    ];

    writeContract({
      abi: UMDPAbi,
      address: contracts.UMDP as Address,
      functionName: "setRoyalties",
      args: args,
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      setStep(2)
    }
  }, [isConfirmed, setStep]);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="col-start-1 col-end-13 w-full flex flex-col border-2 p-5 bg-white/50 border-rose-300 backdrop-blur-sm rounded-xl space-y">
        <div className="flex gap-2 justify-between">

        <p onClick={() => setStep(0)} className="mb-5 cursor-pointer">
          ⬅️
        </p>
        <p onClick={() => setStep(2)} className="mb-5 cursor-pointer">
          ➡️
        </p>
        </div>
        <h2 className="mb-1 text-2xl text-rose-700">Track Royalties Distribution:</h2>
        <p className="mb-6 text-md text-rose-900 w-2/3">Set the track shares participants, each participant will be able to redeem its part of the track generated revenue.</p>
        <section className="bg-rose-200 border border-gray-300 p-5 gap-2 flex flex-col rounded-lg">
        <div className="flex items-center gap-2  rounded-lg">
            <span className="w-full text-gray-900 text-sm font-medium">Participant</span>
            <span className="w-1/4 text-gray-900 text-sm">Royalty share</span>
            <span className="w-12 text-gray-900 text-sm"></span>
          </div>
          {royalties.map((royalty, index) => (
            <div key={index} className="flex flex-1 gap-2 items-center">
              <input
                type="text"
                value={royalty.recipient}
                onChange={(e) => handleRoyaltyChange(index, "recipient", e.target.value)}
                placeholder="Recipient Address"
                className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block  p-2.5"
                required
              />
              <input
                type="number"
                value={royalty.share}
                onChange={(e) => handleRoyaltyChange(index, "share", e.target.value)}
                placeholder="Share"
                className="bg-gray-50 border w-1/4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block p-2.5"
                required
                max="100"
              />
              <button type="button" onClick={() => handleRemoveRoyalty(index)} className="w-8 p-2.5 border-2 rounded-lg flex justify-center items-center border-rose-300 text-red-500 hover:text-red-700">
                X 
              </button>
            </div>
          ))}
          <div className="flex gap-2 justify-between">

          <button type="button" onClick={handleAddRoyalty} className="text-rose-700 hover:text-rose-800 mt-2 bg-rose-100 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Add Participant
          </button>
          {royalties.length > 0 && (

             <button type="button" onClick={() => handleResetRoyalties} className="text-red-800 hover:text-red-700">
             Reset all
           </button>
          )}
          </div>
        </section>
        <button type="submit" className="text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          {isPending ? 'Confirming...' : 'Submit Royalties Distribution'}
        </button>
      </form>
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && <div>Error: {(error as BaseError).shortMessage || error.message}</div>}
    </React.Fragment>
  );
};

export default Step2;
