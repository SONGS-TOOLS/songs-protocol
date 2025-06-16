import { BigInt, log, store } from "@graphprotocol/graph-ts";
import {
  // FundWithdrawal,
  Sale,
  SaleOffer,
  ShareHolder,
  WrappedSong,
  WrappedSongShareHolder,
  WSTokenManagement,
  WrappedSongBuyer,
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
    let saleOfferId = event.transaction.hash;
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
  wsTokenManagement.soldout = false;
  wsTokenManagement.isFree = event.params.price.equals(BigInt.fromI32(0)) ? true : false;
  wsTokenManagement.previousSaleAmount = event.params.amount;
  wsTokenManagement.save();
}

export function handleSharesSold(event: SharesSold): void {
  let wrappedSongId = event.params.wrappedSong;
  const buyer = event.params.recipient;

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
    const seller = wrappedSong.creator;

    let saleId = event.transaction.hash;
    let sale = new Sale(saleId);
    sale.buyer = event.params.recipient;
    sale.amount = event.params.amount;
    sale.wsTokenManagement = wsTokenManagement.id;

    sale.pricePerShare = event.params.totalCost.div(event.params.amount);
    sale.timestamp = event.block.timestamp;
    sale.currency = event.params.paymentToken;

    sale.save();

    wrappedSong.accumulatedFunds = wrappedSong.accumulatedFunds.plus(
      event.params.totalCost
    );
    wrappedSong.save();



    wsTokenManagement.previousSaleAmount = wsTokenManagement.previousSaleAmount.minus(event.params.amount);
    if (wsTokenManagement.previousSaleAmount.equals(BigInt.fromI32(0))) {
      wsTokenManagement.soldout = true;
    }

    if(event.params.totalCost.equals(BigInt.fromI32(0))) {
      wsTokenManagement.totalSoldFree = wsTokenManagement.totalSoldFree.plus(event.params.amount);
    } else {
      wsTokenManagement.totalSoldPaid = wsTokenManagement.totalSoldPaid.plus(event.params.amount);
    }
    wsTokenManagement.totalSold = wsTokenManagement.totalSold.plus(event.params.amount);
    wsTokenManagement.lastSaleAt = event.block.timestamp;

    

    let shareHolderFrom = ShareHolder.load(seller);

    if (shareHolderFrom != null) {
      shareHolderFrom.sharesSold = shareHolderFrom.sharesSold.plus(event.params.amount);
      shareHolderFrom.save();
    }

    let shareHolderTo = ShareHolder.load(buyer);
    if (shareHolderTo == null) {
      shareHolderTo = new ShareHolder(buyer);
      shareHolderTo.shares = BigInt.fromI32(0);
      shareHolderTo.sharesBought = BigInt.fromI32(0);
      shareHolderTo.lastUpdated = event.block.timestamp;
      shareHolderTo.totalEarnings = BigInt.fromI32(0);
      shareHolderTo.unclaimedEarnings = BigInt.fromI32(0);
      shareHolderTo.redeemedEarnings = BigInt.fromI32(0);
    }

    shareHolderTo.sharesBought = shareHolderTo.sharesBought.plus(event.params.amount);

    shareHolderTo.wsTokenManagement = wsTokenManagement.id;
    shareHolderTo.save();


    const wrappedSongShareHolderToId = wrappedSong.id.concat(buyer);
    let wrappedSongShareHolderTo = WrappedSongShareHolder.load(
      wrappedSongShareHolderToId
    );

    if (wrappedSongShareHolderTo == null) {
      wrappedSongShareHolderTo = new WrappedSongShareHolder(
        wrappedSongShareHolderToId
      );
      wrappedSongShareHolderTo.wrappedSong = wrappedSong.id;
      wrappedSongShareHolderTo.shareHolder = buyer;
      wrappedSongShareHolderTo.shares = BigInt.fromI32(0);
      wrappedSongShareHolderTo.sharesBought = BigInt.fromI32(0);
      wrappedSongShareHolderTo.lastEpochClaimed = BigInt.fromI32(0);
    }
    wrappedSongShareHolderTo.sharesBought =
      wrappedSongShareHolderTo.sharesBought.plus(event.params.amount);
    wrappedSongShareHolderTo.save();


    const wrappedSongBuyerId = wrappedSong.id.concat(buyer);
    let wrappedSongBuyer = WrappedSongBuyer.load(
      wrappedSongBuyerId
    );

    if (wrappedSongBuyer == null) {
      wrappedSongBuyer = new WrappedSongBuyer(
        wrappedSongBuyerId
      );
      wrappedSongBuyer.wrappedSong = wrappedSong.id;
      wrappedSongBuyer.shareHolder = buyer;
      wrappedSongBuyer.sharesBought = BigInt.fromI32(0);
    }
    wrappedSongBuyer.sharesBought =
      wrappedSongBuyer.sharesBought.plus(event.params.amount);
    wrappedSongBuyer.save();

    let activeSaleOfferId = wsTokenManagement.saleOffer;
    if (activeSaleOfferId) {
      let activeSaleOffer = SaleOffer.load(activeSaleOfferId);
      if (activeSaleOffer) {
        activeSaleOffer.amount = activeSaleOffer.amount.minus(event.params.amount);
        if (activeSaleOffer.amount.equals(BigInt.fromI32(0))) {
          wsTokenManagement.saleActive = false;
          store.remove("SaleOffer", activeSaleOfferId.toHexString());
        } else {
          activeSaleOffer.save();
        }
      }
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
    wrappedSong.accumulatedFunds = wrappedSong.accumulatedFunds.minus(
      event.params.amount
    );
    wrappedSong.save();
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
