// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWhitelistingManager {
    function nftContract() external view returns (address);
    function nftRequirementEnabled() external view returns (bool);
    function setNFTContract(address _newNFTContract) external;
    function toggleNFTRequirement(bool _enabled) external;
    function isValidToCreateWrappedSong(address _creator) external view returns (bool);
}