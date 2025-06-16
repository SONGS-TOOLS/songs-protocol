import { BigInt, store } from "@graphprotocol/graph-ts";
import {
  WrappedSongReleased as WrappedSongReleasedEvent,
  WrappedSongReleaseRejected as WrappedSongReleaseRejectedEvent,
  WrappedSongReleaseRequested as WrappedSongRequestedEvent,
} from "../generated/ReleaseModule/ReleaseModule";
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
  wrappedSong.createdAtEpoch = distributor.currentEpochId;
  distributor.currentWSIndex = distributor.currentWSIndex.plus(
    BigInt.fromI32(1)
  );
  distributor.save();
  wrappedSong.save();
  store.remove("ReleaseRequest", releaseRequestId.toHexString());
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
