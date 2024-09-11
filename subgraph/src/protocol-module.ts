import { BigInt, store } from "@graphprotocol/graph-ts"
import {
    MetadataUpdateConfirmed as MetadataUpdateConfirmedEvent,
    MetadataUpdateRequested as MetadataUpdateRequestedEvent,
    WrappedSongReleaseConfirmed as WrappedSongReleaseConfirmedEvent,
    WrappedSongReleaseRejected as WrappedSongReleaseRejectedEvent,
    WrappedSongRequested as WrappedSongRequestedEvent
} from "../generated/ProtocolModule/ProtocolModule"
import { WrappedSongSmartAccount } from "../generated/ProtocolModule/WrappedSongSmartAccount"
import { Distributor, MetadataUpdateRequest, WrappedSong } from "../generated/schema"

export function handleWrappedSongRequested(event: WrappedSongRequestedEvent): void {
  let distributorId = event.params.distributor.toHexString()
  let distributor = Distributor.load(distributorId)
  if (!distributor) {
    distributor = new Distributor(distributorId)
    distributor.address = event.params.distributor
    distributor.save()
  }

  let wrappedSongId = event.params.wrappedSong.toHexString()
  let wrappedSong = new WrappedSong(wrappedSongId)
  wrappedSong.address = event.params.wrappedSong
  wrappedSong.creator = event.params.creator
  wrappedSong.distributor = distributor.id
  wrappedSong.status = "Requested"
  wrappedSong.createdAt = event.block.timestamp

  // Fetch metadata from WrappedSongSmartAccount
  let wrappedSongContract = WrappedSongSmartAccount.bind(event.params.wrappedSong)
  let metadataResult = wrappedSongContract.try_getWrappedSongMetadata(BigInt.fromI32(0)) // Using tokenId 0
  if (!metadataResult.reverted) {
    wrappedSong.metadata = metadataResult.value
  }

  wrappedSong.save()
}

export function handleWrappedSongReleaseConfirmed(event: WrappedSongReleaseConfirmedEvent): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    wrappedSong.status = "Released"
    wrappedSong.releasedAt = event.block.timestamp
    wrappedSong.save()
  }
}

export function handleWrappedSongReleaseRejected(event: WrappedSongReleaseRejectedEvent): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    wrappedSong.status = "Rejected"
    wrappedSong.save()
  }
}

export function handleMetadataUpdateRequested(event: MetadataUpdateRequestedEvent): void {
  let id = event.params.wrappedSong.toHexString() + "-" + event.params.tokenId.toString()
  let metadataUpdateRequest = new MetadataUpdateRequest(id)
  metadataUpdateRequest.wrappedSong = event.params.wrappedSong.toHexString()
  metadataUpdateRequest.tokenId = event.params.tokenId
  metadataUpdateRequest.newMetadata = event.params.newMetadata
  metadataUpdateRequest.status = "Requested"
  metadataUpdateRequest.createdAt = event.block.timestamp
  metadataUpdateRequest.save()

  // Update the WrappedSong with the new metadata
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    wrappedSong.newMetadata = event.params.newMetadata
    wrappedSong.save()
  }
}

export function handleMetadataUpdateConfirmed(event: MetadataUpdateConfirmedEvent): void {
  let id = event.params.wrappedSong.toHexString() + "-" + event.params.tokenId.toString()
  let metadataUpdateRequest = MetadataUpdateRequest.load(id)
  if (metadataUpdateRequest) {
    // Remove the MetadataUpdateRequest entity
    store.remove('MetadataUpdateRequest', id)

    // Update the WrappedSong metadata
    let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
    if (wrappedSong) {
      let wrappedSongContract = WrappedSongSmartAccount.bind(event.params.wrappedSong)
      let metadataResult = wrappedSongContract.try_getWrappedSongMetadata(event.params.tokenId)
      if (!metadataResult.reverted) {
        wrappedSong.metadata = metadataResult.value
        wrappedSong.newMetadata = null // Clear the newMetadata field after confirmation
        wrappedSong.save()
      }
    }
  }
}