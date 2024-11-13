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

// export function handleEarningsUpdated(event: EarningsUpdatedEvent): void {
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
// }

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
