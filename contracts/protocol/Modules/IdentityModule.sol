pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../Modules/ReleaseModule.sol"; // Import ReleaseModule


contract IdentityModule is Ownable {
    // Identity Registries
    mapping(address => string) public isrcRegistry;
    mapping(address => string) public upcRegistry;
    mapping(address => string) public iswcRegistry;
    mapping(address => string) public isccRegistry;

    // Authenticity
    mapping(address => bool) public wrappedSongAuthenticity;

    // Reference to ReleaseModule
    ReleaseModule public releaseModule;

    // Events
    event IdentityRegistryUpdated(address indexed wrappedSong, string registryType, string value);
    event WrappedSongAuthenticitySet(address indexed wrappedSong, bool isAuthentic);

    constructor() Ownable(msg.sender) {}

    function initialize(ReleaseModule _releaseModule) external onlyOwner {
        require(address(releaseModule) == address(0), "Already initialized");
        releaseModule = _releaseModule;
    }

    // Modifier to check if the caller is the distributor of the wrapped song
    modifier onlyDistributor(address wrappedSong) {
        require(
            releaseModule.getWrappedSongDistributor(wrappedSong) == msg.sender,
            "Only distributor can perform this action"
        );
        _;
    }

    /**
     * @dev Adds an ISRC to the registry for a given wrapped song. Only callable by the distributor.
     * @param wrappedSong The address of the wrapped song.
     * @param isrc The ISRC to be added.
     */
    function addISRC(address wrappedSong, string memory isrc) external onlyDistributor(wrappedSong) {
        require(bytes(isrc).length > 0, "ISRC cannot be empty");
        isrcRegistry[wrappedSong] = isrc;
        emit IdentityRegistryUpdated(wrappedSong, "ISRC", isrc);
    }

    /**
     * @dev Adds a UPC to the registry for a given wrapped song. Only callable by the distributor.
     * @param wrappedSong The address of the wrapped song.
     * @param upc The UPC to be added.
     */
    function addUPC(address wrappedSong, string memory upc) external onlyDistributor(wrappedSong) {
        require(bytes(upc).length > 0, "UPC cannot be empty");
        upcRegistry[wrappedSong] = upc;
        emit IdentityRegistryUpdated(wrappedSong, "UPC", upc);
    }

    /**
     * @dev Adds an ISWC to the registry for a given wrapped song. Only callable by the distributor.
     * @param wrappedSong The address of the wrapped song.
     * @param iswc The ISWC to be added.
     */
    function addISWC(address wrappedSong, string memory iswc) external onlyDistributor(wrappedSong) {
        require(bytes(iswc).length > 0, "ISWC cannot be empty");
        iswcRegistry[wrappedSong] = iswc;
        emit IdentityRegistryUpdated(wrappedSong, "ISWC", iswc);
    }

    /**
     * @dev Adds an ISCC to the registry for a given wrapped song. Only callable by the distributor.
     * @param wrappedSong The address of the wrapped song.
     * @param iscc The ISCC to be added.
     */
    function addISCC(address wrappedSong, string memory iscc) external onlyDistributor(wrappedSong) {
        require(bytes(iscc).length > 0, "ISCC cannot be empty");
        isccRegistry[wrappedSong] = iscc;
        emit IdentityRegistryUpdated(wrappedSong, "ISCC", iscc);
    }

    /**
     * @dev Sets the authenticity status of a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param _isAuthentic The authenticity status to be set.
     */
    function setWrappedSongAuthenticity(address wrappedSong, bool _isAuthentic) external onlyDistributor(wrappedSong) {
        wrappedSongAuthenticity[wrappedSong] = _isAuthentic;
        emit WrappedSongAuthenticitySet(wrappedSong, _isAuthentic);
    }

    // View functions

    /**
     * @dev Checks the authenticity status of a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return True if the wrapped song is authentic, false otherwise.
     */
    function isAuthentic(address wrappedSong) external view returns (bool) {
        return wrappedSongAuthenticity[wrappedSong];
    }

    function getIsrcCode(address wrappedSong) external view returns (string memory) {
        return isrcRegistry[wrappedSong];
    }

    function getUpcCode(address wrappedSong) external view returns (string memory) {
        return upcRegistry[wrappedSong];
    }

    function getIswcCode(address wrappedSong) external view returns (string memory) {
        return iswcRegistry[wrappedSong];
    }

    function getIsccCode(address wrappedSong) external view returns (string memory) {
        return isccRegistry[wrappedSong];
    }

}