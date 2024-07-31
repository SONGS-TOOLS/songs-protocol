// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./WrappedSongSmartAccount.sol";
import "./ProtocolModule.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract WrappedSongFactory {
    ProtocolModule public protocolModule;
    address public immutable wrappedSongImplementation;
    mapping(address => address[]) public ownerWrappedSongs;

    event WrappedSongCreated(address indexed owner, address indexed wrappedSong);

    /**
     * @dev Constructor to initialize the protocol module and wrapped song implementation addresses.
     * @param _protocolModule The address of the protocol module contract.
     * @param _wrappedSongImplementation The address of the wrapped song implementation contract.
     */
    constructor(address _protocolModule, address _wrappedSongImplementation) {
        protocolModule = ProtocolModule(_protocolModule);
        wrappedSongImplementation = _wrappedSongImplementation;
    }

    /**
     * @dev Creates a new wrapped song.
     * @param _songTokensManagementAddress The address of the song management contract.
     * @param _stablecoin The address of the stablecoin contract.
     */
    function createWrappedSong(address _songTokensManagementAddress, address _stablecoin) public payable {
        //TODO: Pay fee in stablecoins
        // require(msg.value >= protocolModule.wrappedSongCreationFee(), "Insufficient creation fee");
        // require(protocolModule.whitelistingManager().isValidToCreateWrappedSong(msg.sender), "Not valid to create Wrapped Song");
        
        WrappedSongSmartAccount newWrappedSong = new WrappedSongSmartAccount();
        address newWrappedSongAddress = address(newWrappedSong);

        // Call the initialize function directly
        newWrappedSong.initialize(
            _songTokensManagementAddress,
            _stablecoin,
            msg.sender,
            address(protocolModule)
        );

        ownerWrappedSongs[msg.sender].push(newWrappedSongAddress);

        emit WrappedSongCreated(msg.sender, newWrappedSongAddress);
    }

    /**
     * @dev Creates a new wrapped song.
     * @param _songTokensManagementAddress The address of the song management contract.
     * @param _stablecoin The address of the stablecoin contract.
     */
    function createUpgradableWrappedSong(address _songTokensManagementAddress, address _stablecoin) external payable {
        // require(msg.value >= protocolModule.wrappedSongCreationFee(), "Insufficient creation fee");
        // require(protocolModule.whitelistingManager().isValidToCreateWrappedSong(msg.sender), "Not valid to create Wrapped Song");
        
        bytes memory initializeData = abi.encodeWithSelector(
            WrappedSongSmartAccount(address(0)).initialize.selector,
            _songTokensManagementAddress,
            _stablecoin,
            msg.sender,
            address(protocolModule)
        );

        ERC1967Proxy newWrappedSongProxy = new ERC1967Proxy(
            wrappedSongImplementation,
            initializeData
        );

        address newWrappedSong = address(newWrappedSongProxy);
        ownerWrappedSongs[msg.sender].push(newWrappedSong);
        
        emit WrappedSongCreated(msg.sender, newWrappedSong);
    }

    /**
     * @dev Creates a new wrapped song with metadata.
     * @param _songTokensManagementAddress The address of the song management contract.
     * @param _stablecoin The address of the stablecoin contract.
     * @param songURI The URI of the song.
     * @param sharesAmount The amount of shares to be created.
     */
    function createWrappedSongWithMetadata(
        address _songTokensManagementAddress,
        address _stablecoin,
        string memory songURI,
        uint256 sharesAmount
    ) external {
        // require(msg.value >= protocolModule.wrappedSongCreationFee(), "Insufficient creation fee");
        // require(protocolModule.whitelistingManager().isValidToCreateWrappedSong(msg.sender), "Not valid to create Wrapped Song");
        
        console.log("Passed require statements");

        WrappedSongSmartAccount newWrappedSong = new WrappedSongSmartAccount();
        address newWrappedSongAddress = address(newWrappedSong);
        
        console.log("New WrappedSongSmartAccount address: %s", Strings.toHexString(uint160(newWrappedSongAddress), 20));

        // Call the initialize function directly
        newWrappedSong.initialize(
            _songTokensManagementAddress,
            _stablecoin,
            msg.sender,
            address(protocolModule)
        );
        
        // TODO: Optionally add ISRC on registry
        console.log("Initialized WrappedSongSmartAccount");

        ownerWrappedSongs[msg.sender].push(newWrappedSongAddress);

        // Create Wrapped Song Tokens with metadata
        newWrappedSong.createsWrappedSongTokens(songURI, sharesAmount);

        emit WrappedSongCreated(msg.sender, newWrappedSongAddress);
    }

    /**
     * @dev Returns the list of wrapped songs owned by the specified owner.
     * @param _owner The address of the owner.
     * @return An array of addresses of the wrapped songs owned by the owner.
     */
    function getOwnerWrappedSongs(address _owner) public view returns (address[] memory) {
        return ownerWrappedSongs[_owner];
    }
}