// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicERC721 is ERC721, ERC721Enumerable, Ownable {
constructor(string memory name, string memory symbol, address initialOwner) 
        ERC721(name, symbol) 
        Ownable(initialOwner) // Pass the initialOwner to the Ownable constructor
    {}

        // Mapping from token ID to metadata URIs
    mapping(uint256 => string) private _tokenURIs;

    function _setTokenURI(uint256 tokenId, string memory metadataURI) internal {
        // No need to check if the token exists, as _mint ensures it
        _tokenURIs[tokenId] = metadataURI;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        // Will automatically revert if the tokenId does not exist
        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // Concatenate base URI and token URI if both are set
        if (bytes(base).length > 0 && bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        // If only token URI is set
        if (bytes(_tokenURI).length > 0) {
            return _tokenURI;
        }

        // Fallback to the default tokenURI behavior
        return super.tokenURI(tokenId);
    }

    // Function to mint new tokens with an IPFS metadata URI
    function mint(address to, string memory metadataURI) public {
        uint256 newTokenId = totalSupply(); 
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Hypothetical overrides for _increaseBalance and _update
    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
}

