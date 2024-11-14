// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IWrappedSongTypes.sol";
import "./IProtocolModule.sol";
import "./IMetadataModule.sol";
import "./IWSTokenManagement.sol";

interface IWrappedSongSmartAccount {
    // Core functions
    function initialize(
        address _stablecoin,
        address _owner,
        address _protocolModule
    ) external;

    function setWSTokenManagement(address _wsTokenManagement) external;
    
    // Token management functions
    function createSongShares(uint256 sharesAmount) external;
    function createBuyoutToken(uint256 amount, address recipient) external;
    function createLegalContract(string memory contractURI) external returns (uint256);
    
    // Earnings functions
    function receiveERC20(address token, uint256 amount) external;
    function claimETHEarnings(uint256 maxEpochs) external;
    function claimStablecoinEarnings(uint256 maxEpochs) external;
    function createETHDistributionEpoch() external;
    function createStablecoinDistributionEpoch() external;
    
    // View functions
    function getWSTokenManagementAddress() external view returns (address);
    function owner() external view returns (address);
    function ethBalance() external view returns (uint256);
    function migrated() external view returns (bool);
    function wsTokenManagement() external view returns (IWSTokenManagement);
    function stablecoin() external view returns (IERC20);
    function protocolModule() external view returns (IProtocolModule);
    function metadataModule() external view returns (IMetadataModule);
    function songSharesId() external view returns (uint256);
    function wrappedSongTokenId() external view returns (uint256);

    // Epoch management functions
    function userEpochBalances(address user) external view returns (IWrappedSongTypes.EpochBalance memory);
    function ethEarningsEpochs(uint256 index) external view returns (IWrappedSongTypes.EarningsEpoch memory);
    function stablecoinEarningsEpochs(uint256 index) external view returns (IWrappedSongTypes.EarningsEpoch memory);
    
    // Query functions
    function hasMoreEpochsToClaim(
        address account,
        address token
    ) external view returns (
        bool hasMore,
        uint256 nextEpoch,
        uint256 totalEpochs
    );
    
    function getUnclaimedETHEpochs(
        address account
    ) external view returns (
        uint256[] memory epochIds,
        uint256[] memory amounts,
        uint256[] memory timestamps,
        string[] memory sources
    );
    
    function getUnclaimedStablecoinEpochs(
        address account
    ) external view returns (
        uint256[] memory epochIds,
        uint256[] memory amounts,
        uint256[] memory timestamps,
        string[] memory sources
    );

    function getPendingETHEarnings(address account) external view returns (uint256);
    function getPendingStablecoinEarnings(address account) external view returns (uint256);
    
    // Migration function
    function migrateWrappedSong(
        address newMetadataAddress,
        address newWrappedSongAddress
    ) external;
} 