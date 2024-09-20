import { BigInt, log, store } from '@graphprotocol/graph-ts';
import { Metadata, WrappedSong } from '../generated/schema';
import { MetadataUpdated as MetadataUpdatedEvent } from '../generated/templates/WrappedSongSmartAccount/WrappedSongSmartAccount';
import { TokenMetadata as TokenMetadataTemplate } from '../generated/templates';

export function handleMetadataUpdatedDirectly(
  event: MetadataUpdatedEvent
): void {
  log.info('TRYING TO HANDLE METADATA UPDATED DIRECTLY', []);

  const wrappedSongId = event.address;
  const wrappedSong = WrappedSong.load(wrappedSongId);

  if (!wrappedSong) {
    // If the WrappedSong doesn't exist, we can't update its metadata
    return;
  }

  //TODO: Review this. Since in handleWrappedSongCreated there is no metadata, we could have a wrapped song
  //with no metadata and should be created here.
  let metadataId = wrappedSong.metadata;

  let metadata: Metadata | null;
  if (!metadataId) {
    metadataId = wrappedSongId.toHexString() + '-metadata';
    metadata = new Metadata(metadataId);
  } else {
    // If i don't do this redundant check the compiler throws an error
    if (metadataId) {
      metadata = Metadata.load(metadataId);
      if (!metadata) {
        return;
      }
    } else {
      return;
    }

    // metadata = Metadata.load(metadataId);
    // if (!metadata) {
    //   return;
    // }
  }

  //TODO change protocol so that handleMetadataUpdate will take both uris like in create

  log.info('tokenId: {}', [event.params.tokenId.toString()]);
  if (event.params.tokenId.equals(BigInt.fromI32(0))) {
    const songMetadataUrl = event.params.newMetadata;

    const songIpfsURI =
      songMetadataUrl.split('/ipfs/').length > 1
        ? songMetadataUrl.split('/ipfs/')[1]
        : null;

    const oldSongUri = metadata.songCID;
    if (oldSongUri) {
      log.debug(
        'METADATA UPDATED DIRECTLY: REMOVING OLD METADATA SONG URI:{}',
        [oldSongUri]
      );
      store.remove('TokenMetadata', oldSongUri);
    }
    if (songIpfsURI) {
      metadata.songURI = songIpfsURI;
      metadata.songCID = songIpfsURI;
      TokenMetadataTemplate.create(songIpfsURI);
    } else if (songMetadataUrl.startsWith('Qm')) {
      metadata.songURI = songMetadataUrl;
      metadata.songCID = songMetadataUrl;
      TokenMetadataTemplate.create(songMetadataUrl);
    } else {
      metadata.songURI = songMetadataUrl;
      metadata.songCID = songMetadataUrl;
    }
  } else if (event.params.tokenId.equals(BigInt.fromI32(1))) {
    const sharesMetadataUrl = event.params.newMetadata;
    const sharesIpfsURI =
      sharesMetadataUrl.split('/ipfs/').length > 1
        ? sharesMetadataUrl.split('/ipfs/')[1]
        : null;

    const oldSharesUri = metadata.sharesCID;
    if (oldSharesUri) {
      log.debug(
        'METADATA UPDATED DIRECTLY: REMOVING OLD METADATA SHARES URI:{}',
        [oldSharesUri]
      );
      store.remove('TokenMetadata', oldSharesUri);
    }
    if (sharesIpfsURI) {
      metadata.sharesURI = sharesIpfsURI;
      metadata.sharesCID = sharesIpfsURI;
      TokenMetadataTemplate.create(sharesIpfsURI);
    } else if (sharesMetadataUrl.startsWith('Qm')) {
      metadata.sharesURI = sharesMetadataUrl;
      metadata.sharesCID = sharesMetadataUrl;
      TokenMetadataTemplate.create(sharesMetadataUrl);
    } else {
      metadata.sharesURI = sharesMetadataUrl;
      metadata.sharesCID = sharesMetadataUrl;
    }
  }
  log.info('SAVING', []);

  metadata.save();
  wrappedSong.metadata = metadataId;
  wrappedSong.save();
}
