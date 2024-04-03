// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract SongManagement is ERC1155, Ownable {
  uint256 private _currentTokenId = 0;

  mapping(uint256 => string) private _tokenURIs;
  // Mapping song ID to its fungible shares ID
  mapping(uint256 => uint256) public songToFungibleShares;
  // Mapping to track the concept NFT ID for each song
  mapping(uint256 => uint256) private songToConceptNFT;
  // New: Mapping to track the total shares amount for each fungible token ID
  mapping(uint256 => uint256) public fungibleTokenShares;

  constructor(address initialOwner) ERC1155('') Ownable(msg.sender) {
    transferOwnership(initialOwner); // Transfer ownership to the initial owner
  }

  function setTokenURI(uint256 tokenId, string memory tokenURI) private {
    _tokenURIs[tokenId] = tokenURI;
  }

  function uri(uint256 tokenId) public view override returns (string memory) {
    return _tokenURIs[tokenId];
  }

  // Modified to ensure the concept NFT and participation NFTs are in the same "collection"
  function createSongConcept(
    string memory songURI,
    address smartWallet
  ) public onlyOwner returns (uint256 songId) {
    _currentTokenId++;
    songId = _currentTokenId;
    _mint(smartWallet, songId, 1, '');
    setTokenURI(songId, songURI);
    songToConceptNFT[songId] = songId;
  }

  // Adjusted to mint participation NFTs without changing their collection
  function mintParticipationNFTs(
    uint256 songId,
    address[] memory participants
  ) public onlyOwner {
    require(songToConceptNFT[songId] != 0, 'Invalid song ID'); // Ensure the song concept exists
    for (uint i = 0; i < participants.length; i++) {
      _mint(participants[i], songId, 1, ''); // Mint participation NFT for each participant using the songId
    }
  }

  // Adjusted to exchange participation NFTs for shares
  function exchangeNFTForShares(uint256 songId, uint256 sharesAmount) public {
    uint256 sharesId = songToFungibleShares[songId];
    require(sharesId != 0, 'No shares associated with this song');
    require(
      balanceOf(msg.sender, songId) > 0,
      'You do not own the required NFT'
    );

    // Checks and operations as previously outlined
    _burn(msg.sender, songId, 1);
    _safeTransferFrom(address(this), msg.sender, sharesId, sharesAmount, '');
  }

  // Enhanced createFungibleSongShares function
  function createFungibleSongShares(
    uint256 songId,
    uint256 sharesAmount
  ) public onlyOwner returns (uint256 sharesId) {
    require(
      songToConceptNFT[songId] != 0,
      "Invalid song ID, concept NFT doesn't exist"
    );
    require(
      songToFungibleShares[songId] == 0,
      'Shares already created for this song'
    );

    _currentTokenId++;
    sharesId = _currentTokenId;
    _mint(msg.sender, sharesId, sharesAmount, ''); // Mint fungible shares
    songToFungibleShares[songId] = sharesId; // Link concept NFT with fungible shares
    fungibleTokenShares[sharesId] = sharesAmount; // Track the total shares for this ID
  }

  // Query method for fungible token shares
  function getFungibleTokenShares(
    uint256 sharesId
  ) public view returns (uint256) {
    return fungibleTokenShares[sharesId];
  }

  // Query method to get the fungible shares ID associated with a concept NFT
  function getSharesIdForSong(uint256 songId) public view returns (uint256) {
    require(
      songToConceptNFT[songId] != 0,
      "Invalid song ID, concept NFT doesn't exist"
    );
    return songToFungibleShares[songId];
  }
}
