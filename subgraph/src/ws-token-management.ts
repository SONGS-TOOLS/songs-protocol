import { BigInt, log, store } from '@graphprotocol/graph-ts';
import {
  // FundWithdrawal,
  Sale,
  SaleOffer,
  ShareHolder,
  WrappedSong,
  WrappedSongShareHolder,
  WSTokenManagement,
} from '../generated/schema';
import {
  FundsWithdrawn,
  SharesSaleEnded,
  SharesSaleStarted,
  SharesSold,
  TransferSingle as TransferSingleEvent,
} from '../generated/templates/WSTokenManagement/WSTokenManagement';

export function handleSharesSaleStarted(event: SharesSaleStarted): void {
  let wsTokenManagementAddress = event.address;
  const currency = event.params.stableCoinAddress;
  const wsTokenManagement = WSTokenManagement.load(wsTokenManagementAddress);
  if (!wsTokenManagement) {
    return;
  }

  const wrappedSongId = wsTokenManagement.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }
  const currentSaleOfferId = wsTokenManagement.saleOffer;

  let saleOffer: SaleOffer | null;
  if (currentSaleOfferId) {
    saleOffer = SaleOffer.load(currentSaleOfferId);
    if (!saleOffer) {
      return;
    }
  } else {
    let saleOfferId = event.block.hash;
    saleOffer = new SaleOffer(saleOfferId);
    saleOffer.createdAt = event.block.timestamp;
  }
  saleOffer.currency = currency;
  saleOffer.amount = event.params.amount;
  saleOffer.initialAmount = event.params.amount;
  saleOffer.maxPerWallet = event.params.maxSharesPerWallet;
  saleOffer.pricePerShare = event.params.price;
  saleOffer.currency = event.params.stableCoinAddress;
  // saleOffer.updatedAt = event.block.timestamp;

  saleOffer.save();
  wsTokenManagement.saleOffer = saleOffer.id;
  wsTokenManagement.save();
}

export function handleSharesSold(event: SharesSold): void {
  let wsTokenManagementAddress = event.address;
  const wsTokenManagement = WSTokenManagement.load(wsTokenManagementAddress);

  if (!wsTokenManagement) {
    return;
  }

  const wrappedSongId = wsTokenManagement.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);

  if (wrappedSong) {
    let saleId = event.block.hash;
    let sale = new Sale(saleId);
    sale.buyer = event.params.buyer;
    sale.amount = event.params.amount;
    sale.wsTokenManagement = wsTokenManagement.id;

    // Why not? Why do we need to have pricePerShare in a sale?
    sale.pricePerShare = BigInt.fromI32(0); // We don't have access to the price in this event
    sale.timestamp = event.block.timestamp;
    const saleOfferId = wsTokenManagement.saleOffer;
    if (saleOfferId) {
      const saleOffer = SaleOffer.load(saleOfferId);
      if (saleOffer) {
        sale.currency = saleOffer.currency;
      }
    }

    sale.save();

    let activeSaleOfferId = wsTokenManagement.saleOffer;
    if (!activeSaleOfferId) {
      return;
    }
    let activeSaleOffer = SaleOffer.load(activeSaleOfferId);
    if (!activeSaleOffer) {
      return;
    }
    activeSaleOffer.amount = activeSaleOffer.amount.minus(event.params.amount);
    if (activeSaleOffer.amount.equals(BigInt.fromI32(0))) {
      wsTokenManagement.saleActive = false;
      wsTokenManagement.saleOffer = null;
      store.remove('SaleOffer', activeSaleOfferId.toHexString());
    } else {
      activeSaleOffer.save();
    }
    wsTokenManagement.save();
  }
}

export function handleSharesSaleEnded(event: SharesSaleEnded): void {
  let wsTokenManagementAddress = event.address;
  const wsTokenManagement = WSTokenManagement.load(wsTokenManagementAddress);
  if (!wsTokenManagement) {
    return;
  }
  let activeSaleOfferId = wsTokenManagement.saleOffer;

  if (!activeSaleOfferId) {
    return;
  }

  wsTokenManagement.saleActive = false;
  wsTokenManagement.saleOffer = null;
  wsTokenManagement.save();
  store.remove('SaleOffer', activeSaleOfferId.toHexString());
}

export function handleFundsWithdrawn(event: FundsWithdrawn): void {
  let wsTokenManagementAddress = event.address;
  let wrappedSong = WrappedSong.load(wsTokenManagementAddress);

  if (wrappedSong) {
    // let withdrawalId =
    //   wsTokenManagementAddress + '-' + event.transaction.hash.toHexString();
    // let withdrawal = new FundWithdrawal(withdrawalId);
    // withdrawal.wrappedSong = wrappedSong.id;
    // withdrawal.to = event.params.to;
    // withdrawal.amount = event.params.amount;
    // withdrawal.timestamp = event.block.timestamp;
    // withdrawal.save();
  }
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  const from = event.params.from;
  const to = event.params.to;
  const amount = event.params.value;
  const tokenId = event.params.id;
  log.info('Event params value: {}, from: {}, to: {}, tokenId: {}', [
    event.params.value.toString(),
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.id.toHexString(),
  ]);
  if (tokenId.toHexString() != '0x1') {
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
  }
  wrappedSongShareHolderTo.shares =
    wrappedSongShareHolderTo.shares.plus(amount);
  wrappedSongShareHolderTo.save();

  if (from.toHexString() != '0x0000000000000000000000000000000000000000') {
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
    }
    wrappedSongShareHolderFrom.shares =
      wrappedSongShareHolderFrom.shares.minus(amount);
    wrappedSongShareHolderFrom.save();
    if (wrappedSongShareHolderFrom.shares.equals(BigInt.fromI32(0))) {
      store.remove(
        'WrappedSongShareHolder',
        wrappedSongShareHolderFrom.id.toHexString()
      );
    }
  }
}
