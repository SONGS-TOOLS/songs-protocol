// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './../Interfaces/IMetadataModule.sol';

interface IWrappedSongSmartAccount {
    function initialize(
        address _stablecoin,
        address _owner,
        address _protocolModule
    ) external;
    
    function receiveERC20(address token, uint256 amount) external;
    function claimEarnings(address token, uint256 maxEpochs) external;
    function getPendingEarnings(address account, address token) external view returns (uint256);
    function createSongShares(uint256 sharesAmount) external;
    function createBuyoutToken(uint256 amount, address recipient) external;
    function createLegalContract(string memory contractURI) external returns (uint256);
    function getWSTokenManagementAddress() external view returns (address);
    function owner() external view returns (address);
    function migrateWrappedSong(address metadataAddress, address newWrappedSongAddress) external;
    function receiveEpochEarnings(
        address token,
        uint256 amount,
        uint256 startEpoch,
        uint256 endEpoch
    ) external;
    function setWSTokenManagement(address _wsTokenManagement) external;
}
