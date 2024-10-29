// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import './WSTokensManagement.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IDistributorWallet.sol';
import './../Interfaces/IMetadataModule.sol';

contract WrappedSongSmartAccount is
  Ownable,
  IERC1155Receiver,
  ERC165,
  ReentrancyGuard
{
  // State variables
  WSTokenManagement public immutable newWSTokenManagement;
  IERC20 public immutable stablecoin;
  IProtocolModule public immutable protocolModule;
  IMetadataModule public immutable metadataModule;

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

  mapping(address => uint256) public totalEarnings;
  mapping(address => uint256) public redeemedEarnings;

  // Events
  event EarningsReceived(
    address indexed token,
    uint256 amount,
    uint256 earningsPerShare
  );
  event EarningsClaimed(
    address indexed account,
    address indexed token,
    uint256 amount,
    uint256 totalAmount
  );
  event EarningsUpdated(
    address indexed account,
    uint256 newEarnings,
    uint256 totalEarnings
  );
  event SaleFundsReceived(uint256 amount);
  event SaleFundsWithdrawn(address indexed to, uint256 amount);
  event SongSharesTransferred(
    address indexed from,
    address indexed to,
    uint256 amount
  );
  // event BatchSongSharesTransferred(address indexed from, address[] recipients, uint256[] amounts);

  /**
   * @dev Initializes the contract with the given parameters and creates song tokens.
   * @param _stablecoinAddress The address of the stablecoin contract.
   * @param _owner The address of the owner.
   * @param _protocolModuleAddress The address of the ProtocolModule contract.
   * @param sharesAmount The amount of shares to be created.
   */
  constructor(
    address _stablecoinAddress,
    address _owner,
    address _protocolModuleAddress,
    uint256 sharesAmount
  ) Ownable(_owner) {
    stablecoin = IERC20(_stablecoinAddress);
    protocolModule = IProtocolModule(_protocolModuleAddress);
    metadataModule = IMetadataModule(protocolModule.metadataModule());
    
    newWSTokenManagement = new WSTokenManagement(address(this), _owner, address(protocolModule.metadataModule()), _protocolModuleAddress);

    _createSongTokens(sharesAmount, _owner);
  }

  // Internal functions
  /**
   * @dev Creates wrapped song tokens and metadata.
   * @param sharesAmount The amount of shares to be created.
   * @param creator The address of the creator.
   */
  function _createSongTokens(uint256 sharesAmount, address creator) internal {
    newWSTokenManagement.createSongTokens(sharesAmount);
  }

  // External functions

  /**
   * @dev Requests the release of the wrapped song with a metadata update.
   * @param _distributorWallet The address of the distributor wallet.
   * @param newMetadata The new metadata for the song.
   */
  function requestWrappedSongReleaseWithMetadata(
    address _distributorWallet,
    IMetadataModule.Metadata memory newMetadata
  ) external onlyOwner {
    metadataModule.updateMetadata(address(this), newMetadata);
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
   * @dev Receives ERC20 tokens and processes them as earnings.
   * @param token The address of the ERC20 token being received.
   * @param amount The amount of tokens being received.
   */
  function receiveERC20(address token, uint256 amount) external {
    require(
      IERC20(token).transferFrom(msg.sender, address(this), amount),
      'Transfer failed'
    );
    _processEarnings(amount, token);
  }

  /**
   * @dev Redeems the shares for the WrappedSong as established by the Distributor.
   */
  function redeemShares() external nonReentrant {
    address distributor = protocolModule.getWrappedSongDistributor(
      address(this)
    );
    require(
      distributor != address(0),
      'No distributor set for this wrapped song'
    );
    IDistributorWallet(distributor).redeemWrappedSongEarnings(address(this));
  }

  /**
   * @dev Receives earnings in the form of the wrapped song's stablecoin.
   * @notice This function can be called by anyone to add earnings to the contract.
   */
  function receiveEarnings() external payable {
    uint256 previousBalance = stablecoin.balanceOf(address(this));
    require(
      stablecoin.transferFrom(msg.sender, address(this), msg.value),
      'Stablecoin transfer failed'
    );
    uint256 newBalance = stablecoin.balanceOf(address(this));
    uint256 receivedAmount = newBalance - previousBalance;

    require(receivedAmount > 0, 'No new earnings received');

    _processEarnings(receivedAmount, address(stablecoin));
  }

  /**
   * @dev Allows a shareholder to claim their earnings in the wrapped song's stablecoin.
   * @notice This function allows shareholders to claim their earnings.
   * @dev Uses a reentrancy guard to prevent reentrancy attacks.
   */
  function claimEarnings() external nonReentrant {
    updateEarnings();

    uint256 totalAmount = unclaimedEarnings[msg.sender];
    require(totalAmount > 0, 'No earnings to claim');

    // Cache state variables in local variables
    uint256 stablecoinBalance = stablecoin.balanceOf(address(this));
    uint256 totalDistributed = totalDistributedEarnings;

    // Calculate stablecoin share
    uint256 stablecoinShare = (stablecoinBalance * totalAmount) /
      totalDistributed;
    require(stablecoinShare > 0, 'No stablecoin earnings to claim');

    // Update state variables
    unclaimedEarnings[msg.sender] = 0;
    redeemedEarnings[msg.sender] += totalAmount;

    // Transfer stablecoins
    require(
      stablecoin.transfer(msg.sender, stablecoinShare),
      'Stablecoin transfer failed'
    );

    // Emit events
    emit EarningsClaimed(
      msg.sender,
      address(stablecoin),
      stablecoinShare,
      totalAmount
    );
  }

  /**
   * @dev Allows a shareholder to claim their earnings in ETH.
   */
  function claimEthEarnings() external {
    updateEarnings();
    uint256 totalAmount = unclaimedEarnings[msg.sender];
    require(totalAmount > 0, 'No earnings to claim');

    uint256 ethShare = (ethBalance * totalAmount) / totalDistributedEarnings;
    require(ethShare > 0, 'No ETH earnings to claim');

    unclaimedEarnings[msg.sender] = 0;
    redeemedEarnings[msg.sender] += totalAmount;
    ethBalance -= ethShare;

    (bool success, ) = msg.sender.call{value: ethShare}('');
    require(success, 'ETH transfer failed');
    emit EarningsClaimed(msg.sender, address(0), ethShare, totalAmount);
  }

  /**
   * @dev Updates the earnings for the caller.
   */
  function updateEarnings() public {
    uint256 shares = newWSTokenManagement.balanceOf(msg.sender, songSharesId);
    uint256 newEarnings = (shares * accumulatedEarningsPerShare) /
      1e18 -
      lastClaimedEarningsPerShare[msg.sender];
    if (newEarnings > 0) {
      unclaimedEarnings[msg.sender] += newEarnings;
      lastClaimedEarningsPerShare[msg.sender] = accumulatedEarningsPerShare;
      totalEarnings[msg.sender] += newEarnings;
      emit EarningsUpdated(msg.sender, newEarnings, totalEarnings[msg.sender]);
    }
  }

  /**
   * @dev Requests an update to the metadata if the song has been released.
   * @param newMetadata The new metadata to be set.
   */
  function requestUpdateMetadata(
    IMetadataModule.Metadata memory newMetadata
  ) external onlyOwner {
    require(
      protocolModule.isReleased(address(this)),
      'Song not released, update metadata directly'
    );
    metadataModule.requestUpdateMetadata(address(this), newMetadata);
  }

  /**
   * @dev Updates the metadata directly if the song has not been released.
   * @param newMetadata The new metadata to be set.
   */
  function updateMetadata(
    IMetadataModule.Metadata memory newMetadata
  ) public onlyOwner {
    require(
      !protocolModule.isReleased(address(this)),
      'Cannot update metadata directly after release, request update instead'
    );
    metadataModule.updateMetadata(address(this), newMetadata);
  }

  /**
   * @dev Initiates the withdrawal of sale funds from the WSTokenManagement contract.
   */
  function withdrawSaleFundsFromWSTokenManagement() external onlyOwner {
    newWSTokenManagement.withdrawFunds();
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
 M  * @dev Indicates whether a contract implements the `IERC1155Receiver` interface.
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
  function _processEarnings(uint256 amount, address token) private {
    uint256 totalShares = newWSTokenManagement.totalSupply(songSharesId);
    require(totalShares > 0, 'No shares exist');

    uint256 earningsPerShare = (amount * 1e18) / totalShares;
    accumulatedEarningsPerShare += earningsPerShare;
    totalDistributedEarnings += amount;

    if (token != address(stablecoin) && token != address(0)) {
      if (!isTokenReceived[token]) {
        receivedTokens.push(token);
        isTokenReceived[token] = true;
      }
    }

    emit EarningsReceived(token, amount, earningsPerShare);
  }

  function getWSTokenManagementAddress() external view returns (address) {
    return address(newWSTokenManagement);
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
