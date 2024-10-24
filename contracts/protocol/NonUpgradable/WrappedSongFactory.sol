// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './WrappedSongSmartAccount.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IMetadataModule.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import 'hardhat/console.sol';

contract WrappedSongFactory {
  IProtocolModule public immutable protocolModule;
  IMetadataModule public immutable metadataModule;
  mapping(address => address[]) public ownerWrappedSongs;

  event WrappedSongCreated(
    address indexed owner,
    address wrappedSongSmartAccount,
    address stablecoin,
    address wsTokenManagement
  );

  event WrappedSongCreatedWithMetadata(
    address indexed owner,
    address wrappedSongSmartAccount,
    IMetadataModule.Metadata songMetadata,
    uint256 sharesAmount
  );

  constructor(address _protocolModule, address _metadataModule) {
    protocolModule = IProtocolModule(_protocolModule);
    metadataModule = IMetadataModule(_metadataModule);
  }

  /**
   * @dev Validates the metadata object to ensure all required fields are present and non-empty.
   * @param metadata The metadata object to validate.
   * @return bool Returns true if the metadata is valid, false otherwise.
   */
  function isValidMetadata(
    IMetadataModule.Metadata memory metadata
  ) internal pure returns (bool) {
    return (bytes(metadata.name).length > 0 &&
      bytes(metadata.image).length > 0 &&
      bytes(metadata.animationUrl).length > 0 &&
      bytes(metadata.attributesIpfsHash).length > 0);
  }

  /**
   * @dev Creates a new wrapped song with metadata.
   * @param _stablecoin The address of the stablecoin contract.
   * @param songMetadata The metadata for the song NFT.
   * @param sharesAmount The amount of shares to be created.
   * @return The address of the created WrappedSongSmartAccount.
   */
  function createWrappedSongWithMetadata(
    address _stablecoin,
    IMetadataModule.Metadata memory songMetadata,
    uint256 sharesAmount
  ) public payable returns (address) {
    require(!protocolModule.paused(), 'Protocol is paused');
    require(
      isValidMetadata(songMetadata),
      'Invalid metadata: All required fields must be non-empty'
    );
    require(sharesAmount > 0, 'Shares amount must be greater than zero');
    
    require(
      protocolModule.isTokenWhitelisted(_stablecoin),
      "Stablecoin is not whitelisted"
    );

    require(msg.value >= protocolModule.wrappedSongCreationFee(), 'Insufficient creation fee');


    require(msg.sender != address(0), 'Invalid owner address');
    require(
      address(protocolModule) != address(0),
      'Invalid protocol module address'
    );
    require(sharesAmount > 0, 'Invalid shares amount');

    require(protocolModule.isTokenWhitelisted(_stablecoin), "Stablecoin is not whitelisted");

    WrappedSongSmartAccount newWrappedSongSmartAccount = new WrappedSongSmartAccount(
        _stablecoin,
        msg.sender,
        address(protocolModule),
        sharesAmount
      );

    address newWrappedSongSmartAccountAddress = address(
      newWrappedSongSmartAccount
    );
    address wsTokenManagement = address(
      newWrappedSongSmartAccount.newWSTokenManagement()
    );

    ownerWrappedSongs[msg.sender].push(newWrappedSongSmartAccountAddress);

    emit WrappedSongCreated(
      msg.sender,
      newWrappedSongSmartAccountAddress,
      _stablecoin,
      wsTokenManagement
    );

    metadataModule.createMetadata(
      newWrappedSongSmartAccountAddress,
      songMetadata
    );

    return newWrappedSongSmartAccountAddress;
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
