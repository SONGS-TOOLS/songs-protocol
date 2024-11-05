// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBuyoutTokenMarketPlace {
    struct Sale {
        bool active;
        address seller;
        uint256 tokensForSale;
        uint256 pricePerToken;
        uint256 totalSold;
        address stableCoin;
    }

    function startSale(
        address wsTokenManagement,
        uint256 amount,
        uint256 price,
        address _stableCoin
    ) external;

    function buyToken(
        address wsTokenManagement,
        uint256 amount,
        address recipient
    ) external payable;

    function endSale(address wsTokenManagement) external;

    function withdrawFunds(address wsTokenManagement) external;

    function getSale(address wsTokenManagement) external view returns (Sale memory);

    function pause() external;

    function unpause() external;

    function isApprovedForTokens(
        address wsTokenManagement, 
        address seller
    ) external view returns (bool);

    function isSaleExpired(address wsTokenManagement) external view returns (bool);
} 