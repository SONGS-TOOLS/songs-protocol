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
import './../Interfaces/ILegalContractMetadata.sol';
import './../Interfaces/IMetadataRenderer.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';


contract ProtocolModule is Ownable, Pausable {
    using SafeERC20 for IERC20;
    
    uint256 public wrappedSongCreationFee;
    uint256 public releaseFee;
    
    mapping(address => address[]) public ownerWrappedSongs;
    mapping(address => address) public smartAccountToWSToken;

    IWrappedSongFactory public wrappedSongFactory;
    IDistributorWalletFactory public distributorWalletFactory;
    IWhitelistingManager public whitelistingManager;
    IERC20Whitelist public erc20whitelist;
    IMetadataModule public metadataModule;
    ILegalContractMetadata public legalContractMetadata;

    mapping(address => string) public isrcRegistry;
    mapping(address => string) public upcRegistry;
    mapping(address => string) public iswcRegistry;
    mapping(address => string) public isccRegistry;

    mapping(address => address) public wrappedSongToDistributor;
    mapping(address => address) public pendingDistributorRequests;

    mapping(address => bool) public wrappedSongAuthenticity;

    // Authorized contracts
    mapping(address => bool) public authorizedContracts;

    // Add this struct and mapping
    struct ReviewPeriod {
        uint256 startTime;
        uint256 endTime;
        address distributor;
    }
    mapping(address => ReviewPeriod) public reviewPeriods;
        // Add mapping to track WSTokenManagement contracts
    mapping(address => bool) private protocolWSTokens;

    // Add new state variable
    IMetadataRenderer public metadataRenderer;

    uint256 private _startSaleFee;

    // Add new state variables
    uint256 public withdrawalFeePercentage; // Base 10000 (e.g., 250 = 2.5%)
    uint256 public constant MAX_WITHDRAWAL_FEE = 1000; // 10% maximum fee
    
    // Add accumulated fees tracking
    mapping(address => uint256) public accumulatedFees; // token => amount

    modifier onlyOwnerOrAuthorized() {
        require(msg.sender == owner() || msg.sender == address(erc20whitelist), "Not authorized");
        _;
    }

    uint256 public reviewPeriodDays = 7; // Default to 7 days, can be changed by owner

    event Paused(bool isPaused); // Add event for pausing

    // Metadata Update Events
    event MetadataUpdated(address indexed wrappedSong, uint256 indexed tokenId, string newMetadata);
    event MetadataUpdateRequested(address indexed wrappedSong, uint256 indexed tokenId, string newMetadata);
    // Release Events
    event WrappedSongReleased(address indexed wrappedSong, address indexed distributor);
    event WrappedSongReleaseRequested(address indexed wrappedSong, address indexed distributor, address indexed creator);
    event WrappedSongReleaseRejected(address indexed wrappedSong, address indexed distributor);
    event DistributorAcceptedReview(address indexed wrappedSong, address indexed distributor);
    event ReviewPeriodExpired(address indexed wrappedSong, address indexed distributor);
    event WrappedSongAuthenticitySet(address indexed wrappedSong, bool isAuthentic);

    // Change from constant to regular state variable
    uint256 public maxSaleDuration = 30 days;

    // Add new state variable
    string public baseURI;

    // Add new state variable
    bool public releasesEnabled = true;

    // Add event for tracking changes
    event ReleasesEnabledChanged(bool enabled);

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _distributorWalletFactory The address of the DistributorWalletFactory contract.
     * @param _whitelistingManager The address of the WhitelistingManager contract.
     * @param _erc20whitelist The address of the ERC20Whitelist contract.
     * @param _metadataModule The address of the MetadataModule contract.
     * @param _legalContractMetadata The address of the LegalContractMetadata contract.
     */
    constructor  (
        address _distributorWalletFactory,
        address _whitelistingManager,
        address _erc20whitelist,
        address _metadataModule,
        address _legalContractMetadata
    ) Ownable(msg.sender) {
        distributorWalletFactory = IDistributorWalletFactory(_distributorWalletFactory);
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
    function removeTokenFromWhitelist(address token) external onlyOwnerOrAuthorized {
        return erc20whitelist.removeTokenFromWhitelist(token);
    }


    /**************************************************************************
     * Release Actions
     *************************************************************************/

    /**
     * @dev Requests the release of a wrapped song with metadata update.
     * @param wrappedSong The address of the wrapped song.
     * @param distributor The address of the distributor.
     * @param newMetadata The new metadata for the wrapped song.
     */
    function requestWrappedSongReleaseWithMetadata(
        address wrappedSong,
        address distributor,
        IMetadataModule.Metadata memory newMetadata
    ) external payable {
        require(releasesEnabled, "Releases are currently disabled");
        require(msg.value >= releaseFee, "Insufficient release fee");

        // Validate basic requirements
        _validateReleaseRequest(wrappedSong, distributor);

        // Update metadata first
        metadataModule.updateMetadata(wrappedSong, newMetadata);

        // Process the release request
        _processReleaseRequest(wrappedSong, distributor);
    }

    /**
     * @dev Requests the release of a wrapped song without metadata update.
     * @param wrappedSong The address of the wrapped song.
     * @param distributor The address of the distributor.
     */
    function requestWrappedSongRelease(
        address wrappedSong,
        address distributor
    ) external payable {
        require(releasesEnabled, "Releases are currently disabled");
        require(msg.value >= releaseFee, "Insufficient release fee");

        // Validate basic requirements
        _validateReleaseRequest(wrappedSong, distributor);

        // Process the release request
        _processReleaseRequest(wrappedSong, distributor);
    }

    /**
     * @dev Internal function to validate release request requirements.
     */
    function _validateReleaseRequest(address wrappedSong, address distributor) internal view {
        require(msg.sender == Ownable(wrappedSong).owner(), "Only wrapped song owner can request release");
        require(distributor != address(0), "Invalid distributor wallet address");
        require(distributor.code.length > 0, "Distributor wallet must be a contract");
        require(distributorWalletFactory.checkIsDistributorWallet(distributor), "Invalid distributor wallet: not registered in factory");
        require(wrappedSongToDistributor[wrappedSong] == address(0), "Wrapped song already released");
    }

    /**
     * @dev Internal function to process the release request.
     */
    function _processReleaseRequest(address wrappedSong, address distributor) internal {
        pendingDistributorRequests[wrappedSong] = distributor;
        emit WrappedSongReleaseRequested(wrappedSong, distributor, msg.sender);
    }

    /**
     * @dev Removes the release request of a wrapped song by the owner.
     * @param wrappedSong The address of the wrapped song.
     */
    function removeWrappedSongReleaseRequest(address wrappedSong) external {
        require(msg.sender == Ownable(wrappedSong).owner(), "Only wrapped song owner can remove release request");
        require(pendingDistributorRequests[wrappedSong] != address(0), "No pending release request");
        require(distributorWalletFactory.checkIsDistributorWallet(pendingDistributorRequests[wrappedSong]), "Distributor does not exist"); // Check if distributor exists
        delete pendingDistributorRequests[wrappedSong];
    }

    /**
     * @dev Confirms the release of a wrapped song by the pending distributor.
     * @param wrappedSong The address of the wrapped song.
     */
    function acceptWrappedSongForReview(address wrappedSong) external {
        require(pendingDistributorRequests[wrappedSong] == msg.sender, "Only pending distributor can accept for review");
        require(distributorWalletFactory.checkIsDistributorWallet(msg.sender), "Distributor does not exist");
        
        delete pendingDistributorRequests[wrappedSong];
        
        reviewPeriods[wrappedSong] = ReviewPeriod({
            startTime: block.timestamp,
            endTime: block.timestamp + (reviewPeriodDays * 1 days),
            distributor: msg.sender
        });
        
        emit DistributorAcceptedReview(wrappedSong, msg.sender);
    }

    function confirmWrappedSongRelease(address wrappedSong) external {
        address pendingDistributor = pendingDistributorRequests[wrappedSong];
        require(pendingDistributor == msg.sender, "Not the pending distributor");
        require(distributorWalletFactory.checkIsDistributorWallet(msg.sender), "Distributor does not exist");

        wrappedSongToDistributor[wrappedSong] = msg.sender;
        delete pendingDistributorRequests[wrappedSong];
        delete reviewPeriods[wrappedSong]; // Clear any existing review period

        emit WrappedSongReleased(wrappedSong, msg.sender);
    }

    function rejectWrappedSongRelease(address wrappedSong) external {
        address pendingDistributor = pendingDistributorRequests[wrappedSong];
        require(pendingDistributor == msg.sender, "Not the pending distributor");
        require(distributorWalletFactory.checkIsDistributorWallet(msg.sender), "Distributor does not exist");

        delete pendingDistributorRequests[wrappedSong];
        delete reviewPeriods[wrappedSong]; // Clear any existing review period

        emit WrappedSongReleaseRejected(wrappedSong, msg.sender);
    }

    function handleExpiredReviewPeriod(address wrappedSong) external {
        ReviewPeriod memory review = reviewPeriods[wrappedSong];
        require(block.timestamp > review.endTime, "Review period has not expired");
        
        delete reviewPeriods[wrappedSong];
        emit ReviewPeriodExpired(wrappedSong, review.distributor);
    }

    /**
     * @dev Checks if a wrapped song is released.
     * @param wrappedSong The address of the wrapped song.
     * @return True if the wrapped song is released, false otherwise.
     */
    function isReleased(address wrappedSong) external view returns (bool) {
        return wrappedSongToDistributor[wrappedSong] != address(0);
    }


    /**
     * @dev Sets the review period days. Only the owner can set the review period days.
     * @param _days The number of days for the review period.
     */
    function setReviewPeriodDays(uint256 _days) external onlyOwner {
        reviewPeriodDays = _days;
    }


    /**************************************************************************
     * Getters
     *************************************************************************/

    /**
     * @dev Returns the distributor address for a given wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return The address of the distributor.
     */
    function getWrappedSongDistributor(address wrappedSong) external view returns (address) {
        return wrappedSongToDistributor[wrappedSong];
    }

    /**
     * @dev Returns the pending distributor address for a given wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return The address of the pending distributor.
     */
    function getPendingDistributorRequests(address wrappedSong) external view returns (address) {
        return pendingDistributorRequests[wrappedSong];
    }

    /**************************************************************************
     * Fees
     *************************************************************************/

    
    /**
     * @dev Sets the fee for creating a wrapped song. Only the owner can set the fee.
     * @param _fee The new fee for creating a wrapped song.
     */

    function setWrappedSongCreationFee(uint256 _fee) external onlyOwner {
        wrappedSongCreationFee = _fee;
    }

    /**
     * @dev Sets the fee for releasing a wrapped song. Only the owner can set the fee.
     * @param _fee The new fee for releasing a wrapped song.
     */
    function setReleaseFee(uint256 _fee) external onlyOwner {
        releaseFee = _fee;
    }


    /**************************************************************************
     * Modifiers
     *************************************************************************/

    /**
     * @dev Updates the address of the DistributorWalletFactory contract. Only the owner can update the address.
     * @param _newFactory The address of the new DistributorWalletFactory contract.
     */
    function setDistributorWalletFactory(address _newFactory) external onlyOwner {
        distributorWalletFactory = IDistributorWalletFactory(_newFactory);
    }

    /**
     * @dev Sets the address of the WhitelistingManager contract. Only the owner can set the address.
     * @param _whitelistingManager The address of the new WhitelistingManager contract.
     */
    function setWhitelistingManager(address _whitelistingManager) external onlyOwner {
        whitelistingManager = IWhitelistingManager(_whitelistingManager);
    }

    /**
     * @dev Sets the address of the ERC20Whitelist contract. Only the owner can set the address.
     * @param _erc20whitelist The address of the new ERC20Whitelist contract.
     */
    function setERC20Whitelist(address _erc20whitelist) external onlyOwner {
        erc20whitelist = IERC20Whitelist(_erc20whitelist);
    }

        /**
     * @dev Sets the address of the MetadataModule contract. Only the owner can set the address.
     * @param _metadataModule The address of the new MetadataModule contract.
     */
    function setMetadataModule(address _metadataModule) external onlyOwner {
        require(_metadataModule != address(0), "Invalid address");
        metadataModule = IMetadataModule(_metadataModule);
    }

    /**
     * @dev Sets the authorization status of a contract.
     * @param _contractAddress The address of the contract to set the authorization status.
     * @param _isAuthorized The authorization status to be set.
     */
    function setAuthorizedContract(address _contractAddress, bool _isAuthorized) external onlyOwner {
        authorizedContracts[_contractAddress] = _isAuthorized;
    }


    /**
     * @dev Sets the address of the WrappedSongFactory contract. Only the owner can set the address.
     * @param _wrappedSongFactory The address of the new WrappedSongFactory contract.
     */
    function setWrappedSongFactory(address _wrappedSongFactory) external onlyOwner {
        require(_wrappedSongFactory != address(0), "Invalid factory address");
        wrappedSongFactory = IWrappedSongFactory(_wrappedSongFactory);
    }

    function setSmartAccountToWSToken(address smartAccount, address wsToken) external whenNotPaused {
        require(msg.sender == address(wrappedSongFactory), "Only factory can set token mapping");
        smartAccountToWSToken[smartAccount] = wsToken;
    }

    /**
     * @dev Updates the maximum duration allowed for sales.
     * @param _duration The new maximum duration in seconds
     */
    function setMaxSaleDuration(uint256 _duration) external onlyOwner {
        require(_duration > 0, "Duration must be greater than 0");
        maxSaleDuration = _duration;
    }

    function setWSTokenFromProtocol(address wsTokenManagement) external {
        require(msg.sender == address(wrappedSongFactory), "Only factory can add wrapped song");
        protocolWSTokens[wsTokenManagement] = true;
    }

    /**
     * @dev Sets the base URI for metadata resources
     * @param _baseURI The new base URI to be used
     */
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    // Update setter function
    function setLegalContractMetadata(address _legalContractMetadata) external onlyOwner {
        require(_legalContractMetadata != address(0), "Invalid address");
        legalContractMetadata = ILegalContractMetadata(_legalContractMetadata);
    }


    // Add new function to set the renderer
    function setMetadataRenderer(address _renderer) external onlyOwner {
        require(_renderer != address(0), "Invalid renderer address");
        metadataRenderer = IMetadataRenderer(_renderer);
    }


    function setOwnerWrappedSong(address owner, address wrappedSong) external whenNotPaused {
        require(msg.sender == address(wrappedSongFactory), "Only factory can add wrapped song");
        ownerWrappedSongs[owner].push(wrappedSong);
    }

    /**************************************************************************
     * Identity Registry
     *************************************************************************/

    /**
     * @dev Adds an ISRC to the registry for a given wrapped song. Only callable by the distributor.
     * @param wrappedSong The address of the wrapped song.
     * @param isrc The ISRC to be added.
     */
    function addISRC(address wrappedSong, string memory isrc) external whenNotPaused {
        require(wrappedSongToDistributor[wrappedSong] == msg.sender, "Only distributor can set ISRC");
        isrcRegistry[wrappedSong] = isrc;
    }

    /**
     * @dev Adds a UPC to the registry for a given wrapped song. Only callable by the distributor.
     * @param wrappedSong The address of the wrapped song.
     * @param upc The UPC to be added.
     */
    function addUPC(address wrappedSong, string memory upc) external whenNotPaused {
        require(wrappedSongToDistributor[wrappedSong] == msg.sender, "Only distributor can set UPC");
        upcRegistry[wrappedSong] = upc;
    }

    /**
     * @dev Adds an ISWC to the registry for a given wrapped song. Only callable by the distributor.
     * @param wrappedSong The address of the wrapped song.
     * @param iswc The ISWC to be added.
     */
    function addISWC(address wrappedSong, string memory iswc) external whenNotPaused {
        require(wrappedSongToDistributor[wrappedSong] == msg.sender, "Only distributor can set ISWC");
        iswcRegistry[wrappedSong] = iswc;
    }

    /**
     * @dev Adds an ISCC to the registry for a given wrapped song. Only callable by the distributor.
     * @param wrappedSong The address of the wrapped song.
     * @param iscc The ISCC to be added.
     */
    function addISCC(address wrappedSong, string memory iscc) external whenNotPaused {
        require(wrappedSongToDistributor[wrappedSong] == msg.sender, "Only distributor can set ISCC");
        isccRegistry[wrappedSong] = iscc;
    }

    /**************************************************************************
     * Authenticity
     *************************************************************************/


    /**
     * @dev Sets the authenticity status of a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param _isAuthentic The authenticity status to be set.
     */
    function setWrappedSongAuthenticity(address wrappedSong, bool _isAuthentic) external whenNotPaused {
        require(wrappedSongToDistributor[wrappedSong] == msg.sender, "Only distributor can set authenticity status");
        wrappedSongAuthenticity[wrappedSong] = _isAuthentic;
        emit WrappedSongAuthenticitySet(wrappedSong, _isAuthentic);
    }

    /**
     * @dev Checks the authenticity status of a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return True if the wrapped song is authentic, false otherwise.
     */
    function isAuthentic(address wrappedSong) external view returns (bool) {
        return wrappedSongAuthenticity[wrappedSong];
    }

    /**************************************************************************
     * Data & getters
     *************************************************************************/

    /**
     * @dev Checks if the creator is valid to create a wrapped song based on the NFT requirement.
     * @param creator The address of the creator.
     * @return True if the creator is valid to create a wrapped song, false otherwise.
     */
    function isValidToCreateWrappedSong(address creator) external view returns (bool) {
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
    function isAuthorizedContract(address _contractAddress) external view returns (bool) {
        return authorizedContracts[_contractAddress];
    }

    /**
     * @dev Returns the address of the WrappedSongFactory contract.
     * @return The address of the WrappedSongFactory contract.
     */
    function wrappedSongFactoryAddress() external view returns (address) {
        return address(wrappedSongFactory);
    }


    function getOwnerWrappedSongs(address owner) external view returns (address[] memory) {
        return ownerWrappedSongs[owner];
    }

    function isWSTokenFromProtocol(address wsTokenManagement) external view returns (bool) {
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


    /**************************************************************************
     * Wrapped Song Owner
     *************************************************************************/


    // Add function to render token URI
    function renderTokenURI(
        IMetadataModule.Metadata memory metadata,
        uint256 tokenId,
        address wrappedSong
    ) external view returns (string memory) {
        require(msg.sender == address(metadataModule), "Only metadata module can render");
        
        return metadataRenderer.composeTokenURI(
            metadata, 
            tokenId, 
            wrappedSong, 
            baseURI,
            IProtocolModule(address(this))
        );
    }

    event StartSaleFeeUpdated(uint256 newFee);

    function setStartSaleFee(uint256 newFee) external onlyOwner {
        _startSaleFee = newFee;
        emit StartSaleFeeUpdated(newFee);
    }

    function getStartSaleFee() external view returns (uint256) {
        return _startSaleFee;
    }

    function setWithdrawalFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= MAX_WITHDRAWAL_FEE, "Fee too high");
        withdrawalFeePercentage = _feePercentage;
    }
    
    function getWithdrawalFeePercentage() external view returns (uint256) {
        return withdrawalFeePercentage;
    }
    
    function withdrawAccumulatedFees(address token, address recipient) external onlyOwner {
        uint256 amount = accumulatedFees[token];
        require(amount > 0, "No fees to withdraw");
        
        accumulatedFees[token] = 0;
        
        if (token == address(0)) {
            (bool success, ) = payable(recipient).call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(recipient, amount);
        }
        
        emit FeesWithdrawn(token, recipient, amount);
    }
    
    // Add event
    event FeesWithdrawn(address indexed token, address indexed recipient, uint256 amount);
    
    // Make sure to add receive() function if not present
    receive() external payable {}

    // Add new function to control releases
    function setReleasesEnabled(bool _enabled) external onlyOwner {
        releasesEnabled = _enabled;
        emit ReleasesEnabledChanged(_enabled);
    }
}
