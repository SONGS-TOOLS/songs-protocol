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
  WSTokensCreated,
} from '../generated/templates/WSTokenManagement/WSTokenManagement';

export function handleSharesSaleStarted(event: SharesSaleStarted): void {
  let wsTokenManagementAddress = event.address;
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

  saleOffer.amount = event.params.amount;
  saleOffer.initialAmount = event.params.amount;
  saleOffer.maxPerWallet = event.params.maxSharesPerWallet;
  saleOffer.pricePerShare = event.params.price;
  // saleOffer.updatedAt = event.block.timestamp;

  saleOffer.save();
  wsTokenManagement.saleOffer = saleOffer.id;
  wsTokenManagement.save();
}

export function handleSharesSold(event: SharesSold): void {
  log.info('TRYING TO handleSharesSold', []);
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

    sale.save();

    const shareHolderId = event.params.buyer;
    let shareHolder = ShareHolder.load(shareHolderId);
    if (!shareHolder) {
      shareHolder = new ShareHolder(shareHolderId);
      // shareHolder.holder = event.params.buyer;
      shareHolder.shares = event.params.amount;
      shareHolder.lastUpdated = event.block.timestamp;
      shareHolder.totalEarnings = BigInt.fromI32(0);
      shareHolder.unclaimedEarnings = BigInt.fromI32(0);
      shareHolder.redeemedEarnings = BigInt.fromI32(0);
    } else {
      shareHolder.shares = shareHolder.shares.plus(event.params.amount);
    }

    const wrappedSongShareHolderId = wrappedSongId.concat(shareHolderId);
    let wrappedSongShareHolder = WrappedSongShareHolder.load(
      wrappedSongShareHolderId
    );
    if (!wrappedSongShareHolder) {
      wrappedSongShareHolder = new WrappedSongShareHolder(
        wrappedSongShareHolderId
      );
      wrappedSongShareHolder.wrappedSong = wrappedSong.id;
      wrappedSongShareHolder.shareHolder = shareHolder.id;
      wrappedSongShareHolder.shares = BigInt.fromI32(0);
    }
    let currentShares = wrappedSongShareHolder.shares;
    wrappedSongShareHolder.shares = currentShares.plus(event.params.amount);
    wrappedSongShareHolder.save();
    // shareHolder.wrappedSong = wrappedSong.id;
    shareHolder.wsTokenManagement = wsTokenManagement.id;
    shareHolder.save();

    // Update the active sale offer

    log.info('updating ownershares with {}', [
      event.params.amount.toHexString(),
    ]);
    wrappedSong.ownerShares = wrappedSong.ownerShares.minus(
      event.params.amount
    );
    wrappedSong.save();

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
    }
    // wsTokenManagement.updatedAt = event.block.timestamp;
    activeSaleOffer.save();
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

  // let activeSaleOffer = SaleOffer.load(activeSaleOfferId);

  // if (activeSaleOffer) {
  //   activeSaleOffer.isActive = false;
  //   activeSaleOffer.updatedAt = event.block.timestamp;
  //   activeSaleOffer.save();
  // }
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
