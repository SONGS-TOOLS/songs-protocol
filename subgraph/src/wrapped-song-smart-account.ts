import { BigInt, json, JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts"
import { MetadataUpdated as MetadataUpdatedEvent } from "../generated/WrappedSongSmartAccount/WrappedSongSmartAccount"
import { Metadata, WrappedSong } from "../generated/schema"

export function handleMetadataUpdatedDirectly(event: MetadataUpdatedEvent): void {
  let wrappedSongAddress = event.address.toHexString()
  let wrappedSong = WrappedSong.load(wrappedSongAddress)

  if (wrappedSong) {
    let metadataId = wrappedSongAddress + "-metadata"
    let metadata = Metadata.load(metadataId)
    
    if (!metadata) {
      metadata = new Metadata(metadataId)
    }

    let parsedMetadata = parseMetadata(event.params.newMetadata)
    if (parsedMetadata) {
      metadata.songURI = parsedMetadata.get("songURI")!.toString()
      metadata.sharesAmount = BigInt.fromString(parsedMetadata.get("sharesAmount")!.toString())
      metadata.sharesURI = parsedMetadata.get("sharesURI")!.toString()
      metadata.save()

      wrappedSong.metadata = metadataId
      wrappedSong.save()
    }
  }
}

function parseMetadata(metadataString: string): TypedMap<string, JSONValue> | null {
  let jsonResult = json.fromString(metadataString)
  if (jsonResult.kind == JSONValueKind.OBJECT) {
    return jsonResult.toObject()
  }
  return null
}