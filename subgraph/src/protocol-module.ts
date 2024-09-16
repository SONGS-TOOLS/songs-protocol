import { BigInt, json, JSONValue, JSONValueKind, log, TypedMap } from "@graphprotocol/graph-ts"
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
  log.info('Handling WrappedSongReleaseRequested for song: {}', [event.params.wrappedSong.toHexString()])
  
  let wrappedSong = WrappedSong.load(event.params.wrappedSong.toHexString())
  if (!wrappedSong) {
    wrappedSong = new WrappedSong(event.params.wrappedSong.toHexString())
  }
  // Preserve existing data
  let creator = wrappedSong.creator || event.params.creator
  let address = wrappedSong.address || event.params.wrappedSong
  
  wrappedSong.creator = creator
  wrappedSong.status = "Requested"
  wrappedSong.address = address
  wrappedSong.pendingDistributor = event.params.distributor
  // Remove the distributor assignment
  // wrappedSong.distributor = event.params.distributor.toHexString()
  wrappedSong.save()

  log.info('WrappedSong saved with status: {} and pendingDistributor: {}', [wrappedSong.status, event.params.distributor.toHexString()])
  
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

    log.info('WrappedSong released with distributor: {}', [distributorId])

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
      
      // Handle the case where newMetadata might be a URL instead of JSON
      let newMetadataString = event.params.newMetadata
      if (newMetadataString.startsWith("http")) {
        // If it's a URL, store it directly in the songURI field
        newMetadata.songURI = newMetadataString
        newMetadata.sharesAmount = BigInt.fromI32(0) // Default value
        newMetadata.sharesURI = "" // Empty string as default
      } else {
        // Try to parse as JSON
        let parsedMetadata = parseMetadata(newMetadataString)
        if (parsedMetadata) {
          newMetadata.songURI = parsedMetadata.get("songURI") ? parsedMetadata.get("songURI")!.toString() : ""
          newMetadata.sharesAmount = parsedMetadata.get("sharesAmount") ? BigInt.fromString(parsedMetadata.get("sharesAmount")!.toString()) : BigInt.fromI32(0)
          newMetadata.sharesURI = parsedMetadata.get("sharesURI") ? parsedMetadata.get("sharesURI")!.toString() : ""
        } else {
          log.warning("Failed to parse metadata: {}", [newMetadataString])
          return // Exit the function if we can't parse the metadata
        }
      }
      
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
  let jsonResult = json.try_fromString(metadataString)
  if (jsonResult.isOk && jsonResult.value.kind == JSONValueKind.OBJECT) {
    return jsonResult.value.toObject()
  }
  return null
}

