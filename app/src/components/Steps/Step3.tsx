import { UMDPConfig } from '@/config/contractsConfig';
import { usePageContext } from "@/context/PageContext";
import { Body3, BodyHeadline, Button } from '@gordo-d/mufi-ui-components';
import React from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";

type IStep3Props = {};

export interface RoyaltyData {
  recipient: string;
  share: bigint;
}


const Step3: React.FC<IStep3Props> = (props) => {
  const {} = props;
  const { selectedNft, setStep } = usePageContext();
  const account = useAccount()
  console.log(selectedNft);

  const {
    data: royaltyData,
    error,
    isLoading,
  } = useReadContract({
    ...UMDPConfig,
    functionName: "getRoyalties",
    args: [selectedNft.address, selectedNft.tokenId],
  });



  const buildRoyalties = () => {
    console.log("🚀 ~ buildRoyalties ~ royaltyData:", royaltyData);

    if (isLoading) {
      return <div>Loading royalty data...</div>;
    }

    if (error) {
      return <div>Error fetching royalty data: {error.message}</div>;
    }

    if (!royaltyData) {
      return <div>No royalties information available for this NFT.</div>;
    }

    return (
      <div className="w-full flex flex-col bg-white/50backdrop-blur-sm rounded-xl space-y">
        <BodyHeadline color='rose-600' className="mb-6">Track Distribution:</BodyHeadline>
        <section className="bg-rose-200 border border-gray-300 p-5 gap-2 flex flex-col rounded">
          <div className="flex justify-between items-center gap-4  rounded-lg">
            <span className="text-gray-900 text-sm font-medium">Participant</span>
            <span className="text-gray-900 text-sm">Royalty Share</span>
          </div>
          {Object.values(royaltyData).map((royalty: RoyaltyData, index: number) => (
            <div key={index} className="flex gap-2">
              <div className="flex w-full justify-between items-center gap-4 p-2 bg-gray-50 rounded border-rose-300 border">
                <span className="text-gray-900 text-sm font-medium">
                  {royalty.recipient}
                </span>
              </div>
              <div
                key={index}
                className="flex w-40 justify-between items-center gap-4 p-2 bg-gray-50 rounded border-rose-300 border">
                <span className="text-gray-900 text-sm">
                  {`${formatUnits(royalty.share, 2)}%`}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  };

  return (
    <React.Fragment>
      <form className="col-start-1 col-end-13 w-full flex flex-col border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-lg p-5 space-y">

        {/* <Headline3 color='rose-700' className="mb-1 text-2xl">
          DPSs Release setup:
        </Headline3>

        <Body3 color="rose-900" className="mb-6 text-md  w-2/3">
          Your track split distribution is now settled, your track earnings will be automatically available to the participants based on the provided percentages
        </Body3> */}

        <section className="mb-6">{buildRoyalties()}</section>

          <Body3 color='rose-500'>Work in progress</Body3>
        <div className="flex gap-2">
          <Button disabled size="small" type="button"
            >
            Copyright review
          </Button>
          <Button size="small" type="button"
            disabled
            >
            Release it
          </Button>
          <Button size="small" type="button"
            disabled
            >
            Sell it
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};


export default Step3;
