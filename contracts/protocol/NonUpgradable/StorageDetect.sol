// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StorageDetect
 * @dev Library for detecting storage hash types and building appropriate URIs
 * @notice Supports IPFS (CID v0 and v1) and Arweave hash detection
 */
library StorageDetect {
    enum Kind {
        Unknown,
        IPFS,
        Arweave
    }

    /**
     * @dev Detects the storage type based on hash characteristics
     * @param hash The hash string to analyze
     * @return The detected storage kind
     */
    function detect(string memory hash) internal pure returns (Kind) {
        bytes memory hashBytes = bytes(hash);
        uint256 length = hashBytes.length;

        // IPFS CID v0: 46 characters, starts with "Qm"
        if (length == 46 && hashBytes[0] == 'Q' && hashBytes[1] == 'm') {
            return Kind.IPFS;
        }

        // IPFS CID v1: 59 characters, starts with "b"
        if (length == 59 && hashBytes[0] == 'b') {
            return Kind.IPFS;
        }

        // Arweave: 43-44 characters, Base64url format (contains - or _)
        if (length >= 43 && length <= 44) {
            for (uint256 i = 0; i < length; i++) {
                if (hashBytes[i] == '-' || hashBytes[i] == '_') {
                    return Kind.Arweave;
                }
            }
        }

        return Kind.Unknown;
    }

    /**
     * @dev Builds URI with protocol-specific prefixes - reverts on unsupported types
     * @param hash The hash to build URI for
     * @param ipfsBaseURI The base URI for IPFS (e.g., "ipfs://")
     * @param arweaveBaseURI The base URI for Arweave (e.g., "https://arweave.net/")
     * @return The complete URI string
     */
    function buildURI(
        string memory hash,
        string memory ipfsBaseURI,
        string memory arweaveBaseURI
    ) internal pure returns (string memory) {
        Kind kind = detect(hash);
        
        if (kind == Kind.IPFS) {
            return string(abi.encodePacked(ipfsBaseURI, hash));
        } else if (kind == Kind.Arweave) {
            return string(abi.encodePacked(arweaveBaseURI, hash));
        } else {
            revert("StorageDetect: Unsupported hash format");
        }
    }

    /**
     * @dev Builds URI with fallback to baseURI concatenation for unknown types
     * @param hash The hash to build URI for
     * @param baseURI The fallback base URI for unknown formats
     * @param ipfsBaseURI The base URI for IPFS (e.g., "ipfs://")
     * @param arweaveBaseURI The base URI for Arweave (e.g., "https://arweave.net/")
     * @return The complete URI string
     */
    function buildURIWithFallback(
        string memory hash,
        string memory baseURI,
        string memory ipfsBaseURI,
        string memory arweaveBaseURI
    ) internal pure returns (string memory) {
        Kind kind = detect(hash);
        
        if (kind == Kind.IPFS) {
            return string(abi.encodePacked(ipfsBaseURI, hash));
        } else if (kind == Kind.Arweave) {
            return string(abi.encodePacked(arweaveBaseURI, hash));
        } else {
            // Fallback to traditional baseURI concatenation for unknown formats
            return string(abi.encodePacked(baseURI, hash));
        }
    }
} 