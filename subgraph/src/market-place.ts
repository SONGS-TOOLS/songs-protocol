import { BigInt, log, store } from "@graphprotocol/graph-ts";
import {
  // FundWithdrawal,
  Sale,
  SaleOffer,
  WrappedSong,
  WSTokenManagement,
} from "../generated/schema";
import {
  SharesSaleStarted,
  SharesSold,
  SharesSaleEnded,
  FundsWithdrawn,
} from "../generated/SongSharesMarketPlace/SongSharesMarketPlace";

export function handleSharesSaleStarted(event: SharesSaleStarted): void {
  let wrappedSongId = event.params.wrappedSong;
  const currency = event.params.stableCoinAddress;
  if (!wrappedSongId) {
    return;
  }
  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }
  const wsTokenManagementAddress = wrappedSong.wsTokenManagement;
  const wsTokenManagement = WSTokenManagement.load(wsTokenManagementAddress);
  if (!wsTokenManagement) {
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
  let wrappedSongId = event.params.wrappedSong;
  if (!wrappedSongId) {
    return;
  }
  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }
  const wsTokenManagementAddress = wrappedSong.wsTokenManagement;
  const wsTokenManagement = WSTokenManagement.load(wsTokenManagementAddress);

  if (!wsTokenManagement) {
    return;
  }

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
      store.remove("SaleOffer", activeSaleOfferId.toHexString());
    } else {
      activeSaleOffer.save();
    }
    wsTokenManagement.save();
  }
}

export function handleSharesSaleEnded(event: SharesSaleEnded): void {
  let wrappedSongId = event.params.wrappedSong;
  if (!wrappedSongId) {
    return;
  }
  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }
  const wsTokenManagementAddress = wrappedSong.wsTokenManagement;
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
  store.remove("SaleOffer", activeSaleOfferId.toHexString());
}

export function handleFundsWithdrawn(event: FundsWithdrawn): void {
  let wrappedSongId = event.params.wrappedSong;
  if (!wrappedSongId) {
    return;
  }
  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }
  const wsTokenManagementAddress = wrappedSong.wsTokenManagement;

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
