# Protocol Documentation

## Overview

This documentation provides a comprehensive guide to the protocol's smart contracts, focusing on the functions that are externally or publicly accessible. The protocol is designed to manage and interact with wrapped songs, distributors, and various modules within the ecosystem. The primary contracts include `WhitelistingManager`, `DistributorWallet`, `DistributorWalletFactory`, `ProtocolModule`, `WrappedSongFactory`, `WrappedSongSmartAccount`, and `WSTokensManagement`.

### Understanding the Protocol

The protocol is structured to facilitate the creation, management, and distribution of wrapped songs. It includes mechanisms for whitelisting creators, managing payments and earnings, and handling the creation and exchange of NFTs and fungible shares. The following sections provide detailed descriptions of each contract and their respective functions.

## ProtocolModule.sol

The `ProtocolModule` contract serves as the central hub for managing the protocol's operations. It handles the creation and release of wrapped songs, manages fees, and interacts with other contracts such as the `WrappedSongFactory` and `DistributorWalletFactory`. This contract ensures that all protocol operations are conducted in a coordinated and secure manner.

### Functions

- **requestWrappedSongRelease(address wrappedSong, address distributor)**
  - Requests the release of a wrapped song by the owner.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `distributor`: The address of the distributor.
  - **Requirements:**
    - Only the owner of the wrapped song can request the release.
    - The wrapped song must not already be released.
    - The distributor must exist.

- **removeWrappedSongReleaseRequest(address wrappedSong)**
  - Removes the release request of a wrapped song by the owner.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
  - **Requirements:**
    - Only the owner of the wrapped song can remove the release request.
    - There must be a pending release request.
    - The distributor must exist.

- **confirmWrappedSongRelease(address wrappedSong)**
  - Confirms the release of a wrapped song by the pending distributor.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
  - **Requirements:**
    - There must be a pending release request.
    - The caller must be a valid distributor.

- **rejectWrappedSongRelease(address wrappedSong)**
  - Rejects the release of a wrapped song by the reviewing distributor.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
  - **Requirements:**
    - The caller must be the reviewing distributor.
    - The review period must not have expired.
    - The distributor must exist.

- **getWrappedSongDistributor(address wrappedSong)**
  - Returns the distributor address for a given wrapped song.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
  - **Returns:** `address`

- **getPendingDistributorRequests(address wrappedSong)**
  - Returns the pending distributor address for a given wrapped song.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
  - **Returns:** `address`

- **setWrappedSongCreationFee(uint256 _fee)**
  - Sets the fee for creating a wrapped song. Only the owner can set the fee.
  - **Parameters:**
    - `_fee`: The new fee for creating a wrapped song.

- **setReleaseFee(uint256 _fee)**
  - Sets the fee for releasing a wrapped song. Only the owner can set the fee.
  - **Parameters:**
    - `_fee`: The new fee for releasing a wrapped song.

- **setDistributorWalletFactory(address _newFactory)**
  - Updates the address of the DistributorWalletFactory contract. Only the owner can update the address.
  - **Parameters:**
    - `_newFactory`: The address of the new DistributorWalletFactory contract.

- **setWhitelistingManager(address _whitelistingManager)**
  - Sets the address of the WhitelistingManager contract. Only the owner can set the address.
  - **Parameters:**
    - `_whitelistingManager`: The address of the new WhitelistingManager contract.

- **addISRC(address wrappedSong, string memory isrc)**
  - Adds an ISRC to the registry for a given wrapped song. Only the owner can add an ISRC.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `isrc`: The ISRC to be added.

- **addUPC(address wrappedSong, string memory upc)**
  - Adds a UPC to the registry for a given wrapped song. Only the owner can add a UPC.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `upc`: The UPC to be added.

- **addISWC(address wrappedSong, string memory iswc)**
  - Adds an ISWC to the registry for a given wrapped song. Only the owner can add an ISWC.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `iswc`: The ISWC to be added.

- **addISCC(address wrappedSong, string memory iscc)**
  - Adds an ISCC to the registry for a given wrapped song. Only the owner can add an ISCC.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `iscc`: The ISCC to be added.

- **requestUpdateMetadata(address wrappedSong, uint256 tokenId, string memory newMetadata)**
  - Requests an update to the metadata.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `tokenId`: The ID of the token to update.
    - `newMetadata`: The new metadata to be set.
  - **Requirements:**
    - Only the WrappedSongSmartAccount can request a metadata update.
    - The wrapped song must be released.

- **confirmUpdateMetadata(address wrappedSong, uint256 tokenId)**
  - Confirms the update to the metadata.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `tokenId`: The ID of the token to update.
  - **Requirements:**
    - Only the distributor can confirm the metadata update.
    - There must be a pending metadata update.

- **rejectUpdateMetadata(address wrappedSong, uint256 tokenId)**
  - Rejects the update to the metadata.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `tokenId`: The ID of the token to update.
  - **Requirements:**
    - Only the distributor can reject the metadata update.

- **getPendingMetadataUpdate(address wrappedSong, uint256 tokenId)**
  - Retrieves the pending metadata update for a specific token ID.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `tokenId`: The ID of the token.
  - **Returns:** `string`

- **isMetadataUpdateConfirmed(address wrappedSong, uint256 tokenId)**
  - Checks if the metadata update is confirmed for a specific token ID.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `tokenId`: The ID of the token.
  - **Returns:** `bool`

- **isReleased(address wrappedSong)**
  - Checks if a wrapped song is released.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
  - **Returns:** `bool`

- **setWrappedSongAuthenticity(address wrappedSong, bool isAuthentic)**
  - Sets the authenticity status of a wrapped song. Only the owner can set the authenticity status.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `isAuthentic`: The authenticity status to be set.

- **isAuthentic(address wrappedSong)**
  - Checks the authenticity status of a wrapped song.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
  - **Returns:** `bool`

### New Events

- **WrappedSongReleaseRejected(address indexed wrappedSong, address indexed distributor)**
  - Emitted when a distributor rejects the release of a wrapped song.
