import { BigInt, Bytes, log } from '@graphprotocol/graph-ts';
import { WrappedSongCreated as WrappedSongCreatedEvent } from '../generated/WrappedSongFactory/WrappedSongFactory';
import { WrappedSong, WSTokenManagement } from '../generated/schema';
import {
  WrappedSongSmartAccount,
  WSTokenManagement as WSTokenManagementTemplate,
  Attributes as AttributesTemplate,
} from '../generated/templates';

export function handleWrappedSongCreated(event: WrappedSongCreatedEvent): void {
  const wrappedSongId = event.params.wrappedSongSmartAccount;
  let wrappedSong = new WrappedSong(wrappedSongId);
  wrappedSong.creator = event.params.owner;
  wrappedSong.status = 'Created';
  wrappedSong.address = wrappedSongId;

  //TODO: Remove this once we have a real stablecoin
  wrappedSong.stablecoinAddress = Bytes.fromHexString(
    '0x0000000000000000000000000000000000000000'
  );
  wrappedSong.createdAt = event.block.timestamp;
  wrappedSong.releasedAt = null;
  wrappedSong.totalShares = BigInt.fromI32(10000);
  wrappedSong.creatorShares = BigInt.fromI32(10000);
  wrappedSong.isAuthentic = false;

  const wsTokenManagement = new WSTokenManagement(
    event.params.wsTokenManagement
  );

  wsTokenManagement.wrappedSong = wrappedSongId;
  wsTokenManagement.saleActive = false;
  wsTokenManagement.save();
  WSTokenManagementTemplate.create(event.params.wsTokenManagement);
  wrappedSong.wsTokenManagement = event.params.wsTokenManagement;
  wrappedSong.save();

  // Create a new instance of the WrappedSongSmartAccount template
  WrappedSongSmartAccount.create(wrappedSongId);
}
