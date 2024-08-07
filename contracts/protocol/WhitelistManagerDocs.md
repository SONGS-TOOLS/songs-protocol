
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