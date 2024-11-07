// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LegalContractMetadata
 * @dev Manages metadata for legal contract tokens
 */
contract LegalContractMetadata is Ownable {
    mapping(address => mapping(uint256 => string)) private legalContractURIs;

    event LegalContractURIUpdated(address indexed wsToken, uint256 indexed tokenId, string newURI);
    event LegalContractURIRemoved(address indexed wsToken, uint256 indexed tokenId);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Sets or updates the URI for a legal contract token
     * @param wsToken The address of the WSTokenManagement contract
     * @param tokenId The ID of the legal contract token
     * @param uri The new URI for the legal contract
     */
    function setLegalContractURI(address wsToken, uint256 tokenId, string memory uri) external {
        require(msg.sender == wsToken, "Only WSTokenManagement can set URIs");
        require(bytes(uri).length > 0, "URI cannot be empty");
        
        legalContractURIs[wsToken][tokenId] = uri;
        emit LegalContractURIUpdated(wsToken, tokenId, uri);
    }

    /**
     * @dev Gets the URI for a legal contract token
     * @param wsToken The address of the WSTokenManagement contract
     * @param tokenId The ID of the legal contract token
     * @return The URI for the legal contract
     */
    function getLegalContractURI(address wsToken, uint256 tokenId) external view returns (string memory) {
        return legalContractURIs[wsToken][tokenId];
    }

    /**
     * @dev Removes the URI for a legal contract token
     * @param wsToken The address of the WSTokenManagement contract
     * @param tokenId The ID of the legal contract token
     */
    function removeLegalContractURI(address wsToken, uint256 tokenId) external {
        require(msg.sender == wsToken, "Only WSTokenManagement can remove URIs");
        require(bytes(legalContractURIs[wsToken][tokenId]).length > 0, "URI does not exist");
        
        delete legalContractURIs[wsToken][tokenId];
        emit LegalContractURIRemoved(wsToken, tokenId);
    }
} 