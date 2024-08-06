// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './WrappedSongSmartAccount.sol';
import './../Interfaces/IProtocolModule.sol';
import 'hardhat/console.sol';

contract DistributorWallet is Ownable {
  IERC20 public stablecoin;
  IProtocolModule public protocolModule;
  mapping(address => uint256) public wrappedSongTreasury;
  address[] public managedWrappedSongs;
  // TODO: CHECK THIS and the function
  uint256 public currentBatchIndex; // Added this line to declare currentBatchIndex

  event WrappedSongReleaseRequested(address indexed wrappedSong);
  event WrappedSongReleased(address indexed wrappedSong);
  event WrappedSongRedeemed(address indexed wrappedSong, uint256 amount);
  event WrappedSongReleaseRejected(address indexed wrappedSong);
  event MetadataUpdateRequested(
    address indexed wrappedSong,
    uint256 indexed tokenId,
    string newMetadata
  );
  event MetadataUpdated(
    address indexed wrappedSong,
    uint256 indexed tokenId,
    string newMetadata
  );
  event MetadataUpdateRejected(
    address indexed wrappedSong,
    uint256 indexed tokenId
  );

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
    stablecoin = IERC20(_stablecoin);
    protocolModule = IProtocolModule(_protocolModule);
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
  function setAccounting(
    address _wrappedSong,
    uint256 _amount
  ) external onlyOwner {
    wrappedSongTreasury[_wrappedSong] = _amount;
  }

  /**
   * @dev Sets the accounting for multiple wrapped songs in a batch.
   * @param _wrappedSongs The addresses of the wrapped songs.
   * @param _amounts The amounts of stablecoin to be set for each wrapped song.
   * @param _totalAmount The total amount of stablecoin received.
   * @param _batchSize The number of items to process per call.
   */
  function setAccountingBatch(
    address[] calldata _wrappedSongs,
    uint256[] calldata _amounts,
    uint256 _totalAmount,
    uint256 _batchSize
  ) external onlyOwner {
    require(
      _wrappedSongs.length == _amounts.length,
      'Mismatched input lengths'
    );

    uint256 sum = 0;
    for (uint256 i = 0; i < _wrappedSongs.length; i++) {
      sum += _amounts[i];
    }
    require(
      sum == _totalAmount,
      'Total amount does not match sum of individual amounts'
    );

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
    require(
      msg.sender == Ownable(_wrappedSong).owner(),
      'Only wrapped song owner can redeem'
    );
    uint256 amount = wrappedSongTreasury[_wrappedSong];
    require(amount > 0, 'No earnings to redeem');
    wrappedSongTreasury[_wrappedSong] = 0;
    require(stablecoin.transfer(msg.sender, amount), 'Transfer failed');
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
   * @dev Rejects the release of a wrapped song.
   * @param wrappedSong The address of the wrapped song to be rejected.
   */
  function rejectWrappedSongRelease(address wrappedSong) external onlyOwner {
    console.log('Start Rejecting release for wrapped song:', wrappedSong);
    require(
      protocolModule.getPendingDistributorRequests(wrappedSong) ==
        address(this),
      'Not the pending distributor for this wrapped song'
    );
    console.log('Rejecting release for wrapped song:', wrappedSong);

    protocolModule.rejectWrappedSongRelease(wrappedSong);
    emit WrappedSongReleaseRejected(wrappedSong);
  }

  /**
   * @dev Confirms the release of a wrapped song and adds it to the managed wrapped songs.
   * @param wrappedSong The address of the wrapped song to be released.
   */
  function confirmWrappedSongRelease(address wrappedSong) external onlyOwner {
    console.log('Start Confirming release for wrapped song:', wrappedSong);
    require(
      protocolModule.getPendingDistributorRequests(wrappedSong) ==
        address(this),
      'Not the pending distributor for this wrapped song'
    );
    console.log('Confirming release for wrapped song:', wrappedSong);

    protocolModule.confirmWrappedSongRelease(wrappedSong);
    managedWrappedSongs.push(wrappedSong);

    emit WrappedSongReleased(wrappedSong);
  }

  /**
   * @dev Confirms the update to the metadata.
   * @param wrappedSong The address of the wrapped song.
   * @param tokenId The ID of the token to update.
   */
  function confirmUpdateMetadata(
    address wrappedSong,
    uint256 tokenId
  ) external onlyOwner {
    require(
      keccak256(bytes(protocolModule.getPendingMetadataUpdate(wrappedSong, tokenId))) != keccak256(bytes("")),
      'No pending metadata update for this token'
    );
    require(
      protocolModule.getWrappedSongDistributor(wrappedSong) == address(this),
      'Not the distributor for this wrapped song'
    );
    protocolModule.confirmUpdateMetadata(wrappedSong, tokenId);
    emit MetadataUpdated(
      wrappedSong,
      tokenId,
      protocolModule.getPendingMetadataUpdate(wrappedSong, tokenId)
    );
  }

  /**
   * @dev Rejects the update to the metadata.
   * @param wrappedSong The address of the wrapped song.
   * @param tokenId The ID of the token to update.
   */
  function rejectUpdateMetadata(
    address wrappedSong,
    uint256 tokenId
  ) external onlyOwner {
    require(
      keccak256(bytes(protocolModule.getPendingMetadataUpdate(wrappedSong, tokenId))) != keccak256(bytes("")),
      'No pending metadata update for this token'
    );
    require(
      protocolModule.getWrappedSongDistributor(wrappedSong) == address(this),
      'Not the distributor for this wrapped song'
    );
    protocolModule.rejectUpdateMetadata(wrappedSong, tokenId);
    emit MetadataUpdateRejected(wrappedSong, tokenId);
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
}