import {
  EpochRedeemed,
  NewRevenueEpoch,
} from "../generated/templates/DistributorWallet/DistributorWallet";
import {
  Distributor,
  DistributorEpoch,
  WrappedSongShareHolder,
} from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleNewRevenueEpoch(event: NewRevenueEpoch): void {
  const distributorId = event.params.distributor;
  const epochId = event.params.epochId;
  const totalAmount = event.params.totalAmount;
  const timestamp = event.block.timestamp;
  const distributor = Distributor.load(distributorId);
  if (!distributor) {
    return;
  }
  const epoch = new DistributorEpoch(epochId.toString());
  epoch.epochId = epochId;
  epoch.totalAmount = totalAmount;
  epoch.timestamp = timestamp;
  epoch.distributor = distributorId;
  epoch.save();
  distributor.currentEpochId = epochId;
  distributor.save();
}

export function handleEpochRedeemed(event: EpochRedeemed): void {
  const distributorId = event.address;
  const wrappedSong = event.params.wrappedSong;
  const user = event.params.holder;
  const epochId = event.params.epochId;
  const amount = event.params.amount;

  const wrappedSongShareHolderToId = wrappedSong.concat(user);
  const wrappedSongShareHolderTo = WrappedSongShareHolder.load(
    wrappedSongShareHolderToId
  );
  if (wrappedSongShareHolderTo == null) {
    return;
  }
  wrappedSongShareHolderTo.lastEpochClaimed = epochId;
  wrappedSongShareHolderTo.save();
}
