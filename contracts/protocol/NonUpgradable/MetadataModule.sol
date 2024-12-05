// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IWSTokenManagement.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/IDistributorWallet.sol";
import "./../Interfaces/IRegistryModule.sol";
contract MetadataModule is Ownable, IMetadataModule, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IProtocolModule public protocolModule;
    IReleaseModule releaseModule;
    IFeesModule feesModule;
    IERC20Whitelist erc20whitelist;
    bool private isProtocolSet;

    mapping(address => Metadata) private wrappedSongMetadata;
    mapping(address => Metadata) private pendingMetadataUpdates;
    mapping(address => bool) private metadataUpdateConfirmed;
    mapping(address => uint256) private accumulatedFees;

    event MetadataCreated(address indexed wrappedSong, Metadata newMetadata);
    event MetadataUpdateRequested(address indexed wrappedSong, Metadata newMetadata);
    event MetadataUpdated(address indexed wrappedSong, Metadata newMetadata);
    event MetadataUpdateRejected(address indexed wrappedSong);
    event MetadataRemoved(address indexed wrappedSong);
    event FeesWithdrawn(address indexed token, address indexed recipient, uint256 amount);
    event UpdateFeeCollected(address indexed wrappedSong, address indexed token, uint256 amount);

    /**
     * @dev Initializes the contract.
     */
    constructor(address _initialOwner) Ownable(_initialOwner) {
    }

    /**
     * @dev Sets the protocol module address. Can only be called once by the owner.
     * @param _protocolModule The address of the ProtocolModule contract.
     */
    function setProtocolModule(address _protocolModule) external onlyOwner {
        require(_protocolModule != address(0), "Invalid protocol module address");
        protocolModule = IProtocolModule(_protocolModule);
        isProtocolSet = true;
    }

    /**
     * @dev Validates the metadata object to ensure all required fields are present and non-empty.
     * @param metadata The metadata object to validate.
     * @return bool Returns true if the metadata is valid, false otherwise.
     */
    function isValidMetadata(Metadata memory metadata) internal pure returns (bool) {
        return (
            bytes(metadata.name).length > 0 &&
            bytes(metadata.image).length > 0 &&
            bytes(metadata.animationUrl).length > 0 &&
            bytes(metadata.attributesIpfsHash).length > 0
        );
    }
    /**
     * @dev Creates initial metadata for a wrapped song token management contract.
     * @param wrappedSong The address of the WrappedSongSmartAccount contract.
     * @param newMetadata The new metadata to be set.
     * @return The new metadata.
     */
    function createMetadata(address wrappedSong, Metadata memory newMetadata) external returns (Metadata memory) {
        address wsToken = protocolModule.smartAccountToWSToken(wrappedSong);
        require(wsToken != address(0), "Address not a protocol WS");
        require(bytes(wrappedSongMetadata[wrappedSong].name).length == 0, "Metadata already exists");
        require(isValidMetadata(newMetadata), "Invalid metadata");
        
        wrappedSongMetadata[wrappedSong] = newMetadata;
        emit MetadataCreated(wrappedSong, newMetadata);
        
        return newMetadata;
    }
    /**
     * @dev Requests an update to the metadata of a released wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param newMetadata The new metadata to be set.
     */
    function requestUpdateMetadata(address wrappedSong, Metadata memory newMetadata) external {
        releaseModule = IRegistryModule(protocolModule.getRegistryModule()).releaseModule();

        require(isValidMetadata(newMetadata), "Invalid metadata: All required fields must be non-empty");
        require(IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender, "Only wrapped song owner can request update");
        require(releaseModule.isReleased(wrappedSong), "Song not released, update metadata directly");

        _handleUpdateFee();
        
        pendingMetadataUpdates[wrappedSong] = newMetadata;
        metadataUpdateConfirmed[wrappedSong] = false;
        emit MetadataUpdateRequested(wrappedSong, newMetadata);
    }

    /**
     * @dev Updates the metadata of an unreleased wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @param newMetadata The new metadata to be set.
     */
    function updateMetadata(address wrappedSong, Metadata memory newMetadata) external payable {
        releaseModule = IRegistryModule(protocolModule.getRegistryModule()).releaseModule();
        
        require(
            IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender || 
            msg.sender == address(releaseModule), 
            "Only wrapped song or its owner can update"
        );
        

        require(!releaseModule.isReleased(wrappedSong), "Cannot update metadata directly after release");
        require(isValidMetadata(newMetadata), "Invalid metadata: All required fields must be non-empty");
        
        wrappedSongMetadata[wrappedSong] = newMetadata;
        emit MetadataUpdated(wrappedSong, newMetadata);
    }

    /**
     * @dev Confirms a pending metadata update for a released wrapped song.
     * @param wrappedSong The address of the wrapped song.
     */
    function confirmUpdateMetadata(address wrappedSong) external payable {
        releaseModule = IRegistryModule(protocolModule.getRegistryModule()).releaseModule();
        address distributor = releaseModule.getWrappedSongDistributor(wrappedSong);
        require(msg.sender == IDistributorWallet(distributor).owner(), "Only distributor can confirm update");
        require(!metadataUpdateConfirmed[wrappedSong], "No pending metadata update");

        // Do we need this here?
        // _handleUpdateFee();

        wrappedSongMetadata[wrappedSong] = pendingMetadataUpdates[wrappedSong];
        
        delete pendingMetadataUpdates[wrappedSong];
        metadataUpdateConfirmed[wrappedSong] = true;

        emit MetadataUpdated(wrappedSong, wrappedSongMetadata[wrappedSong]);
    }

    /**
     * @dev Rejects a pending metadata update for a released wrapped song.
     * @param wrappedSong The address of the wrapped song.
     */
    function rejectUpdateMetadata(address wrappedSong) external {
        releaseModule = IRegistryModule(protocolModule.getRegistryModule()).releaseModule();
        address distributor = releaseModule.getWrappedSongDistributor(wrappedSong);
        require(msg.sender == IDistributorWallet(distributor).owner(), "Only distributor can reject update");
        
        delete pendingMetadataUpdates[wrappedSong];
        delete metadataUpdateConfirmed[wrappedSong];
        emit MetadataUpdateRejected(wrappedSong);
    }
    
    /**
     * @dev Retrieves the token URI for a given wrapped song and token ID.
     * @param wrappedSong The address of the wrapped song.
     * @param tokenId The ID of the token.
     * @return The token URI as a string.
     */
    function getTokenURI(address wrappedSong, uint256 tokenId) external view override returns (string memory) {
        Metadata memory metadata = wrappedSongMetadata[wrappedSong];
        require(tokenId < 3, "Invalid token ID for metadata module"); // Only handle tokens 0-2
        
        return protocolModule.renderTokenURI(metadata, tokenId, wrappedSong);
    }

    /**
     * @dev Retrieves the pending metadata update for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return The pending metadata update.
     */
    function getPendingMetadataUpdate(address wrappedSong) external view override returns (Metadata memory) {
        return pendingMetadataUpdates[wrappedSong];
    }

    /**
     * @dev Checks if a metadata update has been confirmed for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return True if the metadata update is confirmed, false otherwise.
     */
    function isMetadataUpdateConfirmed(address wrappedSong) external view override returns (bool) {
        return metadataUpdateConfirmed[wrappedSong];
    }

    /**
     * @dev Removes metadata for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     */
    function removeMetadata(address wrappedSong) external {
        require(
            wrappedSong == msg.sender, 
            "Only wrapped song can remove metadata"
        );
        require(bytes(wrappedSongMetadata[wrappedSong].name).length > 0, "Metadata does not exist");

        delete wrappedSongMetadata[wrappedSong];
        delete pendingMetadataUpdates[wrappedSong];
        delete metadataUpdateConfirmed[wrappedSong];

        emit MetadataRemoved(wrappedSong);
    }

    function _handleUpdateFee() internal {
        feesModule = IRegistryModule(protocolModule.getRegistryModule()).feesModule();
        uint256 updateFee = feesModule.getUpdateMetadataFee();
        bool payInStablecoin = feesModule.isPayInStablecoin();
        erc20whitelist = IRegistryModule(protocolModule.getRegistryModule()).erc20whitelist();
        
        if (updateFee > 0) {
            if (payInStablecoin) {
                // Get the current stablecoin from protocol
                uint256 currentStablecoinIndex = feesModule.getCurrentStablecoinIndex();
                address stablecoin = erc20whitelist.getWhitelistedTokenAtIndex(currentStablecoinIndex);
                require(stablecoin != address(0), "No whitelisted stablecoin available");

                // Transfer stablecoin fee from user to this contract
                IERC20(stablecoin).safeTransferFrom(msg.sender, address(this), updateFee);
                
                // Add to accumulated fees
                accumulatedFees[stablecoin] += updateFee;
                
                emit UpdateFeeCollected(msg.sender, stablecoin, updateFee);
            } else {
                // Check if correct ETH amount was sent
                require(msg.value >= updateFee, "Incorrect ETH fee amount");
                
                // Add to accumulated fees for ETH (address(0))
                accumulatedFees[address(0)] += msg.value;

                // Refund excess ETH if any
                if (msg.value > updateFee) {
                    (bool refundSuccess, ) = msg.sender.call{value: msg.value - updateFee}("");
                    require(refundSuccess, "ETH refund failed");
                }
                
                emit UpdateFeeCollected(msg.sender, address(0), msg.value);
            }
        } else {
            require(msg.value == 0, "Fee not required");
        }
    }

    function withdrawAccumulatedFees(address token, address recipient) external onlyOwner nonReentrant {
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

    /**
     * @dev Gets the metadata for a wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return The metadata for the wrapped song.
     */
    function getWrappedSongMetadata(address wrappedSong) external view returns (Metadata memory) {
        return wrappedSongMetadata[wrappedSong];
    }

    receive() external payable {}
}
