// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

contract WSTokenManagement is
  ERC1155Upgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  uint256 private _currentTokenId;
  address private _minter;

  mapping(uint256 => string) private _tokenURIs;
  mapping(uint256 => uint256) public songToFungibleShares;
  mapping(uint256 => uint256) private songToConceptNFT;
  mapping(uint256 => uint256) public fungibleTokenShares;
  mapping(uint256 => address[]) private _shareholders;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @dev Initializes the contract with the given initial owner.
   * @param _smartAccountAddress Wrapped Song smartAccount address.
   * @param _minterAddress Wrapped Song smartAccount address.
   */
  function initialize(address _smartAccountAddress, address _minterAddress) public initializer {
    __ERC1155_init('');
    __Ownable_init(_smartAccountAddress); // Pass the initial owner
    __UUPSUpgradeable_init();
    _minter = _minterAddress;
    _currentTokenId = 0;
  }

  /**
   * @dev Authorizes the upgrade of the contract. Only the owner can authorize upgrades.
   * @param newImplementation The address of the new implementation contract.
   */
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}

  /**
   * @dev Modifier to restrict minting to the minter address.
   */
  modifier onlyMinter() {
    require(msg.sender == _minter, 'Caller is not the minter');
    _;
  }

  //TODO FIX BURN + Virtual on ERC-1155

  // /**
  //  * @dev Burns tokens and transfers them back to the minter if balance is zero.
  //  * @param account The address of the account to transfer tokens from.
  //  * @param id The ID of the token to transfer.
  //  * @param amount The amount of tokens to transfer.
  //  */
  // function _burn(address account, uint256 id, uint256 amount) internal override {
  //     require(_minter != address(0), "Minter address not set");

  //     // Transfer tokens back to the minter instead of burning
  //     _safeTransferFrom(account, _minter, id, amount, "");

  //     // Remove shareholder if balance is zero
  //     _removeShareholder(id, account);
  // }

  /**
   * @dev Removes a shareholder from the list if they no longer hold tokens.
   * @param sharesId The ID of the shares.
   * @param shareholder The address of the shareholder.
   */
  function _removeShareholder(uint256 sharesId, address shareholder) internal {
    if (balanceOf(shareholder, sharesId) == 0) {
      address[] storage shareholders = _shareholders[sharesId];
      for (uint i = 0; i < shareholders.length; i++) {
        if (shareholders[i] == shareholder) {
          shareholders[i] = shareholders[shareholders.length - 1];
          shareholders.pop();
          break;
        }
      }
    }
  }

  /**
   * @dev Returns the list of shareholder addresses for a given shares ID.
   * @param sharesId The ID of the shares.
   * @return An array of shareholder addresses.
   */
  function getShareholderAddresses(
    uint256 sharesId
  ) public view returns (address[] memory) {
    return _shareholders[sharesId];
  }

  /**
   * @dev Sets the token URI for a specific token ID.
   * @param tokenId The ID of the token to set the URI for.
   * @param tokenURI The URI to be set for the token.
   */
  function setTokenURI(uint256 tokenId, string memory tokenURI) private {
    _tokenURIs[tokenId] = tokenURI;
  }

  /**
   * @dev Retrieves the URI for a specific token ID.
   * @param tokenId The ID of the token to get the URI for.
   * @return The URI of the specified token.
   */
  function uri(uint256 tokenId) public view override returns (string memory) {
    return _tokenURIs[tokenId];
  }

  /**
   * @dev Creates a new song concept NFT.
   * @param songURI The URI containing metadata for the song.
   * @param smartWallet The address of the smart wallet to mint the NFT to.
   * @return songId The ID of the newly created song concept NFT.
   */
  function createSongConcept(
    string memory songURI,
    address smartWallet
  ) public onlyOwner returns (uint256 songId) {
    _currentTokenId++;
    songId = _currentTokenId;
    _mint(smartWallet, songId, 1, '');
    setTokenURI(songId, songURI);
    songToConceptNFT[songId] = songId;
  }

  /**
   * @dev Creates fungible shares for a specific song.
   * @param songId The ID of the song to create shares for.
   * @param sharesAmount The total amount of shares to create.
   * @return sharesId The ID of the newly created fungible shares.
   */
  function createFungibleSongShares(
    uint256 songId,
    uint256 sharesAmount
  ) public onlyOwner returns (uint256 sharesId) {
    require(
      songToConceptNFT[songId] != 0,
      "Invalid song ID, concept NFT doesn't exist"
    );
    require(
      songToFungibleShares[songId] == 0,
      'Shares already created for this song'
    );

    _currentTokenId++;
    sharesId = _currentTokenId;
    _mint(msg.sender, sharesId, sharesAmount, '');
    songToFungibleShares[songId] = sharesId;
    fungibleTokenShares[sharesId] = sharesAmount;
  }

  /**
   * @dev Retrieves the total amount of fungible shares for a specific shares ID.
   * @param sharesId The ID of the shares to query.
   * @return The total amount of shares for the specified ID.
   */
  function getFungibleTokenShares(
    uint256 sharesId
  ) public view returns (uint256) {
    return fungibleTokenShares[sharesId];
  }

  /**
   * @dev Retrieves the fungible shares ID associated with a specific song.
   * @param songId The ID of the song to query.
   * @return The ID of the fungible shares associated with the specified song.
   */
  function getSharesIdForSong(uint256 songId) public view returns (uint256) {
    require(
      songToConceptNFT[songId] != 0,
      "Invalid song ID, concept NFT doesn't exist"
    );
    return songToFungibleShares[songId];
  }
}
