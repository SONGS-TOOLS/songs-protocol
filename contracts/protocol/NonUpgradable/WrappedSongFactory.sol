// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IWSTokenManagement.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract WrappedSongFactory {
    using Clones for address;

    IProtocolModule public immutable protocolModule;
    IMetadataModule public immutable metadataModule;
    
    address public immutable wrappedSongTemplate;
    address public immutable wsTokenTemplate;

    event WrappedSongCreated(
        address indexed owner,
        address indexed wrappedSongSmartAccount,
        address stablecoin,
        address wsTokenManagement,
        uint256 sharesAmount,
        IMetadataModule.Metadata metadata
    );

    constructor(
        address _protocolModule,
        address _wrappedSongTemplate,
        address _wsTokenTemplate
    ) {
        require(_protocolModule != address(0), "Invalid protocol module");
        require(_wrappedSongTemplate != address(0), "Invalid wrapped song template");
        require(_wsTokenTemplate != address(0), "Invalid WSToken template");
        
        protocolModule = IProtocolModule(_protocolModule);
        metadataModule = IMetadataModule(protocolModule.getMetadataModule());
        wrappedSongTemplate = _wrappedSongTemplate;
        wsTokenTemplate = _wsTokenTemplate;
    }

    function createWrappedSong(
        address _stablecoin,
        IMetadataModule.Metadata memory songMetadata,
        uint256 sharesAmount
    ) public payable returns (address) {
        require(!protocolModule.paused(), "Protocol is paused");
        require(isValidMetadata(songMetadata), "Invalid metadata");
        require(sharesAmount > 0, "Shares amount must be greater than zero");
        require(msg.value >= protocolModule.wrappedSongCreationFee(), "Insufficient creation fee");
        require(protocolModule.isValidToCreateWrappedSong(msg.sender), "Not valid to create Wrapped Song");
        require(protocolModule.isTokenWhitelisted(_stablecoin), "Stablecoin is not whitelisted");

        // Clone WrappedSongSmartAccount
        address newWrappedSongSmartAccount = wrappedSongTemplate.clone();
        
        // Initialize WrappedSongSmartAccount
        IWrappedSongSmartAccount(newWrappedSongSmartAccount).initialize(
            _stablecoin,
            tx.origin,
            address(protocolModule)
        );

        // Clone WSTokenManagement
        address wsTokenManagementAddress = wsTokenTemplate.clone();
        
        // Initialize WSTokenManagement
        IWSTokenManagement(wsTokenManagementAddress).initialize(
            newWrappedSongSmartAccount,
            msg.sender,
            address(protocolModule)
        );

        // Set protocol relationships first
        protocolModule.setWSTokenFromProtocol(wsTokenManagementAddress);
        
        protocolModule.setSmartAccountToWSToken(
            newWrappedSongSmartAccount,
            wsTokenManagementAddress
        );
        
        protocolModule.setOwnerWrappedSong(
            msg.sender,
            newWrappedSongSmartAccount
        );

        // Then set WSTokenManagement in WrappedSongSmartAccount
        IWrappedSongSmartAccount(newWrappedSongSmartAccount).setWSTokenManagement(wsTokenManagementAddress);
        // Finally create initial shares
        IWrappedSongSmartAccount(newWrappedSongSmartAccount).createSongShares(sharesAmount);

        // Create metadata
        IMetadataModule.Metadata memory createdMetadata = metadataModule.createMetadata(
            newWrappedSongSmartAccount,
            songMetadata
        );


        emit WrappedSongCreated(
            msg.sender,
            newWrappedSongSmartAccount,
            _stablecoin,
            wsTokenManagementAddress,
            sharesAmount,
            createdMetadata
        );

        return newWrappedSongSmartAccount;
    }

    function isValidMetadata(
        IMetadataModule.Metadata memory metadata
    ) internal pure returns (bool) {
        return (
            bytes(metadata.name).length > 0 &&
            bytes(metadata.image).length > 0 &&
            bytes(metadata.animationUrl).length > 0 &&
            bytes(metadata.attributesIpfsHash).length > 0
        );
    }
}
