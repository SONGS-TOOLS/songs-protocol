pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IWSTokensManagement.sol';

/**
 * @title WSUtils
 * @dev A utility contract for interacting with IWSTokensManagement instances.
 * This contract provides view functions to retrieve information from any IWSTokensManagement.
 */
contract WSUtils is Ownable, ERC165 {
    IProtocolModule public immutable protocolModule;
    
    constructor(address _protocolModuleAddress, address _owner) Ownable(_owner) {
        require(_protocolModuleAddress != address(0), 'Invalid protocol module address');
        protocolModule = IProtocolModule(_protocolModuleAddress);
    }

    /**
     * @dev Retrieves the token balance for a specific token ID in a IWSTokensManagement.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @param account The address of the account to check the balance for.
     * @param tokenId The ID of the token to check the balance for.
     * @return The balance of the specified token.
     */
    function getTokenBalance(address _wsTokensManagement, address account, uint256 tokenId) public view returns (uint256) {
        return IWSTokensManagement(_wsTokensManagement).balanceOf(account, tokenId);
    }

    /**
     * @dev Retrieves the metadata for a wrapped song token.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @param tokenId The ID of the token to get metadata for.
     * @return The metadata of the specified wrapped song token.
     */
    function getWrappedSongMetadata(address _wsTokensManagement, uint256 tokenId) public view returns (string memory) {
        return IWSTokensManagement(_wsTokensManagement).uri(tokenId);
    }

    /**
     * @dev Retrieves the total supply of a specific token in a IWSTokensManagement.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @param id The ID of the token to get the total supply for.
     * @return The total supply of the specified token.
     */
    function getTokenTotalSupply(address _wsTokensManagement, uint256 id) public view returns (uint256) {
        return IWSTokensManagement(_wsTokensManagement).totalSupply(id);
    }

    /**
     * @dev Retrieves the song shares balance for a specific account in a IWSTokensManagement.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @param account The address of the account to check the balance for.
     * @return The song shares balance of the specified account.
     */
    function getSongSharesBalance(address _wsTokensManagement, address account) public view returns (uint256) {
        return IWSTokensManagement(_wsTokensManagement).balanceOf(account, IWSTokensManagement(_wsTokensManagement).SONG_SHARES_ID());
    }

    /**
     * @dev Retrieves the metadata for a specific token in a IWSTokensManagement.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @param tokenId The ID of the token to get metadata for.
     * @return The metadata of the specified token.
     */
    function getTokenMetadata(address _wsTokensManagement, uint256 tokenId) public view returns (string memory) {
        return IWSTokensManagement(_wsTokensManagement).uri(tokenId);
    }

    /**
     * @dev Checks if a share sale is currently active.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @return A boolean indicating whether a share sale is active.
     */
    function isSaleActive(address _wsTokensManagement) public view returns (bool) {
        return IWSTokensManagement(_wsTokensManagement).saleActive();
    }

    /**
     * @dev Retrieves the current price per share in an active sale.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @return The current price per share.
     */
    function getPricePerShare(address _wsTokensManagement) public view returns (uint256) {
        return IWSTokensManagement(_wsTokensManagement).pricePerShare();
    }

    /**
     * @dev Retrieves the number of shares available for sale.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @return The number of shares available for sale.
     */
    function getSharesForSale(address _wsTokensManagement) public view returns (uint256) {
        return IWSTokensManagement(_wsTokensManagement).sharesForSale();
    }

    /**
     * @dev Retrieves the total number of shares.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @return The total number of shares.
     */
    function getTotalShares(address _wsTokensManagement) public view returns (uint256) {
        return IWSTokensManagement(_wsTokensManagement).totalShares();
    }

    /**
     * @dev Retrieves the URI for a specific token ID.
     * @param _wsTokensManagement The address of the IWSTokensManagement.
     * @param tokenId The ID of the token to get the URI for.
     * @return The URI of the specified token.
     */
    function getTokenURI(address _wsTokensManagement, uint256 tokenId) public view returns (string memory) {
        return IWSTokensManagement(_wsTokensManagement).uri(tokenId);
    }

    /**
     * @dev Checks if this contract supports a given interface.
     * @param interfaceId The interface identifier to check.
     * @return A boolean indicating whether the contract supports the interface.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
