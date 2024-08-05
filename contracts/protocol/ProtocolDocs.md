# Protocol Documentation

## Overview

This documentation provides a comprehensive guide to the protocol's smart contracts, focusing on the functions that are externally or publicly accessible. The protocol is designed to manage and interact with wrapped songs, distributors, and various modules within the ecosystem. The primary contracts include `WhitelistingManager`, `DistributorWallet`, `DistributorWalletFactory`, `ProtocolModule`, `WrappedSongFactory`, `WrappedSongSmartAccount`, and `WSTokensManagement`.

### Understanding the Protocol

The protocol is structured to facilitate the creation, management, and distribution of wrapped songs. It includes mechanisms for whitelisting creators, managing payments and earnings, and handling the creation and exchange of NFTs and fungible shares. The following sections provide detailed descriptions of each contract and their respective functions.

## WhitelistingManager.sol

The `WhitelistingManager` contract is responsible for managing the whitelist of creators who are allowed to create wrapped songs. It ensures that only authorized creators can participate in the protocol by checking their validity based on certain requirements, such as owning specific NFTs.

### Functions

- **initialize(address initialOwner)**
  - Initializes the contract with the given initial owner and enables the NFT requirement.
  - **Parameters:**
    - `initialOwner`: The address of the initial owner.

- **setNFTContract(address _newNFTContract)**
  - Sets the NFT contract address. Only the owner can set the NFT contract.
  - **Parameters:**
    - `_newNFTContract`: The address of the new NFT contract.

- **toggleNFTRequirement(bool _enabled)**
  - Toggles the NFT requirement for creating a wrapped song. Only the owner can toggle this requirement.
  - **Parameters:**
    - `_enabled`: A boolean indicating whether the NFT requirement is enabled or not.

- **isValidToCreateWrappedSong(address _creator)**
  - Checks if the creator is valid to create a wrapped song based on the NFT requirement.
  - **Parameters:**
    - `_creator`: The address of the creator.
  - **Returns:** `bool`

## DistributorWallet.sol

The `DistributorWallet` contract handles the financial transactions related to wrapped songs. It manages the receipt of payments, distribution of earnings, and confirmation of wrapped song releases. This contract ensures that all financial operations are conducted securely and transparently.

### Functions

- **receivePayment(address _wrappedSong, uint256 _amount)**
  - Receives payment in stablecoin and updates the treasury for the specified wrapped song.
  - **Parameters:**
    - `_wrappedSong`: The address of the wrapped song.
    - `_amount`: The amount of stablecoin to be received.

- **distributeEarnings(address _wrappedSong)**
  - Distributes earnings to the specified wrapped song.
  - **Parameters:**
    - `_wrappedSong`: The address of the wrapped song.

- **confirmWrappedSongRelease(address wrappedSong)**
  - Confirms the release of a wrapped song and adds it to the managed wrapped songs.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song to be released.

## DistributorWalletFactory.sol

The `DistributorWalletFactory` contract is responsible for creating and managing distributor wallets. These wallets are used by distributors to handle the financial aspects of wrapped songs, including receiving payments and distributing earnings. The factory contract ensures that each distributor has a dedicated wallet for managing their transactions.

### Functions

- **createDistributorWallet(address distributor)**
  - Creates a new distributor wallet for the given distributor address.
  - **Parameters:**
    - `distributor`: The address of the distributor.
  - **Returns:** `address`

- **getDistributorWallet(address distributor)**
  - Returns the distributor wallet address for the given distributor.
  - **Parameters:**
    - `distributor`: The address of the distributor.
  - **Returns:** `address`

- **getWrappedSongDistributor(address wrappedSong)**
  - Returns the distributor address for the given wrapped song.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
  - **Returns:** `address`

## ProtocolModule.sol

The `ProtocolModule` contract serves as the central hub for managing the protocol's operations. It handles the creation and release of wrapped songs, manages fees, and interacts with other contracts such as the `WrappedSongFactory` and `DistributorWalletFactory`. This contract ensures that all protocol operations are conducted in a coordinated and secure manner.

### Functions

- **requestWrappedSongRelease(address wrappedSong, address distributor)**
  - Requests the release of a wrapped song by a distributor.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `distributor`: The address of the distributor.

- **confirmWrappedSongRelease(address wrappedSong)**
  - Confirms the release of a wrapped song by the pending distributor.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.

- **getWrappedSongDistributor(address wrappedSong)**
  - Returns the distributor address for a given wrapped song.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
  - **Returns:** `address`

- **getPendingDistributor(address wrappedSong)**
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

- **updateWrappedSongFactory(address _newFactory)**
  - Updates the address of the WrappedSongFactory contract. Only the owner can update the address.
  - **Parameters:**
    - `_newFactory`: The address of the new WrappedSongFactory contract.

- **updateDistributorWalletFactory(address _newFactory)**
  - Updates the address of the DistributorWalletFactory contract. Only the owner can update the address.
  - **Parameters:**
    - `_newFactory`: The address of the new DistributorWalletFactory contract.

- **setWhitelistingManager(address _whitelistingManager)**
  - Sets the address of the WhitelistingManager contract. Only the owner can set the address.
  - **Parameters:**
    - `_whitelistingManager`: The address of the new WhitelistingManager contract.

## WrappedSongFactory.sol

The `WrappedSongFactory` contract is responsible for creating new wrapped songs. It interacts with the `ProtocolModule` to ensure that all necessary conditions are met before a wrapped song is created. This contract also manages the initialization of new wrapped songs and keeps track of the songs created by each owner.

### Functions

- **createWrappedSong(address _stablecoin)**
  - Creates a new wrapped song.
  - **Parameters:**
    - `_stablecoin`: The address of the stablecoin contract.
  - **Returns:** `address`

- **createWrappedSongWithMetadata(address _stablecoin, string memory songURI, uint256 sharesAmount)**
  - Creates a new wrapped song with metadata.
  - **Parameters:**
    - `_stablecoin`: The address of the stablecoin contract.
    - `songURI`: The URI of the song metadata.
    - `sharesAmount`: The amount of shares to be created.

- **getOwnerWrappedSongs(address _owner)**
  - Returns the list of wrapped songs owned by the specified owner.
  - **Parameters:**
    - `_owner`: The address of the owner.
  - **Returns:** `address[]`

## WrappedSongSmartAccount.sol

The `WrappedSongSmartAccount` contract represents the smart account for a wrapped song. It manages the song's state, including its release status, authenticity, and associated distributor wallet. This contract also handles the financial operations related to the wrapped song, such as receiving payments and distributing earnings.

### Functions

- **constructor(address _stablecoinAddress, address _owner, address _protocolModuleAddress)**
  - Initializes the contract with the given parameters.
  - **Parameters:**
    - `_stablecoinAddress`: The address of the stablecoin contract.
    - `_owner`: The address of the owner.
    - `_protocolModuleAddress`: The address of the ProtocolModule contract.

- **requestWrappedSongRelease(address _distributorWallet)**
  - Requests the release of the wrapped song.
  - **Parameters:**
    - `_distributorWallet`: The address of the distributor wallet.

- **createsWrappedSongTokens(string memory songURI, uint256 sharesAmount)**
  - Registers a new song with the given URI and creates fungible shares.
  - **Parameters:**
    - `songURI`: The URI of the song.
    - `sharesAmount`: The amount of shares to be created.
  - **Returns:** `uint256 songId, uint256 newSongSharesId`

- **createsSongToken(string memory songURI, address[] memory participants)**
  - Registers a new song with the given URI.
  - **Parameters:**
    - `songURI`: The URI of the song.
    - `participants`: The addresses of the participants.
  - **Returns:** `uint256 songId`

- **createFungibleSongShares(uint256 songId, uint256 sharesAmount)**
  - Creates fungible song shares for the given song ID and shares amount.
  - **Parameters:**
    - `songId`: The ID of the song.
    - `sharesAmount`: The amount of shares to be created.
  - **Returns:** `uint256 sharesId`

- **setSharesForSale(uint256 sharesId, uint256 percentage, uint256 pricePerShare)**
  - Sets the price and percentage of shares available for sale.
  - **Parameters:**
    - `sharesId`: The ID of the shares.
    - `percentage`: The percentage of shares to be sold.
    - `pricePerShare`: The price per share.

- **transferShares(uint256 sharesId, uint256 amount, address recipient)**
  - Transfers shares to a recipient.
  - **Parameters:**
    - `sharesId`: The ID of the shares.
    - `amount`: The amount of shares to be transferred.
    - `recipient`: The address of the recipient.

- **batchTransferSongShares(uint256[] memory tokenIds, uint256[] memory amounts, address to)**
  - Batch transfers tokens to a recipient.
  - **Parameters:**
    - `tokenIds`: The IDs of the tokens.
    - `amounts`: The amounts of tokens to be transferred.
    - `to`: The address of the recipient.

- **getTokenBalance(uint256 tokenId)**
  - Returns the token balance of the specified token ID.
  - **Parameters:**
    - `tokenId`: The ID of the token.
  - **Returns:** `uint256`

- **canReceiveERC20()**
  - Indicates whether the contract can receive ERC20 tokens.
  - **Returns:** `bool`

- **receiveEarnings(uint256 amount)**
  - Handles the receipt of earnings.
  - **Parameters:**
    - `amount`: The amount of earnings received.

- **onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data)**
  - Handles the receipt of a single ERC1155 token type.
  - **Parameters:**
    - `operator`: The address which initiated the transfer (i.e. msg.sender).
    - `from`: The address which previously owned the token.
    - `id`: The ID of the token being transferred.
    - `value`: The amount of tokens being transferred.
    - `data`: Additional data with no specified format.
  - **Returns:** `bytes4`

- **onERC1155BatchReceived(address operator, address from, uint256[] calldata ids, uint256[] calldata values, bytes calldata data)**
  - Handles the receipt of multiple ERC1155 token types.
  - **Parameters:**
    - `operator`: The address which initiated the batch transfer (i.e. msg.sender).
    - `from`: The address which previously owned the token.
    - `ids`: An array containing ids of each token being transferred.
    - `values`: An array containing amounts of each token being transferred.
    - `data`: Additional data with no specified format.
  - **Returns:** `bytes4`

- **supportsInterface(bytes4 interfaceId)**
  - Indicates whether a contract implements the `IERC1155Receiver` interface.
  - **Parameters:**
    - `interfaceId`: The interface identifier, as specified in ERC-165.
  - **Returns:** `bool`

## WSTokensManagement.sol

The `WSTokensManagement` contract manages the creation and distribution of song-related tokens, including both NFTs and fungible shares. It allows for the creation of song concept NFTs, the minting of participation NFTs, and the exchange of NFTs for fungible shares. This contract also handles the setting and retrieval of token URIs.

### Functions

- **initialize(address _smartAccountAddress, address _minterAddress)**
  - Initializes the contract with the given initial owner and minter.
  - **Parameters:**
    - `_smartAccountAddress`: The address of the smart account.
    - `_minterAddress`: The address of the minter.

- **burn(address account, uint256 id, uint256 amount)**
  - Burns tokens and transfers them back to the minter if balance is zero.
  - **Parameters:**
    - `account`: The address of the account to transfer tokens from.
    - `id`: The ID of the token to transfer.
    - `amount`: The amount of tokens to transfer.

- **getShareholderAddresses(uint256 sharesId)**
  - Returns the list of shareholder addresses for a given shares ID.
  - **Parameters:**
    - `sharesId`: The ID of the shares.
  - **Returns:** `address[]`

- **setTokenURI(uint256 tokenId, string memory tokenURI)**
  - Sets the token URI for a specific token ID.
  - **Parameters:**
    - `tokenId`: The ID of the token to set the URI for.
    - `tokenURI`: The URI to be set for the token.

- **uri(uint256 tokenId)**
  - Retrieves the URI for a specific token ID.
  - **Parameters:**
    - `tokenId`: The ID of the token to get the URI for.
  - **Returns:** `string`

- **createSongConcept(string memory songURI, address smartWallet)**
  - Creates a new song concept NFT.
  - **Parameters:**
    - `songURI`: The URI containing metadata for the song.
    - `smartWallet`: The address of the smart wallet to mint the NFT to.
  - **Returns:** `uint256`

- **createFungibleSongShares(uint256 songId, uint256 sharesAmount)**
  - Creates fungible shares for a specific song.
  - **Parameters:**
    - `songId`: The ID of the song to create shares for.
    - `sharesAmount`: The total amount of shares to create.
  - **Returns:** `uint256`

- **getFungibleTokenShares(uint256 sharesId)**
  - Retrieves the total amount of fungible shares for a specific shares ID.
  - **Parameters:**
    - `sharesId`: The ID of the shares to query.
  - **Returns:** `uint256`

- **getSharesIdForSong(uint256 songId)**
  - Retrieves the fungible shares ID associated with a specific song.
  - **Parameters:**
    - `songId`: The ID of the song to query.
  - **Returns:** `uint256`