// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IERC20Whitelist
 * @dev Interface for the ERC20Whitelist contract
 */
interface IERC20Whitelist {
    /**
     * @dev Emitted when a token is added to the whitelist
     */
    event TokenWhitelisted(address indexed token, string name, string symbol);

    /**
     * @dev Emitted when a token is removed from the whitelist
     */
    event TokenRemovedFromWhitelist(address indexed token);

    /**
     * @dev Emitted when the authorized caller is set
     */
    event AuthorizedCallerSet(address indexed caller);

    /**
     * @dev Sets the authorized caller
     * @param caller The address of the authorized caller
     */
    function setAuthorizedCaller(address caller) external;
    
    /**
     * @dev Adds a token address to the whitelist
     * @param token The address of the ERC20 token to whitelist
     */
    function whitelistToken(address token) external;

    /**
     * @dev Removes a token address from the whitelist
     * @param token The address of the ERC20 token to remove from the whitelist
     */
    function removeTokenFromWhitelist(address token) external;

    /**
     * @dev Checks if a token is whitelisted
     * @param token The address of the ERC20 token to check
     * @return bool True if the token is whitelisted, false otherwise
     */
    function isTokenWhitelisted(address token) external view returns (bool);

    /**
     * @dev Returns the number of whitelisted tokens
     * @return uint256 The number of whitelisted tokens
     */
    function getWhitelistedTokenCount() external view returns (uint256);

    /**
     * @dev Returns a whitelisted token address by index
     * @param index The index of the token in the whitelist
     * @return address The address of the whitelisted token
     */
    function getWhitelistedTokenAtIndex(uint256 index) external view returns (address);
}

