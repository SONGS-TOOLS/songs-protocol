// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IWSTokensManagement.sol";
import "hardhat/console.sol";

contract MetadataModule is Ownable {
    IProtocolModule public protocolModule;

    struct Metadata {
        string name;
        string description;
        string image;
        string externalUrl;
        string animationUrl;
        string attributesIpfsHash;
    }

    mapping(address => Metadata) private wrappedSongMetadata;
    mapping(address => Metadata) private pendingMetadataUpdates;
    mapping(address => bool) private metadataUpdateConfirmed;

    event MetadataCreated(address indexed wrappedSong, Metadata newMetadata);
    event MetadataUpdateRequested(address indexed wrappedSong, Metadata newMetadata);
    event MetadataUpdated(address indexed wrappedSong, Metadata newMetadata);
    event MetadataUpdateRejected(address indexed wrappedSong);

    /**
     * @dev Initializes the contract with the ProtocolModule address.
     * @param _protocolModule The address of the ProtocolModule contract.
     */
    constructor(address _protocolModule) Ownable(msg.sender) {
        protocolModule = IProtocolModule(_protocolModule);
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
     * @dev Creates initial metadata for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param newMetadata The new metadata to be set.
     */
    
    function createMetadata(address wrappedSong, Metadata memory newMetadata) external {
        console.log("createMetadata called for wrapped song:", wrappedSong);
        console.log("Caller (msg.sender):", msg.sender);

        require(bytes(wrappedSongMetadata[wrappedSong].name).length == 0, "Metadata already exists");
        
        wrappedSongMetadata[wrappedSong] = newMetadata;
        emit MetadataCreated(wrappedSong, newMetadata);
        
        console.log("createMetadata completed successfully");
    }
    /**
     * @dev Requests an update to the metadata of a released wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param newMetadata The new metadata to be set.
     */
    function requestUpdateMetadata(address wrappedSong, Metadata memory newMetadata) external {
        console.log("requestUpdateMetadata called for wrapped song:", wrappedSong);
        console.log("Caller (msg.sender):", msg.sender);

        require(isValidMetadata(newMetadata), "Invalid metadata: All required fields must be non-empty");

        require(IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender, "Only wrapped song owner can request update");
        console.log("Owner check passed");

        require(protocolModule.isReleased(wrappedSong), "Song not released, update metadata directly");
        console.log("Release check passed");
        
        pendingMetadataUpdates[wrappedSong] = newMetadata;
        metadataUpdateConfirmed[wrappedSong] = false;
        console.log("Pending metadata update set");

        emit MetadataUpdateRequested(wrappedSong, newMetadata);
        console.log("MetadataUpdateRequested event emitted");

        console.log("requestUpdateMetadata completed successfully");
    }

    /**
     * @dev Updates the metadata of an unreleased wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param newMetadata The new metadata to be set.
     */
    function updateMetadata(address wrappedSong, Metadata memory newMetadata) external {
        require(IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender, "Only wrapped song owner can update");
        require(!protocolModule.isReleased(wrappedSong), "Cannot update metadata directly after release");
        
        wrappedSongMetadata[wrappedSong] = newMetadata;
        emit MetadataUpdated(wrappedSong, newMetadata);
    }

    /**
     * @dev Confirms a pending metadata update for a released wrapped song.
     * @param wrappedSong The address of the wrapped song.
     */
    function confirmUpdateMetadata(address wrappedSong) external {
        address distributor = protocolModule.getWrappedSongDistributor(wrappedSong);
        require(msg.sender == distributor, "Only distributor can confirm update");
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
        require(msg.sender == distributor, "Only distributor can reject update");
        
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
    function getTokenURI(address wrappedSong, uint256 tokenId) external view returns (string memory) {
        Metadata memory metadata = wrappedSongMetadata[wrappedSong];
        return _composeTokenURI(metadata, tokenId, wrappedSong);
    }

    /**
     * @dev Retrieves the pending metadata update for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return The pending metadata update.
     */
    function getPendingMetadataUpdate(address wrappedSong) external view returns (Metadata memory) {
        return pendingMetadataUpdates[wrappedSong];
    }

    /**
     * @dev Checks if a metadata update has been confirmed for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return True if the metadata update is confirmed, false otherwise.
     */
    function isMetadataUpdateConfirmed(address wrappedSong) external view returns (bool) {
        return metadataUpdateConfirmed[wrappedSong];
    }

    /**
     * @dev Composes the token URI from the metadata and token ID.
     * @param metadata The metadata of the wrapped song.
     * @param tokenId The ID of the token.
     * @param wrappedSongAddress The address of the wrapped song.
     * @return The composed token URI as a string.
     */
    function _composeTokenURI(Metadata memory metadata, uint256 tokenId, address wrappedSongAddress) internal pure returns (string memory) {
        string memory tokenType;
        string memory imageData;
        string memory description;

        if (tokenId == 0) {
            tokenType = unicode"◒";
            imageData = metadata.image;
            description = metadata.description;
        } else if (tokenId == 1) {
            tokenType = unicode"§";
            imageData = _generateSVGImage(metadata.image);
            description = string(abi.encodePacked(
                "These are the SongShares representing your share on the royalty earnings of the Wrapped Song",
                addressToString(wrappedSongAddress),
                "."
            ));
        } else {
            tokenType = "Creator-defined NFT";
            imageData = metadata.image;
            description = metadata.description;
        }

        string memory json = Base64.encode(
            bytes(string(abi.encodePacked(
                '{"name": "', tokenType, ' - ', metadata.name, '",',
                '"description": "', description, '",',
                '"image": "', imageData, '",',
                '"external_url": "', metadata.externalUrl, '",',
                '"animation_url": "', metadata.animationUrl, '",',
                '"attributes": ', metadata.attributesIpfsHash, '}'
            )))
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _generateSVGImage(string memory imageUrl) internal pure returns (string memory) {
        string memory svgContent = _generateSVGContent(imageUrl);
        return string(abi.encodePacked(
            'data:image/svg+xml;base64,',
            Base64.encode(bytes(svgContent))
        ));
    }

    function _generateSVGContent(string memory imageUrl) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<svg width="562" height="562" viewBox="0 0 562 562" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
            '<rect width="562" height="562" fill="#D9D9D9"/>',
            '<circle cx="281" cy="281" r="276.5" stroke="url(#paint0_linear)" stroke-width="9"/>',
            '<circle cx="281" cy="281" r="240" fill="url(#pattern0)"/>',
            '<defs>',
            '<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">',
            '<use xlink:href="#image0" transform="scale(0.00095057)"/>',
            '</pattern>',
            '<linearGradient id="paint0_linear" x1="611.5" y1="-23" x2="-168" y2="174" gradientUnits="userSpaceOnUse">',
            '<stop offset="0.0461987" stop-color="#76ACF5"/>',
            '<stop offset="0.201565" stop-color="#B8BAD4"/>',
            '<stop offset="0.361787" stop-color="#FBBAB7"/>',
            '<stop offset="0.488023" stop-color="#FECD8A"/>',
            '<stop offset="0.64339" stop-color="#F9DF7D"/>',
            '<stop offset="0.793901" stop-color="#A9E6C8"/>',
            '<stop offset="0.992965" stop-color="#31D0E9"/>',
            '</linearGradient>',
            '<image id="image0" width="1052" height="1052" xlink:href="', imageUrl, '"/>',
            '</defs>',
            '</svg>'
        ));
    }

    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
