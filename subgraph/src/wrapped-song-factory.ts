import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { WrappedSongCreated as WrappedSongCreatedEvent } from "../generated/WrappedSongFactory/WrappedSongFactory";
import { WrappedSong, WSTokenManagement } from "../generated/schema";
import {
  WrappedSongSmartAccount,
  WSTokenManagement as WSTokenManagementTemplate,
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
