import { Address, BigInt, Bytes, log, store } from '@graphprotocol/graph-ts';
import {
  Metadata,
  ShareHolder,
  WrappedSong,
  WrappedSongShareHolder,
  WSTokenManagement,
} from '../generated/schema';
import { TokenMetadata as TokenMetadataTemplate } from '../generated/templates';
import {
  // EarningsRedeemed as EarningsRedeemedEvent,
  EarningsUpdated as EarningsUpdatedEvent,
  MetadataUpdated as MetadataUpdatedEvent,
  SongSharesTransferred as SongSharesTransferredEvent,
  // Transfer as TransferEvent,
} from '../generated/templates/WrappedSongSmartAccount/WrappedSongSmartAccount';

export function handleMetadataUpdatedDirectly(
  event: MetadataUpdatedEvent
): void {
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

  if (event.params.tokenId.equals(BigInt.fromI32(0))) {
    const songMetadataUrl = event.params.newMetadata;

    const songIpfsURI =
      songMetadataUrl.split('/ipfs/').length > 1
        ? songMetadataUrl.split('/ipfs/')[1]
        : null;

    const oldSongUri = metadata.songCID;
    if (oldSongUri) {
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

  metadata.save();
  wrappedSong.metadata = metadataId;
  wrappedSong.save();
}

// export function handleTransfer(event: TransferEvent): void {
//   let wrappedSongAddress = event.address.toHexString();
//   let wrappedSong = WrappedSong.load(wrappedSongAddress);

//   if (wrappedSong) {
//     updateShareHolder(
//       wrappedSongAddress,
//       event.params.from,
//       event.params.value.neg(),
//       event.block.timestamp
//     );
//     updateShareHolder(
//       wrappedSongAddress,
//       event.params.to,
//       event.params.value,
//       event.block.timestamp
//     );

//     // Update total shares if necessary (e.g., for minting or burning)
//     if (event.params.from == Address.zero()) {
//       wrappedSong.totalShares = wrappedSong.totalShares.plus(
//         event.params.value
//       );
//     } else if (event.params.to == Address.zero()) {
//       wrappedSong.totalShares = wrappedSong.totalShares.minus(
//         event.params.value
//       );
//     }

//     wrappedSong.save();
//   }
// }

// function updateShareHolder(
//   wrappedSongAddress: Bytes,
//   holderAddress: Address,
//   amount: BigInt,
//   timestamp: BigInt
// ): void {
//   // let shareHolderId = wrappedSongAddress + '-' + holderAddress.toHexString();
//   let shareHolderId = holderAddress.toHexString();

//   let shareHolder = ShareHolder.load(shareHolderId);

//   if (shareHolder == null) {
//     shareHolder = new ShareHolder(shareHolderId);
//     shareHolder.wrappedSong = wrappedSongAddress;
//     shareHolder.holder = holderAddress;
//     shareHolder.shares = BigInt.fromI32(0);
//   }

//   shareHolder.shares = shareHolder.shares.plus(amount);
//   shareHolder.lastUpdated = timestamp;

//   if (shareHolder.shares.equals(BigInt.fromI32(0))) {
//     store.remove('ShareHolder', shareHolderId);
//   } else {
//     shareHolder.save();
//   }
// }

export function handleEarningsUpdated(event: EarningsUpdatedEvent): void {
  // let shareHolderId = event.address;
  // let shareHolder = ShareHolder.load(shareHolderId);
  // if (shareHolder == null) {
  //   shareHolder = new ShareHolder(shareHolderId);
  //   shareHolder.wrappedSong = event.address;
  //   shareHolder.holder = event.params.account;
  //   shareHolder.shares = BigInt.fromI32(0);
  //   shareHolder.totalEarnings = BigInt.fromI32(0);
  //   shareHolder.unclaimedEarnings = BigInt.fromI32(0);
  //   shareHolder.redeemedEarnings = BigInt.fromI32(0);
  // }
  // shareHolder.totalEarnings = event.params.totalEarnings;
  // shareHolder.unclaimedEarnings = shareHolder.unclaimedEarnings.plus(
  //   event.params.newEarnings
  // );
  // shareHolder.lastUpdated = event.block.timestamp;
  // shareHolder.save();
}

// export function handleEarningsRedeemed(event: EarningsRedeemedEvent): void {
//   let shareHolderId =
//     event.address.toHexString() + '-' + event.params.account.toHexString();
//   let shareHolder = ShareHolder.load(shareHolderId);

//   if (shareHolder != null) {
//     shareHolder.unclaimedEarnings = BigInt.fromI32(0);
//     shareHolder.redeemedEarnings = shareHolder.redeemedEarnings.plus(
//       event.params.amount
//     );
//     shareHolder.lastUpdated = event.block.timestamp;

//     shareHolder.save();
//   }
// }
