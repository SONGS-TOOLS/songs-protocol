// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Base64.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IRegistryModule.sol";
contract MetadataRenderer {
    /**
     * @dev Composes the token URI from the metadata and token ID.
     * @param metadata The metadata of the wrapped song.
     * @param tokenId The ID of the token.
     * @param wrappedSongAddress The address of the wrapped song.
     * @param baseURI The base URI for the protocol.
     * @param protocolModule The protocol module interface to fetch registry codes.
     * @return The composed token URI as a string.
     */
    function composeTokenURI(
        IMetadataModule.Metadata memory metadata, 
        uint256 tokenId, 
        address wrappedSongAddress,
        string memory baseURI,
        IProtocolModule protocolModule
    ) external view returns (string memory) {
        require(bytes(baseURI).length > 0, "Base URI not set");
        
        string memory tokenType;
        string memory finalImageData;
        string memory description;

        if (tokenId == 0) {
            tokenType = unicode"◒";
            finalImageData = string(abi.encodePacked(baseURI, metadata.image));
            description = metadata.description;
        } else if (tokenId == 1) {
            tokenType = unicode"§"; 
            finalImageData = string(abi.encodePacked(baseURI, metadata.image));
            description = string(abi.encodePacked(
                "These are the SongShares representing your share on the royalty earnings of the Wrapped Song",
                addressToString(wrappedSongAddress),
                "."
            ));
        } else if (tokenId == 2) {
            tokenType = unicode"⟳";
            finalImageData = string(abi.encodePacked(baseURI, metadata.image));
            description = string(abi.encodePacked(
                "This is a Buyout Token for the Wrapped Song ",
                addressToString(wrappedSongAddress),
                "."
            ));
        } else if (tokenId >= 3) {
            tokenType = unicode"📄";
            finalImageData = string(abi.encodePacked(baseURI, metadata.image));
            description = string(abi.encodePacked(
                "This is a Legal Contract Token for the Wrapped Song ",
                addressToString(wrappedSongAddress),
                "."
            ));
        }

        // Get registry codes and authenticity status from protocol module
        string memory isrcCode = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule()).identityModule().getIsrcCode(wrappedSongAddress);
        string memory upcCode = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule()).identityModule().getUpcCode(wrappedSongAddress);
        string memory iswcCode = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule()).identityModule().getIswcCode(wrappedSongAddress);
        string memory isccCode = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule()).identityModule().getIsccCode(wrappedSongAddress);
        bool isAuthentic = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule()).identityModule().isAuthentic(wrappedSongAddress);

        string memory registryCodes = _composeRegistryCodes(isrcCode, upcCode, iswcCode, isccCode);
        string memory authenticity = _composeAuthenticity(isAuthentic);

        string memory json = Base64.encode(
            bytes(string(abi.encodePacked(
                '{"name": "', tokenType, ' ', metadata.name, '",',
                '"description": "', description, '",',
                '"image": "', finalImageData, '",',
                '"external_url": "', metadata.externalUrl, '",',
                '"animation_url": "', string(abi.encodePacked(baseURI, metadata.animationUrl)), '",',
                '"attributes": "', string(abi.encodePacked(baseURI, metadata.attributesIpfsHash)), '",',
                registryCodes, ',',
                authenticity,
                '}'
            )))
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _generateSVGImage(string memory imageUrl) internal pure returns (string memory) {
        string memory htmlContent = _generateSVGContent(imageUrl);
        return string(abi.encodePacked(
            'data:text/html;base64,',
            Base64.encode(bytes(htmlContent))
        ));
    }

    function _generateSVGContent(string memory imageUrl) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<html><head><style>',
            '.container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }',
            '.circle-image { width: 80%; height: 80%; border-radius: 50%; border: 2px solid black; ',
            'background-image: url("', imageUrl, '"); background-size: cover; background-position: center; }',
            '</style></head>',
            '<body><div class="container"><div class="circle-image"></div></div></body></html>'
        ));
    }

    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function _composeRegistryCodes(
        string memory isrcCode,
        string memory upcCode,
        string memory iswcCode,
        string memory isccCode
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '"registryCodes": {',
            '"ISRC": "', bytes(isrcCode).length > 0 ? isrcCode : '', '",',
            '"UPC": "', bytes(upcCode).length > 0 ? upcCode : '', '",',
            '"ISWC": "', bytes(iswcCode).length > 0 ? iswcCode : '', '",',
            '"ISCC": "', bytes(isccCode).length > 0 ? isccCode : '', '"',
            '}'
        ));
    }

    // Add new helper function for authenticity
    function _composeAuthenticity(bool isAuthentic) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '"authenticity": {',
            '"isAuthentic": ', isAuthentic ? 'true' : 'false',
            '}'
        ));
    }
} 