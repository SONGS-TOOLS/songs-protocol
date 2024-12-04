// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IMetadataModule.sol";
import "./ILegalContractMetadata.sol";
import "./IMetadataRenderer.sol";

interface IProtocolModule {
    // View functions
    function distributorWalletFactory() external view returns (address);
    function whitelistingManager() external view returns (address);
    function paused() external view returns (bool);
    function metadataModule() external view returns (IMetadataModule);
    function legalContractMetadata() external view returns (ILegalContractMetadata);
    function owner() external view returns (address);
    function metadataRenderer() external view returns (IMetadataRenderer);

    // State-changing functions
    function pause() external;
    function unpause() external;

    // Contract setters
    function setDistributorWalletFactory(address _newFactory) external;
    function setWhitelistingManager(address _whitelistingManager) external;
    function setMetadataModule(address _metadataModule) external;
    function setLegalContractMetadata(address _legalContractMetadata) external;
    function setMetadataRenderer(address _renderer) external;

    // Whitelist management
    function whitelistToken(address token) external;
    function removeTokenFromWhitelist(address token) external;

    // Authorization management
    function setAuthorizedContract(address contractAddress, bool isAuthorized) external;

    // Factory and token management
    function wrappedSongFactoryAddress() external view returns (address);
    function setWrappedSongFactory(address _wrappedSongFactory) external;
    function setOwnerWrappedSong(address owner, address wrappedSong) external;
    function setSmartAccountToWSToken(address smartAccount, address wsToken) external;
    function getOwnerWrappedSongs(address owner) external view returns (address[] memory);
    function smartAccountToWSToken(address smartAccount) external view returns (address);

    // Sale duration management
    function maxSaleDuration() external view returns (uint256);
    function setMaxSaleDuration(uint256 _duration) external;

    // Protocol token management
    function isWSTokenFromProtocol(address wsTokenManagement) external view returns (bool);
    function setWSTokenFromProtocol(address wsTokenManagement) external;

    // URI management
    function getBaseURI() external view returns (string memory);
    function setBaseURI(string memory _baseURI) external;

    // Metadata management
    function getLegalContractMetadata() external view returns (address);
    function getMetadataModule() external view returns (address);
    function renderTokenURI(
        IMetadataModule.Metadata memory metadata,
        uint256 tokenId,
        address wrappedSong
    ) external view returns (string memory);

    function getRegistryModule() external view returns (address);
    function setRegistryModule(address _registryModule) external;

    // Additional functions
    function isValidToCreateWrappedSong(address creator) external view returns (bool);
    function isTokenWhitelisted(address token) external view returns (bool);
    function isAuthorizedContract(address contractAddress) external view returns (bool);
}
