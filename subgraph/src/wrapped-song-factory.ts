import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { WrappedSongCreated as WrappedSongCreatedEvent, WrappedSongMigrated as WrappedSongMigratedEvent } from "../generated/WrappedSongFactory/WrappedSongFactory";
import { MetadataUpdateRequest, ReleaseRequest, SharesMetadata, SongMetadata, WrappedSong, WrappedSongShareHolder, WSTokenManagement } from "../generated/schema";
import {
  WrappedSongSmartAccount,
  WSTokenManagement as WSTokenManagementTemplate,
  Attributes as AttributesTemplate,
} from "../generated/templates";
import { createMetadata } from "./helper-functions";

export function handleWrappedSongCreated(event: WrappedSongCreatedEvent): void {
  const wrappedSongId = event.params.wrappedSongSmartAccount;
  let wrappedSong = new WrappedSong(wrappedSongId);




  wrappedSong.creator = event.params.owner;
  wrappedSong.status = "Created";
  wrappedSong.address = wrappedSongId;
  wrappedSong.stablecoinAddress = event.params.stablecoin;
  wrappedSong.createdAt = event.block.timestamp;
  wrappedSong.releasedAt = null;
  wrappedSong.totalShares = BigInt.fromI32(10000);
  wrappedSong.creatorShares = BigInt.fromI32(10000);
  wrappedSong.isAuthentic = false;
  wrappedSong.accumulatedFunds = BigInt.fromI32(0);

  const wsTokenManagement = new WSTokenManagement(
    event.params.wsTokenManagement
  );

  wsTokenManagement.wrappedSong = wrappedSongId;
  wsTokenManagement.saleActive = false;
  wsTokenManagement.previousSaleAmount = BigInt.fromI32(0);
  wsTokenManagement.totalSold = BigInt.fromI32(0);
  wsTokenManagement.totalSoldFree = BigInt.fromI32(0);
  wsTokenManagement.totalSoldPaid = BigInt.fromI32(0);
  wsTokenManagement.save();
  WSTokenManagementTemplate.create(event.params.wsTokenManagement);
  wrappedSong.wsTokenManagement = event.params.wsTokenManagement;

  const metadata = event.params.metadata;

  createMetadata(wrappedSong, metadata);

  wrappedSong.save();

  // Create a new instance of the WrappedSongSmartAccount template
  WrappedSongSmartAccount.create(wrappedSongId);
}

export function handleWrappedSongMigrated(event: WrappedSongMigratedEvent): void {
  const oldWrappedSongId = event.params.oldWrappedSong;
  const newWrappedSongId = event.params.newWrappedSong;
  const newWsTokenManagementId= event.params.wsTokenManagement;
  const newWrappedSong = new WrappedSong(newWrappedSongId);
  const oldWrappedSong = WrappedSong.load(oldWrappedSongId);
  if(oldWrappedSong){
    newWrappedSong.address = newWrappedSongId;
    newWrappedSong.creator = oldWrappedSong.creator;
    newWrappedSong.status = oldWrappedSong.status;
    newWrappedSong.stablecoinAddress = oldWrappedSong.stablecoinAddress;
    newWrappedSong.createdAt = oldWrappedSong.createdAt;
    newWrappedSong.releasedAt = oldWrappedSong.releasedAt;
    newWrappedSong.totalShares = oldWrappedSong.totalShares;
    newWrappedSong.creatorShares = oldWrappedSong.creatorShares;
    newWrappedSong.isAuthentic = oldWrappedSong.isAuthentic;
    newWrappedSong.wsIndex = oldWrappedSong.wsIndex;

    //SONG METADATA

    if(oldWrappedSong.songMetadata){
      const id = oldWrappedSong.songMetadata as string;
      const oldSongMetadata = SongMetadata.load(id);
      if(oldSongMetadata){
        newWrappedSong.songMetadata = oldSongMetadata.id;
      }
    }

    //SHARES METADATA

    if(oldWrappedSong.sharesMetadata !== null){
      const id = oldWrappedSong.sharesMetadata as string;
      const oldSharesMetadata = SharesMetadata.load(id);
      if(oldSharesMetadata){
        newWrappedSong.sharesMetadata = oldSharesMetadata.id;
      }
    }

    //PENDING METADATA UPDATE

    if(oldWrappedSong.pendingMetadataUpdate !== null){
      const id = oldWrappedSong.pendingMetadataUpdate as Bytes;
      const oldPendingMetadataUpdate = MetadataUpdateRequest.load(id);
      if(oldPendingMetadataUpdate){
        newWrappedSong.pendingMetadataUpdate = oldPendingMetadataUpdate.id;
      }
    }

    //RELEASE REQUEST

    if(oldWrappedSong.releaseRequest !== null){
      const id = oldWrappedSong.releaseRequest as Bytes;
      const oldReleaseRequest = ReleaseRequest.load(id);
      if(oldReleaseRequest){
        newWrappedSong.releaseRequest = oldReleaseRequest.id;
      }
    }

    //SHAREHOLDERS

    if(oldWrappedSong.shareholders){
      const oldShareholders = oldWrappedSong.shareholders.load();
      for(let i = 0; i < oldShareholders.length; i++){
        const oldShareholder = oldShareholders[i];
        if(oldShareholder){
          const newWrappedSongShareHolderId = newWrappedSongId.concat(oldShareholder.shareHolder);
          const newWrappedSongShareHolder = new WrappedSongShareHolder(newWrappedSongShareHolderId);
          newWrappedSongShareHolder.wrappedSong = newWrappedSongId;
          newWrappedSongShareHolder.shareHolder = oldShareholder.shareHolder;
          newWrappedSongShareHolder.shares = oldShareholder.shares;
          newWrappedSongShareHolder.sharesBought = oldShareholder.sharesBought;
          newWrappedSongShareHolder.lastEpochClaimed = oldShareholder.lastEpochClaimed;
          newWrappedSongShareHolder.save();
        }
      }
    }

    //WS TOKEN MANAGEMENT
    const oldWsTokenManagement = WSTokenManagement.load(oldWrappedSong.wsTokenManagement);
    if(oldWsTokenManagement){
      const wsTokenManagement = new WSTokenManagement(
        newWsTokenManagementId
      );
      wsTokenManagement.previousSaleAmount = oldWsTokenManagement.previousSaleAmount;
      wsTokenManagement.wrappedSong = newWrappedSongId;
      wsTokenManagement.saleActive = oldWsTokenManagement.saleActive;
      wsTokenManagement.saleOffer = oldWsTokenManagement.saleOffer;
      wsTokenManagement.save();
      WSTokenManagementTemplate.create(newWsTokenManagementId);

      newWrappedSong.wsTokenManagement = newWsTokenManagementId;
      WrappedSongSmartAccount.create(newWrappedSongId);
    }
  }
}
