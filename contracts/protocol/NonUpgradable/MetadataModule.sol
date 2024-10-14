// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IWSTokensManagement.sol";

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

    constructor(address _protocolModule) Ownable(msg.sender) {
        protocolModule = IProtocolModule(_protocolModule);
    }

    function createMetadata(address wrappedSong, Metadata memory newMetadata) external {
        require(IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender, "Only wrapped song owner can create metadata");
        require(bytes(wrappedSongMetadata[wrappedSong].name).length == 0, "Metadata already exists");
        
        wrappedSongMetadata[wrappedSong] = newMetadata;
        emit MetadataCreated(wrappedSong, newMetadata);
    }

    function requestUpdateMetadata(address wrappedSong, Metadata memory newMetadata) external {
        require(IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender, "Only wrapped song owner can request update");
        require(protocolModule.isReleased(wrappedSong), "Song not released, update metadata directly");
        
        pendingMetadataUpdates[wrappedSong] = newMetadata;
        metadataUpdateConfirmed[wrappedSong] = false;
        emit MetadataUpdateRequested(wrappedSong, newMetadata);
    }

    function updateMetadata(address wrappedSong, Metadata memory newMetadata) external {
        require(IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender, "Only wrapped song owner can update");
        require(!protocolModule.isReleased(wrappedSong), "Cannot update metadata directly after release");
        
        wrappedSongMetadata[wrappedSong] = newMetadata;
        emit MetadataUpdated(wrappedSong, newMetadata);
    }

    function confirmUpdateMetadata(address wrappedSong) external {
        address distributor = protocolModule.getWrappedSongDistributor(wrappedSong);
        require(msg.sender == distributor, "Only distributor can confirm update");
        require(!metadataUpdateConfirmed[wrappedSong], "No pending metadata update");

        wrappedSongMetadata[wrappedSong] = pendingMetadataUpdates[wrappedSong];
        
        delete pendingMetadataUpdates[wrappedSong];
        metadataUpdateConfirmed[wrappedSong] = true;

        emit MetadataUpdated(wrappedSong, wrappedSongMetadata[wrappedSong]);
    }

    function rejectUpdateMetadata(address wrappedSong) external {
        address distributor = protocolModule.getWrappedSongDistributor(wrappedSong);
        require(msg.sender == distributor, "Only distributor can reject update");
        
        delete pendingMetadataUpdates[wrappedSong];
        delete metadataUpdateConfirmed[wrappedSong];
        emit MetadataUpdateRejected(wrappedSong);
    }

    function getTokenURI(address wrappedSong, uint256 tokenId) external view returns (string memory) {
        Metadata memory metadata = wrappedSongMetadata[wrappedSong];
        return _composeTokenURI(metadata, tokenId);
    }

    function getPendingMetadataUpdate(address wrappedSong) external view returns (Metadata memory) {
        return pendingMetadataUpdates[wrappedSong];
    }

    function isMetadataUpdateConfirmed(address wrappedSong) external view returns (bool) {
        return metadataUpdateConfirmed[wrappedSong];
    }

    function _composeTokenURI(Metadata memory metadata, uint256 tokenId) internal pure returns (string memory) {
        string memory tokenType;
        if (tokenId == 0) {
            tokenType = unicode"◒";
        } else if (tokenId == 1) {
            tokenType = unicode"§";
        } else {
            tokenType = "Creator-defined NFT";
        }

        string memory json = Base64.encode(
            bytes(string(abi.encodePacked(
                '{"name": "', tokenType, ' - ', metadata.name, '",',
                '"description": "', metadata.description, '",',
                '"image": "', metadata.image, '",',
                '"external_url": "', metadata.externalUrl, '",',
                '"animation_url": "', metadata.animationUrl, '",',
                '"attributes": ', metadata.attributesIpfsHash, '}'
            )))
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
