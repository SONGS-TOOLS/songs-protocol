import {
  WrappedSongCreated as WrappedSongCreatedEvent,
  WrappedSongCreatedWithMetadata as WrappedSongCreatedWithMetadataEvent
} from "../generated/WrappedSongFactory/WrappedSongFactory"
import { Metadata, WrappedSong } from "../generated/schema"

export function handleWrappedSongCreated(event: WrappedSongCreatedEvent): void {
  let wrappedSong = new WrappedSong(event.params.wrappedSongSmartAccount.toHexString())
  wrappedSong.address = event.params.wrappedSongSmartAccount
  wrappedSong.creator = event.params.owner
  wrappedSong.status = "Created"
  wrappedSong.createdAt = event.block.timestamp
  wrappedSong.stablecoinAddress = event.params.stablecoin
  
  // Initialize other fields
  wrappedSong.distributor = null
  wrappedSong.pendingDistributor = null
  wrappedSong.releasedAt = null
  wrappedSong.reviewStartedAt = null
  wrappedSong.reviewEndTime = null
  wrappedSong.reviewingDistributor = null

  wrappedSong.save()
}

export function handleWrappedSongCreatedWithMetadata(event: WrappedSongCreatedWithMetadataEvent): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSongSmartAccount.toHexString())
  if (wrappedSong == null) {
    wrappedSong = new WrappedSong(event.params.wrappedSongSmartAccount.toHexString())
    wrappedSong.address = event.params.wrappedSongSmartAccount
    wrappedSong.creator = event.params.owner
    wrappedSong.status = "Created"
    wrappedSong.createdAt = event.block.timestamp
    // Note: stablecoinAddress is not provided in this event, so we can't set it here
  }

  let metadataId = event.params.wrappedSongSmartAccount.toHexString()
  let metadata = new Metadata(metadataId)
  metadata.songURI = event.params.songURI
  metadata.sharesAmount = event.params.sharesAmount
  metadata.sharesURI = event.params.sharesURI
  metadata.save()

  wrappedSong.metadata = metadataId
  wrappedSong.save()
}

// Remove handleWrappedSongCreatedWithMetadata as it's no longer used
