import { useContractAddressLoader } from "@/app/hooks/contractLoader";
import useIpfsNFTStorageUpload from "@/app/hooks/useNFTStorage";
import { usePageContext } from "@/context/PageContext";
import MusicFactoryAbi from "@/contracts/MusicERC721Factory.json";
import {
  Body3,
  Button,
  DropInput,
  TextAreaInput,
  TextInput,
} from "@gordo-d/mufi-ui-components";
import React, { useEffect, useState } from "react";
import { Address } from "viem";
import {
  BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
interface Attribute {
  trait_type: string;
  value: string;
}

export interface MusicMetadata {
  name?: string;
  description?: string;
  image?: string;
  main_artists?: string; // Assuming this is a new field
  production_year?: string; // Assuming this is a new field
  lyrics?: string; // Assuming this is a new field
  explicity_content?: boolean; // Assuming this is a new field, changed to boolean for checkbox
  cover?: string; // Assuming this is a new field
  attributes: Attribute[];
  external_url?: string;
  explicit_content: boolean; // Boolean field example
  animation_url?: string;
}

export const defaultMusicMetadata: MusicMetadata = {
  name: ``, // Example placeholder value with current date, minutes, and seconds
  description: ``,
  attributes: [
    { trait_type: "Main Artist", value: "" }, // Prefilled example attribute
    { trait_type: "Production Year", value: "" }, // Prefilled example attribute
    { trait_type: "Genre", value: "" }, // Additional attribute
  ],
  external_url: "",
  animation_url: "",
  main_artists: "",
  production_year: "", // Defaults to current year
  lyrics: "",
  explicit_content: false, // Boolean field example
  cover: "", // Example cover URL
};


const MusicMetadataForm: React.FC = () => {
  const {
    setSelectedNft,
    trackFile,
    trackCover,
    setStep,
    setTrackFile,
    setMusicMetadata,
    setTrackCover,
    setUploadingStatus,
    uploadingStatus,
    musicMetadata,
  }: any = usePageContext(); // Use the updated context to access the selectNft function
  const { uploadIpfs, isUploading, uploadError } = useIpfsNFTStorageUpload();
  const {
    data: hash,
    error,
    isPending,
    isError,
    writeContract,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });
const [isPreparing, setisPreparing] = useState<boolean>(false);

  const contractsAddresses = useContractAddressLoader();
  const account = useAccount()
  const [formFields, setFormFields] =
    useState<MusicMetadata>(defaultMusicMetadata);

  // Update context whenever formFields change
  useEffect(() => {
    setMusicMetadata(formFields);
  }, [formFields, setMusicMetadata]);


  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formFields.name 
      || !formFields.description 
      || !trackCover
      || !trackFile
    ) {
      alert("Please fill all required fields.");
      return;
    }

    await generateErc721Metadata();
  };


  useEffect(() => {
    if (isConfirmed) {
      setStep(1);
      setisPreparing(false);
    }
  }, [isConfirmed]);

  const handleAttributeChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedAttributes = [...formFields.attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [event.target.name]: event.target.value,
    };
    setFormFields((prevState) => ({
      ...prevState,
      attributes: updatedAttributes,
    }));
  };


  // useWatchContractEvent({
  //   abi: MusicFactoryAbi,
  //   address: contractsAddresses.MusicERC721Factory as Address,
  //   eventName: "MusicERC721Deployed",
  //   args: { 
  //     to: account
  //   },
  //   onLogs(logs: any) {
  //     console.log("New logs!", logs);
  //     logs.find((log:any) => {
  //       console.log("New log!", log);
  //       setSelectedNft({ address: log.args.contractAddress, tokenId: "0" });
  //     });
      
  //   },
  //   onError(error) {
  //     console.log("Log Error", error);
  //   },
  // });
  

  const addAttributeField = () => {
    setFormFields((prevState) => ({
      ...prevState,
      attributes: [...prevState.attributes, { trait_type: "", value: "" }],
    }));
  };

  // const generateErc721Metadata = async () => {
  
  //     const args = [
  //       formFields.attributes.find(attr => attr.trait_type = "Main Artist" )?.value,
  //       formFields.name,
  //       "https://nftstorage.link/ipfs/bafkreidem5zvis6k3rt6re7wm2gx3uheb6z2etqcx3s47sfbjkp6mhds6i",
  //       // JsonMetaDataURI?.url,
  //     ];

  //     writeContract({
  //       abi: MusicFactoryAbi,
  //       address: contractsAddresses.MusicERC721Factory as Address,
  //       functionName: "deployMusicERC721",
  //       args: args,
  //     });
  // };

  const generateErc721Metadata = async () => {
    let trackUri, coverUri;
    setisPreparing(true);
    setUploadingStatus("uploading track file");
    if (trackFile) {
      console.log("track file ", trackFile);
      trackUri = await uploadIpfs(trackFile);
      // Update context or local state with the URI
    }
    
    setUploadingStatus("uploading track cover");
    if (trackCover) {
      console.log("track cover ", trackCover);
      coverUri = await uploadIpfs(trackCover);
      // Update context or local state with the URI
    }

    // Ensure that trackUri and coverUri are not null before using them
    if (trackUri && coverUri) {
      const erc721Metadata = {
        ...musicMetadata,
        image_data: coverUri.url, // Use uploaded cover URI
        cover: coverUri.url, // Use uploaded cover URI
        animation_url: trackUri.url, // Use uploaded track URI
        attributes: musicMetadata.attributes.filter(
          (attr: any) => attr.trait_type && attr.value
        ),
      };
      const JSONFile = new Blob([JSON.stringify(erc721Metadata, null, 2)], {
        type: "application/json",
      });

      // Convert the Blob to a File
      const metadataFile = new File([JSONFile], "erc721Metadata.json", {
        type: "application/json",
      });
      setUploadingStatus("uploading Metadata File");
      const JsonMetaDataURI = await uploadIpfs(metadataFile); // Now uploadIpfs receives a File object

      console.log("ERC-721 Metadata URI:", JsonMetaDataURI);

      setUploadingStatus("write Metadata File");

      const args = [
        formFields.attributes.find(attr => attr.trait_type = "Main Artist" ),
        formFields.name,
        JsonMetaDataURI?.url,
      ];

      writeContract({
        abi: MusicFactoryAbi,
        address: contractsAddresses.MusicERC721Factory as Address,
        functionName: "deployMusicERC721",
        args: args,
      });
    } else {
      console.error("Failed to upload track file or cover image to IPFS");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <TextInput
        label="Song Title"
        name="name"
        placeholder="Enter the song title"
        value={formFields.name}
        required
        onChange={handleInputChange}
      />
      {/* <DropInput/> */}
      <DropInput
        label="Track file (.mp3)"
        name="trackfile"
        // required
        dropzoneConfig={{
          accept: {
            "audio/mpeg": [".mp3"],
          },
          maxFiles: 1,
          onDrop: (acceptedFiles: File[]) => {
            console.log(acceptedFiles[0]);
            acceptedFiles[0].text().then((text: string) => {
              console.log(acceptedFiles[0]);
              setTrackFile(acceptedFiles[0]);
              // setTrackFile(text);
            });
          },
        }}
        showFiles={true}
      />
      <DropInput
        label="Cover"
        // required
        name="trackCover"
        dropzoneConfig={{
          accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg"],
          },
          maxFiles: 1,
          onDrop: (acceptedFiles: File[]) => {
            acceptedFiles[0]
              .text()
              .then((text: string) => {
                // setTrackCover(text)
                setTrackCover(acceptedFiles[0])
              });
          },
        }}
        showFiles={true}
      />
      <TextAreaInput
        label="Description"
        name="description"
        placeholder="Describe the track"
        value={formFields.description}
        onChange={handleInputChange}
      />
      {/* <TextInput
        required
        label="Artist Names"
        name="main_artists"
        placeholder="Artist 1, Artist 2"
        value={formFields.main_artists}
        onChange={handleInputChange}
      /> */}
      {/* <TextInput
        label="Production Year"
        name="production_year"
        placeholder="e.g., 2024"
        value={formFields.production_year}
        onChange={handleInputChange}
      /> */}
      <TextAreaInput
        label="Lyrics"
        name="lyrics"
        placeholder="Enter the lyrics here"
        value={formFields.lyrics}
        onChange={handleInputChange}
      />
      {/* <label>
        Explicit Content:
        <input
          type="checkbox"
          name="explicit_content"
          checked={formFields.explicit_content}
          onChange={handleInputChange}
        />
      </label> */}
      <div className="w-full">
        {formFields.attributes.map((attribute, index) => (
          <div key={index} className="flex gap-2 w-full">
            {/* <TextInput
              label="genre"
              name="trait_type"
              placeholder="e.g., Genre"
              value={attribute.trait_type}
              onChange={(e: any) => handleAttributeChange(index, e)}
            /> */}
            <TextInput
              className="w-full"
              
              label={attribute.trait_type}
              name="value"
              placeholder="e.g., Rock"
              value={attribute.value}
              onChange={(e: any) => handleAttributeChange(index, e)}
            />
          </div>
        ))}
      </div>
      {/* <Button onClick={addAttributeField} size="small">
        Add Attribute
      </Button> */}

      {/* <TextInput
        label="External URL"
        name="external_url"
        placeholder="http://example.com/info"
        value={formFields.external_url}
        onChange={handleInputChange}º
      /> */}
      {/* <TextInput
        label="Animation URL"
        name="animation_url"
        placeholder="http://example.com/animation"
        value={formFields.animation_url}
        onChange={handleInputChange}
      /> */}
      {/* <button onClick={generateJSONFile}>Generate JSON</button> */}
      {/* <Body3>You will be able to edit the Wrapped song metadata later.</Body3> */}
      <div className="flex gap-3 mt-10 items-center">
        <Button type="submit" disabled={isPreparing ||  !formFields.name 
      || !formFields.description 
      || !trackCover
      || !trackFile}>Create Wrapped Song</Button>
      </div>
      {isConfirming ? <Body3>Waiting for confirmation...</Body3> : <Body3>{uploadingStatus}</Body3>}
      {isConfirmed && <Body3>Transaction confirmed.</Body3>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
};

export default MusicMetadataForm;
