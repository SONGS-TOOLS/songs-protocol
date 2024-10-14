// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './../Interfaces/IMetadataModule.sol';

interface IWrappedSongSmartAccount {
  function requestWrappedSongReleaseWithMetadata(address _distributorWallet, string memory songURI) external;
  function requestWrappedSongRelease(address _distributorWallet) external;
  function receiveERC20(address token, uint256 amount) external;
  function receiveEarnings() external payable;
  function claimEarnings() external;
  function claimEthEarnings() external;
  function updateEarnings() external;
  function withdrawSaleFundsFromWSTokenManagement() external;
  function createSongTokens(IMetadataModule.Metadata memory songMetadata, uint256 sharesAmount, address creator) external returns (uint256 songId, uint256 sharesId);
  function getWSTokenManagementAddress() external view returns (address);
  function owner() external view returns (address);
  function redeemShares() external;
}
