// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILegalContractMetadata {
    function setLegalContractURI(address wsToken, uint256 tokenId, string memory uri) external;
    function getLegalContractURI(address wsToken, uint256 tokenId) external view returns (string memory);
    function removeLegalContractURI(address wsToken, uint256 tokenId) external;
} 