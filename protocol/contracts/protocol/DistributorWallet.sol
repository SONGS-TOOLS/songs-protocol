// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import './WrappedSongSmartAccount.sol';
import './ProtocolModule.sol';

contract DistributorWallet is Initializable, UUPSUpgradeable, OwnableUpgradeable {
  IERC20Upgradeable public stablecoin;
  ProtocolModule public protocolModule;
  mapping(address => uint256) public wrappedSongTreasury;
  address[] public managedWrappedSongs;

  event WrappedSongReleaseRequested(address indexed wrappedSong);
  event WrappedSongReleased(address indexed wrappedSong);

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
    __Ownable_init();
    __UUPSUpgradeable_init();
    stablecoin = IERC20Upgradeable(_stablecoin);
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
   * @dev Distributes earnings to the specified wrapped song.
   * @param _wrappedSong The address of the wrapped song.
   */
  function distributeEarnings(address _wrappedSong) external {
    uint256 amount = wrappedSongTreasury[_wrappedSong];
    require(amount > 0, 'No earnings to distribute');
    wrappedSongTreasury[_wrappedSong] = 0;
    WrappedSong(_wrappedSong).receiveEarnings(amount);
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
   * @dev Authorizes the upgrade of the contract. Only the owner can authorize upgrades.
   * @param newImplementation The address of the new implementation contract.
   */
  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}