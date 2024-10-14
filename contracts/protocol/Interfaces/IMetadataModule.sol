// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMetadataModule {
    function requestUpdateMetadata(address wrappedSong, uint256 tokenId, string memory newMetadata) external;
    function updateMetadata(address wrappedSong, uint256 tokenId, string memory newMetadata) external;
    function confirmUpdateMetadata(address wrappedSong, uint256 tokenId) external;
    function rejectUpdateMetadata(address wrappedSong, uint256 tokenId) external;
    function getPendingMetadataUpdate(address wrappedSong, uint256 tokenId) external view returns (string memory);
    function isMetadataUpdateConfirmed(address wrappedSong, uint256 tokenId) external view returns (bool);
    function getTokenURI(address wrappedSong, uint256 tokenId) external view returns (string memory);
}
