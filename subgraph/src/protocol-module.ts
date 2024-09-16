import {
  BigInt,
  json,
  JSONValue,
  JSONValueKind,
  log,
  store,
  TypedMap,
} from '@graphprotocol/graph-ts';
import {
  DistributorAcceptedReview as DistributorAcceptedReviewEvent,
  MetadataUpdated as MetadataUpdateConfirmedEvent,
  MetadataUpdateRequested as MetadataUpdateRequestedEvent,
  ReviewPeriodExpired as ReviewPeriodExpiredEvent,
  WrappedSongReleased as WrappedSongReleasedEvent,
  WrappedSongReleaseRejected as WrappedSongReleaseRejectedEvent,
  WrappedSongReleaseRequested as WrappedSongRequestedEvent,
} from '../generated/ProtocolModule/ProtocolModule';
import {
  Distributor,
  Metadata,
  MetadataUpdateRequest,
  ReleaseRequest,
  WrappedSong,
} from '../generated/schema';
import { TokenMetadata as TokenMetadataTemplate } from '../generated/templates';

export function handleWrappedSongReleaseRequested(
  event: WrappedSongRequestedEvent
): void {
  log.info('Handling WrappedSongReleaseRequested for song: {}', [
    event.params.wrappedSong.toHexString(),
  ]);
  // GET IDs FROM ALL TOPICS IN EVENT (wrappedSong, distributor, releaseRequest)
  const wrappedSongId = event.params.wrappedSong;
  const distributorId = event.params.distributor;
  const releaseRequestId = event.transaction.hash;

  // GET ENTITIES FROM SCHEMA
  let distributor = Distributor.load(distributorId);
  let wrappedSong = WrappedSong.load(wrappedSongId);

  // CREATE NEW RELEASE REQUEST ONLY IF WRAPPEDSONG AND DISTRIBUTOR EXIST
  if (wrappedSong && distributor) {
    wrappedSong.status = 'Requested';

    const releaseRequest = new ReleaseRequest(releaseRequestId);
    releaseRequest.status = 'Pending';
    releaseRequest.createdAt = event.block.timestamp;
    releaseRequest.save();
    // ASSIGN DISTRIBUTOR AND RELEASE REQUEST TO WRAPPEDSONG
    wrappedSong.distributor = distributorId;
    wrappedSong.releaseRequest = releaseRequestId;
    wrappedSong.save();
  }

  // Preserve existing data
  // let creatorAddress = wrappedSong.creator || event.params.creator.toHexString();
  // let address = wrappedSong.address || event.params.wrappedSong.toHexString();
  // let distributorAddress = wrappedSong.distributor || event.params.distributor.toHexString();

  // wrappedSong.creator = creatorAddress;
  // wrappedSong.status = 'Requested';
  // wrappedSong.address = address;
  // wrappedSong.pendingDistributor = event.params.distributor;
  // Remove the distributor assignment
  // wrappedSong.distributor = event.params.distributor.toHexString()

  // log.info('WrappedSong saved with status: {} and pendingDistributor: {}', [
  //   wrappedSong.status,
  //   event.params.distributor.toHexString(),
  // ]);

  // let distributorId = event.params.distributor;
  // let distributor = Distributor.load(distributorId);
  // if (!distributor) {
  //   distributor = new Distributor(distributorId);
  // }

  // distributor.address = event.params.distributor;
  // distributor.save();

  // wrappedSong.distributor = distributorId;

  // let releaseRequestId = event.transaction.hash;

  // event.params.wrappedSong.toHexString() + '-' + distributorId;
  // const releaseRequest = new ReleaseRequest(releaseRequestId);
  // releaseRequest.wrappedSong = wrappedSong.id;
  // releaseRequest.distributor = distributorId;
  // releaseRequest.status = 'Pending';
  // releaseRequest.createdAt = event.block.timestamp;
  // releaseRequest.save();
  // wrappedSong.releaseRequest = releaseRequestId;
  // wrappedSong.save();
}

export function handleWrappedSongReleased(
  event: WrappedSongReleasedEvent
): void {
  const wrappedSongId = event.params.wrappedSong;
  const distributorId = event.params.distributor;

  const wrappedSong = WrappedSong.load(wrappedSongId);
  const distributor = Distributor.load(distributorId);
  if (wrappedSong && distributor) {
    const releaseRequestId = wrappedSong.releaseRequest;

    if (!releaseRequestId) {
      return;
    }

    wrappedSong.status = 'Released';
    wrappedSong.releasedAt = event.block.timestamp;
    wrappedSong.releaseRequest = null;
    wrappedSong.save();
    store.remove('ReleaseRequest', releaseRequestId.toHexString());
  }
}

export function handleMetadataUpdateRequested(
  event: MetadataUpdateRequestedEvent
): void {
  const wrappedSongId = event.params.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }

  let distributorId = wrappedSong.distributor;

  if (!distributorId) {
    return;
  }

  let metadataUpdateRequestId = event.block.hash;

  let metadataUpdateRequest = new MetadataUpdateRequest(
    metadataUpdateRequestId
  );

  let newMetadataId = metadataUpdateRequestId.toHexString() + '-newMetadata';
  let newMetadata = new Metadata(newMetadataId);

  const newMetadataUrl = event.params.newMetadata;

  if (newMetadataUrl.startsWith('http')) {
    const songIpfsURI = newMetadataUrl.split('/ipfs/')[1];
    if (songIpfsURI) {
      newMetadata.songURI = songIpfsURI;
      TokenMetadataTemplate.create(songIpfsURI);

      //TODO: handle metadata update for shares
      newMetadata.sharesURI = '';
    }
  } else if (newMetadataUrl.startsWith('Qm')) {
    newMetadata.songURI = newMetadataUrl;
    TokenMetadataTemplate.create(newMetadataUrl);
    //TODO: handle metadata update for shares

    newMetadata.sharesURI = '';
  }

  newMetadata.save();

  metadataUpdateRequest.newMetadata = newMetadataId;
  metadataUpdateRequest.status = 'Pending';
  metadataUpdateRequest.createdAt = event.block.timestamp;
  metadataUpdateRequest.save();

  wrappedSong.pendingMetadataUpdate = metadataUpdateRequestId;
  wrappedSong.save();
}

export function handleMetadataUpdated(
  event: MetadataUpdateConfirmedEvent
): void {
  const wrappedSongId = event.params.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);

  if (!wrappedSong) {
    return;
  }

  const metadataUpdateRequestId = wrappedSong.pendingMetadataUpdate;

  if (!metadataUpdateRequestId) {
    return;
  }

  const metadataUpdateRequest = MetadataUpdateRequest.load(
    metadataUpdateRequestId
  );

  if (!metadataUpdateRequest) {
    return;
  }

  metadataUpdateRequest.status = 'Confirmed';
  metadataUpdateRequest.confirmedAt = event.block.timestamp;
  metadataUpdateRequest.save();
  const oldMetadataId = wrappedSong.metadata;

  const newMetadataId = metadataUpdateRequest.newMetadata;
  wrappedSong.metadata = newMetadataId;

  if (oldMetadataId) {
    store.remove('Metadata', oldMetadataId);
  }

  wrappedSong.pendingMetadataUpdate = null;
  wrappedSong.save();

  store.remove('MetadataUpdateRequest', metadataUpdateRequestId.toHexString());
}

export function handleDistributorAcceptedReview(
  event: DistributorAcceptedReviewEvent
): void {
  const wrappedSongId = event.params.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }

  const releaseRequestId = wrappedSong.releaseRequest;
  if (!releaseRequestId) {
    return;
  }

  const releaseRequest = ReleaseRequest.load(releaseRequestId);
  if (!releaseRequest) {
    return;
  }

  releaseRequest.status = 'InReview';
  releaseRequest.reviewStartedAt = event.block.timestamp;
  releaseRequest.reviewEndTime = event.block.timestamp.plus(
    BigInt.fromI32(7 * 86400)
  ); // Assuming 7 days review period
  releaseRequest.save();

  wrappedSong.status = 'InReview';
}

export function handleReviewPeriodExpired(
  event: ReviewPeriodExpiredEvent
): void {
  const wrappedSongId = event.params.wrappedSong;

  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }

  const releaseRequestId = wrappedSong.releaseRequest;
  if (!releaseRequestId) {
    return;
  }

  const releaseRequest = ReleaseRequest.load(releaseRequestId);
  if (!releaseRequest) {
    return;
  }

  wrappedSong.status = 'Requested';
  wrappedSong.save();

  releaseRequest.status = 'Pending';
  releaseRequest.reviewStartedAt = null;
  releaseRequest.reviewEndTime = null;
  releaseRequest.save();
}

export function handleWrappedSongReleaseRejected(
  event: WrappedSongReleaseRejectedEvent
): void {
  const wrappedSongId = event.params.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }

  const releaseRequestId = wrappedSong.releaseRequest;
  if (!releaseRequestId) {
    return;
  }

  wrappedSong.status = 'Requested';
  wrappedSong.releaseRequest = null;
  wrappedSong.save();

  store.remove('ReleaseRequest', releaseRequestId.toHexString());
}

// Helper function to parse metadata
// function parseMetadata(
//   metadataString: string
// ): TypedMap<string, JSONValue> | null {
//   let jsonResult = json.try_fromString(metadataString);
//   if (jsonResult.isOk && jsonResult.value.kind == JSONValueKind.OBJECT) {
//     return jsonResult.value.toObject();
//   }
//   return null;
// }
