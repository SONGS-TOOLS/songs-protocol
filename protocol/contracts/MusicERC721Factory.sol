// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MusicERC721.sol";

contract MusicERC721Factory {
    // Event to emit when a new MusicERC721 contract is deployed
    event MusicERC721Deployed(address indexed owner, address indexed contractAddress, string tokenURI);

    function deployMusicERC721(
        string memory name,
        string memory symbol,
        string memory metadataURI
    ) public { // Note the return type `address` here
        MusicERC721 musicNFT = new MusicERC721(name, symbol);
        musicNFT.setTokenUri(metadataURI); // Assuming `setTokenUri` is a valid function in MusicERC721
        emit MusicERC721Deployed(msg.sender, address(musicNFT), metadataURI);
    }
}
