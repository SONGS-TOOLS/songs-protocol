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
   * @param externalUrlBase The external URL base for the protocol.
   * @param protocolModule The protocol module interface to fetch registry codes.
   * @return The composed token URI as a string.
   */
  function composeTokenURI(
    IMetadataModule.Metadata memory metadata,
    uint256 tokenId,
    address wrappedSongAddress,
    string memory baseURI,
    string memory externalUrlBase,
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
      description = string(
        abi.encodePacked(
          "These are the SongShares that represent your ownership stake in the royalty earnings of the Song ",
          metadata.name,
          "."
        )
      );
    } else if (tokenId == 2) {
      tokenType = unicode"⟳";
      finalImageData = string(abi.encodePacked(baseURI, metadata.image));
      description = string(
        abi.encodePacked(
          "This token grants you access to download a high-quality version of the song ",
          metadata.name,
          "."
        )
      );
    } else if (tokenId >= 3) {
      tokenType = unicode"📄";
      finalImageData = string(abi.encodePacked(baseURI, metadata.image));
      description = string(
        abi.encodePacked("This is a Legal Contract Document for the song ", metadata.name, ".")
      );
    }

    // Handle different types of content identifiers
    if (_isIPFSCID(metadata.animationUrl)) {
      // IPFS CID (v0 or v1) - use IPFS gateway
      metadata.animationUrl = string(abi.encodePacked(baseURI, metadata.animationUrl));
    } else {
      // Arweave or other external URL - use external URL base
      metadata.animationUrl = string(abi.encodePacked(externalUrlBase, metadata.animationUrl));
    }

    // Get registry codes and authenticity status from protocol module
    string memory isrcCode = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule())
      .identityModule()
      .getIsrcCode(wrappedSongAddress);
    string memory upcCode = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule())
      .identityModule()
      .getUpcCode(wrappedSongAddress);
    string memory iswcCode = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule())
      .identityModule()
      .getIswcCode(wrappedSongAddress);
    string memory isccCode = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule())
      .identityModule()
      .getIsccCode(wrappedSongAddress);
    bool isAuthentic = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule())
      .identityModule()
      .isAuthentic(wrappedSongAddress);

    string memory registryCodes = _composeRegistryCodes(isrcCode, upcCode, iswcCode, isccCode);
    string memory authenticity = _composeAuthenticity(isAuthentic);

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            tokenType,
            " ",
            metadata.name,
            '",',
            '"description": "',
            description,
            '",',
            '"image": "',
            finalImageData,
            '",',
            '"external_url": "',
            string(
              abi.encodePacked(
                externalUrlBase,
                "wrapped-songs/",
                addressToString(wrappedSongAddress)
              )
            ),
            '",',
            '"animation_url": "',
            string(abi.encodePacked(baseURI, metadata.animationUrl)),
            '",',
            '"attributes": "',
            string(abi.encodePacked(baseURI, metadata.attributesIpfsHash)),
            '",',
            registryCodes,
            ",",
            authenticity,
            "}"
          )
        )
      )
    );

    return string(abi.encodePacked("data:application/json;base64,", json));
  }

  function _generateSVGImage(string memory imageUrl) internal pure returns (string memory) {
    string memory htmlContent = _generateSVGContent(imageUrl);
    return string(abi.encodePacked("data:text/html;base64,", Base64.encode(bytes(htmlContent))));
  }

  function _generateSVGContent(string memory imageUrl) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          "<html><head><style>",
          ".container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }",
          ".circle-image { width: 80%; height: 80%; border-radius: 50%; border: 2px solid black; ",
          'background-image: url("',
          imageUrl,
          '"); background-size: cover; background-position: center; }',
          "</style></head>",
          '<body><div class="container"><div class="circle-image"></div></div></body></html>'
        )
      );
  }

  function addressToString(address _addr) internal pure returns (string memory) {
    bytes32 value = bytes32(uint256(uint160(_addr)));
    bytes memory alphabet = "0123456789abcdef";
    bytes memory str = new bytes(42);
    str[0] = "0";
    str[1] = "x";
    for (uint256 i = 0; i < 20; i++) {
      str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
      str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
    }
    return string(str);
  }

  function _composeRegistryCodes(
    string memory isrcCode,
    string memory upcCode,
    string memory iswcCode,
    string memory isccCode
  ) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '"registryCodes": {',
          '"ISRC": "',
          bytes(isrcCode).length > 0 ? isrcCode : "",
          '",',
          '"UPC": "',
          bytes(upcCode).length > 0 ? upcCode : "",
          '",',
          '"ISWC": "',
          bytes(iswcCode).length > 0 ? iswcCode : "",
          '",',
          '"ISCC": "',
          bytes(isccCode).length > 0 ? isccCode : "",
          '"',
          "}"
        )
      );
  }

  // Add new helper function for authenticity
  function _composeAuthenticity(bool isAuthentic) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '"authenticity": {',
          '"isAuthentic": ',
          isAuthentic ? "true" : "false",
          "}"
        )
      );
  }

  /**
   * @dev Composes the contract-level metadata URI.
   * @param metadata The metadata of the wrapped song.
   * @param baseURI The base URI for the protocol.
   * @return The composed contract URI as a string.
   */
  function composeContractURI(
    IMetadataModule.Metadata memory metadata,
    string memory baseURI,
    string memory externalUrlBase,
    address wrappedSongAddress
  ) external pure returns (string memory) {
    require(bytes(baseURI).length > 0, "Base URI not set");

    string memory finalImageData = string(abi.encodePacked(baseURI, metadata.image));

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            "{",
            '"name": "SONGS: ',
            metadata.name,
            '",',
            '"description": "',
            metadata.description,
            '",',
            '"image": "',
            finalImageData,
            '",',
            '"external_link": "',
            string(
              abi.encodePacked(
                externalUrlBase,
                "wrapped-songs/",
                addressToString(wrappedSongAddress)
              )
            ),
            '"',
            "}"
          )
        )
      )
    );

    return string(abi.encodePacked("data:application/json;base64,", json));
  }

  /**
   * @dev Checks if a string is an IPFS CID (v0 or v1).
   * @param str The string to check.
   * @return True if the string is an IPFS CID, false otherwise.
   */
  function _isIPFSCID(string memory str) internal pure returns (bool) {
    bytes memory strBytes = bytes(str);

    // Check for CIDv0: exactly 46 characters and starts with "Qm"
    if (strBytes.length == 46 && _startsWith(str, "Qm")) {
      return true;
    }

    // Check for CIDv1: various multibase prefixes
    if (strBytes.length > 10) {
      // Minimum reasonable length for CIDv1
      bytes1 firstChar = strBytes[0];

      // Common multibase prefixes for CIDv1:
      // 'b' = base32 (most common, gives "bafy", "bagu", etc.)
      // 'z' = base58btc
      // 'f' = base16 (hex)
      // 'u' = base64url
      // 'm' = base64
      // 'k' = base36
      // 't' = base32hex
      if (
        firstChar == "b" ||
        firstChar == "z" ||
        firstChar == "f" ||
        firstChar == "u" ||
        firstChar == "m" ||
        firstChar == "k" ||
        firstChar == "t"
      ) {
        // Additional validation: check if it looks like a valid CID structure
        // CIDv1 with base32 typically starts with "bafy", "bagu", "bah5", etc.
        // CIDv1 with base58btc typically starts with "z" followed by alphanumeric
        if (firstChar == "b") {
          // For base32, check if it starts with common CIDv1 patterns
          return
            _startsWith(str, "bafy") ||
            _startsWith(str, "bagu") ||
            _startsWith(str, "bah5") ||
            _startsWith(str, "baea") ||
            strBytes.length >= 32; // Reasonable minimum length
        } else if (firstChar == "z") {
          // For base58btc, should be longer and contain valid base58 chars
          return strBytes.length >= 32;
        } else {
          // For other bases, use length heuristic
          return strBytes.length >= 20;
        }
      }
    }

    return false;
  }

  /**
   * @dev Checks if a string starts with a given prefix.
   * @param str The string to check.
   * @param prefix The prefix to look for.
   * @return True if the string starts with the prefix, false otherwise.
   */
  function _startsWith(string memory str, string memory prefix) internal pure returns (bool) {
    bytes memory strBytes = bytes(str);
    bytes memory prefixBytes = bytes(prefix);

    if (strBytes.length < prefixBytes.length) {
      return false;
    }

    for (uint256 i = 0; i < prefixBytes.length; i++) {
      if (strBytes[i] != prefixBytes[i]) {
        return false;
      }
    }

    return true;
  }
}
