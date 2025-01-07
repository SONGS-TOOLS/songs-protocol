// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IWSTokenManagement is IERC1155 {
    // Events

    // View functions - non-ERC1155 functions only
    function totalSupply(uint256 id) external view returns (uint256);
    function balanceOfAt(address account, uint256 id, uint256 timestamp) external view returns (uint256);
    function uri(uint256 tokenId) external view returns (string memory);
    
    // Token ID getters
    function SONG_CONCEPT_ID() external pure returns (uint256);
    function SONG_SHARES_ID() external pure returns (uint256);
    function BUYOUT_TOKEN_ID() external pure returns (uint256);
    function LEGAL_CONTRACT_START_ID() external pure returns (uint256);
    
    // State variables
    function totalShares() external view returns (uint256);
    function currentLegalContractId() external view returns (uint256);
    function metadataModule() external view returns (address);
    function protocolModule() external view returns (address);
    function legalContractMetadata() external view returns (address);

    // Token management functions
    function initialize(
        address _smartAccount,
        address _minterAddress,
        address _protocolModuleAddress
    ) external;
    
    function createSongShares(uint256 sharesAmount) external;
    function createBuyoutToken(uint256 amount, address recipient) external;
    function createLegalContract(string memory contractURI) external returns (uint256);
    function updateSymbol(string memory newSymbol) external;
    // Migration and ownership
    function migrateWrappedSong(address newMetadataAddress, address newWrappedSongAddress) external;
    function transferOwnership(address newOwner) external;

}
