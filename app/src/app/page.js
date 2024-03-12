"use client";

import ConnectButton from "@/components/ConnectButton";
import Grid from "@/components/Grid";
import Step1 from "@/components/Steps/Step1";
import Step2 from "@/components/Steps/Step2";
import Step3 from "@/components/Steps/Step3";
import { usePageContext } from "@/context/PageContext";
import Image from "next/image";
import { useReadContract, useWriteContract } from "wagmi";

import cx from "classnames";
import abi from "../contracts/UMDP.json";
import contracts from "../contracts/contractAddresses.json";

export default function Home() {
  // TODO type
  const stepColors = {
    active:
      "text-rose-600 border-rose-600 ",
    ahead:
      "text-gray-500 border-gray-500 ",
  };

  const result = useReadContract({
    abi: abi,
    address: contracts.UMDP,
    functionName: "getISRCMetadataURI",
  });
  const { writeContract } = useWriteContract();

  const { currentStep } = usePageContext();

  const colorClass =
    stepColors[currentStep] ||
    "text-gray-500 border-gray-500 ";

  return (
    <main className="flex w-screen justify-center text-black">
      <div className="max-w-5xl">
      <Grid>
        <div className=" relative mt-3 col-start-1 col-end-13 w-full flex justify-between items-center border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-full p-2">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={120} // Replace with actual logo size
              height={60} // Replace with actual logo size
              className="md:inline-block hidden"
            />
            <p className="text-sm font-light">Alpha v0.1</p>
          </div>
          <ConnectButton />
          {/* <Profile/> */} 
          <a className="text-sm underline absolute right-6 text-rose-700 top-[70px]" href="https://www.alchemy.com/faucets/ethereum-sepolia"><p>{"Get Sepolia ETH"}</p></a>
        </div>
        <div className="col-start-1 col-end-13 flex flex-col w-full text-rose-800">
          <h1 className="font-bold text-2xl">Open Music Distribution Protocol</h1>
          <p>{"v0.1 (Work in progress)"}</p>
          
        </div>
        <ol
          className={`col-start-1 col-end-13 p-2 items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse ${colorClass}`}>
          <li
            className={cx(
              "flex items-center space-x-2.5 rtl:space-x-reverse",
              currentStep >= 0 ? stepColors["active"] : stepColors["ahead"]
            )}>
            <span
              className={cx(
                "flex items-center justify-center w-8 h-8 border  rounded-full shrink-0 ",
                currentStep >= 0
                  ? "border-rose-600 "
                  : "border-gray-500 "
              )}>
              1
            </span>
            <span>
              <h3 className="font-medium leading-tight">
                Select or create the Music NFT
              </h3>
              <p className="text-sm">Step details here</p>
            </span>
          </li>
          <li
            className={cx(
              "flex items-center space-x-2.5 rtl:space-x-reverse",
              currentStep >= 1 ? stepColors["active"] : stepColors["ahead"]
            )}>
            <span
              className={cx(
                "flex items-center justify-center w-8 h-8 border  rounded-full shrink-0 ",
                currentStep >= 1
                  ? "border-rose-600 "
                  : "border-gray-500 "
              )}>
              {" "}
              2
            </span>
            <span>
              <h3 className="font-medium leading-tight">
                Stablish Royalties distribution
              </h3>
              <p className="text-sm">Step details here</p>
            </span>
          </li>
          <li
            className={cx(
              "flex items-center space-x-2.5 rtl:space-x-reverse",
              currentStep >= 2 ? stepColors["active"] : stepColors["ahead"]
            )}>
            <span
              className={cx(
                "flex items-center justify-center w-8 h-8 border  rounded-full shrink-0 ",
                currentStep >= 2
                  ? "border-rose-600 "
                  : "border-gray-500 "
              )}>
              {" "}
              3
            </span>
            <span>
              <h3 className="font-medium leading-tight">Connect DPSs</h3>
              <p className="text-sm">Step details here</p>
            </span>
          </li>
        </ol>
        {currentStep === 0 && <Step1 />}
        {currentStep === 1 && <Step2 />}
        {currentStep === 2 && <Step3 />}
      </Grid>
      </div>
    </main>
  );
}
