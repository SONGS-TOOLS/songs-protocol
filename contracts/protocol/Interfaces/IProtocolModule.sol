// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IMetadataModule.sol";
import "./ILegalContractMetadata.sol";
import "./IMetadataRenderer.sol";

interface IProtocolModule {
    /**************************************************************************
     * View functions
     *************************************************************************/
    function distributorWalletFactory() external view returns (address);
    function whitelistingManager() external view returns (address);
    function paused() external view returns (bool);
    function metadataModule() external view returns (IMetadataModule);
    function legalContractMetadata() external view returns (ILegalContractMetadata);
    function owner() external view returns (address);
    function metadataRenderer() external view returns (IMetadataRenderer);
    function wrappedSongFactoryAddress() external view returns (address);
    function getOwnerWrappedSongs(address owner) external view returns (address[] memory);
    function smartAccountToWSToken(address smartAccount) external view returns (address);
    function maxSaleDuration() external view returns (uint256);
    function isWSTokenFromProtocol(address wsTokenManagement) external view returns (bool);
    function getStablecoinFeeReceiver() external view returns (address);
    function getLegalContractMetadata() external view returns (address);
    function getMetadataModule() external view returns (address);
    function getRegistryModule() external view returns (address);
    function isValidToCreateWrappedSong(address creator) external view returns (bool);
    function isTokenWhitelisted(address token) external view returns (bool);
    function isAuthorizedContract(address contractAddress) external view returns (bool);

    /**************************************************************************
     * Getters
     *************************************************************************/
    function getExternalUrlBase() external view returns (string memory);
    function getBaseURI() external view returns (string memory);

    /**************************************************************************
     * Pause
     *************************************************************************/
    function pause() external;
    function unpause() external;

    /**************************************************************************
     * Whitelisting
     *************************************************************************/
    function whitelistToken(address token) external;
    function removeTokenFromWhitelist(address token) external;

    /**************************************************************************
     * Set protocol modules
     *************************************************************************/
    function setDistributorWalletFactory(address _newFactory) external;
    function setWhitelistingManager(address _whitelistingManager) external;
    function setMetadataModule(address _metadataModule) external;
    function setLegalContractMetadata(address _legalContractMetadata) external;
    function setMetadataRenderer(address _renderer) external;
    function setRegistryModule(address _registryModule) external;
    function setERC20Whitelist(address _erc20whitelist) external;
    function setAuthorizedContract(address contractAddress, bool isAuthorized) external;

    /**************************************************************************
     * Set protocol relations
     *************************************************************************/
    function setSmartAccountToWSToken(address smartAccount, address wsToken) external;
    function setMaxSaleDuration(uint256 _duration) external;
    function setWSTokenFromProtocol(address wsTokenManagement) external;
    function setOwnerWrappedSong(address owner, address wrappedSong) external;
    function setStablecoinFeeReceiver(address newReceiver) external;

    /**************************************************************************
     * Wrapped Song Owner
     *************************************************************************/
    function renderTokenURI(
        IMetadataModule.Metadata memory metadata,
        uint256 tokenId,
        address wrappedSong
    ) external view returns (string memory);

    function renderContractURI(
        IMetadataModule.Metadata memory metadata,
        address wrappedSong
    ) external view returns (string memory);

    /**************************************************************************
     * Globals
     *************************************************************************/
    function setBaseURI(string memory _baseURI) external;
    function setExternalUrlBase(string memory _externalUrlBase) external;
}
