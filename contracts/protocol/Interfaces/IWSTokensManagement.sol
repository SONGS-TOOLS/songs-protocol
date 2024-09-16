// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWSTokensManagement {
  function getShareholderAddresses(uint256 sharesId) external view returns (address[] memory);
  function setTokenURI(uint256 tokenId, string memory tokenURI) external;
  function uri(uint256 tokenId) external view returns (string memory);
  function createSongConcept(string memory songURI, address smartWallet) external returns (uint256 songId);
  function createFungibleSongShares(uint256 songId, uint256 sharesAmount, string memory sharesURI, address creator) external returns (uint256 sharesId);
  function getFungibleTokenShares(uint256 sharesId) external view returns (uint256);
  function getSharesIdForSong(uint256 songId) external view returns (uint256);
  function startSharesSale(uint256 amount, uint256 price) external;
  function buyShares(uint256 amount) external payable;
  function endSharesSale() external;
  function withdrawFunds(address payable to) external;
  function totalSupply(uint256 id) external view returns (uint256);
  function balanceOf(address account, uint256 id) external view returns (uint256);
  function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
}


