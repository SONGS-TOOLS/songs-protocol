// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./../Interfaces/IDistributorWalletFactory.sol";
import "./../Interfaces/IWhitelistingManager.sol"; // Ensure the path is correct
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IERC20Whitelist.sol";
import "./../Interfaces/IMetadataModule.sol";


contract ProtocolModule is Ownable {
    uint256 public wrappedSongCreationFee;
    uint256 public releaseFee;
    IDistributorWalletFactory public distributorWalletFactory;
    IWhitelistingManager public whitelistingManager;
    IERC20Whitelist public erc20whitelist;
    IMetadataModule public metadataModule;

    bool public paused; // Add paused state variable

    mapping(address => string) public isrcRegistry;
    mapping(address => string) public upcRegistry;
    mapping(address => string) public iswcRegistry;
    mapping(address => string) public isccRegistry;

    mapping(address => address) public wrappedSongToDistributor;
    mapping(address => address) public pendingDistributorRequests;

    mapping(address => bool) public wrappedSongAuthenticity;

    // Add this struct and mapping
    struct ReviewPeriod {
        uint256 startTime;
        uint256 endTime;
        address distributor;
    }
    mapping(address => ReviewPeriod) public reviewPeriods;

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

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _distributorWalletFactory The address of the DistributorWalletFactory contract.
     * @param _whitelistingManager The address of the WhitelistingManager contract.
     * @param _erc20whitelist The address of the ERC20Whitelist contract.
     */
    constructor  (
        address _distributorWalletFactory,
        address _whitelistingManager,
        address _erc20whitelist
    ) Ownable(msg.sender) {
        distributorWalletFactory = IDistributorWalletFactory(_distributorWalletFactory);
        whitelistingManager = IWhitelistingManager(_whitelistingManager);
        erc20whitelist = IERC20Whitelist(_erc20whitelist);
        paused = false; // Initialize paused state
    }

    // Add a modifier to check if the protocol is paused
    modifier whenNotPaused() {
        require(!paused, "Protocol is paused");
        _;
    }

    // Add a function to toggle the paused state
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit Paused(_paused);
    }

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

    /**
     * @dev Requests the release of a wrapped song by the owner.
     * @param wrappedSong The address of the wrapped song.
     * @param distributor The address of the distributor.
     */
    function requestWrappedSongRelease(address wrappedSong, address distributor) external {
        // require(msg.sender == Ownable(wrappedSong).owner(), "Only wrapped song owner can request release");
        require(wrappedSongToDistributor[wrappedSong] == address(0), "Wrapped song already released");
        require(distributorWalletFactory.checkIsDistributorWallet(distributor), "Distributor does not exist"); // Check if distributor exists
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

    /**
     * @dev Updates the address of the DistributorWalletFactory contract. Only the owner can update the address.
     * @param _newFactory The address of the new DistributorWalletFactory contract.
     */
    function updateDistributorWalletFactory(address _newFactory) external onlyOwner {
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
     * @dev Adds an ISRC to the registry for a given wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param isrc The ISRC to be added.
     */
    function addISRC(address wrappedSong, string memory isrc) external onlyOwner {
        isrcRegistry[wrappedSong] = isrc;
    }

    /**
     * @dev Adds a UPC to the registry for a given wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param upc The UPC to be added.
     */
    function addUPC(address wrappedSong, string memory upc) external onlyOwner {
        upcRegistry[wrappedSong] = upc;
    }

    /**
     * @dev Adds an ISWC to the registry for a given wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param iswc The ISWC to be added.
     */
    function addISWC(address wrappedSong, string memory iswc) external onlyOwner {
        iswcRegistry[wrappedSong] = iswc;
    }

    /**
     * @dev Adds an ISCC to the registry for a given wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param iscc The ISCC to be added.
     */
    function addISCC(address wrappedSong, string memory iscc) external onlyOwner {
        isccRegistry[wrappedSong] = iscc;
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
     * @dev Sets the authenticity status of a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param _isAuthentic The authenticity status to be set.
     */
    function setWrappedSongAuthenticity(address wrappedSong, bool _isAuthentic) external {
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

    function setReviewPeriodDays(uint256 _days) external onlyOwner {
        reviewPeriodDays = _days;
    }

    function setMetadataModule(address _metadataModule) external onlyOwner {
        metadataModule = IMetadataModule(_metadataModule);
    }
}
