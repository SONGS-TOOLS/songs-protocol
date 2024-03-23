import { useContractAddressLoader } from "@/app/hooks/contractLoader";
import useIpfsUpload from "@/app/hooks/useIpfsUpload";
import { usePageContext } from "@/context/PageContext";
import MusicFactoryAbi from "@/contracts/MusicERC721Factory.json";
import {
  Body3,
  Button,
  DropInput,
  TextInput,
} from "@gordo-d/mufi-ui-components";
import React, { useEffect, useState } from "react";
import { Address } from "viem";
import {
  BaseError,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { TextAreaInput } from "../../../ui-components/src/components/molecules/inputs/TextAreaInput";
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
  name: "Enter song title here", // Example placeholder value
  description: "Describe the track",
  image: "http://example.com/path/to/your/image.jpg", // Example image URL
  attributes: [
    { trait_type: "Mood", value: "Energetic" }, // Prefilled example attribute
    { trait_type: "Genre", value: "Electronic" }, // Additional attribute
  ],
  external_url: "http://example.com/path/to/track/info",
  animation_url: "http://example.com/path/to/animation",
  main_artists: "Artist Name",
  production_year: new Date().getFullYear().toString(), // Defaults to current year
  lyrics: "Your lyrics go here...",
  explicit_content: false, // Boolean field example
  cover: "http://example.com/path/to/your/cover.jpg", // Example cover URL
};

const MusicMetadataForm: React.FC = () => {
  const {
    selectNft,
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
  const { uploadIpfs, isUploading, uploadError } = useIpfsUpload();
  const {
    data: hash,
    error,
    isPending,
    isError,
    writeContract,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const contractsAddresses = useContractAddressLoader();

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

    // Simple validation for required fields
    if (
      !formFields.name ||
      !formFields.image
      // !formFields.main_artists ||
      // !formFields.cover||
      // !trackCover||
      // !trackFile
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setUploadingStatus("write Metadata File");

    const args = [
      "MySong",
      "GORDO",
      "https://ipfs.infura.io/ipfs/QmVtmLmgFurxLTwzVAU1bmnHbF8bREyaGNTfPiYsUzNzNZ",
      // JsonMetaDataURI?.url
    ];

    writeContract({
      abi: MusicFactoryAbi,
      address: contractsAddresses.MusicERC721Factory as Address,
      functionName: "deployMusicERC721",
      args: args,
    });
    console.log(error, hash, isError);
  };

  console.log(contractsAddresses.MusicERC721Factory);
  useWatchContractEvent({
    abi: MusicFactoryAbi,
    address: contractsAddresses.MusicERC721Factory as Address,
    eventName: "MusicERC721Deployed",
    onLogs(logs: any) {
      console.log("New logs!", logs);
    },
    onError(error) { 
      console.log('Log Error', error) 
    }
  });

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

  const addAttributeField = () => {
    setFormFields((prevState) => ({
      ...prevState,
      attributes: [...prevState.attributes, { trait_type: "", value: "" }],
    }));
  };

  const generateErc721Metadata = async () => {
    // let trackUri, coverUri;
    // setUploadingStatus("uploading track file");
    // if (trackFile) {
    //   trackUri = await uploadIpfs(trackFile);
    //   // Update context or local state with the URI
    // }

    // setUploadingStatus("uploading track cover");
    // if (trackCover) {
    //   coverUri = await uploadIpfs(trackCover);
    //   // Update context or local state with the URI
    // }
    // console.log(trackUri, coverUri);

    // const erc721Metadata = {
    //   ...musicMetadata,
    //   image: coverUri?.url + "/" + trackCover?.name || musicMetadata.cover, // Use uploaded cover URI
    //   cover: coverUri?.url || musicMetadata.cover, // Use uploaded cover URI
    //   animation_url: trackUri?.url || musicMetadata.animation_url, // Use uploaded track URI
    //   attributes: musicMetadata.attributes.filter(
    //     (attr: any) => attr.trait_type && attr.value
    //   ),
    // };

    // const JSONFile = new Blob([JSON.stringify(erc721Metadata, null, 2)], {
    //   type: "application/json",
    // });

    // // Convert the Blob to a File
    // const metadataFile = new File([JSONFile], "erc721Metadata.json", {
    //   type: "application/json",
    // });
    // setUploadingStatus("uploading Metadata File");
    // const JsonMetaDataURI = await uploadIpfs(metadataFile); // Now uploadIpfs receives a File object

    // console.log("ERC-721 Metadata URI:", JsonMetaDataURI);

    setUploadingStatus("write Metadata File");

    const args = [
      "MySong",
      "GORDO",
      "https://ipfs.infura.io/ipfs/QmVtmLmgFurxLTwzVAU1bmnHbF8bREyaGNTfPiYsUzNzNZ",
      // JsonMetaDataURI?.url
    ];

    writeContract({
      abi: MusicFactoryAbi,
      address: contractsAddresses.MusicERC721Factory as Address,
      functionName: "deployMusicERC721",
      args: args,
    });
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
        label="Track file"
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
              console.log(text);
              setTrackFile(acceptedFiles[0]);
            });
          },
        }}
        showFiles={true}
      />
      {/* <DropInput
        label="Lossless Track file"
        dropzoneConfig={{
          accept: {
            "audio/wav": [".wav"],
            "audio/flac": [".flac"],
            "audio/aiff": [".aiff"],
          },
          maxFiles: 1,
          onDrop: (acceptedFiles: File[]) => {
            acceptedFiles[0].text().then((text: string) => setTrackFile(text));
          },
        }}
        showFiles={true}
      /> */}
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
              .then((text: string) => setTrackCover(acceptedFiles[0]));
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
      <TextInput
        required
        label="Artist Names"
        name="main_artists"
        placeholder="Artist 1, Artist 2"
        value={formFields.main_artists}
        onChange={handleInputChange}
      />
      <TextInput
        label="Production Year"
        name="production_year"
        placeholder="e.g., 2024"
        value={formFields.production_year}
        onChange={handleInputChange}
      />
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
            <TextInput
              label="genre"
              name="trait_type"
              placeholder="e.g., Genre"
              value={attribute.trait_type}
              onChange={(e: any) => handleAttributeChange(index, e)}
            />
            <TextInput
              label="Type"
              name="value"
              placeholder="e.g., Rock"
              value={attribute.value}
              onChange={(e: any) => handleAttributeChange(index, e)}
            />
          </div>
        ))}
      </div>
      <Button onClick={addAttributeField} size="small">
        Add Attribute
      </Button>

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
      <Body3>You will be able to edit the Wrapped song metadata later.</Body3>
      <div className="flex gap-3 mt-10 items-center">
        <Button type="submit">Create Wrapped Song</Button>
        <Body3>{uploadingStatus}</Body3>
      </div>
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
};

export default MusicMetadataForm;
