// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import './WSTokensManagement.sol';
import './../Interfaces/IProtocolModule.sol';

contract WrappedSongSmartAccount is Ownable, IERC1155Receiver, ERC165 {
  // State variables
  WSTokenManagement public immutable newWSTokenManagement;
  IERC20 public immutable stablecoin;
  IProtocolModule public immutable protocolModule;

  uint256 public songSharesId;
  uint256 public wrappedSongTokenId;

  uint256 public accumulatedEarningsPerShare;
  mapping(address => uint256) public unclaimedEarnings;
  mapping(address => uint256) public lastClaimedEarningsPerShare;
  uint256 public totalDistributedEarnings;
  uint256 public ethBalance;
  uint256 public saleFunds;

  address[] public receivedTokens;
  mapping(address => bool) public isTokenReceived;

  struct SaleInfo {
    uint256 pricePerShare;
    uint256 percentageForSale;
  }

  mapping(uint256 => SaleInfo) public sharesForSale;

  // Events
  event MetadataUpdated(uint256 indexed tokenId, string newMetadata, address implementationAccount);
  event SharesSetForSale(address indexed wrappedSongAddress, uint256 percentage, uint256 pricePerShare);
  event EarningsReceived(address indexed token, uint256 amount, uint256 earningsPerShare);
  event EarningsClaimed(address indexed account, address indexed token, uint256 amount);
  event EarningsUpdated(address indexed account, uint256 newEarnings);
  event AllEarningsClaimed(address indexed account, address[] tokens, uint256[] amounts);
  event TokenReceived(address indexed token);
  event SaleFundsReceived(uint256 amount);
  event SaleFundsWithdrawn(address indexed to, uint256 amount);

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

    newWSTokenManagement = new WSTokenManagement(address(this), _owner);
    stablecoin = IERC20(_stablecoinAddress);
    protocolModule = IProtocolModule(_protocolModuleAddress);
  }

  // External functions

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
  function requestWrappedSongRelease(address _distributorWallet) external onlyOwner {
    protocolModule.requestWrappedSongRelease(address(this), _distributorWallet);
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
  ) external onlyOwner {
    require(percentage > 0 && percentage <= 100, 'Invalid percentage');

    sharesForSale[sharesId] = SaleInfo({
      pricePerShare: pricePerShare,
      percentageForSale: percentage
    });

    emit SharesSetForSale(address(this), percentage, pricePerShare);
  }

  /**
   * @dev Transfers song shares to a recipient.
   * @param amount The amount of shares to be transferred.
   * @param to The address of the recipient.
   */
  function transferSongShares(uint256 amount, address to) external onlyOwner {
    require(getSongSharesBalance(owner()) >= amount, 'Insufficient shares balance');
    newWSTokenManagement.safeTransferFrom(owner(), to, songSharesId, amount, '');
  }

  /**
   * @dev Batch transfers shares to multiple recipients.
   * @param amounts The amounts of shares to be transferred.
   * @param recipients The addresses of the recipients.
   */
  function batchTransferShares(
    uint256[] memory amounts,
    address[] memory recipients
  ) external onlyOwner {
    require(amounts.length == recipients.length, 'Arrays must be the same length');
    
    uint256 totalAmount = 0;
    for (uint256 i = 0; i < amounts.length; i++) {
      totalAmount += amounts[i];
    }
    
    require(getSongSharesBalance(owner()) >= totalAmount, 'Not enough shares to transfer');

    for (uint256 i = 0; i < recipients.length; i++) {
      newWSTokenManagement.safeTransferFrom(owner(), recipients[i], songSharesId, amounts[i], '');
    }
  }

  /**
   * @dev Receives ERC20 tokens and processes them as earnings.
   * @param token The address of the ERC20 token being received.
   * @param amount The amount of tokens being received.
   */
  function receiveERC20(address token, uint256 amount) external {
    require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
    _processEarnings(amount, token);
  }

  /**
   * @dev Receives earnings in the form of ETH or the selected stablecoin.
   * @notice This function can be called by anyone to add earnings to the contract.
   */
  function receiveEarnings() external payable {
    uint256 ethAmount = msg.value;
    uint256 stablecoinAmount = stablecoin.balanceOf(address(this)) - totalDistributedEarnings;
    
    require(ethAmount > 0 || stablecoinAmount > 0, "No new earnings received");
    
    if (ethAmount > 0) {
        _processEarnings(ethAmount, address(0));
    }
    
    if (stablecoinAmount > 0) {
        require(stablecoin.transferFrom(msg.sender, address(this), stablecoinAmount), "Stablecoin transfer failed");
        _processEarnings(stablecoinAmount, address(stablecoin));
    }
  }

  /**
   * @dev Allows a shareholder to claim their earnings in all received tokens.
   */
  function claimEarnings() external {
    updateEarnings();
    uint256 totalAmount = unclaimedEarnings[msg.sender];
    require(totalAmount > 0, "No earnings to claim");
    
    unclaimedEarnings[msg.sender] = 0;
    
    uint256 ethShare = (ethBalance * totalAmount) / totalDistributedEarnings;
    if (ethShare > 0) {
        ethBalance -= ethShare;
        (bool success, ) = msg.sender.call{value: ethShare}("");
        require(success, "ETH transfer failed");
        emit EarningsClaimed(msg.sender, address(0), ethShare);
    }
    
    for (uint i = 0; i < receivedTokens.length; i++) {
        address token = receivedTokens[i];
        uint256 tokenBalance = IERC20(token).balanceOf(address(this));
        uint256 tokenShare = (tokenBalance * totalAmount) / totalDistributedEarnings;
        if (tokenShare > 0) {
            require(IERC20(token).transfer(msg.sender, tokenShare), "Token transfer failed");
            emit EarningsClaimed(msg.sender, token, tokenShare);
        }
    }
  }

  /**
   * @dev Updates the earnings for the caller.
   */
  function updateEarnings() public {
    uint256 shares = newWSTokenManagement.balanceOf(msg.sender, songSharesId);
    uint256 newEarnings = (shares * accumulatedEarningsPerShare) / 1e18 - lastClaimedEarningsPerShare[msg.sender];
    if (newEarnings > 0) {
        unclaimedEarnings[msg.sender] += newEarnings;
        lastClaimedEarningsPerShare[msg.sender] = accumulatedEarningsPerShare;
        emit EarningsUpdated(msg.sender, newEarnings);
    }
  }

  /**
   * @dev Requests an update to the metadata if the song has been released.
   * @param tokenId The ID of the token to update.
   * @param newMetadata The new metadata to be set.
   */
  function requestUpdateMetadata(uint256 tokenId, string memory newMetadata) external onlyOwner {
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

  /**
   * @dev Initiates the withdrawal of sale funds from the WSTokenManagement contract.
   */
  function withdrawSaleFundsFromWSTokenManagement() external onlyOwner {
    newWSTokenManagement.withdrawFunds();
  }

  // Public functions

  /**
   * @dev Registers a new song with the given URI and creates fungible shares.
   * @param songURI The URI of the song.
   * @param sharesAmount The amount of shares to be created.
   * @param sharesURI The URI for the shares.
   * @param creator The address of the creator.
   * @return songId The ID of the registered song.
   * @return newSongSharesId The ID of the created fungible shares.
   */
  function createsWrappedSongTokens(
    string memory songURI,
    uint256 sharesAmount,
    string memory sharesURI,
    address creator
  ) public returns (uint256 songId, uint256 newSongSharesId) {
    songId = newWSTokenManagement.createSongConcept(songURI, address(this));
    wrappedSongTokenId = songId;
    newSongSharesId = newWSTokenManagement.createFungibleSongShares(
      songId,
      sharesAmount,
      sharesURI,
      creator
    );
    songSharesId = newSongSharesId;
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
   * @param sharesURI The URI for the shares.
   * @param creator The address of the creator.
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

  // View functions

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
   * @dev Returns the unclaimed earnings for a given account.
   * @param account The address to check unclaimed earnings for.
   * @return The amount of unclaimed earnings.
   */
  function getUnclaimedEarnings(address account) public view returns (uint256) {
    uint256 shares = newWSTokenManagement.balanceOf(account, songSharesId);
    uint256 newEarnings = (shares * accumulatedEarningsPerShare) / 1e18 - lastClaimedEarningsPerShare[account];
    return unclaimedEarnings[account] + newEarnings;
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
   * @dev Checks the authenticity of the contract.
   * @return A boolean indicating if the contract is authentic.
   */
  function checkAuthenticity() public view returns (bool) {
    return protocolModule.isAuthentic(address(this));
  }

  /**
   * @dev Returns an array of all ERC20 token addresses received by the contract.
   * @return An array of token addresses.
   */
  function getReceivedTokens() public view returns (address[] memory) {
    return receivedTokens;
  }

  // ERC1155Receiver functions

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

  // Internal functions

  /**
   * @dev Internal function to process received earnings.
   * @param amount The amount of tokens or ETH received.
   * @param token The address of the token received, or address(0) for ETH.
   */
  function _processEarnings(uint256 amount, address token) private {
    uint256 totalShares = newWSTokenManagement.totalSupply(songSharesId);
    require(totalShares > 0, "No shares exist");
    
    uint256 earningsPerShare = (amount * 1e18) / totalShares;
    accumulatedEarningsPerShare += earningsPerShare;
    totalDistributedEarnings += amount;
    
    if (token == address(0)) {
        ethBalance += amount;
    } else {
        if (!isTokenReceived[token]) {
            receivedTokens.push(token);
            isTokenReceived[token] = true;
            emit TokenReceived(token);
        }
    }
    
    emit EarningsReceived(token, amount, earningsPerShare);
  }

  // Fallback function

  /**
   * @dev Function to receive ETH. It automatically processes it as earnings.
   */
  receive() external payable {
    if (msg.sender == address(newWSTokenManagement)) {
      saleFunds += msg.value;
      emit SaleFundsReceived(msg.value);
    } else {
      _processEarnings(msg.value, address(0));
    }
  }
}