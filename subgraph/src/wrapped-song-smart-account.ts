import { BigInt } from '@graphprotocol/graph-ts'
import { Metadata, WrappedSong } from '../generated/schema'
import { MetadataUpdated as MetadataUpdatedEvent } from '../generated/templates/WrappedSongSmartAccount/WrappedSongSmartAccount'

export function handleMetadataUpdatedDirectly(event: MetadataUpdatedEvent): void {
  let wrappedSongId = event.address.toHexString()
  let wrappedSong = WrappedSong.load(wrappedSongId)
  
  if (wrappedSong == null) {
    // If the WrappedSong doesn't exist, we can't update its metadata
    return
  }

  let metadataId = wrappedSongId + "-metadata"
  let metadata = Metadata.load(metadataId)
  if (metadata == null) {
    metadata = new Metadata(metadataId)
    // Initialize non-nullable fields with default values
    metadata.sharesAmount = BigInt.fromI32(0)
    metadata.songURI = ""
    metadata.sharesURI = ""
  }
  
  if (event.params.tokenId.equals(BigInt.fromI32(0))) {
    metadata.songURI = event.params.newMetadata
  } else if (event.params.tokenId.equals(BigInt.fromI32(1))) {
    metadata.sharesURI = event.params.newMetadata
  }
  
  metadata.save()

  // Update the WrappedSong entity to point to the new metadata
  wrappedSong.metadata = metadataId
  wrappedSong.save()
}
