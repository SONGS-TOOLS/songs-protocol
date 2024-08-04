// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import './WrappedSongSmartAccountUpgradeable.sol';
import './WSTokensManagementUpgradeable.sol';
import './../Interfaces/IProtocolModule.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// import 'hardhat/console.sol';

contract WrappedSongFactoryUpgradeable {
  IProtocolModule public protocolModule;
  address public immutable wrappedSongSmartAccountImplementation;
  address public immutable wsTokensBaseImplementation;
  mapping(address => address[]) public ownerWrappedSongs;

  event WrappedSongCreated(
    address indexed owner,
    address indexed wrappedSongSmartAccount,
    address indexed wsTokensBase
  );

  /**
   * @dev Constructor to initialize the protocol module and wrapped song implementation addresses.
   * @param _protocolModule The address of the protocol module contract.
   * @param _wrappedSongSmartAccountImplementation The address of the WrappedSongSmartAccount implementation contract.
   * @param _wsTokensBaseImplementation The address of the WSTokenManagement implementation contract.
   */
  constructor(
    address _protocolModule,
    address _wrappedSongSmartAccountImplementation,
    address _wsTokensBaseImplementation
  ) {
    protocolModule = IProtocolModule(_protocolModule);
    wrappedSongSmartAccountImplementation = _wrappedSongSmartAccountImplementation;
    wsTokensBaseImplementation = _wsTokensBaseImplementation;
  }

  /**
   * @dev Creates a new wrapped song.
   * @param _stablecoin The address of the stablecoin contract.
   */
  function createWrappedSong(address _stablecoin) public payable {
    // console.log("Creating Wrapped Song for stablecoin:", _stablecoin);
    // console.log("Caller address:", msg.sender);

    //TODO: Pay fee in stablecoins
    // require(msg.value >= protocolModule.wrappedSongCreationFee(), "Insufficient creation fee");
    // require(protocolModule.whitelistingManager().isValidToCreateWrappedSong(msg.sender), "Not valid to create Wrapped Song");

    // Create WSTokenManagement instance
    bytes memory initializeData1 = abi.encodeWithSelector(
      WSTokensManagementUpgradeable(address(0)).initialize.selector,
      address(this),
      msg.sender
    );

    // console.log("Initializing WSTokenManagement with data:", initializeData1);

    ERC1967Proxy newWSTokenManagementProxy = new ERC1967Proxy(
      wsTokensBaseImplementation,
      initializeData1
    );

    address newWSTokenManagement = address(newWSTokenManagementProxy);
    // console.log("WSTokenManagement deployed at:", newWSTokenManagement);

    // Create WrappedSongSmartAccount instance
    bytes memory initializeData2 = abi.encodeWithSelector(
      WrappedSongSmartAccountUpgradeable(address(0)).initialize.selector,
      _stablecoin,
      msg.sender,
      address(protocolModule),
      newWSTokenManagement
    );

    // console.log("Initializing WrappedSongSmartAccount with data:", initializeData2);

    ERC1967Proxy newWrappedSongSmartAccountProxy = new ERC1967Proxy(
      wrappedSongSmartAccountImplementation,
      initializeData2
    );

    address newWrappedSongSmartAccount = address(
      newWrappedSongSmartAccountProxy
    );
    // console.log("WrappedSongSmartAccount deployed at:", newWrappedSongSmartAccount);

    ownerWrappedSongs[msg.sender].push(newWrappedSongSmartAccount);

    emit WrappedSongCreated(
      msg.sender,
      newWrappedSongSmartAccount,
      newWSTokenManagement
    );
  }

  /**
   * @dev Creates a new wrapped song with metadata.
   * @param _stablecoin The address of the stablecoin contract.
   * @param songURI The URI of the song metadata.
   * @param sharesAmount The amount of shares to be created.
   */
  function createWrappedSongWithMetadata(
    address _stablecoin,
    string memory songURI,
    uint256 sharesAmount
  ) public payable {
    createWrappedSong(_stablecoin);

    address newWrappedSongSmartAccount = ownerWrappedSongs[msg.sender][
      ownerWrappedSongs[msg.sender].length - 1
    ];
    WrappedSongSmartAccountUpgradeable wrappedSong = WrappedSongSmartAccountUpgradeable(
        newWrappedSongSmartAccount
      );
    wrappedSong.createsWrappedSongTokens(songURI, sharesAmount);
  }

  /**
   * @dev Returns the list of wrapped songs owned by the specified owner.
   * @param _owner The address of the owner.
   * @return An array of addresses of the wrapped songs owned by the owner.
   */
  function getOwnerWrappedSongs(
    address _owner
  ) public view returns (address[] memory) {
    return ownerWrappedSongs[_owner];
  }
}
