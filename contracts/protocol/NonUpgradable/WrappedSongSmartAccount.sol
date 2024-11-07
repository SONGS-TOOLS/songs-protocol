// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./WSTokensManagement.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IDistributorWallet.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/IDistributorWalletFactory.sol";

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
  IMetadataModule public metadataModule;

  uint256 public songSharesId;
  uint256 public wrappedSongTokenId;

  uint256 public accumulatedEarningsPerShare;
  mapping(address => uint256) public userShares;
  mapping(address => uint256) public earningsPerSharePaid;
  uint256 public totalDistributedEarnings;
  uint256 public ethBalance;
  uint256 public saleFunds;

  address[] public receivedTokens;
  mapping(address => bool) public isTokenReceived;

  mapping(address => uint256) public totalEarnings;
  mapping(address => uint256) public redeemedEarnings;

  bool public migrated;

  // Add ETH specific state variables
  uint256 public accumulatedETHEarningsPerShare;
  mapping(address => uint256) public unclaimedETHEarnings;
  mapping(address => uint256) public lastClaimedETHEarningsPerShare;
  uint256 public totalDistributedETHEarnings;

  // Add ETH specific event
  event ETHEarningsClaimed(
    address indexed account,
    uint256 amount,
    uint256 totalAmount
  );

  // Add precision constant
  uint256 private constant PRECISION = 1e18;

  /**
   * @dev Modifier to prevent calls to migrated contracts.
   */
  modifier notMigrated() {
    require(!migrated, "Contract has been migrated");
    _;
  }

  modifier onlyOwnerOrDistributor() {
    require(
      msg.sender == owner() ||
        msg.sender == protocolModule.getWrappedSongDistributor(address(this)),
      "Caller is not owner or wrapped song distributor"
    );
    _;
  }

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
  event ContractMigrated(address indexed newWrappedSongAddress);

  /**
   * @dev Initializes the contract with the given parameters and creates song tokens.
   * @param _stablecoinAddress The address of the stablecoin contract.
   * @param _owner The address of the owner.
   * @param _protocolModuleAddress The address of the ProtocolModule contract.
   */
  constructor(
    address _stablecoinAddress,
    address _owner,
    address _protocolModuleAddress
  ) Ownable(_owner) {

    
    stablecoin = IERC20(_stablecoinAddress);
    protocolModule = IProtocolModule(_protocolModuleAddress);
    metadataModule = IMetadataModule(protocolModule.metadataModule());
    
    // TODO: get from WSTokenManagement
    wrappedSongTokenId = 0;
    songSharesId = 1;

    newWSTokenManagement = new WSTokenManagement(
      address(this), // Smart account address that will own the WSTokenManagement contract
      _owner, // Minter address that will receive initial song shares
      _protocolModuleAddress // Protocol module address for contract verification
    );
  }

  /**
   * @dev Returns the address of the WSTokenManagement contract.
   * @return The address of the WSTokenManagement contract.
   */
  function getWSTokenManagementAddress() external view returns (address) {
    return address(newWSTokenManagement);
  }

  /**
   * @dev Creates the initial song shares. Can only be called by owner or factory.
   * @param sharesAmount The amount of shares to create
   */
  function createSongShares(uint256 sharesAmount) external {
    require(
      msg.sender == owner() || msg.sender == protocolModule.wrappedSongFactoryAddress(),
      "Caller is not owner or factory"
    );
    require(
      newWSTokenManagement.totalSupply(1) == 0,
      "Shares already initialized"
    );
    newWSTokenManagement.createSongShares(sharesAmount);
  }

  /**
   * @dev Creates a buyout token. Can only be called by owner.
   * @param amount The amount of buyout tokens to create
   * @param recipient The address that will receive the buyout token
   */
  function createBuyoutToken(
    uint256 amount,
    address recipient
  ) external onlyOwner {
    newWSTokenManagement.createBuyoutToken(amount, recipient);
  }

  /**
   * @dev Creates a new legal contract token. Can only be called by owner or wrapped song distributor.
   * @param contractURI The URI for the legal contract
   * @return tokenId The ID of the newly created legal contract token
   */
  function createLegalContract(
    string memory contractURI
  ) external onlyOwnerOrDistributor returns (uint256) {
    return newWSTokenManagement.createLegalContract(contractURI);
  }



  /******************************************************************************
   *                                                                             *
   *                           RELEASE MANAGEMENT                                *
   *                                                                             *
   * This section contains functions related to managing the release process     *
   * of the wrapped song. It includes functionality for requesting releases      *
   * with or without metadata updates, and handling distributor wallet          *
   * assignments.                                                               *
   *                                                                             *
   ******************************************************************************/

  /**
   * @dev Requests the release of the wrapped song with a metadata update.
   * @param _distributorWallet The address of the distributor wallet.
   * @param newMetadata The new metadata for the song.
   */
  function requestWrappedSongReleaseWithMetadata(
    address _distributorWallet,
    IMetadataModule.Metadata memory newMetadata
  ) external onlyOwner {
    require(
      _distributorWallet != address(0),
      "Invalid distributor wallet address"
    );
    require(
      _distributorWallet.code.length > 0,
      "Distributor wallet must be a contract"
    );
    require(
      IDistributorWalletFactory(protocolModule.distributorWalletFactory())
        .checkIsDistributorWallet(_distributorWallet),
      "Invalid distributor wallet: not registered in factory"
    );
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

  /******************************************************************************
   *                                                                             *
   *                           EARNINGS MANAGEMENT                               *
   *                                                                             *
   * This section contains functions related to managing earnings and            *
   * distributions for the wrapped song. It includes functionality for           *
   * receiving earnings in different tokens, claiming earnings by shareholders,  *
   * and updating earnings calculations.                                         *
   *                                                                             *
   ******************************************************************************/

  /**
   * @dev Receives ERC20 tokens and processes them as earnings.
   * @param token The address of the ERC20 token being received.
   * @param amount The amount of tokens being received.
   */
  function receiveERC20(address token, uint256 amount) external notMigrated {
    require(
      IERC20(token).transferFrom(msg.sender, address(this), amount),
      "Transfer failed"
    );
    
    _processEarnings(amount, token);
  }

  /**
   * @dev Allows a shareholder to claim their earnings in the wrapped song's stablecoin.
   * @notice This function allows shareholders to claim their earnings.
   * @dev Uses a reentrancy guard to prevent reentrancy attacks.
   */
  function claimEarnings() external nonReentrant notMigrated {
    uint256 shares = newWSTokenManagement.balanceOf(msg.sender, songSharesId);
    require(shares > 0, "No shares owned");

    // Calculate share of total earnings directly from shares
    uint256 payment = (shares * totalDistributedEarnings) / newWSTokenManagement.totalSupply(songSharesId);
    require(payment > 0, "No payment to claim");

    // Update state
    earningsPerSharePaid[msg.sender] = accumulatedEarningsPerShare;
    totalEarnings[msg.sender] += payment;
    redeemedEarnings[msg.sender] += payment;

    // Transfer tokens
    require(stablecoin.transfer(msg.sender, payment), "Transfer failed");

    emit EarningsClaimed(
        msg.sender,
        address(stablecoin),
        payment,
        payment
    );
  }

  /**
   * @dev Allows a shareholder to claim their ETH earnings
   */
  function claimETHEarnings() external nonReentrant notMigrated {
    uint256 shares = newWSTokenManagement.balanceOf(msg.sender, songSharesId);
    require(shares > 0, "No shares owned");

    // Calculate share of total ETH earnings directly from shares
    uint256 payment = (shares * totalDistributedETHEarnings) / newWSTokenManagement.totalSupply(songSharesId);
    require(payment > 0, "No ETH to claim");

    // Update state
    lastClaimedETHEarningsPerShare[msg.sender] = accumulatedETHEarningsPerShare;
    totalEarnings[msg.sender] += payment;
    redeemedEarnings[msg.sender] += payment;

    // Transfer ETH
    (bool success, ) = msg.sender.call{value: payment}("");
    require(success, "ETH transfer failed");

    emit ETHEarningsClaimed(
        msg.sender,
        payment,
        payment
    );
  }

  /**
   * @dev Modified _processEarnings to handle ETH correctly
   */
  function _processEarnings(uint256 amount, address token) private {
    uint256 totalShares = newWSTokenManagement.totalSupply(songSharesId);
    require(totalShares > 0, "No shares exist");

    if (token == address(0)) {
        // ETH earnings
        accumulatedETHEarningsPerShare += (amount * 1e18) / totalShares;
        totalDistributedETHEarnings += amount;
        ethBalance += amount;
    } else {
        // ERC20 earnings
        accumulatedEarningsPerShare += (amount * 1e18) / totalShares;
        totalDistributedEarnings += amount;
    }

    emit EarningsReceived(token, amount, amount);
  }

  /**
   * @dev Calculate pending earnings for a user
   */
  function _pendingEarnings(address user) private view returns (uint256) {
    uint256 shares = newWSTokenManagement.balanceOf(user, songSharesId);
    if (shares == 0) return 0;

    return (shares * accumulatedEarningsPerShare) / 1e18 - 
           earningsPerSharePaid[user];
  }

  /**
   * @dev View function to get pending ETH earnings for an account
   */
  function getPendingETHEarnings(address account) external view returns (uint256) {
    uint256 shares = newWSTokenManagement.balanceOf(account, songSharesId);
    if (shares == 0) return 0;

    uint256 newEarnings = 
      (shares * accumulatedETHEarningsPerShare) / 
      1e18 - lastClaimedETHEarningsPerShare[account];

    return unclaimedETHEarnings[account] + newEarnings;
  }

  /******************************************************************************
   *                                                                             *
   *                           ERC1155 RECEIVER                                  *
   *                                                                             *
   * This section contains functions required to implement the ERC1155Receiver   *
   * interface, allowing this contract to receive ERC1155 tokens. It includes    *
   * handlers for single and batch token transfers, as well as interface         *
   * support verification.                                                       *
   *                                                                             *
   ******************************************************************************/

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

  /******************************************************************************
   *                                                                             *
   *                                 MIGRATION                                    *
   *                                                                             *
   * This section contains internal functions for handling contract migration.    *
   * It includes functionality for migrating the contract to a new implementation. *
   *                                                                             *
   *                                                                             *
   ******************************************************************************/


  /**
   * @dev Migrates the wrapped song to a new WSTokenManagement contract.
   * @param metadataAddress The address of the new metadata module.
   */
  function migrateWrappedSong(
    address metadataAddress,
    address newWrappedSongAddress
  ) external onlyOwner {
    require(!migrated, "Contract already migrated");
    require(
      protocolModule.isAuthorizedContract(msg.sender),
      "Not authorized contract"
    );

    // Migrate WSTokenManagement to new metadata
    newWSTokenManagement.migrateWrappedSong(metadataAddress);
    newWSTokenManagement.transferOwnership(newWrappedSongAddress);

    // Remove metadata from old protocol
    metadataModule.removeMetadata(address(this));
    // TODO: Remove legal contract metadata

    migrated = true;
    emit ContractMigrated(newWrappedSongAddress);
  }

  // Fallback function

  /**
   * @dev Function to receive ETH. It automatically processes it as earnings.
   */
  receive() external payable {
    if(msg.value > 0) {
      _processEarnings(msg.value, address(0));
    }
  }
}
