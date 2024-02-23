"use client";

import { useStep } from "@/context/PageContext";
import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import UMDPAbi from "../../contracts/UMDP.json";
import contracts from "../../contracts/contractAddresses.json";

const Step2 = () => {
  const { address } = useAccount();
  const { selectedNft } = useStep();
  const [royalties, setRoyalties] = useState<any>([
    { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", percentage: "20" },
    { address: "0xf34Fd6e51aad88F6F4ce6aB8827279cffF884737", percentage: "30" },
  ]);
  const { writeContract } = useWriteContract();

  const handleAddRoyalty = () => {
    setRoyalties([...royalties, { address: "", percentage: "" }]);
  };

  const handleRoyaltyChange = (index, key, value) => {
    const newRoyalties = [...royalties];
    newRoyalties[index][key] = value;
    setRoyalties(newRoyalties);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    writeContract({
      abi: UMDPAbi,
      address: contracts.UMDP,
      functionName: "setRoyalties",
      args: [
        selectedNft.address,
        selectedNft.tokenId,
        royalties.map((royalty) => ({
          recipient: royalty.address,
          share: parseInt(royalty.percentage, 10) * 100, // Convert percentage to basis points
        })),
      ],
    });
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="col-start-1 col-end-13 w-full flex flex-col border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-lg p-2 space-y">
        <h2 className="mb-6">Establish Royalties Distribution:</h2>
        <section className="bg-rose-200 border border-gray-300 p-5 gap-2 flex flex-col rounded-lg">
          {royalties.map((royalty, index) => (
            <div key={index} className="flex flex-1 gap-4">
              <input
                type="text"
                value={royalty.address}
                onChange={(e) =>
                  handleRoyaltyChange(index, "address", e.target.value)
                }
                placeholder="Recipient Address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-500 dark:focus:border-rose-500"
                required
              />
              <input
                type="number"
                value={royalty.percentage}
                onChange={(e) =>
                  handleRoyaltyChange(index, "percentage", e.target.value)
                }
                placeholder="Percentage"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-500 dark:focus:border-rose-500"
                required
                max="100"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddRoyalty}
              className=" text-rose-700 hover:text-rose-200 mt-2 bg-rose-100 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800">
              Add participant
            </button>
          </div>
        </section>
        <button
          type="submit"
          className=" text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800">
          Submit Royalties
        </button>
      </form>
    </React.Fragment>
  );
};

export default Step2;
