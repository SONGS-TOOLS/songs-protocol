// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IWSTokenManagement is IERC1155 {
  function setTokenURI(uint256 tokenId, string memory tokenURI) external;
  function createSongConcept(
    string memory songURI,
    address smartWallet
  ) external returns (uint256 songId);
  function createFungibleSongShares(
    uint256 songId,
    uint256 sharesAmount,
    string memory sharesURI,
    address creator
  ) external returns (uint256 sharesId);
  function startSharesSale(
    uint256 amount,
    uint256 price,
    uint256 maxShares,
    address _stableCoin
  ) external;
  function buyShares(uint256 amount) external payable;
  function endSharesSale() external;
  function withdrawFunds() external;
  function setMaxSharesPerWallet(uint256 maxShares) external;
  function onERC20Received(
    address token,
    uint256 amount
  ) external returns (bytes4);
  function setMetadataModule(address _metadataModule) external;
  function updateTokenURI(uint256 tokenId, string memory newTokenURI) external;

  // View functions
  function songToFungibleShares(uint256 songId) external view returns (uint256);
  function fungibleTokenShares(
    uint256 sharesId
  ) external view returns (uint256);
  function SONG_SHARES_ID() external view returns (uint256);
  function sharesForSale() external view returns (uint256);
  function pricePerShare() external view returns (uint256);
  function saleActive() external view returns (bool);
  function totalShares() external view returns (uint256);
  function maxSharesPerWallet() external view returns (uint256);
  function stableCoin() external view returns (IERC20);
  function metadataModule() external view returns (address);
}
