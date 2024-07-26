// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./WrappedSongFactory.sol";
import "./DistributorWalletFactory.sol";

contract ProtocolModule is Ownable {
    uint256 public wrappedSongCreationFee;
    uint256 public releaseFee;
    WrappedSongFactory public wrappedSongFactory;
    DistributorWalletFactory public distributorWalletFactory;
    WhitelistingManager public whitelistingManager;

    mapping(string => bool) public isrcRegistry;
    mapping(string => bool) public upcRegistry;
    mapping(string => bool) public iswcRegistry;
    mapping(string => bool) public isccRegistry;

    mapping(address => address) public wrappedSongToDistributor;
    mapping(address => address) public pendingDistributorRequests;

    event WrappedSongReleaseRequested(address indexed wrappedSong, address indexed distributor);
    event WrappedSongReleased(address indexed wrappedSong, address indexed distributor);

    /**
     * @dev Requests the release of a wrapped song by a distributor.
     * @param wrappedSong The address of the wrapped song.
     * @param distributor The address of the distributor.
     */
    function requestWrappedSongRelease(address wrappedSong, address distributor) external {
        require(msg.sender == distributorWalletFactory.getDistributorWallet(distributor), "Only distributor wallet can request release");
        require(wrappedSongToDistributor[wrappedSong] == address(0), "Wrapped song already released");
        pendingDistributorRequests[wrappedSong] = distributor;
        emit WrappedSongReleaseRequested(wrappedSong, distributor);
    }

    /**
     * @dev Confirms the release of a wrapped song by the pending distributor.
     * @param wrappedSong The address of the wrapped song.
     */
    function confirmWrappedSongRelease(address wrappedSong) external {
        address distributor = pendingDistributorRequests[wrappedSong];
        require(msg.sender == distributorWalletFactory.getDistributorWallet(distributor), "Only pending distributor can confirm release");
        wrappedSongToDistributor[wrappedSong] = distributor;
        delete pendingDistributorRequests[wrappedSong];
        emit WrappedSongReleased(wrappedSong, distributor);
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
    function getPendingDistributor(address wrappedSong) external view returns (address) {
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
     * @dev Updates the address of the WrappedSongFactory contract. Only the owner can update the address.
     * @param _newFactory The address of the new WrappedSongFactory contract.
     */
    function updateWrappedSongFactory(address _newFactory) external onlyOwner {
        wrappedSongFactory = WrappedSongFactory(_newFactory);
    }

    /**
     * @dev Updates the address of the DistributorWalletFactory contract. Only the owner can update the address.
     * @param _newFactory The address of the new DistributorWalletFactory contract.
     */
    function updateDistributorWalletFactory(address _newFactory) external onlyOwner {
        distributorWalletFactory = DistributorWalletFactory(_newFactory);
    }

    /**
     * @dev Sets the address of the WhitelistingManager contract. Only the owner can set the address.
     * @param _whitelistingManager The address of the new WhitelistingManager contract.
     */
    function setWhitelistingManager(address _whitelistingManager) external onlyOwner {
        whitelistingManager = WhitelistingManager(_whitelistingManager);
    }

    // Functions for managing global registries (ISRC, UPC, ISWC, ISCC)...

    /**
     * @dev Adds an ISRC to the registry.
     * @param isrc The ISRC to be added.
     */
    function addISRC(string memory isrc) external onlyOwner {
        isrcRegistry[isrc] = true;
    }

    /**
     * @dev Adds a UPC to the registry.
     * @param upc The UPC to be added.
     */
    function addUPC(string memory upc) external onlyOwner {
        upcRegistry[upc] = true;
    }

    /**
     * @dev Adds an ISWC to the registry.
     * @param iswc The ISWC to be added.
     */
    function addISWC(string memory iswc) external onlyOwner {
        iswcRegistry[iswc] = true;
    }

    /**
     * @dev Adds an ISCC to the registry.
     * @param iscc The ISCC to be added.
     */
    function addISCC(string memory iscc) external onlyOwner {
        isccRegistry[iscc] = true;
    }

    // Future features for dispute resolution and arbitration...
}