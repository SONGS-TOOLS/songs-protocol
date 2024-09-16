// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWrappedSongSmartAccount {
  function requestWrappedSongReleaseWithMetadata(address _distributorWallet, string memory songURI) external;
  function requestWrappedSongRelease(address _distributorWallet) external;
  function createsWrappedSongTokens(string memory songURI, uint256 sharesAmount, string memory sharesURI, address creator) external returns (uint256 songId, uint256 newSongSharesId);
  function createsSongToken(string memory songURI, address[] memory participants) external returns (uint256 songId);
  function createFungibleSongShares(uint256 songId, uint256 sharesAmount, string memory sharesURI, address creator) external returns (uint256 sharesId);
  function setSharesForSale(uint256 sharesId, uint256 percentage, uint256 pricePerShare) external;
  function getTokenBalance(uint256 tokenId) external view returns (uint256);
  function getWrappedSongMetadata(uint256 tokenId) external view returns (string memory);
  function transferSongShares(uint256 amount, address to) external;
  function batchTransferShares(uint256[] memory amounts, address[] memory recipients) external;
  function getTokenTotalSupply(uint256 id) external view returns (uint256);
  function getSongSharesBalance(address account) external view returns (uint256);
  function getWSTokenManagementAddress() external view returns (address);
  function canReceiveERC20() external pure returns (bool);
  function receiveERC20(address token, uint256 amount) external;
  function receiveEarnings(uint256 amount) external;
  function getTokenMetadata(uint256 tokenId) external view returns (string memory);
  function requestUpdateMetadata(uint256 tokenId, string memory newMetadata) external;
  function updateMetadata(uint256 tokenId, string memory newMetadata) external;
  function executeConfirmedMetadataUpdate(uint256 tokenId) external;
  function checkAuthenticity() external view returns (bool);
  function withdrawSaleFunds(address payable to) external;
}