import { BigInt, ByteArray, Bytes, log, store } from "@graphprotocol/graph-ts";
import {
  // FundWithdrawal,
  Sale,
  SaleOffer,
  ShareHolder,
  WrappedSong,
  WrappedSongShareHolder,
  WSTokenManagement,
} from "../generated/schema";
import {
  // FundsWithdrawn,
  // SharesSaleEnded,
  // SharesSaleStarted,
  // SharesSold,
  TransferSingle as TransferSingleEvent,
} from "../generated/templates/WSTokenManagement/WSTokenManagement";

export function handleTransferSingle(event: TransferSingleEvent): void {
  const from = event.params.from;
  const to = event.params.to;
  const amount = event.params.value;
  const tokenId = event.params.id;
  log.info("DEBUGGGG handleTransferSingle", []);
  log.info("Event params value: {}, from: {}, to: {}, tokenId: {}", [
    event.params.value.toString(),
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.id.toHexString(),
  ]);
  if (tokenId.toHexString() != "0x1") {
    return;
  }
  const wsTokenManagementId = event.address;
  const wsTokenManagement = WSTokenManagement.load(wsTokenManagementId);

  // log.info('Event params from: {}', [event.params.from.toHexString()]);
  // log.info('Event params to: {}', [event.params.to.toHexString()]);
  if (!wsTokenManagement) {
    return;
  }

  const wrappedSong = WrappedSong.load(wsTokenManagement.wrappedSong);
  if (!wrappedSong) {
    return;
  }
  // wrappedSong.creatorShares = wrappedSong.creatorShares.minus(amount);
  // wrappedSong.save();
  // const wsTokenManagementId = wrappedSong.wsTokenManagement;
  // const wsTokenManagement = WSTokenManagement.load(wsTokenManagementId);
  if (!wsTokenManagement) {
    return;
  }

  if (from.toHexString() != "0x0000000000000000000000000000000000000000") {
    let shareHolderFrom = ShareHolder.load(from);
    if (shareHolderFrom == null) {
      shareHolderFrom = new ShareHolder(from);
      shareHolderFrom.shares = BigInt.fromI32(0);
      shareHolderFrom.lastUpdated = event.block.timestamp;
      shareHolderFrom.totalEarnings = BigInt.fromI32(0);
      shareHolderFrom.unclaimedEarnings = BigInt.fromI32(0);
      shareHolderFrom.redeemedEarnings = BigInt.fromI32(0);
    } else {
      // TODO: This is adding all songshares independently of the wrapped song. Does it make sense?
      shareHolderFrom.shares = shareHolderFrom.shares.minus(amount);
    }
    shareHolderFrom.wsTokenManagement = wsTokenManagement.id;
    shareHolderFrom.save();

    const wrappedSongShareHolderFromId = wrappedSong.id.concat(from);
    let wrappedSongShareHolderFrom = WrappedSongShareHolder.load(
      wrappedSongShareHolderFromId
    );
    if (wrappedSongShareHolderFrom == null) {
      wrappedSongShareHolderFrom = new WrappedSongShareHolder(
        wrappedSongShareHolderFromId
      );
      wrappedSongShareHolderFrom.wrappedSong = wrappedSong.id;
      wrappedSongShareHolderFrom.shareHolder = to;
      wrappedSongShareHolderFrom.shares = BigInt.fromI32(0);
      wrappedSongShareHolderFrom.lastEpochClaimed = BigInt.fromI32(0);
    }

    wrappedSongShareHolderFrom.shares =
      wrappedSongShareHolderFrom.shares.minus(amount);
    wrappedSongShareHolderFrom.save();

    // const checkpointFromId = wrappedSong.id
    //   .concat(from)
    //   .concat(Bytes.fromHexString(event.block.timestamp.toHex()));
    // const checkpointFrom = new Checkpoint(checkpointFromId);
    // checkpointFrom.timestamp = event.block.timestamp;
    // checkpointFrom.value = wrappedSongShareHolderFrom.shares;
    // checkpointFrom.wrappedSongShareHolder = wrappedSongShareHolderFrom.id;
    // checkpointFrom.save();

    if (wrappedSongShareHolderFrom.shares.equals(BigInt.fromI32(0))) {
      store.remove(
        "WrappedSongShareHolder",
        wrappedSongShareHolderFrom.id.toHexString()
      );
    }
  }

  let shareHolderTo = ShareHolder.load(to);
  if (shareHolderTo == null) {
    shareHolderTo = new ShareHolder(to);
    shareHolderTo.shares = amount;
    shareHolderTo.lastUpdated = event.block.timestamp;
    shareHolderTo.totalEarnings = BigInt.fromI32(0);
    shareHolderTo.unclaimedEarnings = BigInt.fromI32(0);
    shareHolderTo.redeemedEarnings = BigInt.fromI32(0);
  } else {
    // TODO: This is adding all songshares independently of the wrapped song. Does it make sense?
    shareHolderTo.shares = shareHolderTo.shares.plus(amount);
  }

  // shareHolder is actually going to be related to many wsTokenManagenent,
  // so we don't need this relationship since we have WrappedSongShareHolder Entity.
  shareHolderTo.wsTokenManagement = wsTokenManagement.id;
  shareHolderTo.save();

  const wrappedSongShareHolderToId = wrappedSong.id.concat(to);
  let wrappedSongShareHolderTo = WrappedSongShareHolder.load(
    wrappedSongShareHolderToId
  );
  if (wrappedSongShareHolderTo == null) {
    wrappedSongShareHolderTo = new WrappedSongShareHolder(
      wrappedSongShareHolderToId
    );
    wrappedSongShareHolderTo.wrappedSong = wrappedSong.id;
    wrappedSongShareHolderTo.shareHolder = to;
    wrappedSongShareHolderTo.shares = BigInt.fromI32(0);
    wrappedSongShareHolderTo.lastEpochClaimed = BigInt.fromI32(0);
  }
  wrappedSongShareHolderTo.shares =
    wrappedSongShareHolderTo.shares.plus(amount);

  // const checkpointToId = wrappedSong.id
  //   .concat(to)
  //   .concat(Bytes.fromHexString(event.block.timestamp.toHex()));
  // const checkpointTo = new Checkpoint(checkpointToId);
  // checkpointTo.timestamp = event.block.timestamp;
  // checkpointTo.value = wrappedSongShareHolderTo.shares;
  // checkpointTo.wrappedSongShareHolder = wrappedSongShareHolderTo.id;
  // checkpointTo.save();

  wrappedSongShareHolderTo.save();
}
