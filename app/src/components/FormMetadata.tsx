import { usePageContext } from "@/context/PageContext";
import { TextInput } from "@gordo-d/mufi-ui-components";
import React, { useEffect, useState } from "react";
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
  const { setMusicMetadata } = usePageContext();
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

  const generateJSONFile = () => {
    const filledFields = {
      ...formFields,
      attributes: formFields.attributes.filter(
        (attr) => attr.trait_type && attr.value
      ),
    };
    const jsonData = JSON.stringify(filledFields, null, 2);
    console.log(jsonData);
    // Here you can also implement a function to download this JSON data as a file
  };

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        label="Song Title"
        name="name"
        placeholder="Enter the song title"
        value={formFields.name}
        onChange={handleInputChange}
      />
      <TextAreaInput
        label="Description"
        name="description"
        placeholder="Describe the track"
        value={formFields.description}
        onChange={handleInputChange}
      />
      <TextInput
        label="Image URL"
        name="image"
        placeholder="http://example.com/image.jpg"
        value={formFields.image}
        onChange={handleInputChange}
      />
      <TextInput
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
      <label>
        Explicit Content:
        <input
          type="checkbox"
          name="explicit_content"
          checked={formFields.explicit_content}
          onChange={handleInputChange}
        />
      </label>
      <TextInput
        label="Cover Image URL"
        name="cover"
        placeholder="http://example.com/cover.jpg"
        value={formFields.cover}
        onChange={handleInputChange}
      />
      <div className="flex">
        <label>Cover</label>
        {/* <FileUpload
          immediateUpload={false}
          formats="jpe,jpeg,png"
          onFileSelected={(file) => handleAttributeChange(index, file.url)}
          onUploadSuccess={(cid, url) =>
            console.log(`Uploaded: ${cid}, URL: ${url}`)
          }
        /> */}
      </div>
      {formFields.attributes.map((attribute, index) => (
        <div key={index} className="flex gap-2">
          <TextInput
            label="Trait Type"
            name="trait_type"
            placeholder="e.g., Genre"
            value={attribute.trait_type}
            onChange={(e:string) => handleAttributeChange(index, e)}
          />
          <TextInput
            label="Value"
            name="value"
            placeholder="e.g., Rock"
            value={attribute.value}
            onChange={(e:string) => handleAttributeChange(index, e)}
          />
        </div>
      ))}
      <button onClick={addAttributeField}>Add Attribute</button>
      <TextInput
        label="External URL"
        name="external_url"
        placeholder="http://example.com/info"
        value={formFields.external_url}
        onChange={handleInputChange}
      />
      <TextInput
        label="Animation URL"
        name="animation_url"
        placeholder="http://example.com/animation"
        value={formFields.animation_url}
        onChange={handleInputChange}
      />
      {/* <button onClick={generateJSONFile}>Generate JSON</button> */}
    </div>
  );
};

export default MusicMetadataForm;
