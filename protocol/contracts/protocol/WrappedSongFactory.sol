// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./WrappedSongSmartAccount.sol";
import "./ProtocolModule.sol";

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
     * @param _songManagement The address of the song management contract.
     * @param _stablecoin The address of the stablecoin contract.
     */
    function createWrappedSong(address _songManagement, address _stablecoin) external payable {
        require(msg.value >= protocolModule.wrappedSongCreationFee(), "Insufficient creation fee");
        require(protocolModule.whitelistingManager().isValidToCreateWrappedSong(msg.sender), "Not valid to create Wrapped Song");
        
        bytes memory initializeData = abi.encodeWithSelector(
            WrappedSong(address(0)).initialize.selector,
            _songManagement,
            _stablecoin,
            msg.sender
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
     * @dev Returns the list of wrapped songs owned by the specified owner.
     * @param _owner The address of the owner.
     * @return An array of addresses of the wrapped songs owned by the owner.
     */
    function getOwnerWrappedSongs(address _owner) public view returns (address[] memory) {
        return ownerWrappedSongs[_owner];
    }
}