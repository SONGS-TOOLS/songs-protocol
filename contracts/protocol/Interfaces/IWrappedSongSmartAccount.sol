// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './../Interfaces/IMetadataModule.sol';

interface IWrappedSongSmartAccount {
    function requestWrappedSongReleaseWithMetadata(
        address _distributorWallet, 
        IMetadataModule.Metadata memory newMetadata
    ) external;
    function requestWrappedSongRelease(address _distributorWallet) external;
    function receiveERC20(address token, uint256 amount) external;
    function claimEarnings() external;
    function claimETHEarnings() external;
    function getPendingETHEarnings(address account) external view returns (uint256);
    function createSongShares(uint256 sharesAmount) external;
    function createBuyoutToken(uint256 amount, address recipient) external;
    function createLegalContract(string memory contractURI) external returns (uint256);
    function getWSTokenManagementAddress() external view returns (address);
    function owner() external view returns (address);
    function migrateWrappedSong(address metadataAddress, address newWrappedSongAddress) external;
}
