import { BigInt, store } from "@graphprotocol/graph-ts";
import {
  DistributorAcceptedReview as DistributorAcceptedReviewEvent,
  ReviewPeriodExpired as ReviewPeriodExpiredEvent,
  WrappedSongAuthenticitySet as WrappedSongAuthenticitySetEvent,
  WrappedSongReleased as WrappedSongReleasedEvent,
  WrappedSongReleaseRejected as WrappedSongReleaseRejectedEvent,
  WrappedSongReleaseRequested as WrappedSongRequestedEvent,
} from "../generated/ProtocolModule/ProtocolModule";
import { Distributor, ReleaseRequest, WrappedSong } from "../generated/schema";

export function handleWrappedSongReleaseRequested(
  event: WrappedSongRequestedEvent
): void {
  const wrappedSongId = event.params.wrappedSong;
  const distributorId = event.params.distributor;
  const releaseRequestId = event.transaction.hash;

  let distributor = Distributor.load(distributorId);
  let wrappedSong = WrappedSong.load(wrappedSongId);

  if (!wrappedSong || !distributor) {
    return;
  }

  wrappedSong.status = "Requested";

  const releaseRequest = new ReleaseRequest(releaseRequestId);
  releaseRequest.status = "Pending";
  releaseRequest.createdAt = event.block.timestamp;
  releaseRequest.save();

  wrappedSong.distributor = distributorId;
  wrappedSong.releaseRequest = releaseRequestId;
  wrappedSong.save();
}

export function handleWrappedSongReleased(
  event: WrappedSongReleasedEvent
): void {
  const wrappedSongId = event.params.wrappedSong;
  const distributorId = event.params.distributor;

  const wrappedSong = WrappedSong.load(wrappedSongId);
  const distributor = Distributor.load(distributorId);
  if (!wrappedSong || !distributor) {
    return;
  }

  const releaseRequestId = wrappedSong.releaseRequest;

  if (!releaseRequestId) {
    return;
  }

  wrappedSong.status = "Released";
  wrappedSong.releasedAt = event.block.timestamp;
  wrappedSong.releaseRequest = null;
  wrappedSong.releaseDistributor = distributorId;
  wrappedSong.wsIndex = distributor.currentWSIndex;
  distributor.currentWSIndex = distributor.currentWSIndex.plus(
    BigInt.fromI32(1)
  );
  distributor.save();
  wrappedSong.save();
  store.remove("ReleaseRequest", releaseRequestId.toHexString());
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

  releaseRequest.status = "InReview";
  releaseRequest.reviewStartedAt = event.block.timestamp;
  releaseRequest.reviewEndTime = event.block.timestamp.plus(
    BigInt.fromI32(7 * 86400)
  ); // Assuming 7 days review period
  releaseRequest.save();

  wrappedSong.status = "InReview";
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

  wrappedSong.status = "Requested";
  wrappedSong.save();

  releaseRequest.status = "Pending";
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

  wrappedSong.status = "Created";
  wrappedSong.releaseRequest = null;
  wrappedSong.distributor = null;
  wrappedSong.save();

  store.remove("ReleaseRequest", releaseRequestId.toHexString());
}

export function handleWrappedSongAuthenticitySet(
  event: WrappedSongAuthenticitySetEvent
): void {
  let wrappedSong = WrappedSong.load(event.params.wrappedSong);
  if (wrappedSong) {
    wrappedSong.isAuthentic = event.params.isAuthentic;
    wrappedSong.save();
  }
}
