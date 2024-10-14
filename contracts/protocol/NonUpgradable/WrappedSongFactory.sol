// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './WrappedSongSmartAccount.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IMetadataModule.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract WrappedSongFactory {
  IProtocolModule public protocolModule;
  mapping(address => address[]) public ownerWrappedSongs;

  // TODO: make sure to find another way for the frontend to get the 
  // wsTokenManagement address, to remove the wsTokenManagement parameter from the event
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
    require(!protocolModule.paused(), 'Protocol is paused'); // Check if protocol is paused
    //TODO: Pay fee in stablecoins
    require(
      msg.value >= protocolModule.wrappedSongCreationFee(),
      'Insufficient creation fee'
    );
    // require(protocolModule.isValidToCreateWrappedSong(msg.sender), "Not valid to create Wrapped Song");

    // Create WrappedSongSmartAccount instance
    WrappedSongSmartAccount newWrappedSongSmartAccount = new WrappedSongSmartAccount(
        _stablecoin,
        msg.sender,
        address(protocolModule)
      );
    ownerWrappedSongs[msg.sender].push(address(newWrappedSongSmartAccount));
    // newWrappedSongSmartAccount.newWSTokenManagement
    emit WrappedSongCreated(
      msg.sender,
      address(newWrappedSongSmartAccount),
      _stablecoin,
      address(newWrappedSongSmartAccount.newWSTokenManagement())
    );

    return address(newWrappedSongSmartAccount);
  }

  /**
   * @dev Validates the metadata object to ensure all required fields are present and non-empty.
   * @param metadata The metadata object to validate.
   * @return bool Returns true if the metadata is valid, false otherwise.
   */
  function isValidMetadata(IMetadataModule.Metadata memory metadata) internal pure returns (bool) {
      return (
          bytes(metadata.name).length > 0 &&
          // bytes(metadata.description).length > 0 &&
          bytes(metadata.image).length > 0 &&
          // bytes(metadata.externalUrl).length > 0 &&
          bytes(metadata.animationUrl).length > 0 &&
          bytes(metadata.attributesIpfsHash).length > 0
      );
  }

  /**
   * @dev Creates a new wrapped song with metadata.
   * @param _stablecoin The address of the stablecoin contract.
   * @param songMetadata The metadata for the song NFT.
   * @param sharesAmount The amount of shares to be created.
   */
  function createWrappedSongWithMetadata(
    address _stablecoin,
    IMetadataModule.Metadata memory songMetadata,
    uint256 sharesAmount
  ) public payable {
    require(!protocolModule.paused(), 'Protocol is paused');
    require(isValidMetadata(songMetadata), "Invalid metadata: All fields must be non-empty");
    
    address newWrappedSongSmartAccount = createWrappedSong(_stablecoin);

    WrappedSongSmartAccount wrappedSong = WrappedSongSmartAccount(
        payable(newWrappedSongSmartAccount)
    );
    
    wrappedSong.createSongTokens(
        songMetadata,
        sharesAmount,
        msg.sender
    );

    emit WrappedSongCreatedWithMetadata(
        msg.sender,
        newWrappedSongSmartAccount,
        songMetadata,
        sharesAmount
    );
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
