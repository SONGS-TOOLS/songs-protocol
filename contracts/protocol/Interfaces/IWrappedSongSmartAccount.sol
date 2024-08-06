// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWrappedSongSmartAccount {
  function requestWrappedSongRelease(address _distributorWallet) external;
  function createsWrappedSongTokens(string memory songURI, uint256 sharesAmount) external returns (uint256 songId, uint256 newSongSharesId);
  function createsSongToken(string memory songURI, address[] memory participants) external returns (uint256 songId);
  function createFungibleSongShares(uint256 songId, uint256 sharesAmount) external returns (uint256 sharesId);
  function setSharesForSale(uint256 sharesId, uint256 percentage, uint256 pricePerShare) external;
  function transferShares(uint256 sharesId, uint256 amount, address recipient) external;
  function getTokenBalance(uint256 tokenId) external view returns (uint256);
  function transferSongShares(uint256 tokenId, uint256 amount, address to) external;
  function batchTransferSongShares(uint256[] memory tokenIds, uint256[] memory amounts, address to) external;
  function canReceiveERC20() external pure returns (bool);
  function receiveEarnings(uint256 amount) external;
  function updateMetadata(uint256 tokenId, string memory newMetadata) external;
}