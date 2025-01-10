// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IMetadataModule.sol";
import "./IProtocolModule.sol";

interface IMetadataRenderer {
    function composeTokenURI(
        IMetadataModule.Metadata memory metadata,
        uint256 tokenId,
        address wrappedSongAddress,
        string memory baseURI,
        string memory externalUrlBase,
        IProtocolModule protocolModule
    ) external view returns (string memory);

    function composeContractURI(
        IMetadataModule.Metadata memory metadata,
        string memory baseURI,
        string memory externalUrlBase,
        address wrappedSong
    ) external pure returns (string memory);
} 