// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './WrappedSongSmartAccount.sol';
import './../Interfaces/IProtocolModule.sol';

contract DistributorWallet is Ownable {
  IERC20 public stablecoin;
  IProtocolModule public protocolModule;
  mapping(address => uint256) public wrappedSongTreasury;
  address[] public managedWrappedSongs;
  uint256 public currentBatchIndex;

  event WrappedSongReleaseRequested(address indexed wrappedSong);
  event WrappedSongReleased(address indexed wrappedSong);
  event WrappedSongRedeemed(address indexed wrappedSong, uint256 amount);
  event WrappedSongReleaseRejected(address indexed wrappedSong);
  event WrappedSongAcceptedForReview(address indexed wrappedSong);
  event FundsReceived(address indexed from, uint256 amount, string currency);

  /**
   * @dev Constructor to initialize the contract with the given parameters.
   * @param _stablecoin The address of the stablecoin contract.
   * @param _protocolModule The address of the protocol module contract.
   * @param _owner The address of the owner.
   */
  constructor(
    address _stablecoin,
    address _protocolModule,
    address _owner
  ) Ownable(_owner) {
    protocolModule = IProtocolModule(_protocolModule);
    stablecoin = IERC20(_stablecoin);
  }

  // Payment Functions

  /**
   * @dev Receives ETH and updates the treasury for the specified wrapped song.
   * @param _wrappedSong The address of the wrapped song.
   */
  function receivePaymentETH(address _wrappedSong) external payable {
    require(msg.value > 0, "No ETH sent");
    wrappedSongTreasury[_wrappedSong] += msg.value;
    emit FundsReceived(msg.sender, msg.value, "ETH");
  }

  /**
   * @dev Receives stablecoin and updates the treasury for the specified wrapped song.
   * @param _wrappedSong The address of the wrapped song.
   * @param _amount The amount of stablecoin to be received.
   */
  function receivePaymentStablecoin(address _wrappedSong, uint256 _amount) external {
    require(
      stablecoin.transferFrom(msg.sender, address(this), _amount),
      'Transfer failed'
    );
    wrappedSongTreasury[_wrappedSong] += _amount;
    emit FundsReceived(msg.sender, _amount, "Stablecoin");
  }

  /**
   * @dev Receives ETH and updates the treasury for the specified wrapped songs.
   * @param _wrappedSongs The addresses of the wrapped songs.
   * @param _amounts The amounts of ETH to be received for each wrapped song.
   */
  function receiveBatchPaymentETH(address[] calldata _wrappedSongs, uint256[] calldata _amounts) external payable onlyOwner {
    // TODO : Gas controlling on the loop
    require(_wrappedSongs.length == _amounts.length, "Mismatched input lengths");

    uint256 totalAmount = msg.value;
    uint256 sum = 0;
    for (uint256 i = 0; i < _amounts.length; i++) {
      sum += _amounts[i];
    }
    require(sum == totalAmount, "Total amount does not match sum of individual amounts");

    for (uint256 i = 0; i < _wrappedSongs.length; i++) {
      wrappedSongTreasury[_wrappedSongs[i]] += _amounts[i];
    }

    emit FundsReceived(msg.sender, totalAmount, "ETH");
  }

  /**
   * @dev Receives stablecoin and updates the treasury for the specified wrapped songs.
   * @param _wrappedSongs The addresses of the wrapped songs.
   * @param _amounts The amounts of stablecoin to be received for each wrapped song.
   * @param _totalAmount The total amount of stablecoin to be received.
   */
  function receiveBatchPaymentStablecoin(address[] calldata _wrappedSongs, uint256[] calldata _amounts, uint256 _totalAmount) external onlyOwner {
    require(_wrappedSongs.length == _amounts.length, "Mismatched input lengths");

    uint256 sum = 0;
    for (uint256 i = 0; i < _amounts.length; i++) {
      sum += _amounts[i];
    }
    require(sum == _totalAmount, "Total amount does not match sum of individual amounts");

    require(stablecoin.transferFrom(msg.sender, address(this), _totalAmount), "Transfer failed");

    for (uint256 i = 0; i < _wrappedSongs.length; i++) {
      wrappedSongTreasury[_wrappedSongs[i]] += _amounts[i];
    }

    emit FundsReceived(msg.sender, _totalAmount, "Stablecoin");
  }

  // Redemption Functions

  /**
   * @dev Redeems the amount for the owner of the wrapped song.
   * @param _wrappedSong The address of the wrapped song.
   */
  function redeemWrappedSongEarnings(address _wrappedSong) external {
    uint256 amount = wrappedSongTreasury[_wrappedSong];
    require(amount > 0, 'No earnings to redeem');
    wrappedSongTreasury[_wrappedSong] = 0;
    require(stablecoin.transfer(_wrappedSong, amount), 'Transfer failed');
    emit WrappedSongRedeemed(_wrappedSong, amount);
  }

  /**
   * @dev Redeems the amount for the owner of the wrapped song in ETH.
   * @param _wrappedSong The address of the wrapped song.
   */
  
  // TODO : Add nonReentrant
  function redeemETH(address payable _wrappedSong) external {
    require(
      msg.sender == Ownable(_wrappedSong).owner(),
      'Only wrapped song owner can redeem'
    );
    uint256 amount = wrappedSongTreasury[_wrappedSong];
    require(amount > 0, 'No earnings to redeem');
    wrappedSongTreasury[_wrappedSong] = 0;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, 'Transfer failed');
    emit WrappedSongRedeemed(_wrappedSong, amount);
  }

  // TODO : add Redeem Stable Coin


 // Metadata Functions

  /**
   * @dev Confirms the update to the metadata.
   * @param wrappedSong The address of the wrapped song.
   */
  function confirmUpdateMetadata(address wrappedSong) external onlyOwner {
    require(
      !protocolModule.metadataModule().isMetadataUpdateConfirmed(wrappedSong),
      'No pending metadata update for this wrapped song'
    );
    require(
      protocolModule.getWrappedSongDistributor(wrappedSong) == address(this),
      'Not the distributor for this wrapped song'
    );
    protocolModule.metadataModule().confirmUpdateMetadata(wrappedSong);
  }

  /**
   * @dev Rejects the update to the metadata.
   * @param wrappedSong The address of the wrapped song.
   */
  function rejectUpdateMetadata(address wrappedSong) external onlyOwner {
    require(
      !protocolModule.metadataModule().isMetadataUpdateConfirmed(wrappedSong),
      'No pending metadata update for this wrapped song'
    );
    require(
      protocolModule.getWrappedSongDistributor(wrappedSong) == address(this),
      'Not the distributor for this wrapped song'
    );
    protocolModule.metadataModule().rejectUpdateMetadata(wrappedSong);
  }


  // Wrapped Song Management Functions

  /**
   * @dev Confirms the release of a wrapped song and adds it to the managed wrapped songs.
   * @param wrappedSong The address of the wrapped song to be released.
   */
  function confirmWrappedSongRelease(address wrappedSong) external onlyOwner {
    require(
      protocolModule.getPendingDistributorRequests(wrappedSong) == address(this),
      'Not the pending distributor for this wrapped song'
    );

    protocolModule.confirmWrappedSongRelease(wrappedSong);
    managedWrappedSongs.push(wrappedSong);

    emit WrappedSongReleased(wrappedSong);
  }

  function acceptWrappedSongForReview(address wrappedSong) external onlyOwner {
    protocolModule.acceptWrappedSongForReview(wrappedSong);
    emit WrappedSongAcceptedForReview(wrappedSong);
  }

  function rejectWrappedSongRelease(address wrappedSong) external onlyOwner {
    protocolModule.rejectWrappedSongRelease(wrappedSong);
    emit WrappedSongReleaseRejected(wrappedSong);
  }

  // Fallback Functions

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

  // ERC20 Token Handling

  /**
   * @dev Receives ERC20 tokens.
   */
  function receiveERC20() external {
    // Handle ERC20 token reception
  }
}
