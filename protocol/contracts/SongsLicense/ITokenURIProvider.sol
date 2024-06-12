// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import '@openzeppelin/contracts/utils/Base64.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract ITokenURIProvider2 {
    function tokenURI(
        uint256 tokenId,
        string memory name,
        string memory baseURI,
        string memory imageHash,
        string memory htmlHash
    ) external pure returns (string memory) {
        string memory imageUrl = string(abi.encodePacked(baseURI, imageHash));
        string memory animationUrl = string(abi.encodePacked(baseURI, htmlHash, '/#/', Strings.toString(tokenId)));
        
        string memory metadata = string(
            abi.encodePacked(
                '{',
                '"name":"', name, '",',
                '"description":"This license allows the holder to publish Wrapped Songs at the SONGS Protocol",',
                '"image":"', imageUrl, '",',
                '"animation_url":"', animationUrl, '",',
                '"external_url":"https://songs-tools.com",',
                '"attributes":[',
                _getAttributes(tokenId, name),
                ']',
                '}'
            )
        );

        string memory json = Base64.encode(bytes(metadata));
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function _getAttributes(uint256 tokenId, string memory name) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                '{"trait_type":"License ID","value":"', Strings.toString(tokenId), '"},',
                '{"trait_type":"Name","value":"', name, '"}'
            )
        );
    }

}
