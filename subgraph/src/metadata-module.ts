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
  const wrappedSongId = event.params.wrappedSong;
  const wrappedSong = WrappedSong.load(wrappedSongId);

  if (!wrappedSong) {
    return;
  }

  let songMetadataId = wrappedSong.songMetadata;
  let sharesMetadataId = wrappedSong.sharesMetadata;

  if (!songMetadataId || !sharesMetadataId) {
    return;
  }

  const metadataUpdateRequestId = wrappedSong.pendingMetadataUpdate;

  if (metadataUpdateRequestId) {
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
  const metadataUpdateRequestId = event.transaction.hash;
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
