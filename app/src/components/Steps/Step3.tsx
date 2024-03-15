import { UMDPConfig } from "@/config/contractsConfig";
import { usePageContext } from "@/context/PageContext";
import React, { useEffect } from "react";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

type IStep3Props = {};

export interface RoyaltyData {
  recipient: string;
  share: bigint;
}


const Step3: React.FC<IStep3Props> = (props) => {
  const {} = props;
  const { selectedNft, setStep } = usePageContext();
  useEffect(() => {}, []);

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
      <div className="col-start-1 col-end-13 w-full flex flex-col bg-white/50backdrop-blur-sm rounded-xl space-y">
        {/* <h2 className="mb-6">Royalties Distribution:</h2> */}
        <section className="bg-rose-200 border border-gray-300 p-5 gap-2 flex flex-col rounded-lg">
          <div className="flex justify-between items-center gap-4  rounded-lg">
            <span className="text-gray-900 text-sm font-medium">Participant</span>
            <span className="text-gray-900 text-sm">Royalty Share</span>
          </div>
          {Object.values(royaltyData).map((royalty: RoyaltyData, index: number) => (
            <div key={index} className="flex gap-2">
              <div className="flex w-full justify-between items-center gap-4 p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-900 text-sm font-medium">
                  {royalty.recipient}
                </span>
              </div>
              <div
                key={index}
                className="flex w-40 justify-between items-center gap-4 p-2 bg-gray-50 rounded-lg">
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
        <p onClick={() => setStep(1)} className="mb-5 cursor-pointer">
          ⬅️ Back
        </p>
        <h2 className="mb-1 text-2xl text-rose-700">
          Track royalties distribution:
        </h2>
        <p className="mb-6 text-md text-rose-900 w-2/3">
          Your track split distribution is now settled, which ever amount is sent to
          this address: 0x...123 will accessible to redeeem on the terms
          expressed by participants.{" "}
        </p>
        <section className="mb-6">{buildRoyalties()}</section>
        <p className="mb-2 text-sm text-rose-900 w-2/3">
          Your track is now ready for release. Propose it to a label or a distributor.
        </p>
        <p className="mb-2 text-sm text-rose-900 w-2/3">
          Send it to copyright verification
        </p>
        <p className="mb-6 text-sm text-rose-900 w-2/3">
          An Oracle will now review its autenticity and you will be able to
          asignate an ISRC or generate one for the track.{" "}
        </p>

        <div className="flex gap-2 opacity-30 cursor-default">
          <button
            type="submit"
            className="cursor-default text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center ">
            Verify it
          </button>
          <button
            type="submit"
            className="cursor-default text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
            Propose it
          </button>
          <button
            type="submit"
            className="cursor-default text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
            Release it
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};


export default Step3;
