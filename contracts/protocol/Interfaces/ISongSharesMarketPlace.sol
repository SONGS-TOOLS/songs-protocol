// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISongSharesMarketPlace {
    struct Sale {
        bool active;
        address seller;
        uint256 sharesForSale;
        uint256 pricePerShare;
        uint256 maxSharesPerWallet;
        uint256 totalSold;
        address stableCoin;
    }

    function startSale(
        address wsTokenManagement,
        uint256 amount,
        uint256 price,
        uint256 maxShares,
        address _stableCoin
    ) external;

    function buyShares(
        address wsTokenManagement,
        uint256 amount,
        address recipient
    ) external payable;

    function initialize(address _protocolModule) external;
    function endSale(address wsTokenManagement) external;

    function withdrawFunds(address wsTokenManagement) external;

    function getSale(address wsTokenManagement) external view returns (Sale memory);

    function pause() external;

    function unpause() external;

    function isApprovedForShares(
        address wsTokenManagement, 
        address seller
    ) external view returns (bool);

    function isSaleExpired(address wsTokenManagement) external view returns (bool);
} 