// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWSTokenManagement is IERC1155 {
    function createSongShares(uint256 sharesAmount) external;
    function createBuyoutToken(uint256 amount, address recipient) external;
    function createLegalContract(string memory contractURI) external returns (uint256 tokenId);
    function migrateWrappedSong(address metadataAddress) external;
    
    // Constants
    function SONG_CONCEPT_ID() external view returns (uint256);
    function SONG_SHARES_ID() external view returns (uint256);
    function BUYOUT_TOKEN_ID() external view returns (uint256);
    function LEGAL_CONTRACT_START_ID() external view returns (uint256);
    
    // View functions
    function uri(uint256 tokenId) external view returns (string memory);
    function totalShares() external view returns (uint256);
    function currentLegalContractId() external view returns (uint256);
    function metadataModule() external view returns (address);
    function protocolModule() external view returns (address);
    function legalContractMetadata() external view returns (address);
    function totalSupply(uint256 tokenId) external view returns (uint256);
}
