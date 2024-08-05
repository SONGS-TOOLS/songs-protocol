// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import './WSTokensManagement.sol';
import './../Interfaces/IProtocolModule.sol';

contract WrappedSongSmartAccount is Ownable, IERC1155Receiver, ERC165 {
  WSTokenManagement public newWSTokenManagement;
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

  /**
   * @dev Initializes the contract with the given parameters.
   * @param _stablecoinAddress The address of the stablecoin contract.
   * @param _owner The address of the owner.
   * @param _protocolModuleAddress The address of the ProtocolModule contract.
   */
  constructor(
    address _stablecoinAddress,
    address _owner,
    address _protocolModuleAddress
  ) Ownable(_owner) {
    require(_stablecoinAddress != address(0), 'Invalid stablecoin address');
    require(_owner != address(0), 'Invalid owner address');
    require(_protocolModuleAddress != address(0), 'Invalid protocol module address');

    newWSTokenManagement = new WSTokenManagement(
      address(this),
      msg.sender
    );

    stablecoin = IERC20(_stablecoinAddress);
    protocolModule = IProtocolModule(_protocolModuleAddress);

    isReleased = false;
    isAuthentic = false;
  }

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

    songId = newWSTokenManagement.createSongConcept(songURI, address(this));
    wrappedSongTokenId = songId;
    newSongSharesId = newWSTokenManagement.createFungibleSongShares(
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
    songId = newWSTokenManagement.createSongConcept(songURI, address(this));
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
    sharesId = newWSTokenManagement.createFungibleSongShares(
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
      newWSTokenManagement.balanceOf(address(this), sharesId) >= amount,
      'Not enough shares to transfer'
    );

    // Transfer the shares from the SmartWallet to the recipient
    newWSTokenManagement.safeTransferFrom(
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
    return newWSTokenManagement.balanceOf(address(this), tokenId);
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
    newWSTokenManagement.safeTransferFrom(
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
    newWSTokenManagement.safeBatchTransferFrom(
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

  /**
   * @dev Handles the receipt of a single ERC1155 token type.
   * @param operator The address which initiated the transfer (i.e. msg.sender).
   * @param from The address which previously owned the token.
   * @param id The ID of the token being transferred.
   * @param value The amount of tokens being transferred.
   * @param data Additional data with no specified format.
   * @return A bytes4 value indicating success.
   */
  function onERC1155Received(
    address operator,
    address from,
    uint256 id,
    uint256 value,
    bytes calldata data
  ) external override returns (bytes4) {
    return this.onERC1155Received.selector;
  }

  /**
   * @dev Handles the receipt of multiple ERC1155 token types.
   * @param operator The address which initiated the batch transfer (i.e. msg.sender).
   * @param from The address which previously owned the token.
   * @param ids An array containing ids of each token being transferred.
   * @param values An array containing amounts of each token being transferred.
   * @param data Additional data with no specified format.
   * @return A bytes4 value indicating success.
   */
  function onERC1155BatchReceived(
    address operator,
    address from,
    uint256[] calldata ids,
    uint256[] calldata values,
    bytes calldata data
  ) external override returns (bytes4) {
    return this.onERC1155BatchReceived.selector;
  }

  /**
   * @dev Indicates whether a contract implements the `IERC1155Receiver` interface.
   * @param interfaceId The interface identifier, as specified in ERC-165.
   * @return `true` if the contract implements the `IERC1155Receiver` interface.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
  }
}