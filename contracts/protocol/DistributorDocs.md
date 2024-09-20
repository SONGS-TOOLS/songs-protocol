## DistributorWallet.sol

The `DistributorWallet` contract handles the financial transactions related to wrapped songs. It manages the receipt of payments, distribution of earnings, and confirmation of wrapped song releases. This contract ensures that all financial operations are conducted securely and transparently.

### Functions

- **receivePayment(address _wrappedSong, uint256 _amount)**
  - Receives payment in stablecoin and updates the treasury for the specified wrapped song.
  - **Parameters:**
    - `_wrappedSong`: The address of the wrapped song.
    - `_amount`: The amount of stablecoin to be received.

- **receivePaymentETH(address _wrappedSong)**
  - Receives ETH and updates the treasury for the specified wrapped song.
  - **Parameters:**
    - `_wrappedSong`: The address of the wrapped song.

- **receivePaymentStablecoin(address _wrappedSong, uint256 _amount)**
  - Receives stablecoin and updates the treasury for the specified wrapped song.
  - **Parameters:**
    - `_wrappedSong`: The address of the wrapped song.
    - `_amount`: The amount of stablecoin to be received.

- **receiveBatchPaymentETH(address[] calldata _wrappedSongs, uint256[] calldata _amounts)**
  - Receives ETH and updates the treasury for the specified wrapped songs.
  - **Parameters:**
    - `_wrappedSongs`: The addresses of the wrapped songs.
    - `_amounts`: The amounts of ETH to be received for each wrapped song.

- **receiveBatchPaymentStablecoin(address[] calldata _wrappedSongs, uint256[] calldata _amounts, uint256 _totalAmount)**
  - Receives stablecoin and updates the treasury for the specified wrapped songs.
  - **Parameters:**
    - `_wrappedSongs`: The addresses of the wrapped songs.
    - `_amounts`: The amounts of stablecoin to be received for each wrapped song.
    - `_totalAmount`: The total amount of stablecoin to be received.

- **setAccounting(address _wrappedSong, uint256 _amount)**
  - Sets the accounting for a single wrapped song.
  - **Parameters:**
    - `_wrappedSong`: The address of the wrapped song.
    - `_amount`: The amount of stablecoin to be set.

- **setAccountingBatch(address[] calldata _wrappedSongs, uint256[] calldata _amounts, uint256 _totalAmount, uint256 _batchSize)**
  - Sets the accounting for multiple wrapped songs in a batch.
  - **Parameters:**
    - `_wrappedSongs`: The addresses of the wrapped songs.
    - `_amounts`: The amounts of stablecoin to be set for each wrapped song.
    - `_totalAmount`: The total amount of stablecoin received.
    - `_batchSize`: The number of items to process per call.

- **redeem(address _wrappedSong)**
  - Redeems the amount for the owner of the wrapped song.
  - **Parameters:**
    - `_wrappedSong`: The address of the wrapped song.

- **redeemETH(address payable _wrappedSong)**
  - Redeems the amount for the owner of the wrapped song in ETH.
  - **Parameters:**
    - `_wrappedSong`: The address of the wrapped song.

- **distributeEarnings(address payable _wrappedSong)**
  - Distributes earnings to the specified wrapped song.
  - **Parameters:**
    - `_wrappedSong`: The address of the wrapped song.

- **confirmWrappedSongRelease(address wrappedSong)**
  - Confirms the release of a wrapped song and adds it to the managed wrapped songs.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song to be released.

- **confirmUpdateMetadata(address wrappedSong, uint256 tokenId)**
  - Confirms the update to the metadata.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `tokenId`: The ID of the token to update.

- **rejectUpdateMetadata(address wrappedSong, uint256 tokenId)**
  - Rejects the update to the metadata.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.
    - `tokenId`: The ID of the token to update.

- **acceptWrappedSongForReview(address wrappedSong)**
  - Accepts the wrapped song for review.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.

- **rejectWrappedSongRelease(address wrappedSong)**
  - Rejects the release of the wrapped song.
  - **Parameters:**
    - `wrappedSong`: The address of the wrapped song.

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