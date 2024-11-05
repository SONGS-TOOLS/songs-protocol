// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './WrappedSongSmartAccount.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IMetadataModule.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract WrappedSongFactory {
  IProtocolModule public immutable protocolModule;
  IMetadataModule public immutable metadataModule;

  event WrappedSongCreated(
    address indexed owner,
    address indexedwrappedSongSmartAccount,
    address stablecoin,
    address wsTokenManagement,
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
  function isValidMetadata(IMetadataModule.Metadata memory metadata) internal pure returns (bool) {
      return (
          bytes(metadata.name).length > 0 &&
          bytes(metadata.image).length > 0 &&
          bytes(metadata.animationUrl).length > 0 &&
          bytes(metadata.attributesIpfsHash).length > 0
      );
  }

  /**
   * @dev Creates a new wrapped song with metadata.
   * @param _stablecoin The address of the stablecoin contract.
   * @param songMetadata The metadata for the song NFT.
   * @param sharesAmount The amount of shares to be created.
   * @return The address of the created WrappedSongSmartAccount.
   */
  function createWrappedSong(
    address _stablecoin,
    IMetadataModule.Metadata memory songMetadata,
    uint256 sharesAmount
  ) public payable returns (address) {
    require(!protocolModule.paused(), 'Protocol is paused');
    require(isValidMetadata(songMetadata), "Invalid metadata: All required fields must be non-empty");
    require(sharesAmount > 0, "Shares amount must be greater than zero");

    uint256 requiredFee = protocolModule.wrappedSongCreationFee();
    require(
      msg.value >= requiredFee,
      'Insufficient creation fee'
    );

    require(protocolModule.isValidToCreateWrappedSong(msg.sender), "Not valid to create Wrapped Song");
    require(protocolModule.isTokenWhitelisted(_stablecoin), "Stablecoin is not whitelisted");

    WrappedSongSmartAccount newWrappedSongSmartAccount = new WrappedSongSmartAccount(
        _stablecoin,
        msg.sender,
        address(protocolModule)
    );

    // Create initial shares
    newWrappedSongSmartAccount.createSongShares(sharesAmount);

    address newWrappedSongSmartAccountAddress = address(newWrappedSongSmartAccount);
    address wsTokenManagementAddress = newWrappedSongSmartAccount.getWSTokenManagementAddress();

    protocolModule.setWSTokenFromProtocol(wsTokenManagementAddress);
    protocolModule.setSmartAccountToWSToken(newWrappedSongSmartAccountAddress, wsTokenManagementAddress);
    protocolModule.addOwnerWrappedSong(msg.sender, newWrappedSongSmartAccountAddress);

    emit WrappedSongCreated(
      msg.sender,
      newWrappedSongSmartAccountAddress,
      _stablecoin,
      wsTokenManagementAddress,
      sharesAmount
    );

    metadataModule.createMetadata(newWrappedSongSmartAccountAddress, songMetadata);

    return newWrappedSongSmartAccountAddress;
  }

}
