// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import './WSTokensManagementUpgradeable.sol';
import './../Interfaces/IProtocolModule.sol';

contract WrappedSongSmartAccountUpgradeable is OwnableUpgradeable, UUPSUpgradeable {
  WSTokensManagementUpgradeable public wsTokensManagement;
  IERC20 public stablecoin;
  IProtocolModule public protocolModule;

  bool public isReleased;
  string public isrc;
  bool public isAuthentic;
  address public distributorWallet;

  uint256 public songSharesId;
  uint256 public wrappedSongTokenId;

  struct SaleInfo {
    uint256 pricePerShare;
    uint256 percentageForSale;
  }

  mapping(uint256 => SaleInfo) public sharesForSale;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @dev Initializes the contract with the given parameters.
   * @param _stablecoinAddress The address of the stablecoin contract.
   * @param _owner The address of the owner.
   * @param _protocolModuleAddress The address of the ProtocolModule contract.
   * @param _songManagementContract The address of the WSTokenManagement contract.
   */
  function initialize(
    address _stablecoinAddress,
    address _owner,
    address _protocolModuleAddress,
    address _songManagementContract
  ) public initializer {
    __Ownable_init(_owner); // Initialize Ownable
    __UUPSUpgradeable_init();

    require(_stablecoinAddress != address(0), 'Invalid stablecoin address');
    require(_owner != address(0), 'Invalid owner address');
    require(
      _protocolModuleAddress != address(0),
      'Invalid protocol module address'
    );
    require(
      _songManagementContract != address(0),
      'Invalid song management contract address'
    );

    wsTokensManagement = WSTokensManagementUpgradeable(_songManagementContract);
    stablecoin = IERC20(_stablecoinAddress);
    protocolModule = IProtocolModule(_protocolModuleAddress);
    transferOwnership(_owner);

    isReleased = false; // Initialize isReleased
    isAuthentic = false; // Initialize isAuthentic
  }

  /**
   * @dev Authorizes the upgrade of the contract. Only the owner can authorize upgrades.
   * @param newImplementation The address of the new implementation contract.
   */
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}

  /**
   * @dev Requests the release of the wrapped song.
   * @param _distributorWallet The address of the distributor wallet.
   */
  function requestWrappedSongRelease(
    address _distributorWallet
  ) external onlyOwner {
    require(!isReleased, 'Already released');
    protocolModule.requestWrappedSongRelease(address(this), _distributorWallet);
  }

  /**
   * @dev Registers a new song with the given URI and creates fungible shares.
   * @param songURI The URI of the song.
   * @param sharesAmount The amount of shares to be created.
   * @return songId The ID of the registered song.
   * @return newSongSharesId The ID of the created fungible shares.
   */
  function createsWrappedSongTokens(
    string memory songURI,
    uint256 sharesAmount
  ) public returns (uint256 songId, uint256 newSongSharesId) {
    // require(sharesAmount == 10000, "Shares amount must be 10,000");

    songId = wsTokensManagement.createSongConcept(songURI, address(this));
    wrappedSongTokenId = songId;
    newSongSharesId = wsTokensManagement.createFungibleSongShares(
      songId,
      sharesAmount
    );
    songSharesId = newSongSharesId; // Update the state variable
    return (songId, newSongSharesId);
  }

  /**
   * @dev Registers a new song with the given URI.
   * @param songURI The URI of the song.
   * @param participants The addresses of the participants.
   * @return songId The ID of the registered song.
   */
  function createsSongToken(
    string memory songURI,
    address[] memory participants
  ) public onlyOwner returns (uint256 songId) {
    songId = wsTokensManagement.createSongConcept(songURI, address(this));
    wrappedSongTokenId = songId;
    return songId;
  }

  /**
   * @dev Creates fungible song shares for the given song ID and shares amount.
   * @param songId The ID of the song.
   * @param sharesAmount The amount of shares to be created.
   * @return sharesId The ID of the created shares.
   */
  function createFungibleSongShares(
    uint256 songId,
    uint256 sharesAmount
  ) public onlyOwner returns (uint256 sharesId) {
    sharesId = wsTokensManagement.createFungibleSongShares(
      songId,
      sharesAmount
    );
    songSharesId = sharesId;
    return sharesId;
  }

  /**
   * @dev Sets the price and percentage of shares available for sale.
   * @param sharesId The ID of the shares.
   * @param percentage The percentage of shares to be sold.
   * @param pricePerShare The price per share.
   */
  function setSharesForSale(
    uint256 sharesId,
    uint256 percentage,
    uint256 pricePerShare
  ) public onlyOwner {
    require(percentage > 0 && percentage <= 100, 'Invalid percentage');

    sharesForSale[sharesId] = SaleInfo({
      pricePerShare: pricePerShare,
      percentageForSale: percentage
    });
  }

  /**
   * @dev Transfers shares to a recipient.
   * @param sharesId The ID of the shares.
   * @param amount The amount of shares to be transferred.
   * @param recipient The address of the recipient.
   */
  function transferShares(
    uint256 sharesId,
    uint256 amount,
    address recipient
  ) public onlyOwner {
    require(
      wsTokensManagement.balanceOf(address(this), sharesId) >= amount,
      'Not enough shares to transfer'
    );

    // Transfer the shares from the SmartWallet to the recipient
    wsTokensManagement.safeTransferFrom(
      address(this),
      recipient,
      sharesId,
      amount,
      ''
    );
  }

  /**
   * @dev Returns the token balance of the specified token ID.
   * @param tokenId The ID of the token.
   * @return The balance of the token.
   */
  function getTokenBalance(uint256 tokenId) public view returns (uint256) {
    return wsTokensManagement.balanceOf(address(this), tokenId);
  }

  /**
   * @dev Transfers tokens to a recipient.
   * @param tokenId The ID of the token.
   * @param amount The amount of tokens to be transferred.
   * @param to The address of the recipient.
   */
  function transferSongShares(
    uint256 tokenId,
    uint256 amount,
    address to
  ) public onlyOwner {
    // Ensure the SmartWallet has enough of the token to transfer
    require(getTokenBalance(tokenId) >= amount, 'Insufficient token balance');
    // Perform the safe transfer
    wsTokensManagement.safeTransferFrom(
      address(this),
      to,
      tokenId,
      amount,
      ''
    );
  }

  /**
   * @dev Batch transfers tokens to a recipient.
   * @param tokenIds The IDs of the tokens.
   * @param amounts The amounts of tokens to be transferred.
   * @param to The address of the recipient.
   */
  function batchTransferSongShares(
    uint256[] memory tokenIds,
    uint256[] memory amounts,
    address to
  ) public onlyOwner {
    // Ensure arrays are of the same length to prevent mismatch
    require(
      tokenIds.length == amounts.length,
      'Arrays must be the same length'
    );
    // Perform the safe batch transfer
    wsTokensManagement.safeBatchTransferFrom(
      address(this),
      to,
      tokenIds,
      amounts,
      ''
    );
  }

  /**
   * @dev Indicates whether the contract can receive ERC20 tokens.
   * @return A boolean indicating if the contract can receive ERC20 tokens.
   */
  function canReceiveERC20() external pure returns (bool) {
    return true;
  }

  function receiveEarnings(uint256 amount) external {
    // Implementation of receiveEarnings
  }
}