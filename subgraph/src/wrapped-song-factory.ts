import {
  WrappedSongCreated as WrappedSongCreatedEvent,
  WrappedSongCreatedWithMetadata as WrappedSongCreatedWithMetadataEvent,
} from '../generated/WrappedSongFactory/WrappedSongFactory';
import { Metadata, WrappedSong } from '../generated/schema';
import { WrappedSongSmartAccount } from '../generated/templates';
import { TokenMetadata as TokenMetadataTemplate } from '../generated/templates';

export function handleWrappedSongCreated(event: WrappedSongCreatedEvent): void {
  const wrappedSongId = event.params.wrappedSongSmartAccount;
  let wrappedSong = new WrappedSong(wrappedSongId);
  wrappedSong.creator = event.params.owner;
  wrappedSong.status = 'Created';
  wrappedSong.address = wrappedSongId;
  wrappedSong.stablecoinAddress = event.params.stablecoin;
  wrappedSong.createdAt = event.block.timestamp;
  wrappedSong.releasedAt = null;
  wrappedSong.save();

  // Create a new instance of the WrappedSongSmartAccount template
  WrappedSongSmartAccount.create(wrappedSongId);
}

export function handleWrappedSongCreatedWithMetadata(
  event: WrappedSongCreatedWithMetadataEvent
): void {
  //IN THE CURRENT LOGIC, THE WRAPPED SONG WILL EXIST ALREADY AND THE WRAPPED SONG CREATED EVENT WILL HAVE BEEN TRIGGERED
  const wrappedSongId = event.params.wrappedSongSmartAccount;
  const wrappedSong = WrappedSong.load(wrappedSongId);
  if (!wrappedSong) {
    return;
  }

  let metadataId = wrappedSongId.toHexString() + '-metadata';
  let metadata = new Metadata(metadataId);

  wrappedSong.sharesAmount = event.params.sharesAmount;

  const songMetadataUrl = event.params.songURI;
  const sharesMetadataUrl = event.params.sharesURI;

  //Check if the songURI is a URL and if it is, extract CID from it, otherwise, it's a CID

  const songIpfsURI = songMetadataUrl.split('/ipfs/')[1];
  if (songIpfsURI) {
    metadata.songURI = songIpfsURI;
    TokenMetadataTemplate.create(songIpfsURI);
  } else if (songMetadataUrl.startsWith('Qm')) {
    metadata.songURI = songMetadataUrl;
    TokenMetadataTemplate.create(songMetadataUrl);
  } else {
    metadata.songURI = songMetadataUrl;
  }

  const sharesIpfsURI = sharesMetadataUrl.split('/ipfs/')[1];
  if (sharesIpfsURI) {
    metadata.sharesURI = sharesIpfsURI;
    TokenMetadataTemplate.create(sharesIpfsURI);
  } else if (sharesMetadataUrl.startsWith('Qm')) {
    metadata.sharesURI = sharesMetadataUrl;
    TokenMetadataTemplate.create(sharesMetadataUrl);
  } else {
    metadata.sharesURI = sharesMetadataUrl;
  }

  metadata.save();

  wrappedSong.metadata = metadataId;
  wrappedSong.save();
}

// Remove handleWrappedSongCreatedWithMetadata as it's no longer used
