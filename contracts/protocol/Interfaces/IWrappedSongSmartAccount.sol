// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWrappedSongSmartAccount {
  function requestWrappedSongReleaseWithMetadata(address _distributorWallet, string memory songURI) external;
  function requestWrappedSongRelease(address _distributorWallet) external;
  function setSharesForSale(uint256 sharesId, uint256 percentage, uint256 pricePerShare) external;
  function transferSongShares(uint256 amount, address to) external;
  function batchTransferShares(uint256[] memory amounts, address[] memory recipients) external;
  function receiveERC20(address token, uint256 amount) external;
  function receiveEarnings() external payable;
  function claimEarnings() external;
  function claimEthEarnings() external;
  function claimAllEarnings() external;
  function updateEarnings() external;
  function requestUpdateMetadata(uint256 tokenId, string memory newMetadata) external;
  function updateMetadata(uint256 tokenId, string memory newMetadata) external;
  function executeConfirmedMetadataUpdate(uint256 tokenId) external;
  function withdrawSaleFundsFromWSTokenManagement() external;
  function createsWrappedSongTokens(string memory songURI, uint256 sharesAmount, string memory sharesURI, address creator) external returns (uint256 songId, uint256 newSongSharesId);
  function createsSongToken(string memory songURI, address[] memory participants) external returns (uint256 songId);
  function createFungibleSongShares(uint256 songId, uint256 sharesAmount, string memory sharesURI, address creator) external returns (uint256 sharesId);
  function getTokenBalance(uint256 tokenId) external view returns (uint256);
  function getWrappedSongMetadata(uint256 tokenId) external view returns (string memory);
  function getTokenTotalSupply(uint256 id) external view returns (uint256);
  function getSongSharesBalance(address account) external view returns (uint256);
  function getWSTokenManagementAddress() external view returns (address);
  function canReceiveERC20() external pure returns (bool);
  function getUnclaimedEarnings(address account) external view returns (uint256);
  function getTokenMetadata(uint256 tokenId) external view returns (string memory);
  function checkAuthenticity() external view returns (bool);
  function getReceivedTokens() external view returns (address[] memory);
  function getRemainingEarnings(address account) external view returns (uint256);
  function getTotalEarnings(address account) external view returns (uint256);
  function getRedeemedEarnings(address account) external view returns (uint256);
}