import { Address, BigInt } from '@graphprotocol/graph-ts'
import { WrappedSongCreated as WrappedSongCreatedEvent, WrappedSongCreatedWithMetadata as WrappedSongCreatedWithMetadataEvent } from '../generated/WrappedSongFactory/WrappedSongFactory'
import { Metadata, WrappedSong } from '../generated/schema'
import { WrappedSongSmartAccount } from '../generated/templates'

export function handleWrappedSongCreated(event: WrappedSongCreatedEvent): void {
  let wrappedSong = new WrappedSong(event.params.wrappedSongSmartAccount.toHexString())
  wrappedSong.creator = event.params.owner
  wrappedSong.status = 'Created'
  wrappedSong.address = event.params.wrappedSongSmartAccount
  wrappedSong.stablecoinAddress = event.params.stablecoin
  wrappedSong.createdAt = event.block.timestamp
  wrappedSong.pendingDistributor = Address.zero()
  wrappedSong.reviewStartedAt = BigInt.zero()
  wrappedSong.reviewEndTime = BigInt.zero()
  wrappedSong.reviewingDistributor = Address.zero()
  wrappedSong.releasedAt = BigInt.zero()
  wrappedSong.save()

  // Create a new instance of the WrappedSongSmartAccount template
  WrappedSongSmartAccount.create(event.params.wrappedSongSmartAccount)
}

export function handleWrappedSongCreatedWithMetadata(event: WrappedSongCreatedWithMetadataEvent): void {
  let wrappedSongId = event.params.wrappedSongSmartAccount.toHexString()
  let wrappedSong = WrappedSong.load(wrappedSongId)
  
  if (wrappedSong == null) {
    // This shouldn't happen, but if it does, we'll create a new WrappedSong entity
    wrappedSong = new WrappedSong(wrappedSongId)
    wrappedSong.creator = event.params.owner
    wrappedSong.status = 'Created'
    wrappedSong.address = event.params.wrappedSongSmartAccount
    wrappedSong.createdAt = event.block.timestamp
    wrappedSong.stablecoinAddress = Address.zero() // We don't have this information in this event
    wrappedSong.pendingDistributor = Address.zero()
    wrappedSong.reviewStartedAt = BigInt.zero()
    wrappedSong.reviewEndTime = BigInt.zero()
    wrappedSong.reviewingDistributor = Address.zero()
    wrappedSong.releasedAt = BigInt.zero()
  }

  let metadataId = wrappedSongId
  let metadata = new Metadata(metadataId)
  metadata.songURI = event.params.songURI
  metadata.sharesAmount = event.params.sharesAmount
  metadata.sharesURI = event.params.sharesURI
  metadata.save()

  wrappedSong.metadata = metadataId
  wrappedSong.save()
}

// Remove handleWrappedSongCreatedWithMetadata as it's no longer used
