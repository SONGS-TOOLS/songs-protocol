import { BigInt, json, JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts"
import {
  DistributorAcceptedReview as DistributorAcceptedReviewEvent,
  MetadataUpdated as MetadataUpdateConfirmedEvent,
  MetadataUpdateRequested as MetadataUpdateRequestedEvent,
  ReviewPeriodExpired as ReviewPeriodExpiredEvent,
  WrappedSongReleased as WrappedSongReleasedEvent,
  WrappedSongReleaseRejected as WrappedSongReleaseRejectedEvent,
  WrappedSongReleaseRequested as WrappedSongRequestedEvent
} from "../generated/ProtocolModule/ProtocolModule"
import { Distributor, Metadata, MetadataUpdateRequest, ReleaseRequest, WrappedSong } from "../generated/schema"

export function handleWrappedSongReleaseRequested(event: WrappedSongRequestedEvent): void {
  let wrappedSong = new WrappedSong(event.params.wrappedSong.toHexString())
  wrappedSong.creator = event.params.creator
  wrappedSong.status = "Requested"
  wrappedSong.address = event.params.wrappedSong
  wrappedSong.pendingDistributor = event.params.distributor
  wrappedSong.save()

  let distributorId = event.params.distributor.toHexString()
  let distributor = Distributor.load(distributorId)
  if (!distributor) {
    distributor = new Distributor(distributorId)
    distributor.address = event.params.distributor
    distributor.save()
  }

  let releaseRequestId = event.params.wrappedSong.toHexString() + "-" + distributorId
  let releaseRequest = new ReleaseRequest(releaseRequestId)
  releaseRequest.wrappedSong = wrappedSong.id
  releaseRequest.distributor = distributorId
  releaseRequest.status = "Pending"
  releaseRequest.createdAt = event.block.timestamp
  releaseRequest.save()
}

export function handleWrappedSongReleased(event: WrappedSongReleasedEvent): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    let distributorId = event.params.distributor.toHexString()
    let distributor = Distributor.load(distributorId)
    if (!distributor) {
      distributor = new Distributor(distributorId)
      distributor.address = event.params.distributor
      distributor.save()
    }
    wrappedSong.distributor = distributorId
    wrappedSong.status = "Released"
    wrappedSong.releasedAt = event.block.timestamp
    wrappedSong.pendingDistributor = null
    wrappedSong.save()

    let releaseRequestId = wrappedSong.id + "-" + distributorId
    let releaseRequest = ReleaseRequest.load(releaseRequestId)
    if (releaseRequest) {
      releaseRequest.status = "Released"
      releaseRequest.confirmedAt = event.block.timestamp
      releaseRequest.save()
    }
  }
}

export function handleMetadataUpdateRequested(event: MetadataUpdateRequestedEvent): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    let distributorId = wrappedSong.distributor
    if (distributorId) {
      let metadataUpdateRequestId = event.params.wrappedSong.toHexString() + "-" + event.params.tokenId.toString()
      let metadataUpdateRequest = new MetadataUpdateRequest(metadataUpdateRequestId)
      metadataUpdateRequest.wrappedSong = wrappedSong.id
      metadataUpdateRequest.distributor = distributorId
      metadataUpdateRequest.tokenId = event.params.tokenId
      
      let newMetadataId = metadataUpdateRequestId + "-newMetadata"
      let newMetadata = new Metadata(newMetadataId)
      
      let parsedMetadata = parseMetadata(event.params.newMetadata)
      if (parsedMetadata) {
        newMetadata.songURI = parsedMetadata.get("songURI")!.toString()
        newMetadata.sharesAmount = BigInt.fromString(parsedMetadata.get("sharesAmount")!.toString())
        newMetadata.sharesURI = parsedMetadata.get("sharesURI")!.toString()
        newMetadata.save()
      
        metadataUpdateRequest.newMetadata = newMetadataId
        metadataUpdateRequest.status = "Pending"
        metadataUpdateRequest.createdAt = event.block.timestamp
        metadataUpdateRequest.save()

        wrappedSong.pendingMetadataUpdate = metadataUpdateRequest.id
        wrappedSong.save()
      }
    }
  }
}

export function handleMetadataUpdated(event: MetadataUpdateConfirmedEvent): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    let metadataUpdateRequestId = event.params.wrappedSong.toHexString() + "-" + event.params.tokenId.toString()
    let metadataUpdateRequest = MetadataUpdateRequest.load(metadataUpdateRequestId)
    
    if (metadataUpdateRequest) {
      metadataUpdateRequest.status = "Confirmed"
      metadataUpdateRequest.confirmedAt = event.block.timestamp
      metadataUpdateRequest.save()

      if (metadataUpdateRequest.newMetadata) {
        let newMetadata = Metadata.load(metadataUpdateRequest.newMetadata)
        if (newMetadata) {
          // Update the existing Metadata entity or create a new one if it doesn't exist
          let metadataId = wrappedSong.id + "-metadata"
          let metadata = Metadata.load(metadataId)
          if (!metadata) {
            metadata = new Metadata(metadataId)
          }
          metadata.songURI = newMetadata.songURI
          metadata.sharesAmount = newMetadata.sharesAmount
          metadata.sharesURI = newMetadata.sharesURI
          metadata.save()

          // Update the WrappedSong with the updated metadata
          wrappedSong.metadata = metadataId
        }
      }
      
      wrappedSong.pendingMetadataUpdate = null
      wrappedSong.save()
    }
  }
}

export function handleDistributorAcceptedReview(event: DistributorAcceptedReviewEvent): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    wrappedSong.status = "InReview"
    wrappedSong.reviewStartedAt = event.block.timestamp
    wrappedSong.reviewEndTime = event.block.timestamp.plus(BigInt.fromI32(7 * 86400)) // Assuming 7 days review period
    wrappedSong.reviewingDistributor = event.params.distributor
    wrappedSong.save()

    let releaseRequestId = event.params.wrappedSong.toHexString() + "-" + event.params.distributor.toHexString()
    let releaseRequest = ReleaseRequest.load(releaseRequestId)
    if (releaseRequest) {
      releaseRequest.status = "InReview"
      releaseRequest.reviewStartedAt = event.block.timestamp
      releaseRequest.save()
    }
  }
}

export function handleReviewPeriodExpired(event: ReviewPeriodExpiredEvent): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    wrappedSong.status = "Requested"
    wrappedSong.reviewStartedAt = null
    wrappedSong.reviewEndTime = null
    wrappedSong.reviewingDistributor = null
    wrappedSong.save()

    let releaseRequestId = wrappedSong.id + "-" + event.params.distributor.toHexString()
    let releaseRequest = ReleaseRequest.load(releaseRequestId)
    if (releaseRequest) {
      releaseRequest.status = "Pending"
      releaseRequest.save()
    }
  }
}

export function handleWrappedSongReleaseRejected(event: WrappedSongReleaseRejectedEvent): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (wrappedSong) {
    wrappedSong.status = "Requested"
    wrappedSong.reviewStartedAt = null
    wrappedSong.reviewEndTime = null
    wrappedSong.reviewingDistributor = null
    wrappedSong.save()

    let releaseRequestId = wrappedSong.id + "-" + event.params.distributor.toHexString()
    let releaseRequest = ReleaseRequest.load(releaseRequestId)
    if (releaseRequest) {
      releaseRequest.status = "Rejected"
      releaseRequest.save()
    }
  }
}

// Helper function to parse metadata
function parseMetadata(metadataString: string): TypedMap<string, JSONValue> | null {
  let jsonResult = json.fromString(metadataString)
  if (jsonResult.kind == JSONValueKind.OBJECT) {
    return jsonResult.toObject()
  }
  return null
}

