## WrappedSongFactory.sol

The `WrappedSongFactory` contract is responsible for creating new wrapped songs. It interacts with the `ProtocolModule` to ensure that all necessary conditions are met before a wrapped song is created. This contract also manages the initialization of new wrapped songs and keeps track of the songs created by each owner.

### Functions

- **createWrappedSong(address _stablecoin)**
  - Creates a new wrapped song.
  - **Parameters:**
    - `_stablecoin`: The address of the stablecoin contract.
  - **Returns:** `address`
  - **Requirements:**
    - The caller must pay the creation fee.
    - The caller must be valid to create a wrapped song.

- **createWrappedSongWithMetadata(address _stablecoin, string memory songURI, uint256 sharesAmount)**
  - Creates a new wrapped song with metadata.
  - **Parameters:**
    - `_stablecoin`: The address of the stablecoin contract.
    - `songURI`: The URI of the song metadata.
    - `sharesAmount`: The amount of shares to be created.
  - **Requirements:**
    - The caller must pay the creation fee.
    - The caller must be valid to create a wrapped song.

- **getOwnerWrappedSongs(address _owner)**
  - Returns the list of wrapped songs owned by the specified owner.
  - **Parameters:**
    - `_owner`: The address of the owner.
  - **Returns:** `address[]`

## WrappedSongSmartAccount.sol

The `WrappedSongSmartAccount` contract represents the smart account for a wrapped song. It manages the song's state, including its release status, authenticity, and associated distributor wallet. This contract also handles the financial operations related to the wrapped song, such as receiving payments and distributing earnings.

### Functions

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

- **getWrappedSongMetadata(uint256 tokenId)**
  - Retrieves the metadata for a specific token ID from the WSTokenManagement contract.
  - **Parameters:**
    - `tokenId`: The ID of the token to get the metadata for.
  - **Returns:** `string`

- **requestUpdateMetadata(uint256 tokenId, string memory newMetadata)**
  - Requests an update to the metadata if the song has been released.
  - **Parameters:**
    - `tokenId`: The ID of the token to update.
    - `newMetadata`: The new metadata to be set.

- **updateMetadata(uint256 tokenId, string memory newMetadata)**
  - Updates the metadata directly if the song has not been released.
  - **Parameters:**
    - `tokenId`: The ID of the token to update.
    - `newMetadata`: The new metadata to be set.

- **executeConfirmedMetadataUpdate(uint256 tokenId)**
  - Executes the confirmed metadata update.
  - **Parameters:**
    - `tokenId`: The ID of the token to update.

- **checkAuthenticity()**
  - Checks the authenticity status of the wrapped song.
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