// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./../Interfaces/IWrappedSongFactory.sol";
import "./../Interfaces/IDistributorWalletFactory.sol";
import "./../Interfaces/IWhitelistingManager.sol"; // Ensure the path is correct
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IERC20Whitelist.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/ILegalContractMetadata.sol";
import "./../Interfaces/IMetadataRenderer.sol";
import "./../Interfaces/IRegistryModule.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


// +..................................................................................................+
// -                                                                                                  -
// =                                                                                                  =
// =                                                                                                  =
// =                                                                                                  =
// =                                                                                                  =
// =                                                                                                  =
// =                      .::..                                                                       =
// =                   :-:....:--.                                                                    =
// =                  =:         --       :::      :::     ..   .     .::.     .::.                   =
// =                 =.           =:     *#-+-   =#=-=#-   *%=  #-   +*--+=   -%===                   =
// =                 *-.        .:==     :==+-   %-   +#   *+=*:#-  :@. -=*:  .====                   =
// =                 =::-======--.=:     ==-*#   =#=-=#-   #+ :*@-   +*-=*#.  :+-=%:                  =
// =                  =.         --       :-:     .:-:     ..   :.    .:-:     .-:.                   =
// =                   :-:....:--.                                                                    =
// =                     ..:::.                                                                       =
// =                                                                                                  =
// =                                                                                                  =
// =                                                                                                  =
// =                                                                                                  =
// =                                                                                                  =
// -                                                                                                  -
// +..................................................................................................+


contract ProtocolModule is Ownable, Pausable, ReentrancyGuard {
  using SafeERC20 for IERC20;

  mapping(address => address[]) public ownerWrappedSongs;
  mapping(address => address) public smartAccountToWSToken;
  address public stablecoinFeeReceiver;
  
  IWrappedSongFactory public wrappedSongFactory;
  IDistributorWalletFactory public distributorWalletFactory;
  IWhitelistingManager public whitelistingManager;
  IERC20Whitelist public erc20whitelist;
  IMetadataModule public metadataModule;
  ILegalContractMetadata public legalContractMetadata;
  IRegistryModule public registryModule;

  mapping(address => bool) public authorizedContracts;
  mapping(address => bool) private protocolWSTokens;

  // Add new state variable
  IMetadataRenderer public metadataRenderer;

  modifier onlyOwnerOrAuthorized() {
    require(
      msg.sender == owner() || msg.sender == address(erc20whitelist),
      "Not authorized"
    );
    _;
  }

  event Paused(bool isPaused); // Add event for pausing

  // Metadata Update Events
  event MetadataUpdated(
    address indexed wrappedSong,
    uint256 indexed tokenId,
    string newMetadata
  );
  event MetadataUpdateRequested(
    address indexed wrappedSong,
    uint256 indexed tokenId,
    string newMetadata
  );
  event WrappedSongAuthenticitySet(
    address indexed wrappedSong,
    bool isAuthentic
  );

  event DistributorCreationFeeUpdated(uint256 newFee);
  event UpdateMetadataFeeUpdated(uint256 newFee);
  event PayInStablecoinUpdated(bool newPayInStablecoin);

  // Change from constant to regular state variable
  uint256 public maxSaleDuration = 30 days;

  // Add new state variable
  string public baseURI;

  // Add event for tracking changes
  event ReleasesEnabledChanged(bool enabled);

  // Add new events
  event StableFeesUpdated(uint256 newCreationFee, uint256 newReleaseFee);

  // Add these events near the top with other events
  event WrappedSongCreationFeeUpdated(uint256 newFee);
  event ReleaseFeeUpdated(uint256 newFee);
  event DistributorWalletFactoryUpdated(address newFactory);
  event WhitelistingManagerUpdated(address newManager);
  event ERC20WhitelistUpdated(address newWhitelist);
  event MetadataModuleUpdated(address newModule);
  event ReviewPeriodDaysUpdated(uint256 newDays);
  event LegalContractMetadataUpdated(address newContract);
  event MetadataRendererUpdated(address newRenderer);
  event MaxSaleDurationUpdated(uint256 newDuration);
  event WithdrawalFeePercentageUpdated(uint256 newPercentage);
  event IdentityRegistryUpdated(
    address indexed wrappedSong,
    string registryType,
    string value
  );
  event SmartAccountToWSTokenMapped(
    address indexed smartAccount,
    address indexed wsToken
  );
  event OwnerWrappedSongAdded(
    address indexed owner,
    address indexed wrappedSong
  );


  /**
   * @dev Initializes the contract with the given parameters.
   * @param _distributorWalletFactory The address of the DistributorWalletFactory contract.
   * @param _whitelistingManager The address of the WhitelistingManager contract.
   * @param _erc20whitelist The address of the ERC20Whitelist contract.
   * @param _metadataModule The address of the MetadataModule contract.
   * @param _legalContractMetadata The address of the LegalContractMetadata contract.
   */
  constructor(
    address _distributorWalletFactory,
    address _whitelistingManager,
    address _erc20whitelist,
    address _metadataModule,
    address _legalContractMetadata
  ) Ownable(msg.sender) {
    distributorWalletFactory = IDistributorWalletFactory(
      _distributorWalletFactory
    );
    whitelistingManager = IWhitelistingManager(_whitelistingManager);
    erc20whitelist = IERC20Whitelist(_erc20whitelist);
    metadataModule = IMetadataModule(_metadataModule);
    legalContractMetadata = ILegalContractMetadata(_legalContractMetadata);
  }


  /**************************************************************************
   * Pause
   *************************************************************************/

  // Add a function to toggle the paused state
  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }

  /**************************************************************************
   * Whitelisting
   *************************************************************************/

  /**
   * @dev whitelists a token.
   * @param token The address of the token to whitelist.
   */
  function whitelistToken(address token) external onlyOwnerOrAuthorized {
    return erc20whitelist.whitelistToken(token);
  }

  /**
   * @dev removes a token from the whitelist.
   * @param token The address of the token to remove from the whitelist.
   */
  function removeTokenFromWhitelist(
    address token
  ) external onlyOwnerOrAuthorized {
    return erc20whitelist.removeTokenFromWhitelist(token);
  }


  /**************************************************************************
   * Set protocol modules
   *************************************************************************/

  /**
   * @dev Updates the address of the DistributorWalletFactory contract. Only the owner can update the address.
   * @param _newFactory The address of the new DistributorWalletFactory contract.
   */
  function setDistributorWalletFactory(address _newFactory) external onlyOwner {
    require(_newFactory != address(0), "Invalid address");
    distributorWalletFactory = IDistributorWalletFactory(_newFactory);
    emit DistributorWalletFactoryUpdated(_newFactory);
  }

  /**
   * @dev Sets the address of the WhitelistingManager contract. Only the owner can set the address.
   * @param _whitelistingManager The address of the new WhitelistingManager contract.
   */
  function setWhitelistingManager(
    address _whitelistingManager
  ) external onlyOwner {
    require(_whitelistingManager != address(0), "Invalid address");
    whitelistingManager = IWhitelistingManager(_whitelistingManager);
    emit WhitelistingManagerUpdated(_whitelistingManager);
  }

  /**
   * @dev Sets the address of the ERC20Whitelist contract. Only the owner can set the address.
   * @param _erc20whitelist The address of the new ERC20Whitelist contract.
   */
  function setERC20Whitelist(address _erc20whitelist) external onlyOwner {
    require(_erc20whitelist != address(0), "Invalid address");
    erc20whitelist = IERC20Whitelist(_erc20whitelist);
    emit ERC20WhitelistUpdated(_erc20whitelist);
  }

  /**
   * @dev Sets the address of the MetadataModule contract. Only the owner can set the address.
   * @param _metadataModule The address of the new MetadataModule contract.
   */
  function setMetadataModule(address _metadataModule) external onlyOwner {
    require(_metadataModule != address(0), "Invalid address");
    metadataModule = IMetadataModule(_metadataModule);
    emit MetadataModuleUpdated(_metadataModule);
  }

  /**
   * @dev Sets the authorization status of a contract.
   * @param _contractAddress The address of the contract to set the authorization status.
   * @param _isAuthorized The authorization status to be set.
   */
  function setAuthorizedContract(
    address _contractAddress,
    bool _isAuthorized
  ) external onlyOwner {
    authorizedContracts[_contractAddress] = _isAuthorized;
  }

  /**
   * @dev Sets the address of the WrappedSongFactory contract. Only the owner can set the address.
   * @param _wrappedSongFactory The address of the new WrappedSongFactory contract.
   */
  function setWrappedSongFactory(
    address _wrappedSongFactory
  ) external onlyOwner {
    require(_wrappedSongFactory != address(0), "Invalid factory address");
    wrappedSongFactory = IWrappedSongFactory(_wrappedSongFactory);
  }

  // Update setter function
  function setLegalContractMetadata(
    address _legalContractMetadata
  ) external onlyOwner {
    require(_legalContractMetadata != address(0), "Invalid address");
    legalContractMetadata = ILegalContractMetadata(_legalContractMetadata);
    emit LegalContractMetadataUpdated(_legalContractMetadata);
  }

  // Add new function to set the renderer
  function setMetadataRenderer(address _renderer) external onlyOwner {
    require(_renderer != address(0), "Invalid renderer address");
    metadataRenderer = IMetadataRenderer(_renderer);
    emit MetadataRendererUpdated(_renderer);
  }


  function setRegistryModule(address _registryModule) external onlyOwner {
    require(_registryModule != address(0), "Invalid registryModule address");
    registryModule = IRegistryModule(_registryModule);
  }

  /**************************************************************************
   * Set protocol relations
   *************************************************************************/


  function setSmartAccountToWSToken(
    address smartAccount,
    address wsToken
  ) external whenNotPaused {
    require(
      msg.sender == address(wrappedSongFactory),
      "Only factory can set token mapping"
    );
    smartAccountToWSToken[smartAccount] = wsToken;
    emit SmartAccountToWSTokenMapped(smartAccount, wsToken);
  }

  /**
   * @dev Updates the maximum duration allowed for sales.
   * @param _duration The new maximum duration in seconds
   */
  function setMaxSaleDuration(uint256 _duration) external onlyOwner {
    require(_duration > 0, "Duration must be greater than 0");
    maxSaleDuration = _duration;
    emit MaxSaleDurationUpdated(_duration);
  }

  function setWSTokenFromProtocol(address wsTokenManagement) external {
    require(
      msg.sender == address(wrappedSongFactory),
      "Only factory can add wrapped song"
    );
    protocolWSTokens[wsTokenManagement] = true;
  }

  function setOwnerWrappedSong(
    address owner,
    address wrappedSong
  ) external whenNotPaused {
    require(
      msg.sender == address(wrappedSongFactory),
      "Only factory can add wrapped song"
    );
    ownerWrappedSongs[owner].push(wrappedSong);
    emit OwnerWrappedSongAdded(owner, wrappedSong);
  }

  function setStablecoinFeeReceiver(address _stablecoinFeeReceiver) external onlyOwner {
    stablecoinFeeReceiver = _stablecoinFeeReceiver;
  }

  /**************************************************************************
   * Data & getters
   *************************************************************************/

  /**
   * @dev Checks if the creator is valid to create a wrapped song based on the NFT requirement.
   * @param creator The address of the creator.
   * @return True if the creator is valid to create a wrapped song, false otherwise.
   */
  function isValidToCreateWrappedSong(
    address creator
  ) external view returns (bool) {
    return whitelistingManager.isValidToCreateWrappedSong(creator);
  }

  /**
   * @dev Checks if a token is whitelisted.
   * @param token The address of the token to check.
   * @return True if the token is whitelisted, false otherwise.
   */
  function isTokenWhitelisted(address token) external view returns (bool) {
    return erc20whitelist.isTokenWhitelisted(token);
  }

  /**
   * @dev Checks if a contract is authorized.
   * @param _contractAddress The address of the contract to check.
   * @return True if the contract is authorized, false otherwise.
   */
  function isAuthorizedContract(
    address _contractAddress
  ) external view returns (bool) {
    return authorizedContracts[_contractAddress];
  }

  /**
   * @dev Returns the address of the WrappedSongFactory contract.
   * @return The address of the WrappedSongFactory contract.
   */
  function wrappedSongFactoryAddress() external view returns (address) {
    return address(wrappedSongFactory);
  }

  function getOwnerWrappedSongs(
    address owner
  ) external view returns (address[] memory) {
    return ownerWrappedSongs[owner];
  }

  function isWSTokenFromProtocol(
    address wsTokenManagement
  ) external view returns (bool) {
    return protocolWSTokens[wsTokenManagement];
  }

  /**
   * @dev Gets the current base URI
   * @return The current base URI
   */
  function getBaseURI() external view returns (string memory) {
    return baseURI;
  }

  // Update getter function
  function getLegalContractMetadata() external view returns (address) {
    return address(legalContractMetadata);
  }

  /**
   * @dev Gets the address of the MetadataModule contract
   * @return The address of the MetadataModule contract
   */
  function getMetadataModule() external view returns (address) {
    return address(metadataModule);
  }

  /**
   * @dev Gets the address of the MetadataModule contract
   * @return The address of the MetadataModule contract
   */
  function getRegistryModule() external view returns (address) {
    return address(registryModule);
  }

  function getStablecoinFeeReceiver() external view returns (address) {
    return address(stablecoinFeeReceiver);
  }

  /**************************************************************************
   * Wrapped Song Owner
   *************************************************************************/

  // Add function to render token URI
  function renderTokenURI(
    IMetadataModule.Metadata memory metadata,
    uint256 tokenId,
    address wrappedSong
  ) external view returns (string memory) {
    require(
      msg.sender == address(metadataModule),
      "Only metadata module can render"
    );

    return
      metadataRenderer.composeTokenURI(
        metadata,
        tokenId,
        wrappedSong,
        baseURI,
        IProtocolModule(address(this))
      );
  }

    /**
   * @dev Sets the base URI for metadata resources
   * @param _baseURI The new base URI to be used
   */
  function setBaseURI(string memory _baseURI) external onlyOwner {
    baseURI = _baseURI;
  }
  

  /**************************************************************************
   * Globals
   *************************************************************************/

  receive() external payable {}
}
