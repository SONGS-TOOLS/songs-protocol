import {
  MetadataUpdateConfirmed as MetadataUpdateConfirmedEvent,
  MetadataUpdateRequested as MetadataUpdateRequestedEvent,
  MetadataUpdated as MetadataUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  WrappedSongReleaseConfirmed as WrappedSongReleaseConfirmedEvent,
  WrappedSongReleaseRejected as WrappedSongReleaseRejectedEvent,
  WrappedSongReleaseRequested as WrappedSongReleaseRequestedEvent,
  WrappedSongReleased as WrappedSongReleasedEvent,
  WrappedSongRequested as WrappedSongRequestedEvent
} from "../generated/ProtocolModule/ProtocolModule"
import {
  MetadataUpdateConfirmed,
  MetadataUpdateRequested,
  MetadataUpdated,
  OwnershipTransferred,
  Paused,
  WrappedSongReleaseConfirmed,
  WrappedSongReleaseRejected,
  WrappedSongReleaseRequested,
  WrappedSongReleased,
  WrappedSongRequested
} from "../generated/schema"

export function handleMetadataUpdateConfirmed(
  event: MetadataUpdateConfirmedEvent
): void {
  let entity = new MetadataUpdateConfirmed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wrappedSong = event.params.wrappedSong
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMetadataUpdateRequested(
  event: MetadataUpdateRequestedEvent
): void {
  let entity = new MetadataUpdateRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wrappedSong = event.params.wrappedSong
  entity.tokenId = event.params.tokenId
  entity.newMetadata = event.params.newMetadata

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMetadataUpdated(event: MetadataUpdatedEvent): void {
  let entity = new MetadataUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wrappedSong = event.params.wrappedSong
  entity.tokenId = event.params.tokenId
  entity.newMetadata = event.params.newMetadata

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.isPaused = event.params.isPaused

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWrappedSongReleaseConfirmed(
  event: WrappedSongReleaseConfirmedEvent
): void {
  let entity = new WrappedSongReleaseConfirmed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wrappedSong = event.params.wrappedSong
  entity.distributor = event.params.distributor

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWrappedSongReleaseRejected(
  event: WrappedSongReleaseRejectedEvent
): void {
  let entity = new WrappedSongReleaseRejected(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wrappedSong = event.params.wrappedSong
  entity.distributor = event.params.distributor

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWrappedSongReleaseRequested(
  event: WrappedSongReleaseRequestedEvent
): void {
  let entity = new WrappedSongReleaseRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wrappedSong = event.params.wrappedSong
  entity.distributor = event.params.distributor

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWrappedSongReleased(
  event: WrappedSongReleasedEvent
): void {
  let entity = new WrappedSongReleased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wrappedSong = event.params.wrappedSong
  entity.distributor = event.params.distributor

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWrappedSongRequested(
  event: WrappedSongRequestedEvent
): void {
  let entity = new WrappedSongRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wrappedSong = event.params.wrappedSong
  entity.distributor = event.params.distributor
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
