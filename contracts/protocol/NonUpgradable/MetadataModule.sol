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
    bool private isProtocolSet;

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
        
        console.log("Setting protocol module address:", _protocolModule);
        protocolModule = IProtocolModule(_protocolModule);
        isProtocolSet = true;
        
        console.log("Protocol module set successfully");
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
     */
    function createMetadata(address wrappedSong, Metadata memory newMetadata) external {
        // require(protocolModule.isWSTokenFromProtocol(wsTokenManagement), "Not a valid WSTokenManagement contract");
        // require(bytes(wrappedSongMetadata[wsTokenManagement].name).length == 0, "Metadata already exists");
        require(isValidMetadata(newMetadata), "Invalid metadata");
        
        console.log("Creating metadata for wrapped song:", wrappedSong);
        console.log("Metadata name:", newMetadata.name);
        console.log("Metadata description:", newMetadata.description);
        console.log("Metadata image:", newMetadata.image);
        console.log("Metadata external URL:", newMetadata.externalUrl);
        console.log("Metadata animation URL:", newMetadata.animationUrl);
        console.log("Metadata attributes IPFS hash:", newMetadata.attributesIpfsHash);
        
        wrappedSongMetadata[wrappedSong] = newMetadata;
        emit MetadataCreated(wrappedSong, newMetadata);
        
        console.log("Metadata created successfully");
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
        console.log("Getting token URI for wrapped song: %s, token ID: %d", wrappedSong, tokenId);
        
        Metadata memory metadata = wrappedSongMetadata[wrappedSong];
        // require(bytes(metadata.name).length > 0, "Metadata does not exist for this token");
        require(tokenId < 3, "Invalid token ID for metadata module"); // Only handle tokens 0-2
        
        console.log("Getting token URI for wrapped song: %s, token ID: %d", wrappedSong, tokenId);
        console.log("Metadata name: %s", metadata.name);
        console.log("Metadata image: %s", metadata.image);
        console.log("Metadata external URL: %s", metadata.externalUrl);
        
        string memory uri = _composeTokenURI(metadata, tokenId, wrappedSong);
        console.log("Composed token URI: %s", uri);
        
        return uri;
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
    function _composeTokenURI(Metadata memory metadata, uint256 tokenId, address wrappedSongAddress) internal view returns (string memory) {
        string memory baseURI = protocolModule.getBaseURI();
        require(bytes(baseURI).length > 0, "Base URI not set");
        
        console.log("Composing token URI for token ID: %s", tokenId);
        
        string memory tokenType;
        string memory finalImageData;
        string memory description;

        if (tokenId == 0) {
            tokenType = unicode"◒";
            finalImageData = string(abi.encodePacked(baseURI, metadata.image));
            description = metadata.description;
            console.log("Token type 0: Song Concept NFT");
        } else if (tokenId == 1) {
            tokenType = unicode"§";
            finalImageData = _generateSVGImage(metadata.image);
            description = string(abi.encodePacked(
                "These are the SongShares representing your share on the royalty earnings of the Wrapped Song",
                addressToString(wrappedSongAddress),
                "."
            ));
            console.log("Token type 1: Song Shares NFT");
        } else {
            tokenType = "Creator-defined NFT";
            finalImageData = string(abi.encodePacked(baseURI, metadata.image));
            description = metadata.description;
            console.log("Token type 2: Creator-defined NFT");
        }

        console.log("Metadata name: %s", metadata.name);
        console.log("Final image data: %s", finalImageData);

        string memory json = Base64.encode(
            bytes(string(abi.encodePacked(
                '{"name": "', tokenType, ' - ', metadata.name, '",',
                '"description": "', description, '",',
                '"image": "', finalImageData, '",',
                '"external_url": "', metadata.externalUrl, '",',
                '"animation_url": "', string(abi.encodePacked(baseURI, metadata.animationUrl)), '",',
                '"attributes": "', string(abi.encodePacked(baseURI, metadata.attributesIpfsHash)), '"}'
            )))
        );

        string memory uri = string(abi.encodePacked("data:application/json;base64,", json));
        console.log("Generated URI: %s", uri);
        return uri;
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

            '<image id="image0" width="1052" height="1052" xlink:href="', imageUrl, '"/>',
            
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
