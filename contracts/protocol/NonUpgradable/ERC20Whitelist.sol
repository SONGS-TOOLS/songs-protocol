// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/**
 * @title ERC20Whitelist
 * @dev Contract to manage a whitelist of ERC20 token addresses for the protocol.
 * Only the owner can add or remove addresses from the whitelist.
 */
contract ERC20Whitelist is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private _whitelistedTokens;
    address public authorizedCaller;

    event TokenWhitelisted(address indexed token, string name, string symbol);
    event TokenRemovedFromWhitelist(address indexed token);
    event AuthorizedCallerSet(address indexed caller);

    constructor(address _initialOwner) Ownable(_initialOwner) {}

    modifier onlyOwnerOrAuthorized() {
        require(msg.sender == owner() || msg.sender == authorizedCaller, "Not authorized");
        _;
    }

    function setAuthorizedCaller(address _caller) external onlyOwner {
        authorizedCaller = _caller;
        emit AuthorizedCallerSet(_caller);
    }

    /**
     * @dev Adds a token address to the whitelist
     * @param token The address of the ERC20 token to whitelist
     */
    function whitelistToken(address token) external onlyOwnerOrAuthorized {
        require(token != address(0), "Invalid token address");
        require(_whitelistedTokens.add(token), "Token already whitelisted");
        
        IERC20Metadata tokenMetadata = IERC20Metadata(token);
        string memory name = tokenMetadata.name();
        string memory symbol = tokenMetadata.symbol();
        
        emit TokenWhitelisted(token, name, symbol);
    }

    /**
     * @dev Removes a token address from the whitelist
     * @param token The address of the ERC20 token to remove from the whitelist
     */
    function removeTokenFromWhitelist(address token) external onlyOwnerOrAuthorized {
        require(_whitelistedTokens.remove(token), "Token not in whitelist");
        emit TokenRemovedFromWhitelist(token);
    }

    /**
     * @dev Checks if a token is whitelisted
     * @param token The address of the ERC20 token to check
     * @return bool True if the token is whitelisted, false otherwise
     */
    function isTokenWhitelisted(address token) external view returns (bool) {
        return _whitelistedTokens.contains(token);
    }

    /**
     * @dev Returns the number of whitelisted tokens
     * @return uint256 The number of whitelisted tokens
     */
    function getWhitelistedTokenCount() external view returns (uint256) {
        return _whitelistedTokens.length();
    }

    /**
     * @dev Returns a whitelisted token address by index
     * @param index The index of the token in the whitelist
     * @return address The address of the whitelisted token
     */
    function getWhitelistedTokenAtIndex(uint256 index) external view returns (address) {
        require(index < _whitelistedTokens.length(), "Index out of bounds");
        return _whitelistedTokens.at(index);
    }
}
