// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./../protocol/Interfaces/IProtocolModule.sol";
import "./../protocol/Interfaces/IMetadataModule.sol";
import "./../protocol/Interfaces/IWrappedSongSmartAccount.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract MockWrappedSongFactoryV2 {
    using Clones for address;

    IProtocolModule public immutable protocolModule;
    address public immutable wrappedSongTemplateV2;

    event WrappedSongMigrated(
        address indexed oldWrappedSong,
        address indexed newWrappedSong,
        address indexed owner
    );

    constructor(
        address _protocolModule,
        address _wrappedSongTemplateV2
    ) {
        require(_protocolModule != address(0), "Invalid protocol module");
        require(_wrappedSongTemplateV2 != address(0), "Invalid wrapped song template");
        
        protocolModule = IProtocolModule(_protocolModule);
        wrappedSongTemplateV2 = _wrappedSongTemplateV2;
    }

    function migrateOldWrappedSong(
        address oldWrappedSong
    ) external returns (address) {
        require(!protocolModule.paused(), "Protocol is paused");
        require(oldWrappedSong != address(0), "Invalid old wrapped song address");
        
        // Check that caller is the owner of the old wrapped song
        require(
            IWrappedSongSmartAccount(oldWrappedSong).owner() == msg.sender,
            "Only owner can initiate migration"
        );

        // Clone new WrappedSongSmartAccount V2
        address newWrappedSong = wrappedSongTemplateV2.clone();

        // Initialize new wrapped song
        IWrappedSongSmartAccount(newWrappedSong).initialize(
            address(IWrappedSongSmartAccount(oldWrappedSong).stablecoin()),
            msg.sender,
            address(protocolModule)
        );

        // Trigger migration in old wrapped song
        IWrappedSongSmartAccount(oldWrappedSong).migrateWrappedSong(
            address(0), // New metadata address would be set in V2
            newWrappedSong
        );

        emit WrappedSongMigrated(
            oldWrappedSong,
            newWrappedSong,
            msg.sender
        );

        return newWrappedSong;
    }
} 