// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/utils/introspection/IERC165.sol';

interface IWSUtils is IERC165 {
    function getTokenBalance(address _wsTokensManagement, address account, uint256 tokenId) external view returns (uint256);
    
    function getWrappedSongMetadata(address _wsTokensManagement, uint256 tokenId) external view returns (string memory);
    
    function getTokenTotalSupply(address _wsTokensManagement, uint256 id) external view returns (uint256);
    
    function getSongSharesBalance(address _wsTokensManagement, address account) external view returns (uint256);
    
    function getTokenMetadata(address _wsTokensManagement, uint256 tokenId) external view returns (string memory);
    
    function getShareholderAddresses(address _wsTokensManagement, uint256 sharesId) external view returns (address[] memory);
    
    function getFungibleTokenShares(address _wsTokensManagement, uint256 sharesId) external view returns (uint256);
    
    function getSharesIdForSong(address _wsTokensManagement, uint256 songId) external view returns (uint256);
    
    function isSaleActive(address _wsTokensManagement) external view returns (bool);
    
    function getPricePerShare(address _wsTokensManagement) external view returns (uint256);
    
    function getSharesForSale(address _wsTokensManagement) external view returns (uint256);
    
    function getTotalShares(address _wsTokensManagement) external view returns (uint256);
    
    function protocolModule() external view returns (address);
}