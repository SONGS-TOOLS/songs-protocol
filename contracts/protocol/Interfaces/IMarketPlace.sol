// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMarketPlace {
    struct Sale {
        uint256 tokenId;
        uint256 sharesForSale;
        uint256 pricePerShare;
        uint256 maxSharesPerWallet;
        address stableCoin;
        bool active;
    }

    function startSharesSale(
        address wsTokenManagement,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 maxShares,
        address _stableCoin
    ) external;

    function buyShares(address wsTokenManagement, uint256 saleId, uint256 amount) external payable;
    function endSharesSale(address wsTokenManagement, uint256 saleId) external;
    function withdrawFunds(address wsTokenManagement, address token) external;
    function sales(address wsTokenManagement, uint256 saleId) external view returns (Sale memory);
    function isApprovedForShares(address wsTokenManagement, address seller) external view returns (bool);
} 