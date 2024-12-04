// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './IMetadataModule.sol';

interface IWrappedSongFactory {
    
    function metadataModule() external view returns (IMetadataModule);
    
    function ownerWrappedSongs(address owner, uint256 index) external view returns (address);
    
    function smartAccountToWSToken(address smartAccount) external view returns (address);

    function createWrappedSong(
        address _stablecoin,
        IMetadataModule.Metadata memory songMetadata,
        uint256 sharesAmount,
        address wsOwner
    ) external payable returns (address);
} 