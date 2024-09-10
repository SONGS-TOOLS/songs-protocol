import {
    MetadataUpdateConfirmed,
    MetadataUpdateRequested,
    WrappedSongReleaseConfirmed,
    WrappedSongReleaseRejected,
    WrappedSongRequested
} from "../generated/ProtocolModule/ProtocolModule"
import { Distributor, MetadataUpdateRequest, WrappedSong } from "../generated/schema"

export function handleWrappedSongRequested(event: WrappedSongRequested): void {
  let wrappedSong = new WrappedSong(event.params.wrappedSong.toHexString())
  wrappedSong.address = event.params.wrappedSong
  wrappedSong.creator = event.params.creator
  wrappedSong.distributor = event.params.distributor
  wrappedSong.status = "Requested"
  wrappedSong.createdAt = event.block.timestamp
  wrappedSong.save()

  let distributor = Distributor.load(event.params.distributor.toHexString())
  if (!distributor) {
    distributor = new Distributor(event.params.distributor.toHexString())
    distributor.address = event.params.distributor
    distributor.save()
  }
}

export function handleWrappedSongReleaseConfirmed(event: WrappedSongReleaseConfirmed): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    wrappedSong.status = "Released"
    wrappedSong.releasedAt = event.block.timestamp
    wrappedSong.save()
  }
}

export function handleWrappedSongReleaseRejected(event: WrappedSongReleaseRejected): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    wrappedSong.status = "Rejected"
    wrappedSong.save()
  }
}

export function handleMetadataUpdateRequested(event: MetadataUpdateRequested): void {
  let id = event.params.wrappedSong.toHexString() + "-" + event.params.tokenId.toString()
  let metadataUpdateRequest = new MetadataUpdateRequest(id)
  metadataUpdateRequest.wrappedSong = event.params.wrappedSong.toHexString()
  metadataUpdateRequest.tokenId = event.params.tokenId
  metadataUpdateRequest.newMetadata = event.params.newMetadata
  metadataUpdateRequest.status = "Requested"
  metadataUpdateRequest.createdAt = event.block.timestamp
  metadataUpdateRequest.save()
}

export function handleMetadataUpdateConfirmed(event: MetadataUpdateConfirmed): void {
  let id = event.params.wrappedSong.toHexString() + "-" + event.params.tokenId.toString()
  let metadataUpdateRequest = MetadataUpdateRequest.load(id)
  if (metadataUpdateRequest) {
    metadataUpdateRequest.status = "Confirmed"
    metadataUpdateRequest.confirmedAt = event.block.timestamp
    metadataUpdateRequest.save()
  }
}