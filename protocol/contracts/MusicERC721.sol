// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MusicERC721 is ERC721, ERC721Enumerable, Ownable {
  // Keep the metadata URI and token ID fixed
  string private _tokenURI;
  uint256 private constant _tokenId = 0;

  constructor(
    string memory name,
    string memory symbol
  ) ERC721(name, symbol) Ownable(msg.sender) {
    
  }

  function setTokenUri(string memory metadataURI) public onlyOwner {
    _tokenURI = metadataURI; // Set the token URI
  }

  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory) {
    // If only token URI is set
    if (bytes(_tokenURI).length > 0) {
      return _tokenURI;
    }

    // Fallback to the default tokenURI behavior
    return super.tokenURI(tokenId);
  }

  // Function to mint new tokens with an IPFS metadata URI
  function mint(address to) public onlyOwner {
    uint256 newTokenId = totalSupply();
    _mint(to, newTokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  // Hypothetical overrides for _increaseBalance and _update
  function _increaseBalance(
    address account,
    uint128 amount
  ) internal override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, amount);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal override(ERC721, ERC721Enumerable) returns (address) {
    return super._update(to, tokenId, auth);
  }
}
