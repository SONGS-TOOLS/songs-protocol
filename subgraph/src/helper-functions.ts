import {
  MetadataUpdateRequestedNewMetadataStruct,
  MetadataCreatedNewMetadataStruct,
  MetadataUpdatedNewMetadataStruct,
} from "../generated/metadataModule/MetadataModule";

import { WrappedSongCreatedMetadataStruct } from "../generated/WrappedSongFactory/WrappedSongFactory";

import { Attributes as AttributesTemplate } from "../generated/templates";
import {
  MetadataUpdateRequest,
  SharesMetadata,
  SongMetadata,
  WrappedSong,
} from "../generated/schema";

export function createMetadata<T, U>(parent: T, songMetadataParam: U): void {
  if (
    (songMetadataParam instanceof MetadataUpdateRequestedNewMetadataStruct ||
      songMetadataParam instanceof MetadataCreatedNewMetadataStruct ||
      songMetadataParam instanceof MetadataUpdatedNewMetadataStruct ||
      songMetadataParam instanceof WrappedSongCreatedMetadataStruct) &&
    (parent instanceof WrappedSong || parent instanceof MetadataUpdateRequest)
  ) {
    const name = songMetadataParam.name;
    const description = songMetadataParam.description;
    const image = songMetadataParam.image;
    const externalUrl = songMetadataParam.externalUrl;
    const animationUrl = songMetadataParam.animationUrl;
    const attributesIpfsHash = songMetadataParam.attributesIpfsHash;
    const songMetadataId = parent.id.toHexString() + "-songmetadata";
    let songMetadata = SongMetadata.load(songMetadataId);
    if (!songMetadata) {
      songMetadata = new SongMetadata(songMetadataId);
    }
    songMetadata.name = name;
    songMetadata.description = description;
    songMetadata.image = image;
    songMetadata.externalUrl = externalUrl;
    songMetadata.animationUrl = animationUrl;
    songMetadata.attributesIpfsHash = attributesIpfsHash;
    songMetadata.attributes = attributesIpfsHash;
    AttributesTemplate.create(attributesIpfsHash);
    songMetadata.save();

    const sharesMetadataId = parent.id.toHexString() + "-sharesmetadata";
    let sharesMetadata = SharesMetadata.load(sharesMetadataId);
    if (!sharesMetadata) {
      sharesMetadata = new SharesMetadata(sharesMetadataId);
    }
    sharesMetadata.name = name + " - SongShares";
    sharesMetadata.image = image;
    sharesMetadata.save();

    parent.songMetadata = songMetadataId;
    parent.sharesMetadata = sharesMetadataId;

    parent.save();
  }
}
