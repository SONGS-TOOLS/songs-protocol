import {
    MetadataUpdateConfirmed as MetadataUpdateConfirmedEvent,
    MetadataUpdateRequested as MetadataUpdateRequestedEvent,
    WrappedSongReleaseConfirmed as WrappedSongReleaseConfirmedEvent,
    WrappedSongReleaseRejected as WrappedSongReleaseRejectedEvent,
    WrappedSongRequested as WrappedSongRequestedEvent
} from "../generated/ProtocolModule/ProtocolModule"
import { Distributor, MetadataUpdateRequest, WrappedSong } from "../generated/schema"

export function handleWrappedSongRequested(event: WrappedSongRequestedEvent): void {
  let distributorId = event.params.distributor.toHexString()
  let distributor = Distributor.load(distributorId)
  if (!distributor) {
    distributor = new Distributor(distributorId)
    distributor.address = event.params.distributor
    distributor.save()
  }

  let wrappedSong = new WrappedSong(event.params.wrappedSong.toHexString())
  wrappedSong.address = event.params.wrappedSong
  wrappedSong.creator = event.params.creator
  wrappedSong.distributor = distributor.id
  wrappedSong.status = "Requested"
  wrappedSong.createdAt = event.block.timestamp
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
}

export function handleMetadataUpdateConfirmed(event: MetadataUpdateConfirmedEvent): void {
  let id = event.params.wrappedSong.toHexString() + "-" + event.params.tokenId.toString()
  let metadataUpdateRequest = MetadataUpdateRequest.load(id)
  if (metadataUpdateRequest) {
    metadataUpdateRequest.status = "Confirmed"
    metadataUpdateRequest.confirmedAt = event.block.timestamp
    metadataUpdateRequest.save()
  }
}