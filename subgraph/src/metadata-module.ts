import {
  MetadataCreated as MetadataCreatedEvent,
  MetadataUpdateRequested as MetadataUpdateRequestedEvent,
  MetadataUpdated as MetadataUpdatedEvent,
  MetadataUpdateRejected as MetadataUpdateRejectedEvent,
  MetadataUpdateRequestedNewMetadataStruct,
  MetadataCreatedNewMetadataStruct,
  MetadataUpdatedNewMetadataStruct,
} from "../generated/metadataModule/MetadataModule";
import {
  MetadataUpdateRequest,
  SharesMetadata,
  SongMetadata,
  WrappedSong,
} from "../generated/schema";
import { Attributes as AttributesTemplate } from "../generated/templates";
import { Bytes, log, store } from "@graphprotocol/graph-ts";
import { createMetadata } from "./helper-functions";

// export function handleMetadataCreated(event: MetadataCreatedEvent): void {
//   const wrappedSongId = event.params.wrappedSong;

//   const wrappedSong = WrappedSong.load(wrappedSongId);
//   log.info("DEBUGGGG wrappedSong handle metadatacreated: {}", [
//     wrappedSongId.toHexString(),
//   ]);

//   if (!wrappedSong) {
//     return;
//   }
//   log.info("DEBUGGGG CREATING METADATA inside metadatacreated: {}", [
//     wrappedSongId.toHexString(),
//   ]);

//   createMetadata(wrappedSong, event.params.newMetadata);
//   wrappedSong.save();
// }

export function handleMetadataUpdated(event: MetadataUpdatedEvent): void {
  log.info("DEBUGGGG metadataUpdated: {}", [event.block.hash.toHexString()]);
  const wrappedSongId = event.params.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);

  if (!wrappedSong) {
    return;
  }
  log.info("DEBUGGGG Wrapped songs: {}", [wrappedSongId.toHexString()]);

  let songMetadataId = wrappedSong.songMetadata;
  let sharesMetadataId = wrappedSong.sharesMetadata;

  if (!songMetadataId || !sharesMetadataId) {
    return;
  }

  const metadataUpdateRequestId = wrappedSong.pendingMetadataUpdate;

  if (metadataUpdateRequestId) {
    log.info("DEBUGGGG metadataUpdateRequestId: {}", [
      metadataUpdateRequestId.toHexString(),
    ]);

    const metadataUpdateRequest = MetadataUpdateRequest.load(
      metadataUpdateRequestId
    );
    if (metadataUpdateRequest) {
      const currentSongMetadataId = wrappedSong.songMetadata;
      const currentSharesMetadataId = wrappedSong.sharesMetadata;
      wrappedSong.songMetadata = metadataUpdateRequest.songMetadata;
      wrappedSong.sharesMetadata = metadataUpdateRequest.sharesMetadata;

      cascadeRemoveMetadata(currentSongMetadataId, currentSharesMetadataId);
      wrappedSong.pendingMetadataUpdate = null;
      store.remove(
        "MetadataUpdateRequest",
        metadataUpdateRequestId.toHexString()
      );

      wrappedSong.save();
    }
  } else {
    log.info("DEBUGGGG metadataUpdateddirectly: {}", [
      event.block.hash.toHexString(),
    ]);

    const songMetadataParam = event.params.newMetadata;

    createMetadata(wrappedSong, songMetadataParam);

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
  metadataUpdateRequest.status = "Pending";
  metadataUpdateRequest.createdAt = event.block.timestamp;

  createMetadata(metadataUpdateRequest, event.params.newMetadata);
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
      cascadeRemoveMetadata(
        metadataUpdateRequest.songMetadata,
        metadataUpdateRequest.sharesMetadata
      );
      store.remove(
        "MetadataUpdateRequest",
        metadataUpdateRequestId.toHexString()
      );
      wrappedSong.save();
    }
  }
}

function cascadeRemoveMetadata(
  songMetadataId: string | null,
  sharesMetadataId: string | null
): void {
  if (songMetadataId) {
    const currentSongMetadata = SongMetadata.load(songMetadataId);
    if (currentSongMetadata) {
      const currentSongMetadataId = songMetadataId;
      if (currentSongMetadataId) {
        const currentSongMetadata = SongMetadata.load(currentSongMetadataId);
        if (currentSongMetadata) {
          const attributesIpfsHash = currentSongMetadata.attributesIpfsHash;
          if (attributesIpfsHash) {
            store.remove("Attributes", attributesIpfsHash);
          }
          store.remove("SongMetadata", currentSongMetadataId);
        }
      }
    }
  }
  if (sharesMetadataId) {
    const currentSharesMetadataId = sharesMetadataId;
    if (currentSharesMetadataId) {
      const currentSharesMetadata = SharesMetadata.load(
        currentSharesMetadataId
      );
      if (currentSharesMetadata) {
        store.remove("SharesMetadata", currentSharesMetadataId);
      }
    }
  }
}

// function createMetadata<T, U>(parent: T, songMetadataParam: U): void {
//   log.info("DEBUGGGG createMetadata", []);
//   if (
//     (songMetadataParam instanceof MetadataUpdateRequestedNewMetadataStruct ||
//       songMetadataParam instanceof MetadataCreatedNewMetadataStruct ||
//       songMetadataParam instanceof MetadataUpdatedNewMetadataStruct) &&
//     (parent instanceof WrappedSong || parent instanceof MetadataUpdateRequest)
//   ) {
//     log.info("DEBUGGGG inside create metadata", []);

//     const name = songMetadataParam.name;
//     const description = songMetadataParam.description;
//     const image = songMetadataParam.image;
//     const externalUrl = songMetadataParam.externalUrl;
//     const animationUrl = songMetadataParam.animationUrl;
//     const attributesIpfsHash = songMetadataParam.attributesIpfsHash;
//     const songMetadataId = parent.id.toHexString() + "-songmetadata";
//     let songMetadata = SongMetadata.load(songMetadataId);
//     if (!songMetadata) {
//       songMetadata = new SongMetadata(songMetadataId);
//     }
//     songMetadata.name = name;
//     songMetadata.description = description;
//     songMetadata.image = image;
//     songMetadata.externalUrl = externalUrl;
//     songMetadata.animationUrl = animationUrl;
//     songMetadata.attributesIpfsHash = attributesIpfsHash;
//     songMetadata.attributes = attributesIpfsHash;
//     AttributesTemplate.create(attributesIpfsHash);
//     songMetadata.save();

//     const sharesMetadataId = parent.id.toHexString() + "-sharesmetadata";
//     let sharesMetadata = SharesMetadata.load(sharesMetadataId);
//     if (!sharesMetadata) {
//       sharesMetadata = new SharesMetadata(sharesMetadataId);
//     }
//     sharesMetadata.name = name + " - SongShares";
//     sharesMetadata.image = image;
//     sharesMetadata.save();
//     log.info("DEBUGGGG saving shares metadata to parent: {}", [
//       parent.id.toHexString(),
//     ]);

//     parent.songMetadata = songMetadataId;
//     parent.sharesMetadata = sharesMetadataId;

//     parent.save();
//   }
// }
