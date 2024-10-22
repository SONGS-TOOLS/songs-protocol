import {
  MetadataCreated as MetadataCreatedEvent,
  MetadataUpdateRequested as MetadataUpdateRequestedEvent,
  MetadataUpdated as MetadataUpdatedEvent,
  MetadataUpdateRejected as MetadataUpdateRejectedEvent,
  MetadataUpdateRequestedNewMetadataStruct,
  MetadataCreatedNewMetadataStruct,
  MetadataUpdatedNewMetadataStruct,
} from '../generated/templates/MetadataModule/MetadataModule';
import {
  Metadata,
  MetadataUpdateRequest,
  SharesMetadata,
  SongMetadata,
  WrappedSong,
} from '../generated/schema';
import { Attributes as AttributesTemplate } from '../generated/templates';
import { log, store } from '@graphprotocol/graph-ts';

export function handleMetadataCreated(event: MetadataCreatedEvent): void {
  const wrappedSongId = event.params.wrappedSong;

  const wrappedSong = WrappedSong.load(wrappedSongId);
  log.info('DEBUGGGG wrappedSong: {}', [wrappedSongId.toHexString()]);

  if (!wrappedSong) {
    return;
  }

  let metadataId = event.block.hash.toHexString();
  createMetadata(metadataId, event.params.newMetadata);

  wrappedSong.metadata = metadataId;
  wrappedSong.save();
}

export function handleMetadataUpdated(event: MetadataUpdatedEvent): void {
  log.info('DEBUGGGG metadataUpdated: {}', [event.block.hash.toHexString()]);
  const wrappedSongId = event.params.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);

  if (!wrappedSong) {
    return;
  }
  log.info('DEBUGGGG Wrapped songs: {}', [wrappedSongId.toHexString()]);

  let metadataId = wrappedSong.metadata;

  if (!metadataId) {
    return;
  }

  const metadataUpdateRequestId = wrappedSong.pendingMetadataUpdate;

  if (metadataUpdateRequestId) {
    log.info('DEBUGGGG metadataUpdateRequestId: {}', [
      metadataUpdateRequestId.toHexString(),
    ]);

    const metadataUpdateRequest = MetadataUpdateRequest.load(
      metadataUpdateRequestId
    );
    if (metadataUpdateRequest) {
      const currentMetadataId = wrappedSong.metadata;
      wrappedSong.metadata = metadataUpdateRequest.newMetadata;

      cascadeRemoveMetadata(currentMetadataId);
      wrappedSong.pendingMetadataUpdate = null;
      store.remove(
        'MetadataUpdateRequest',
        metadataUpdateRequestId.toHexString()
      );

      wrappedSong.save();
    }
  } else {
    log.info('DEBUGGGG metadataUpdateddirectly: {}', [
      event.block.hash.toHexString(),
    ]);

    const songMetadataParam = event.params.newMetadata;

    createMetadata(metadataId, songMetadataParam);

    wrappedSong.save();
  }
}

export function handleMetadataUpdateRequested(
  event: MetadataUpdateRequestedEvent
): void {
  const wrappedSongId = event.params.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);

  if (!wrappedSong) {
    return;
  }
  const metadataUpdateRequestId = event.block.hash;
  const metadataUpdateRequest = new MetadataUpdateRequest(
    metadataUpdateRequestId
  );
  metadataUpdateRequest.status = 'Pending';
  metadataUpdateRequest.createdAt = event.block.timestamp;
  let metadataId = metadataUpdateRequestId.toHexString() + '-metadata';

  createMetadata(metadataId, event.params.newMetadata);
  metadataUpdateRequest.newMetadata = metadataId;
  metadataUpdateRequest.save();

  wrappedSong.pendingMetadataUpdate = metadataUpdateRequestId;
  wrappedSong.save();
}

export function handleMetadataUpdateRejected(
  event: MetadataUpdateRejectedEvent
): void {
  const wrappedSongId = event.params.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);

  if (!wrappedSong) {
    return;
  }
  const metadataUpdateRequestId = wrappedSong.pendingMetadataUpdate;
  if (metadataUpdateRequestId) {
    const metadataUpdateRequest = MetadataUpdateRequest.load(
      metadataUpdateRequestId
    );
    if (metadataUpdateRequest) {
      wrappedSong.pendingMetadataUpdate = null;
      cascadeRemoveMetadata(metadataUpdateRequest.newMetadata);
      store.remove(
        'MetadataUpdateRequest',
        metadataUpdateRequestId.toHexString()
      );
      wrappedSong.save();
    }
  }
}

function cascadeRemoveMetadata(metadataId: string | null): void {
  if (metadataId) {
    const currentMetadata = Metadata.load(metadataId);
    if (currentMetadata) {
      const currentSongMetadataId = currentMetadata.songMetadata;
      if (currentSongMetadataId) {
        const currentSongMetadata = SongMetadata.load(currentSongMetadataId);
        if (currentSongMetadata) {
          const attributesIpfsHash = currentSongMetadata.attributesIpfsHash;
          if (attributesIpfsHash) {
            store.remove('Attributes', attributesIpfsHash);
          }
          store.remove('SongMetadata', currentSongMetadataId);
        }
      }

      const currentSharesMetadataId = currentMetadata.sharesMetadata;
      if (currentSharesMetadataId) {
        const currentSharesMetadata = SharesMetadata.load(
          currentSharesMetadataId
        );
        if (currentSharesMetadata) {
          store.remove('SharesMetadata', currentSharesMetadataId);
        }
      }
      store.remove('Metadata', metadataId);
    }
  }
}

function createMetadata<T>(
  metadataId: string | null,
  songMetadataParam: T
): void {
  if (
    (songMetadataParam instanceof MetadataUpdateRequestedNewMetadataStruct ||
      songMetadataParam instanceof MetadataCreatedNewMetadataStruct ||
      songMetadataParam instanceof MetadataUpdatedNewMetadataStruct) &&
    metadataId !== null
  ) {
    let metadata = Metadata.load(metadataId);
    if (!metadata) {
      metadata = new Metadata(metadataId);
    }
    const name = songMetadataParam.name;
    const description = songMetadataParam.description;
    const image = songMetadataParam.image;
    const externalUrl = songMetadataParam.externalUrl;
    const animationUrl = songMetadataParam.animationUrl;
    const attributesIpfsHash = songMetadataParam.attributesIpfsHash;
    const songMetadataId = metadataId + '-song';
    let songMetadata = SongMetadata.load(songMetadataId);
    if (!songMetadata) {
      songMetadata = new SongMetadata(songMetadataId);
    }
    songMetadata.name = name;
    songMetadata.description = description;
    songMetadata.image = image;
    songMetadata.externalUrl = externalUrl;
    songMetadata.animationUrl = animationUrl;
    songMetadata.attributesIpfsHash = attributesIpfsHash;
    songMetadata.attributes = attributesIpfsHash;
    AttributesTemplate.create(attributesIpfsHash);
    songMetadata.save();

    const sharesMetadataId = metadataId + '-shares';
    let sharesMetadata = SharesMetadata.load(sharesMetadataId);
    if (!sharesMetadata) {
      sharesMetadata = new SharesMetadata(sharesMetadataId);
    }
    sharesMetadata.name = name + ' - SongShares';
    sharesMetadata.image = image;
    sharesMetadata.save();

    metadata.songMetadata = songMetadataId;
    metadata.sharesMetadata = sharesMetadataId;
    metadata.save();
  }
}
