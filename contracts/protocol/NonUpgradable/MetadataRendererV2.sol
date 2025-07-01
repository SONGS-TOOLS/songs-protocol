// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/IMetadataRenderer.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IRegistryModule.sol";
import "./StorageDetect.sol";

/**
 * @title MetadataRendererV2
 * @dev Enhanced metadata renderer with automatic storage type detection and configurable base URIs
 * @notice Automatically detects IPFS and Arweave hashes and applies appropriate URI formats
 */
contract MetadataRendererV2 is IMetadataRenderer, Ownable {
    using StorageDetect for string;

    // Configurable base URIs for different storage types
    string public ipfsBaseURI;
    string public arweaveBaseURI;

    // Events for base URI changes
    event IPFSBaseURIUpdated(string oldURI, string newURI);
    event ArweaveBaseURIUpdated(string oldURI, string newURI);

    /**
     * @dev Constructor sets default base URIs and initial owner
     * @param initialOwner The address that will own this contract
     * @param _ipfsBaseURI Initial IPFS base URI (e.g., "ipfs://")
     * @param _arweaveBaseURI Initial Arweave base URI (e.g., "https://arweave.net/")
     */
    constructor(
        address initialOwner,
        string memory _ipfsBaseURI,
        string memory _arweaveBaseURI
    ) Ownable(initialOwner) {
        ipfsBaseURI = _ipfsBaseURI;
        arweaveBaseURI = _arweaveBaseURI;
    }

    /**
     * @dev Sets the IPFS base URI
     * @param _ipfsBaseURI New IPFS base URI (e.g., "ipfs://", "https://ipfs.io/ipfs/")
     */
    function setIPFSBaseURI(string memory _ipfsBaseURI) external onlyOwner {
        string memory oldURI = ipfsBaseURI;
        ipfsBaseURI = _ipfsBaseURI;
        emit IPFSBaseURIUpdated(oldURI, _ipfsBaseURI);
    }

    /**
     * @dev Sets the Arweave base URI
     * @param _arweaveBaseURI New Arweave base URI (e.g., "https://arweave.net/", "https://ar-io.net/")
     */
    function setArweaveBaseURI(string memory _arweaveBaseURI) external onlyOwner {
        string memory oldURI = arweaveBaseURI;
        arweaveBaseURI = _arweaveBaseURI;
        emit ArweaveBaseURIUpdated(oldURI, _arweaveBaseURI);
    }

    /**
     * @dev Sets both IPFS and Arweave base URIs in a single transaction
     * @param _ipfsBaseURI New IPFS base URI
     * @param _arweaveBaseURI New Arweave base URI
     */
    function setBaseURIs(
        string memory _ipfsBaseURI,
        string memory _arweaveBaseURI
    ) external onlyOwner {
        string memory oldIPFSURI = ipfsBaseURI;
        string memory oldArweaveURI = arweaveBaseURI;
        
        ipfsBaseURI = _ipfsBaseURI;
        arweaveBaseURI = _arweaveBaseURI;
        
        emit IPFSBaseURIUpdated(oldIPFSURI, _ipfsBaseURI);
        emit ArweaveBaseURIUpdated(oldArweaveURI, _arweaveBaseURI);
    }

    /**
     * @dev Composes the token URI from the metadata and token ID with enhanced storage detection
     * @param metadata The metadata of the wrapped song
     * @param tokenId The ID of the token
     * @param wrappedSongAddress The address of the wrapped song
     * @param baseURI The base URI for the protocol (fallback for unknown formats)
     * @param protocolModule The protocol module interface to fetch registry codes
     * @return The composed token URI as a string
     */
    function composeTokenURI(
        IMetadataModule.Metadata memory metadata, 
        uint256 tokenId, 
        address wrappedSongAddress,
        string memory baseURI,
        IProtocolModule protocolModule
    ) external view override returns (string memory) {
        require(bytes(baseURI).length > 0, "Base URI not set");
        
        string memory tokenType;
        string memory finalImageData;
        string memory description;

        if (tokenId == 0) {
            tokenType = unicode"◒";
            finalImageData = _buildImageURI(metadata.image, baseURI);
            description = metadata.description;
        } else if (tokenId == 1) {
            tokenType = unicode"§"; 
            finalImageData = _buildImageURI(metadata.image, baseURI);
            description = string(abi.encodePacked(
                "These are the SongShares representing your share on the royalty earnings of the Wrapped Song",
                _addressToString(wrappedSongAddress),
                "."
            ));
        } else if (tokenId == 2) {
            tokenType = unicode"⟳";
            finalImageData = _buildImageURI(metadata.image, baseURI);
            description = string(abi.encodePacked(
                "This is a Buyout Token for the Wrapped Song ",
                _addressToString(wrappedSongAddress),
                "."
            ));
        } else if (tokenId >= 3) {
            tokenType = unicode"📄";
            finalImageData = _buildImageURI(metadata.image, baseURI);
            description = string(abi.encodePacked(
                "This is a Legal Contract Token for the Wrapped Song ",
                _addressToString(wrappedSongAddress),
                "."
            ));
        }

        // Optimize registry module access
        IRegistryModule registryModule = IRegistryModule(protocolModule.getRegistryModule());
        
        // Get registry codes and authenticity status
        string memory isrcCode = registryModule.identityModule().getIsrcCode(wrappedSongAddress);
        string memory upcCode = registryModule.identityModule().getUpcCode(wrappedSongAddress);
        string memory iswcCode = registryModule.identityModule().getIswcCode(wrappedSongAddress);
        string memory isccCode = registryModule.identityModule().getIsccCode(wrappedSongAddress);
        bool isAuthentic = registryModule.identityModule().isAuthentic(wrappedSongAddress);

        string memory registryCodes = _composeRegistryCodes(isrcCode, upcCode, iswcCode, isccCode);
        string memory authenticity = _composeAuthenticity(isAuthentic);

        string memory json = Base64.encode(
            bytes(string(abi.encodePacked(
                '{"name": "', tokenType, ' ', metadata.name, '",',
                '"description": "', description, '",',
                '"image": "', finalImageData, '",',
                '"external_url": "', _buildExternalUrlURI(metadata.externalUrl, baseURI), '",',
                '"animation_url": "', _buildAnimationURI(metadata.animationUrl, baseURI), '",',
                '"attributes": "', _buildAttributesURI(metadata.attributesIpfsHash, baseURI), '",',
                registryCodes, ',',
                authenticity,
                '}'
            )))
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * @dev Builds image URI with automatic storage detection
     * @param imageHash The image hash/URL
     * @param baseURI Fallback base URI
     * @return Complete image URI
     */
    function _buildImageURI(string memory imageHash, string memory baseURI) internal view returns (string memory) {
        return StorageDetect.buildURIWithFallback(imageHash, baseURI, ipfsBaseURI, arweaveBaseURI);
    }

    /**
     * @dev Builds external URL URI with automatic storage detection
     * @param externalUrl The external URL hash
     * @param baseURI Fallback base URI
     * @return Complete external URL URI
     */
    function _buildExternalUrlURI(string memory externalUrl, string memory baseURI) internal view returns (string memory) {
        return StorageDetect.buildURIWithFallback(externalUrl, baseURI, ipfsBaseURI, arweaveBaseURI);
    }

    /**
     * @dev Builds animation URI with automatic storage detection
     * @param animationUrl The animation URL hash
     * @param baseURI Fallback base URI
     * @return Complete animation URI
     */
    function _buildAnimationURI(string memory animationUrl, string memory baseURI) internal view returns (string memory) {
        return StorageDetect.buildURIWithFallback(animationUrl, baseURI, ipfsBaseURI, arweaveBaseURI);
    }

    /**
     * @dev Builds attributes URI with automatic storage detection
     * @param attributesHash The attributes hash
     * @param baseURI Fallback base URI
     * @return Complete attributes URI
     */
    function _buildAttributesURI(string memory attributesHash, string memory baseURI) internal view returns (string memory) {
        return StorageDetect.buildURIWithFallback(attributesHash, baseURI, ipfsBaseURI, arweaveBaseURI);
    }

    /**
     * @dev Converts address to string representation
     * @param _addr The address to convert
     * @return String representation of the address
     */
    function _addressToString(address _addr) internal pure returns (string memory) {
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

    /**
     * @dev Composes registry codes JSON
     * @param isrcCode ISRC code
     * @param upcCode UPC code
     * @param iswcCode ISWC code
     * @param isccCode ISCC code
     * @return JSON string with registry codes
     */
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

    /**
     * @dev Composes authenticity JSON
     * @param isAuthentic Whether the song is authentic
     * @return JSON string with authenticity status
     */
    function _composeAuthenticity(bool isAuthentic) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '"authenticity": {',
            '"isAuthentic": ', isAuthentic ? 'true' : 'false',
            '}'
        ));
    }
} 