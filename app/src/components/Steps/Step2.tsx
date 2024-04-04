"use client";

import { useLogs } from "@/app/hooks/viewHooks";
import { MusicFactoryConfig } from "@/config/contractsConfig";
import { usePageContext } from "@/context/PageContext";
import MusicFactoryAbi from "@/contracts/MusicERC721Factory.json";
import { Body3, Button, Loading } from "@gordo-d/mufi-ui-components";
import React, { FormEvent, useEffect, useState } from "react";
import { Address } from "viem";
import {
  BaseError,
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useContractAddressLoader } from "../../app/hooks/contractLoader";
import UMDPAbi from "../../contracts/UMDP.json";

export interface Royalty {
  recipient: `0x${string}` | undefined | string;
  share: number;
}

const Step2: React.FC = () => {
  const chainId = useChainId();
  const contractsAddresses = useContractAddressLoader();
  const {} = useChainId();
  const { selectedNft, setStep, setSelectedNft } = usePageContext();
  const account = useAccount();
  const [royalties, setRoyalties] = useState<Royalty[]>([
    { recipient: account.address, share: 100 },
  ]);

  const {
    data: hash,
    isPending,
    writeContract,
    error,
    isSuccess,
  } = useWriteContract({});
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const {
    data: contractsDeployed,
    error: ErrorcontractsDeployed,
    isLoading: isLoadingcontractsDeployed,
  } = useReadContract({
    ...MusicFactoryConfig,
    functionName: "getDeployedContractsByOwner",
    args: [account.address],
  }) as { data: string[] | null, error: any, isLoading: boolean };;

  useEffect(() => {
    console.log(contractsDeployed);
    if (contractsDeployed && selectedNft) {
      const contractsAdress: string = contractsDeployed[0];
      setSelectedNft({
        address: contractsAdress,
        tokenId: selectedNft.tokenId,
      });
    }
  }, [contractsDeployed]);

  /* 
  ACTIONS
  */

  const handleAddRoyalty = () => {
    setRoyalties([...royalties, { recipient: "", share: 0 }]);
  };

  const handleRoyaltyChange = (
    index: number,
    key: keyof Royalty,
    value: string
  ) => {
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
    // Calculate the total share percentage
    const totalShares = royalties.reduce((acc, { share }) => acc + share, 0);
    if (totalShares > 100) {
      alert("Total share percentage cannot exceed 100.");
      return;
    }

    if (!selectedNft || royalties.length === 0) {
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

    console.log(args);

    writeContract({
      abi: UMDPAbi,
      address: contractsAddresses.UMDP as Address,
      functionName: "setRoyalties",
      args: args,
    });
  };

  const {
    logs: logsData,
    isLoading: isLoadingLogs,
    error: errorData,
  } = useLogs({
    address: contractsAddresses.MusicERC721Factory as Address,
    eventName: "MusicERC721Deployed",
    abi: MusicFactoryAbi,
  });

  /* 
  
  LISTENERS
  
  */

  useEffect(() => {
    if (isConfirmed) {
      setStep(2);
    }
  }, [isConfirmed]);

  return (
    <React.Fragment>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col border-2 p-5 bg-white/50 border-rose-300 backdrop-blur-sm rounded-xl space-y">
        <h2 className="mb-1 text-2xl text-rose-700">Track Participants</h2>
        <p className="mb-6 text-md text-rose-900 w-2/3">
          Set the track shares participants, each participant will be able to
          redeem its part of the track generated revenue.
        </p>
        Links:
        <a
          href={`https://testnets.opensea.io/es/assets/sepolia/${selectedNft.address}`}
          className="mb-6 text-md text-rose-900 w-2/3">
          Open Sea
        </a>
        <section className="bg-rose-200 border border-rose-500 p-5 gap-2 flex flex-col rounded-md mb-5">
          <div className="flex items-center gap-2  rounded-lg">
            <span className="w-full text-gray-900 text-sm font-medium">
              Participant
            </span>
            <span className="w-1/4 text-gray-900 text-sm">Royalty share %</span>
            <span className="w-12 text-gray-900 text-sm"></span>
          </div>
          {royalties.map((royalty, index) => (
            <div key={index} className="flex flex-1 gap-2 items-center">
              <input
                type="text"
                value={royalty.recipient}
                onChange={(e) =>
                  handleRoyaltyChange(index, "recipient", e.target.value)
                }
                placeholder="Recipient Address"
                className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded focus:ring-rose-500 focus:border-rose-500 block  p-2.5"
                required
              />
              <input
                type="number"
                value={royalty.share}
                onChange={(e) =>
                  handleRoyaltyChange(index, "share", e.target.value)
                }
                placeholder="Share"
                className="bg-gray-50 border w-1/4 border-gray-300 text-gray-900 text-sm rounded focus:ring-rose-500 focus:border-rose-500 block p-2.5"
                required
                max="100"
              />
              <button
                type="button"
                onClick={() => handleRemoveRoyalty(index)}
                className="w-8 p-2.5 border-2 rounded flex justify-center items-center border-rose-300 text-red-500 hover:text-red-700">
                X
              </button>
            </div>
          ))}
          <div className="flex gap-2 justify-between">
            <Button size="small" type="button" onClick={handleAddRoyalty}>
              Add Participant
            </Button>
            {royalties.length > 0 && (
              <Button
                size="small"
                type="button"
                onClick={() => handleResetRoyalties}>
                Reset all
              </Button>
            )}
          </div>
        </section>
        <Button type="submit">
          {isPending ? "Confirming..." : "Submit Royalties Distribution"}
        </Button>
      </form>
      {isConfirming && (
        <Body3>
          <Loading size={20} color="rgb(244 63 94)" /> Waiting for confirmation...
        </Body3>
      )}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </React.Fragment>
  );
};

export default Step2;
function getConnectorClient(config: unknown) {
  throw new Error("Function not implemented.");
}
