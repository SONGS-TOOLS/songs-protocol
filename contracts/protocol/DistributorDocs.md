
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