// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IWSTokenManagement.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/IDistributorWallet.sol";

contract MetadataModule is Ownable, IMetadataModule {
    IProtocolModule public protocolModule;
    bool private isProtocolSet;

    mapping(address => Metadata) private wrappedSongMetadata;
    mapping(address => Metadata) private pendingMetadataUpdates;
    mapping(address => bool) private metadataUpdateConfirmed;

    event MetadataCreated(address indexed wrappedSong, Metadata newMetadata);
    event MetadataUpdateRequested(address indexed wrappedSong, Metadata newMetadata);
    event MetadataUpdated(address indexed wrappedSong, Metadata newMetadata);
    event MetadataUpdateRejected(address indexed wrappedSong);
    event MetadataRemoved(address indexed wrappedSong);

    /**
     * @dev Initializes the contract.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Sets the protocol module address. Can only be called once by the owner.
     * @param _protocolModule The address of the ProtocolModule contract.
     */
    function setProtocolModule(address _protocolModule) external onlyOwner {
        require(_protocolModule != address(0), "Invalid protocol module address");
        
        protocolModule = IProtocolModule(_protocolModule);
        isProtocolSet = true;
        
    }

    /**
     * @dev Validates the metadata object to ensure all required fields are present and non-empty.
     * @param metadata The metadata object to validate.
     * @return bool Returns true if the metadata is valid, false otherwise.
     */
    function isValidMetadata(Metadata memory metadata) internal pure returns (bool) {
        return (
            bytes(metadata.name).length > 0 &&
            bytes(metadata.image).length > 0 &&
            bytes(metadata.animationUrl).length > 0 &&
            bytes(metadata.attributesIpfsHash).length > 0
        );
    }
    /**
     * @dev Creates initial metadata for a wrapped song token management contract.
     * @param wrappedSong The address of the WrappedSongSmartAccount contract.
     * @param newMetadata The new metadata to be set.
     * @return The new metadata.
     */
    function createMetadata(address wrappedSong, Metadata memory newMetadata) external returns (Metadata memory) {
        address wsToken = protocolModule.smartAccountToWSToken(wrappedSong);
        require(wsToken != address(0), "Address not a protocol WS");
        require(bytes(wrappedSongMetadata[wrappedSong].name).length == 0, "Metadata already exists");
        require(isValidMetadata(newMetadata), "Invalid metadata");
        
        wrappedSongMetadata[wrappedSong] = newMetadata;
        emit MetadataCreated(wrappedSong, newMetadata);
        
        return newMetadata;
    }
    /**
     * @dev Requests an update to the metadata of a released wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param newMetadata The new metadata to be set.
     */
    function requestUpdateMetadata(address wrappedSong, Metadata memory newMetadata) external {
        require(isValidMetadata(newMetadata), "Invalid metadata: All required fields must be non-empty");
        require(IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender, "Only wrapped song owner can request update");
        require(protocolModule.isReleased(wrappedSong), "Song not released, update metadata directly");
        
        pendingMetadataUpdates[wrappedSong] = newMetadata;
        metadataUpdateConfirmed[wrappedSong] = false;
        emit MetadataUpdateRequested(wrappedSong, newMetadata);
    }

    /**
     * @dev Updates the metadata of an unreleased wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param newMetadata The new metadata to be set.
     */
    function updateMetadata(address wrappedSong, Metadata memory newMetadata) external {
        require(
            IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender || 
            wrappedSong == msg.sender, 
            "Only wrapped song or its owner can update"
        );
        require(!protocolModule.isReleased(wrappedSong), "Cannot update metadata directly after release");
        require(isValidMetadata(newMetadata), "Invalid metadata: All required fields must be non-empty");
        
        wrappedSongMetadata[wrappedSong] = newMetadata;
        emit MetadataUpdated(wrappedSong, newMetadata);
    }

    /**
     * @dev Confirms a pending metadata update for a released wrapped song.
     * @param wrappedSong The address of the wrapped song.
     */
    function confirmUpdateMetadata(address wrappedSong) external {
        address distributor = protocolModule.getWrappedSongDistributor(wrappedSong);
        require(msg.sender == IDistributorWallet(distributor).owner(), "Only distributor can confirm update");
        require(!metadataUpdateConfirmed[wrappedSong], "No pending metadata update");

        wrappedSongMetadata[wrappedSong] = pendingMetadataUpdates[wrappedSong];
        
        delete pendingMetadataUpdates[wrappedSong];
        metadataUpdateConfirmed[wrappedSong] = true;

        emit MetadataUpdated(wrappedSong, wrappedSongMetadata[wrappedSong]);
    }

    /**
     * @dev Rejects a pending metadata update for a released wrapped song.
     * @param wrappedSong The address of the wrapped song.
     */
    function rejectUpdateMetadata(address wrappedSong) external {
        address distributor = protocolModule.getWrappedSongDistributor(wrappedSong);
        require(msg.sender == IDistributorWallet(distributor).owner(), "Only distributor can reject update");
        
        delete pendingMetadataUpdates[wrappedSong];
        delete metadataUpdateConfirmed[wrappedSong];
        emit MetadataUpdateRejected(wrappedSong);
    }
    
    /**
     * @dev Retrieves the token URI for a given wrapped song and token ID.
     * @param wrappedSong The address of the wrapped song.
     * @param tokenId The ID of the token.
     * @return The token URI as a string.
     */
    function getTokenURI(address wrappedSong, uint256 tokenId) external view override returns (string memory) {
        Metadata memory metadata = wrappedSongMetadata[wrappedSong];
        require(tokenId < 3, "Invalid token ID for metadata module"); // Only handle tokens 0-2
        
        return protocolModule.renderTokenURI(metadata, tokenId, wrappedSong);
    }

    /**
     * @dev Retrieves the pending metadata update for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return The pending metadata update.
     */
    function getPendingMetadataUpdate(address wrappedSong) external view override returns (Metadata memory) {
        return pendingMetadataUpdates[wrappedSong];
    }

    /**
     * @dev Checks if a metadata update has been confirmed for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return True if the metadata update is confirmed, false otherwise.
     */
    function isMetadataUpdateConfirmed(address wrappedSong) external view override returns (bool) {
        return metadataUpdateConfirmed[wrappedSong];
    }

    /**
     * @dev Removes metadata for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     */
    function removeMetadata(address wrappedSong) external {
        require(
            wrappedSong == msg.sender, 
            "Only wrapped song can remove metadata"
        );
        require(bytes(wrappedSongMetadata[wrappedSong].name).length > 0, "Metadata does not exist");

        delete wrappedSongMetadata[wrappedSong];
        delete pendingMetadataUpdates[wrappedSong];
        delete metadataUpdateConfirmed[wrappedSong];

        emit MetadataRemoved(wrappedSong);
    }
}
