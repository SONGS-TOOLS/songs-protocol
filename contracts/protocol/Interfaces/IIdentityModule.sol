// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IIdentityModule {
    function addISRC(address wrappedSong, string memory isrc) external;
    function addUPC(address wrappedSong, string memory upc) external;
    function addISWC(address wrappedSong, string memory iswc) external;
    function addISCC(address wrappedSong, string memory iscc) external;
    function setWrappedSongAuthenticity(address wrappedSong, bool _isAuthentic) external;
    function isAuthentic(address wrappedSong) external view returns (bool);
    function getIsrcCode(address wrappedSong) external view returns (string memory);
    function getUpcCode(address wrappedSong) external view returns (string memory);
    function getIswcCode(address wrappedSong) external view returns (string memory);
    function getIsccCode(address wrappedSong) external view returns (string memory);
}