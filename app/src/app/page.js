"use client";

import ConnectButton from "@/components/ConnectButton";
import Grid from "@/components/Grid";
import StepsList from "@/components/StepList";
import Step1 from "@/components/Steps/Step1";
import Step2 from "@/components/Steps/Step2";
import Step3 from "@/components/Steps/Step3";
import { usePageContext } from "@/context/PageContext";
import { Body3, Headline2 } from "@gordo-d/mufi-ui-components";
import Image from "next/image";
import { useReadContract, useWriteContract } from "wagmi";
import abi from "../contracts/UMDP.json";
import contracts from "../contracts/contractAddresses.json";

export default function Home() {
  // TODO type
  const stepColors = {
    active: "text-rose-600 border-rose-600 ",
    ahead: "text-gray-500 border-gray-500 ",
  };

  const result = useReadContract({
    abi: abi,
    address: contracts.UMDP,
    functionName: "getISRCMetadataURI",
  });
  const { writeContract } = useWriteContract();

  const { currentStep } = usePageContext();

  const colorClass =
    stepColors[currentStep] || "text-gray-500 border-gray-500 ";

    const steps = [
      { stepNumber: 0, title: "Select or create the Music NFT", details: "Step details here" },
      { stepNumber: 1, title: "Establish Royalties distribution", details: "Step details here" },
      { stepNumber: 2, title: "Prepare Release", details: "Step details here" },
    ];

  return (
    <main className="flex w-screen justify-center text-black">
      <div className="max-w-6xl w-full">
        <Grid>
          <div className="relative mt-3 col-start-1 col-end-13 flex justify-between items-center border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-full p-2">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={120} // Replace with actual logo size
                height={60} // Replace with actual logo size
                className="md:inline-block"
              />
              <div className="">
              <p className="text-sm font-light text-rose-400">Alpha v0.1</p>
              <p className="text-sm font-light text-rose-400">Testnet: Sepolia</p>
              </div>
            </div>
            <ConnectButton />
            {/* <Profile/> */}
            <a
              className="text-sm underline absolute right-6 text-rose-700 top-[70px]"
              href="https://www.alchemy.com/faucets/ethereum-sepolia">
              <p>{"Get Sepolia ETH"}</p>
            </a>
          </div>

          <div className="col-start-1 col-end-13 flex flex-col w-full text-rose-800">
          <Headline2 color="rose-700">{"Wrapped Song"}</Headline2>
      <Body3 color="rose-500" className="mb-2 w-2/3">
        A wrapped song is a novel way to distribute your music in which you are
        the sole owner of the track, you set all the rules.
      </Body3>
          </div>

          <div className="col-start-1 col-end-10 mb-28">
            {currentStep === 0 && <Step1 />}
            {currentStep === 1 && <Step2 />}
            {currentStep === 2 && <Step3 />}
          </div>

          <StepsList steps={steps} currentStep={currentStep} />

        </Grid>
      </div>
    </main>
  );
}
