// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './WrappedSongSmartAccount.sol';
import './WSTokensManagement.sol';
import './../Interfaces/IProtocolModule.sol';

contract WrappedSongFactory {
  IProtocolModule public protocolModule;
  mapping(address => address[]) public ownerWrappedSongs;

  event WrappedSongCreated(
    address indexed owner,
    address wrappedSongSmartAccount
  );

  constructor(address _protocolModule) {
    protocolModule = IProtocolModule(_protocolModule);
  }

  /**
   * @dev Creates a new wrapped song.
   * @param _stablecoin The address of the stablecoin contract.
   * @return The address of the created WrappedSongSmartAccount.
   */
  function createWrappedSong(
    address _stablecoin
  ) public payable returns (address) {
    //TODO: Pay fee in stablecoins
    // require(msg.value >= protocolModule.wrappedSongCreationFee(), "Insufficient creation fee");
    // require(protocolModule.isValidToCreateWrappedSong(msg.sender), "Not valid to create Wrapped Song");

    // Create WrappedSongSmartAccount instance
    WrappedSongSmartAccount newWrappedSongSmartAccount = new WrappedSongSmartAccount(
        _stablecoin,
        msg.sender,
        address(protocolModule)
      );

    ownerWrappedSongs[msg.sender].push(address(newWrappedSongSmartAccount));

    emit WrappedSongCreated(msg.sender, address(newWrappedSongSmartAccount));

    return address(newWrappedSongSmartAccount);
  }

  /**
   * @dev Creates a new wrapped song with metadata.
   * @param _stablecoin The address of the stablecoin contract.
   * @param songURI The URI of the song metadata.
   * @param sharesAmount The amount of shares to be created.
   */
  function createWrappedSongWithMetadata(
    address _stablecoin,
    string memory songURI,
    uint256 sharesAmount
  ) public payable {
    address newWrappedSongSmartAccount = createWrappedSong(_stablecoin);

    WrappedSongSmartAccount wrappedSong = WrappedSongSmartAccount(
      newWrappedSongSmartAccount
    );
    wrappedSong.createsWrappedSongTokens(songURI, sharesAmount);
  }

  /**
   * @dev Returns the list of wrapped songs owned by the specified owner.
   * @param _owner The address of the owner.
   * @return An array of addresses of the wrapped songs owned by the owner.
   */
  function getOwnerWrappedSongs(
    address _owner
  ) public view returns (address[] memory) {
    return ownerWrappedSongs[_owner];
  }
}
