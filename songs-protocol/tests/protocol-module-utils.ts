import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/ProtocolModule/ProtocolModule"

export function createMetadataUpdateConfirmedEvent(
  wrappedSong: Address,
  tokenId: BigInt
): MetadataUpdateConfirmed {
  let metadataUpdateConfirmedEvent = changetype<MetadataUpdateConfirmed>(
    newMockEvent()
  )

  metadataUpdateConfirmedEvent.parameters = new Array()

  metadataUpdateConfirmedEvent.parameters.push(
    new ethereum.EventParam(
      "wrappedSong",
      ethereum.Value.fromAddress(wrappedSong)
    )
  )
  metadataUpdateConfirmedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return metadataUpdateConfirmedEvent
}

export function createMetadataUpdateRequestedEvent(
  wrappedSong: Address,
  tokenId: BigInt,
  newMetadata: string
): MetadataUpdateRequested {
  let metadataUpdateRequestedEvent = changetype<MetadataUpdateRequested>(
    newMockEvent()
  )

  metadataUpdateRequestedEvent.parameters = new Array()

  metadataUpdateRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "wrappedSong",
      ethereum.Value.fromAddress(wrappedSong)
    )
  )
  metadataUpdateRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  metadataUpdateRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "newMetadata",
      ethereum.Value.fromString(newMetadata)
    )
  )

  return metadataUpdateRequestedEvent
}

export function createMetadataUpdatedEvent(
  wrappedSong: Address,
  tokenId: BigInt,
  newMetadata: string
): MetadataUpdated {
  let metadataUpdatedEvent = changetype<MetadataUpdated>(newMockEvent())

  metadataUpdatedEvent.parameters = new Array()

  metadataUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "wrappedSong",
      ethereum.Value.fromAddress(wrappedSong)
    )
  )
  metadataUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  metadataUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newMetadata",
      ethereum.Value.fromString(newMetadata)
    )
  )

  return metadataUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(isPaused: boolean): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("isPaused", ethereum.Value.fromBoolean(isPaused))
  )

  return pausedEvent
}

export function createWrappedSongReleaseConfirmedEvent(
  wrappedSong: Address,
  distributor: Address
): WrappedSongReleaseConfirmed {
  let wrappedSongReleaseConfirmedEvent =
    changetype<WrappedSongReleaseConfirmed>(newMockEvent())

  wrappedSongReleaseConfirmedEvent.parameters = new Array()

  wrappedSongReleaseConfirmedEvent.parameters.push(
    new ethereum.EventParam(
      "wrappedSong",
      ethereum.Value.fromAddress(wrappedSong)
    )
  )
  wrappedSongReleaseConfirmedEvent.parameters.push(
    new ethereum.EventParam(
      "distributor",
      ethereum.Value.fromAddress(distributor)
    )
  )

  return wrappedSongReleaseConfirmedEvent
}

export function createWrappedSongReleaseRejectedEvent(
  wrappedSong: Address,
  distributor: Address
): WrappedSongReleaseRejected {
  let wrappedSongReleaseRejectedEvent = changetype<WrappedSongReleaseRejected>(
    newMockEvent()
  )

  wrappedSongReleaseRejectedEvent.parameters = new Array()

  wrappedSongReleaseRejectedEvent.parameters.push(
    new ethereum.EventParam(
      "wrappedSong",
      ethereum.Value.fromAddress(wrappedSong)
    )
  )
  wrappedSongReleaseRejectedEvent.parameters.push(
    new ethereum.EventParam(
      "distributor",
      ethereum.Value.fromAddress(distributor)
    )
  )

  return wrappedSongReleaseRejectedEvent
}

export function createWrappedSongReleaseRequestedEvent(
  wrappedSong: Address,
  distributor: Address
): WrappedSongReleaseRequested {
  let wrappedSongReleaseRequestedEvent =
    changetype<WrappedSongReleaseRequested>(newMockEvent())

  wrappedSongReleaseRequestedEvent.parameters = new Array()

  wrappedSongReleaseRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "wrappedSong",
      ethereum.Value.fromAddress(wrappedSong)
    )
  )
  wrappedSongReleaseRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "distributor",
      ethereum.Value.fromAddress(distributor)
    )
  )

  return wrappedSongReleaseRequestedEvent
}

export function createWrappedSongReleasedEvent(
  wrappedSong: Address,
  distributor: Address
): WrappedSongReleased {
  let wrappedSongReleasedEvent = changetype<WrappedSongReleased>(newMockEvent())

  wrappedSongReleasedEvent.parameters = new Array()

  wrappedSongReleasedEvent.parameters.push(
    new ethereum.EventParam(
      "wrappedSong",
      ethereum.Value.fromAddress(wrappedSong)
    )
  )
  wrappedSongReleasedEvent.parameters.push(
    new ethereum.EventParam(
      "distributor",
      ethereum.Value.fromAddress(distributor)
    )
  )

  return wrappedSongReleasedEvent
}

export function createWrappedSongRequestedEvent(
  wrappedSong: Address,
  distributor: Address,
  creator: Address
): WrappedSongRequested {
  let wrappedSongRequestedEvent = changetype<WrappedSongRequested>(
    newMockEvent()
  )

  wrappedSongRequestedEvent.parameters = new Array()

  wrappedSongRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "wrappedSong",
      ethereum.Value.fromAddress(wrappedSong)
    )
  )
  wrappedSongRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "distributor",
      ethereum.Value.fromAddress(distributor)
    )
  )
  wrappedSongRequestedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return wrappedSongRequestedEvent
}
