// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import './WrappedSongSmartAccount.sol';
import './ProtocolModule.sol';

contract DistributorWallet is Initializable, UUPSUpgradeable, OwnableUpgradeable {
  IERC20 public stablecoin;
  ProtocolModule public protocolModule;
  mapping(address => uint256) public wrappedSongTreasury;
  address[] public managedWrappedSongs;
  // TODO: CHECK THIS and the function
  uint256 public currentBatchIndex; // Added this line to declare currentBatchIndex

  event WrappedSongReleaseRequested(address indexed wrappedSong);
  event WrappedSongReleased(address indexed wrappedSong);
  event WrappedSongRedeemed(address indexed wrappedSong, uint256 amount);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @dev Initializes the contract with the given parameters.
   * @param _stablecoin The address of the stablecoin contract.
   * @param _protocolModule The address of the protocol module contract.
   */
  function initialize(address _stablecoin, address _protocolModule) public initializer {
    __Ownable_init(msg.sender); // Pass the initial owner
    __UUPSUpgradeable_init();
    stablecoin = IERC20(_stablecoin);
    protocolModule = ProtocolModule(_protocolModule);
  }

  /**
   * @dev Receives payment in stablecoin and updates the treasury for the specified wrapped song.
   * @param _wrappedSong The address of the wrapped song.
   * @param _amount The amount of stablecoin to be received.
   */
  function receivePayment(address _wrappedSong, uint256 _amount) external {
    require(
      stablecoin.transferFrom(msg.sender, address(this), _amount),
      'Transfer failed'
    );
    wrappedSongTreasury[_wrappedSong] += _amount;
  }

  /**
   * @dev Sets the accounting for a single wrapped song.
   * @param _wrappedSong The address of the wrapped song.
   * @param _amount The amount of stablecoin to be set.
   */
  function setAccounting(address _wrappedSong, uint256 _amount) external onlyOwner {
    wrappedSongTreasury[_wrappedSong] = _amount;
  }

  /**
   * @dev Sets the accounting for multiple wrapped songs in a batch.
   * @param _wrappedSongs The addresses of the wrapped songs.
   * @param _amounts The amounts of stablecoin to be set for each wrapped song.
   * @param _totalAmount The total amount of stablecoin received.
   * @param _batchSize The number of items to process per call.
   */
  function setAccountingBatch(address[] calldata _wrappedSongs, uint256[] calldata _amounts, uint256 _totalAmount, uint256 _batchSize) external onlyOwner {
    require(_wrappedSongs.length == _amounts.length, "Mismatched input lengths");

    uint256 sum = 0;
    for (uint256 i = 0; i < _wrappedSongs.length; i++) {
      sum += _amounts[i];
    }
    require(sum == _totalAmount, "Total amount does not match sum of individual amounts");

    uint256 endIndex = currentBatchIndex + _batchSize;
    if (endIndex > _wrappedSongs.length) {
      endIndex = _wrappedSongs.length;
    }

    for (uint256 i = currentBatchIndex; i < endIndex; i++) {
      wrappedSongTreasury[_wrappedSongs[i]] = _amounts[i];
    }

    currentBatchIndex = endIndex;

    if (currentBatchIndex == _wrappedSongs.length) {
      currentBatchIndex = 0; // Reset for the next batch
    }
  }

  /**
   * @dev Redeems the amount for the owner of the wrapped song.
   * @param _wrappedSong The address of the wrapped song.
   */
  function redeem(address _wrappedSong) external {
    require(msg.sender == Ownable(_wrappedSong).owner(), "Only wrapped song owner can redeem");
    uint256 amount = wrappedSongTreasury[_wrappedSong];
    require(amount > 0, "No earnings to redeem");
    wrappedSongTreasury[_wrappedSong] = 0;
    require(stablecoin.transfer(msg.sender, amount), "Transfer failed");
    emit WrappedSongRedeemed(_wrappedSong, amount);
  }

  /**
   * @dev Distributes earnings to the specified wrapped song.
   * @param _wrappedSong The address of the wrapped song.
   */
  function distributeEarnings(address _wrappedSong) external onlyOwner {
    uint256 amount = wrappedSongTreasury[_wrappedSong];
    require(amount > 0, 'No earnings to distribute');
    wrappedSongTreasury[_wrappedSong] = 0;
    WrappedSongSmartAccount(_wrappedSong).receiveEarnings(amount);
  }

  /**
   * @dev Confirms the release of a wrapped song and adds it to the managed wrapped songs.
   * @param wrappedSong The address of the wrapped song to be released.
   */
  function confirmWrappedSongRelease(address wrappedSong) external {
    require(
        protocolModule.getPendingDistributor(wrappedSong) == address(this),
        'Not the pending distributor for this wrapped song'
    );

    protocolModule.confirmWrappedSongRelease(wrappedSong);
    managedWrappedSongs.push(wrappedSong);

    emit WrappedSongReleased(wrappedSong);
  }

  /**
   * @dev Fallback function to receive Ether payments.
   */
  receive() external payable {
    // Handle Ether payments
  }

  /**
   * @dev Fallback function to handle calls to the contract.
   */
  fallback() external payable {
    // Handle other calls
  }

  /**
   * @dev Authorizes the upgrade of the contract. Only the owner can authorize upgrades.
   * @param newImplementation The address of the new implementation contract.
   */
  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}