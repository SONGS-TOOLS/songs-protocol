// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IWSTokensManagement.sol";

contract MetadataModule is Ownable {
    IProtocolModule public protocolModule;

    mapping(address => string) private pendingMetadataUpdates;
    mapping(address => bool) private metadataUpdateConfirmed;

    event MetadataUpdateRequested(address indexed wrappedSong, string newMetadata);
    event MetadataUpdated(address indexed wrappedSong, string newMetadata);
    event MetadataUpdateRejected(address indexed wrappedSong);

    constructor(address _protocolModule) Ownable(msg.sender) {
        protocolModule = IProtocolModule(_protocolModule);
    }

    function requestUpdateMetadata(address wrappedSong, string memory newMetadata) external {
        require(IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender, "Only wrapped song owner can request update");
        require(protocolModule.isReleased(wrappedSong), "Song not released, update metadata directly");
        
        pendingMetadataUpdates[wrappedSong] = newMetadata;
        metadataUpdateConfirmed[wrappedSong] = false;
        emit MetadataUpdateRequested(wrappedSong, newMetadata);
    }

    function updateMetadata(address wrappedSong, string memory newMetadata) external {
        require(IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender, "Only wrapped song owner can update");
        require(!protocolModule.isReleased(wrappedSong), "Cannot update metadata directly after release");
        
        IWSTokensManagement wsTokenManagement = IWSTokensManagement(IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress());
        wsTokenManagement.updateAllTokenURIs(newMetadata);
        emit MetadataUpdated(wrappedSong, newMetadata);
    }

    function confirmUpdateMetadata(address wrappedSong) external {
        address distributor = protocolModule.getWrappedSongDistributor(wrappedSong);
        require(msg.sender == distributor, "Only distributor can confirm update");
        require(metadataUpdateConfirmed[wrappedSong] == false, "No pending metadata update");

        string memory newMetadata = pendingMetadataUpdates[wrappedSong];
        IWSTokensManagement wsTokenManagement = IWSTokensManagement(IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress());
        wsTokenManagement.updateAllTokenURIs(newMetadata);
        
        delete pendingMetadataUpdates[wrappedSong];
        metadataUpdateConfirmed[wrappedSong] = true;

        emit MetadataUpdated(wrappedSong, newMetadata);
    }

    function rejectUpdateMetadata(address wrappedSong) external {
        address distributor = protocolModule.getWrappedSongDistributor(wrappedSong);
        require(msg.sender == distributor, "Only distributor can reject update");
        
        delete pendingMetadataUpdates[wrappedSong];
        delete metadataUpdateConfirmed[wrappedSong];
        emit MetadataUpdateRejected(wrappedSong);
    }

    function getTokenURI(address wrappedSong) external view returns (string memory) {
        IWSTokensManagement wsTokenManagement = IWSTokensManagement(IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress());
        return wsTokenManagement.uri(0); // We can use any token ID here as they all share the same metadata
    }

    function getPendingMetadataUpdate(address wrappedSong) external view returns (string memory) {
        return pendingMetadataUpdates[wrappedSong];
    }

    function isMetadataUpdateConfirmed(address wrappedSong) external view returns (bool) {
        return metadataUpdateConfirmed[wrappedSong];
    }
}
