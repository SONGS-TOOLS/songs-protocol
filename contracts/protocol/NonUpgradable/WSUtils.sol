// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IWSTokenManagement.sol';
import './../Interfaces/IWrappedSongSmartAccount.sol';

/**
 * @title WSUtils
 * @dev A utility contract for interacting with IWSTokenManagement instances.
 * This contract provides view functions to retrieve information from any IWSTokenManagement.
 */
contract WSUtils is Ownable, ERC165 {
    IProtocolModule public immutable protocolModule;
    
    constructor(address _protocolModuleAddress, address _owner) Ownable(_owner) {
        require(_protocolModuleAddress != address(0), 'Invalid protocol module address');
        protocolModule = IProtocolModule(_protocolModuleAddress);
    }

    /**
     * @dev Retrieves the token balance for a specific token ID in a IWSTokenManagement.
     * @param _wsTokensManagement The address of the IWSTokenManagement.
     * @param account The address of the account to check the balance for.
     * @param tokenId The ID of the token to check the balance for.
     * @return The balance of the specified token.
     */
    function getTokenBalance(address _wsTokensManagement, address account, uint256 tokenId) public view returns (uint256) {
        return IWSTokenManagement(_wsTokensManagement).balanceOf(account, tokenId);
    }

    /**
     * @dev Retrieves the metadata for a wrapped song token.
     * @param _wsTokensManagement The address of the IWSTokenManagement.
     * @param tokenId The ID of the token to get metadata for.
     * @return The metadata of the specified wrapped song token.
     */
    function getWrappedSongMetadata(address _wsTokensManagement, uint256 tokenId) public view returns (string memory) {
        return IWSTokenManagement(_wsTokensManagement).uri(tokenId);
    }

    /**
     * @dev Retrieves the total supply of a specific token in a IWSTokenManagement.
     * @param _wsTokensManagement The address of the IWSTokenManagement.
     * @param id The ID of the token to get the total supply for.
     * @return The total supply of the specified token.
     */
    function getTokenTotalSupply(address _wsTokensManagement, uint256 id) public view returns (uint256) {
        return IWSTokenManagement(_wsTokensManagement).totalSupply(id);
    }

    /**
     * @dev Retrieves the song shares balance for a specific account in a IWSTokenManagement.
     * @param _wsTokensManagement The address of the IWSTokenManagement.
     * @param account The address of the account to check the balance for.
     * @return The song shares balance of the specified account.
     */
    function getSongSharesBalance(address _wsTokensManagement, address account) public view returns (uint256) {
        return IWSTokenManagement(_wsTokensManagement).balanceOf(account, IWSTokenManagement(_wsTokensManagement).SONG_SHARES_ID());
    }

    /**
     * @dev Retrieves the metadata for a specific token in a IWSTokenManagement.
     * @param _wsTokensManagement The address of the IWSTokenManagement.
     * @param tokenId The ID of the token to get metadata for.
     * @return The metadata of the specified token.
     */
    function getTokenMetadata(address _wsTokensManagement, uint256 tokenId) public view returns (string memory) {
        return IWSTokenManagement(_wsTokensManagement).uri(tokenId);
    }

    /**
     * @dev Retrieves the total number of shares.
     * @param _wsTokensManagement The address of the IWSTokenManagement.
     * @return The total number of shares.
     */
    function getTotalShares(address _wsTokensManagement) public view returns (uint256) {
        return IWSTokenManagement(_wsTokensManagement).totalShares();
    }

    /**
     * @dev Retrieves the URI for a specific token ID.
     * @param _wsTokensManagement The address of the IWSTokenManagement.
     * @param tokenId The ID of the token to get the URI for.
     * @return The URI of the specified token.
     */
    function getTokenURI(address _wsTokensManagement, uint256 tokenId) public view returns (string memory) {
        return IWSTokenManagement(_wsTokensManagement).uri(tokenId);
    }

    /**
     * @dev Checks if this contract supports a given interface.
     * @param interfaceId The interface identifier to check.
     * @return A boolean indicating whether the contract supports the interface.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Checks if a token ID exists in the WSTokensManagement contract.
     * @param _wsTokensManagement The address of the IWSTokenManagement.
     * @param tokenId The ID of the token to check.
     * @return True if the token exists, false otherwise.
     */
    function tokenExists(address _wsTokensManagement, uint256 tokenId) public view returns (bool) {
        return IWSTokenManagement(_wsTokensManagement).totalSupply(tokenId) > 0;
    }

    /**
     * @dev Checks if a wrapped song is from the protocol.
     * @param _wsTokensManagement The address of the IWSTokenManagement.
     * @return True if the wrapped song is from the protocol, false otherwise.
     */
    function isFromProtocol(address _wsTokensManagement) public view returns (bool) {
        return protocolModule.isWSTokenFromProtocol(_wsTokensManagement);
    }
}
