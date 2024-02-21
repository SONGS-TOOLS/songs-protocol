import ConnectButton from "@/components/ConnectButton";
import Grid from "@/components/Grid";

export default function Home() {
  // const result = useReadContract({
  //   abi: UMDPAbi,
  //   address: contracts.UMDP as Address,
  //   functionName: 'getISRCMetadataURI'
  // })
  // const { writeContract } = useWriteContract()

  return (
    <main className="flex justify-center">
      <Grid>
        <div className="mt-3 col-start-1 col-end-13 w-full flex justify-between items-center border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-full p-2">
          <p>Mufi</p>
          <ConnectButton />
        </div>


        <ol className="col-start-1 col-end-13 p-2 items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
    <li className="flex items-center text-rose-600 dark:text-rose-500 space-x-2.5 rtl:space-x-reverse">
        <span className="flex items-center justify-center w-8 h-8 border border-rose-600 rounded-full shrink-0 dark:border-rose-500">
            1
        </span>
        <span>
            <h3 className="font-medium leading-tight">Select or create the Music NFT</h3>
            <p className="text-sm">Step details here</p>
        </span>
    </li>
    <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
            2
        </span>
        <span>
            <h3 className="font-medium leading-tight">Stablish Royalties distribution</h3>
            <p className="text-sm">Step details here</p>
        </span>
    </li>
    <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
            3
        </span>
        <span>
            <h3 className="font-medium leading-tight">Connect DPSs payments</h3>
            <p className="text-sm">Step details here</p>
        </span>
    </li>
</ol>
{/* 
STEP 1
 */}        
        <div className="col-start-1 col-end-13 w-full flex flex-col border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-lg p-2">
          <h2 className="mb-6">Select a music NFT to distribute:</h2>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Token collection address
            </label>
            <input
              type="text"
              id="default-input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-500 dark:focus:border-rose-500"
            />
          </div>
          <div className="mb-0">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Token ID
            </label>
            <input
              type="text"
              id="default-input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-500 dark:focus:border-rose-500"
            />
          </div>
          <button type="submit" className="text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800">Select NFT</button>
        </div>

{/* 
STEP 2
 */}
        <div className="col-start-1 col-end-13 w-full flex flex-col border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-lg p-2">
          <h2 className="mb-6">Stablish Royalties Distribution:</h2>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Recipient addreses:
            </label>
            <input
              type="text"
              id="default-input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-500 dark:focus:border-rose-500"
            />
          </div>
          <div className="mb-0">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Token ID
            </label>
            <input
              type="text"
              id="default-input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-500 dark:focus:border-rose-500"
            />
          </div>
          <button type="submit" className="text-white mt-2 bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800">Select NFT</button>
        </div>
      </Grid>
    </main>
  );
}
