// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import './WSTokensManagement.sol';
import './../Interfaces/IProtocolModule.sol';
import "hardhat/console.sol";

contract WrappedSongSmartAccount is Ownable, IERC1155Receiver, ERC165 {
  WSTokenManagement public newWSTokenManagement;
  IERC20 public stablecoin;
  IProtocolModule public protocolModule;

  address public distributorWallet;

  uint256 public songSharesId;
  uint256 public wrappedSongTokenId;

  struct SaleInfo {
    uint256 pricePerShare;
    uint256 percentageForSale;
  }

  mapping(uint256 => SaleInfo) public sharesForSale;

  event MetadataUpdated(uint256 indexed tokenId, string newMetadata, address implementationAccount);
  event SharesSetForSale(address indexed wrappedSongAddress, uint256 percentage, uint256 pricePerShare);

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
    require(
      _protocolModuleAddress != address(0),
      'Invalid protocol module address'
    );

    newWSTokenManagement = new WSTokenManagement(address(this), _owner);

    stablecoin = IERC20(_stablecoinAddress);
    protocolModule = IProtocolModule(_protocolModuleAddress);
  }

  /**
   * @dev Requests the release of the wrapped song with a metadata update.
   * @param _distributorWallet The address of the distributor wallet.
   * @param songURI The new metadata URI for the song.
   */
  function requestWrappedSongReleaseWithMetadata(
    address _distributorWallet,
    string memory songURI
  ) external onlyOwner {
    updateMetadata(wrappedSongTokenId, songURI);
    protocolModule.requestWrappedSongRelease(address(this), _distributorWallet);
  }

  /**
   * @dev Requests the release of the wrapped song.
   * @param _distributorWallet The address of the distributor wallet.
   */
  function requestWrappedSongRelease(
    address _distributorWallet
  ) external onlyOwner {
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
    uint256 sharesAmount,
    string memory sharesURI,
    address creator
  ) public returns (uint256 songId, uint256 newSongSharesId) {
    // require(sharesAmount == 10000, "Shares amount must be 10,000");

    songId = newWSTokenManagement.createSongConcept(songURI, address(this));
    wrappedSongTokenId = songId;
    newSongSharesId = newWSTokenManagement.createFungibleSongShares(
      songId,
      sharesAmount,
      sharesURI,
      creator
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
    uint256 sharesAmount,
    string memory sharesURI,
    address creator
  ) public onlyOwner returns (uint256 sharesId) {
    sharesId = newWSTokenManagement.createFungibleSongShares(
      songId,
      sharesAmount,
      sharesURI,
      creator
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

    // Emit the event with the contract's address as the wrapped song address
    emit SharesSetForSale(address(this), percentage, pricePerShare);
  }
  
  /**
   * @dev Returns the token balance of the specified token ID for the contract owner.
   * @param tokenId The ID of the token.
   * @return The balance of the token for the contract owner.
   */
  function getTokenBalance(uint256 tokenId) public view returns (uint256) {
    return newWSTokenManagement.balanceOf(owner(), tokenId);
  }

  /**
   * @dev Retrieves the metadata for a specific token ID from the WSTokenManagement contract.
   * @param tokenId The ID of the token to get the metadata for.
   * @return The metadata of the specified token.
   */
  function getWrappedSongMetadata(uint256 tokenId) public view returns (string memory) {
    return newWSTokenManagement.uri(tokenId);
  }

  /**
   * @dev Transfers song shares to a recipient.
   * @param amount The amount of shares to be transferred.
   * @param to The address of the recipient.
   */
  function transferSongShares(
    uint256 amount,
    address to
  ) public onlyOwner {
    // Ensure the owner has enough shares to transfer
    require(getSongSharesBalance(owner()) >= amount, 'Insufficient shares balance');
    // Perform the safe transfer from the owner
    newWSTokenManagement.safeTransferFrom(
      owner(),
      to,
      songSharesId,
      amount,
      ''
    );
  }

  /**
   * @dev Batch transfers shares to multiple recipients.
   * @param amounts The amounts of shares to be transferred.
   * @param recipients The addresses of the recipients.
   */
  function batchTransferShares(
    uint256[] memory amounts,
    address[] memory recipients
  ) public onlyOwner {
    require(amounts.length == recipients.length, 'Arrays must be the same length');
    
    uint256 totalAmount = 0;
    for (uint256 i = 0; i < amounts.length; i++) {
      totalAmount += amounts[i];
    }
    
    require(
      getSongSharesBalance(owner()) >= totalAmount,
      'Not enough shares to transfer'
    );

    // Perform individual transfers
    for (uint256 i = 0; i < recipients.length; i++) {
      newWSTokenManagement.safeTransferFrom(
        owner(),
        recipients[i],
        songSharesId,
        amounts[i],
        ''
      );
    }
  }

  /**
   * @dev Returns the total supply of shares for a given song.
   * @param id The ID of the shares token.
   * @return The total supply of shares for the given ID.
   */
  function getTokenTotalSupply(uint256 id) public view returns (uint256) {
    return newWSTokenManagement.totalSupply(id);
  }

  /**
   * @dev Returns the song shares balance of the specified address.
   * @param account The address to check the balance for.
   * @return The balance of song shares for the specified address.
   */
  function getSongSharesBalance(address account) public view returns (uint256) {
    return newWSTokenManagement.balanceOf(account, songSharesId);
  }

  /**
   * @dev Returns the address of the associated WSTokenManagement contract.
   * @return The address of the newWSTokenManagement contract.
   */
  function getWSTokenManagementAddress() public view returns (address) {
    return address(newWSTokenManagement);
  }

  /**
   * @dev Indicates whether the contract can receive ERC20 tokens.
   * @return A boolean indicating if the contract can receive ERC20 tokens.
   */
  function canReceiveERC20() external pure returns (bool) {
    return true;
  }

  /**
   * @dev Function to receive ERC20 tokens.
   * @param token The address of the ERC20 token contract.
   * @param amount The amount of tokens to be received.
   */
  function receiveERC20(address token, uint256 amount) external {
    require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
  }

  /**
   * @dev Function to receive ETH.
   */
  receive() external payable {
    // Custom logic can be added here if needed
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
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC165, IERC165) returns (bool) {
    return
      interfaceId == type(IERC1155Receiver).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  /**
   * @dev Retrieves the metadata for a specific token ID from the WSTokenManagement contract.
   * @param tokenId The ID of the token to get the metadata for.
   * @return The metadata of the specified token.
   */
  function getTokenMetadata(uint256 tokenId) public view returns (string memory) {
    return newWSTokenManagement.uri(tokenId);
  }

  /**
   * @dev Requests an update to the metadata if the song has been released.
   * @param tokenId The ID of the token to update.
   * @param newMetadata The new metadata to be set.
   */
  function requestUpdateMetadata(uint256 tokenId, string memory newMetadata) public onlyOwner {
    require(protocolModule.isReleased(address(this)), "Song not released, update metadata directly");
    protocolModule.requestUpdateMetadata(address(this), tokenId, newMetadata);
  }

  /**
   * @dev Updates the metadata directly if the song has not been released.
   * @param tokenId The ID of the token to update.
   * @param newMetadata The new metadata to be set.
   */
  function updateMetadata(uint256 tokenId, string memory newMetadata) public onlyOwner {
    require(!protocolModule.isReleased(address(this)), "Cannot update metadata directly after release, request update instead");
    newWSTokenManagement.setTokenURI(tokenId, newMetadata);
    emit MetadataUpdated(tokenId, newMetadata, address(this));
  }

  /**
   * @dev Executes the confirmed metadata update.
   * @param tokenId The ID of the token to update.
   */
  function executeConfirmedMetadataUpdate(uint256 tokenId) external {
    require(msg.sender == address(protocolModule), "Only ProtocolModule can execute confirmed updates");
    require(protocolModule.isMetadataUpdateConfirmed(address(this), tokenId), "Metadata update not confirmed");
    
    string memory newMetadata = protocolModule.getPendingMetadataUpdate(address(this), tokenId);

    newWSTokenManagement.setTokenURI(tokenId, newMetadata);
    
    protocolModule.clearPendingMetadataUpdate(address(this), tokenId);
    
    emit MetadataUpdated(tokenId, newMetadata, address(this));
  }

  // New function to check authenticity
  function checkAuthenticity() public view returns (bool) {
    return protocolModule.isAuthentic(address(this));
  }

  /**
   * @dev Withdraws funds from the WSTokenManagement contract to a specified address.
   * @param to The address to receive the withdrawn funds.
   */
  function withdrawSaleFunds(address payable to) external onlyOwner {
    require(address(newWSTokenManagement) != address(0), "WSTokenManagement not set");
    newWSTokenManagement.withdrawFunds(to);
  }

}