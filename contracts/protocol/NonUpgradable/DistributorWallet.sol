// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './WrappedSongSmartAccount.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IWrappedSongSmartAccount.sol';
import './../Interfaces/IWSTokenManagement.sol';
import './../Interfaces/IMetadataModule.sol';

/**
 * @title DistributorWallet
 * @dev Manages revenue distribution for wrapped songs with support for large-scale distributions
 * @notice Handles revenue distribution and claims for wrapped song token holders
 */
contract DistributorWallet is Ownable {
    // Constants
    uint256 public constant CHUNK_SIZE = 1000;

    // Structs
    struct RevenueEpoch {
        uint256 totalAmount;
        uint256 timestamp;
        uint256 chunksCount;
    }

    // State Variables
    uint256 public currentEpochId;
    IERC20 public immutable stablecoin;
    IProtocolModule public immutable protocolModule;

    // Mappings
    mapping(uint256 => RevenueEpoch) public distributionEpochs;
    mapping(uint256 => mapping(uint256 => uint256[])) public amountChunks;
    mapping(uint256 => mapping(address => mapping(address => bool))) public epochClaims;
    mapping(address => uint256) public wsRedeemIndexList;
    address[] public managedWrappedSongs;

    // Events
    event NewRevenueEpoch(
        address indexed distributor,
        uint256 indexed epochId,
        uint256 totalAmount,
        uint256 timestamp
    );

    event NewDistributionChunk(
        uint256 indexed epochId,
        uint256 indexed chunkIndex,
        uint256 amountsCount
    );

    event EpochRedeemed(
        address indexed wrappedSong,
        address indexed holder,
        uint256 indexed epochId,
        uint256 amount
    );

    event WrappedSongReleased(address indexed wrappedSong);
    event WrappedSongReleaseRejected(address indexed wrappedSong);
    event WrappedSongAcceptedForReview(address indexed wrappedSong);

    /**
     * @dev Constructor
     * @param _stablecoin Address of the stablecoin contract
     * @param _protocolModule Address of the protocol module
     * @param _owner Address of the owner
     */
    constructor(
        address _stablecoin,
        address _protocolModule,
        address _owner
    ) Ownable(_owner) {
        require(_stablecoin != address(0), "Invalid stablecoin");
        require(_protocolModule != address(0), "Invalid protocol module");
        
        stablecoin = IERC20(_stablecoin);
        protocolModule = IProtocolModule(_protocolModule);
    }

    /**
     * @dev Creates a new chunk in an epoch distribution
     * @param epochId The epoch identifier
     * @param chunkIndex The index of this chunk (0-based)
     * @param _amounts Array of amounts for this chunk
     * @param _totalAmount Total amount (only used in first chunk)
     * @param isFirstChunk Whether this is the first chunk
     * @param isLastChunk Whether this is the last chunk
     */
    function createDistributionEpochChunk(
        uint256 epochId,
        uint256 chunkIndex,
        uint256[] calldata _amounts,
        uint256 _totalAmount,
        bool isFirstChunk,
        bool isLastChunk
    ) external onlyOwner {
        require(_amounts.length <= CHUNK_SIZE, "Chunk too large");
        require(epochId == currentEpochId + 1, "Invalid epoch id");
        
        if (isFirstChunk) {
            require(_totalAmount > 0, "Invalid total amount");
            require(
                stablecoin.transferFrom(msg.sender, address(this), _totalAmount),
                "Transfer failed"
            );

            distributionEpochs[epochId] = RevenueEpoch({
                totalAmount: _totalAmount,
                timestamp: block.timestamp,
                chunksCount: 0
            });
        }

        // Store chunk in separate mapping
        amountChunks[epochId][chunkIndex] = _amounts;
        
        if (isLastChunk) {
            distributionEpochs[epochId].chunksCount = chunkIndex + 1;
            currentEpochId = epochId;
            
            emit NewRevenueEpoch(
                address(this),
                epochId,
                _totalAmount,
                block.timestamp
            );
        }

        emit NewDistributionChunk(epochId, chunkIndex, _amounts.length);
    }

    /**
     * @dev Get amount for a specific wrapped song from chunked storage
     * @param epochId The epoch to query
     * @param wsIndex The global index of the wrapped song
     */
    function getAmountForWS(uint256 epochId, uint256 wsIndex) public view returns (uint256) {
        uint256 chunkIndex = wsIndex / CHUNK_SIZE;
        uint256 indexInChunk = wsIndex % CHUNK_SIZE;
        
        require(chunkIndex < distributionEpochs[epochId].chunksCount, "Invalid WS index");
        
        return amountChunks[epochId][chunkIndex][indexInChunk];
    }

    /**
     * @dev Claims earnings for a token holder
     * @param _wrappedSong The wrapped song address
     * @param epochId The epoch to claim from
     */
    function claimEpochEarnings(
        address _wrappedSong,
        uint256 epochId
    ) external {
        require(!epochClaims[epochId][msg.sender][_wrappedSong], "Already claimed");
        require(epochId <= currentEpochId, "Invalid epoch");

        RevenueEpoch storage epoch = distributionEpochs[epochId];
        address wsTokenManagement = IWrappedSongSmartAccount(_wrappedSong).getWSTokenManagementAddress();
        uint256 wsIndex = wsRedeemIndexList[_wrappedSong];

        uint256 balanceAtEpoch = IWSTokenManagement(wsTokenManagement).balanceOfAt(
            msg.sender,
            1,
            epoch.timestamp
        );
        
        uint256 totalShares = IWSTokenManagement(wsTokenManagement).totalShares();
        
        // Get amount from chunked storage
        uint256 wsAmount = getAmountForWS(epochId, wsIndex);
        uint256 amount = (wsAmount * balanceAtEpoch) / totalShares;
        
        epochClaims[epochId][msg.sender][_wrappedSong] = true;

        require(stablecoin.transfer(msg.sender, amount), "Transfer failed");

        emit EpochRedeemed(
            _wrappedSong,
            msg.sender,
            epochId,
            amount
        );
    }

    /**
     * @dev View function to check claimable amount for a specific epoch
     */
    function getClaimableAmount(
        address _wrappedSong,
        address _holder,
        uint256 epochId
    ) external view returns (uint256) {
        if (epochClaims[epochId][_holder][_wrappedSong] || epochId > currentEpochId) {
            return 0;
        }

        address wsTokenManagement = IWrappedSongSmartAccount(_wrappedSong).getWSTokenManagementAddress();
        uint256 wsIndex = wsRedeemIndexList[_wrappedSong];
        uint256 balanceAtEpoch = IWSTokenManagement(wsTokenManagement).balanceOfAt(
            _holder,
            1,
            distributionEpochs[epochId].timestamp
        );
        
        uint256 totalShares = IWSTokenManagement(wsTokenManagement).totalShares();
        uint256 wsAmount = getAmountForWS(epochId, wsIndex);
        
        return (wsAmount * balanceAtEpoch) / totalShares;
    }

    /**
     * @dev Confirms the release of a wrapped song
     * @param wrappedSong The address of the wrapped song
     */
    function confirmWrappedSongRelease(address wrappedSong) external onlyOwner {
        require(
            protocolModule.getPendingDistributorRequests(wrappedSong) == address(this),
            'Not the pending distributor'
        );

        protocolModule.confirmWrappedSongRelease(wrappedSong);
        managedWrappedSongs.push(wrappedSong);

        uint256 newWSIndex = managedWrappedSongs.length - 1;
        wsRedeemIndexList[wrappedSong] = newWSIndex;

        emit WrappedSongReleased(wrappedSong);
    }

    function acceptWrappedSongForReview(address wrappedSong) external onlyOwner {
        protocolModule.acceptWrappedSongForReview(wrappedSong);
        emit WrappedSongAcceptedForReview(wrappedSong);
    }

    function rejectWrappedSongRelease(address wrappedSong) external onlyOwner {
        protocolModule.rejectWrappedSongRelease(wrappedSong);
        emit WrappedSongReleaseRejected(wrappedSong);
    }

    /**
     * @dev Returns the number of managed wrapped songs
     */
    function getManagedWrappedSongsCount() external view returns (uint256) {
        return managedWrappedSongs.length;
    }

    /**
     * @dev Emergency function to recover stuck tokens
     * @param token The token to recover
     * @notice Only owner can call this function
     */
    function recoverTokens(address token) external onlyOwner {
        require(token != address(stablecoin), "Cannot recover stablecoin");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance to recover");
        require(IERC20(token).transfer(owner(), balance), "Transfer failed");
    }

    /**
     * @dev Claims earnings for multiple epochs in a single transaction
     * @param _wrappedSong The wrapped song address
     * @param epochIds Array of epoch IDs to claim
     */
    function claimMultipleEpochs(
        address _wrappedSong,
        uint256[] calldata epochIds
    ) external {
        require(epochIds.length > 0, "Empty epochs array");
        
        address wsTokenManagement = IWrappedSongSmartAccount(_wrappedSong).getWSTokenManagementAddress();
        uint256 wsIndex = wsRedeemIndexList[_wrappedSong];
        uint256 totalShares = IWSTokenManagement(wsTokenManagement).totalShares();
        uint256 totalAmount;

        for (uint256 i = 0; i < epochIds.length; i++) {
            uint256 epochId = epochIds[i];
            require(epochId <= currentEpochId, "Invalid epoch");
            require(!epochClaims[epochId][msg.sender][_wrappedSong], "Epoch already claimed");

            RevenueEpoch storage epoch = distributionEpochs[epochId];
            
            uint256 balanceAtEpoch = IWSTokenManagement(wsTokenManagement).balanceOfAt(
                msg.sender,
                1,
                epoch.timestamp
            );
            
            uint256 wsAmount = getAmountForWS(epochId, wsIndex);
            uint256 amount = (wsAmount * balanceAtEpoch) / totalShares;
            
            totalAmount += amount;
            epochClaims[epochId][msg.sender][_wrappedSong] = true;

            emit EpochRedeemed(
                _wrappedSong,
                msg.sender,
                epochId,
                amount
            );
        }

        require(totalAmount > 0, "Nothing to claim");
        require(stablecoin.transfer(msg.sender, totalAmount), "Transfer failed");
    }

    /**
     * @dev View function to check claimable amounts for multiple epochs
     * @param _wrappedSong The wrapped song address
     * @param _holder The address of the holder
     * @param epochIds Array of epoch IDs to check
     * @return amounts Array of claimable amounts corresponding to each epoch
     */
    function getMultipleClaimableAmounts(
        address _wrappedSong,
        address _holder,
        uint256[] calldata epochIds
    ) external view returns (uint256[] memory amounts) {
        address wsTokenManagement = IWrappedSongSmartAccount(_wrappedSong).getWSTokenManagementAddress();
        uint256 wsIndex = wsRedeemIndexList[_wrappedSong];
        uint256 totalShares = IWSTokenManagement(wsTokenManagement).totalShares();
        
        amounts = new uint256[](epochIds.length);
        
        for (uint256 i = 0; i < epochIds.length; i++) {
            uint256 epochId = epochIds[i];
            if (epochId > currentEpochId || epochClaims[epochId][_holder][_wrappedSong]) {
                amounts[i] = 0;
                continue;
            }

            RevenueEpoch storage epoch = distributionEpochs[epochId];
            uint256 balanceAtEpoch = IWSTokenManagement(wsTokenManagement).balanceOfAt(
                _holder,
                1,
                epoch.timestamp
            );
            
            uint256 wsAmount = getAmountForWS(epochId, wsIndex);
            amounts[i] = (wsAmount * balanceAtEpoch) / totalShares;
        }
        
        return amounts;
    }

    /**
     * @dev Claims earnings for multiple wrapped songs in a single epoch
     * @param _wrappedSongs Array of wrapped song addresses
     * @param epochId The epoch to claim from
     */
    function claimMultipleWrappedSongsEarnings(
        address[] calldata _wrappedSongs,
        uint256 epochId
    ) external {
        require(epochId <= currentEpochId, "Invalid epoch");
        require(_wrappedSongs.length > 0, "Empty wrapped songs array");

        uint256 totalAmount;

        for (uint256 i = 0; i < _wrappedSongs.length; i++) {
            address _wrappedSong = _wrappedSongs[i];
            require(!epochClaims[epochId][msg.sender][_wrappedSong], "Already claimed for this wrapped song");

            RevenueEpoch storage epoch = distributionEpochs[epochId];
            address wsTokenManagement = IWrappedSongSmartAccount(_wrappedSong).getWSTokenManagementAddress();
            uint256 wsIndex = wsRedeemIndexList[_wrappedSong];

            uint256 balanceAtEpoch = IWSTokenManagement(wsTokenManagement).balanceOfAt(
                msg.sender,
                1,
                epoch.timestamp
            );
            
            uint256 totalShares = IWSTokenManagement(wsTokenManagement).totalShares();
            
            // Get amount from chunked storage
            uint256 wsAmount = getAmountForWS(epochId, wsIndex);
            uint256 amount = (wsAmount * balanceAtEpoch) / totalShares;
            
            totalAmount += amount;
            epochClaims[epochId][msg.sender][_wrappedSong] = true;

            emit EpochRedeemed(
                _wrappedSong,
                msg.sender,
                epochId,
                amount
            );
        }

        require(totalAmount > 0, "Nothing to claim");
        require(stablecoin.transfer(msg.sender, totalAmount), "Transfer failed");
    }

    /**
     * @dev Sets the authenticity status of a wrapped song
     * @param wrappedSong The address of the wrapped song
     * @param isAuthentic The authenticity status to set
     */
    function setWrappedSongAuthenticity(address wrappedSong, bool isAuthentic) external onlyOwner {
        require(
            wsRedeemIndexList[wrappedSong] < managedWrappedSongs.length,
            "Not a managed wrapped song"
        );

        // Call ProtocolModule's setWrappedSongAuthenticity function directly
        // The protocol module will handle the pause check and revert with EnforcedPause if needed
        protocolModule.setWrappedSongAuthenticity(wrappedSong, isAuthentic);
    }

    /**
     * @dev Confirms a pending metadata update for a wrapped song
     * @param wrappedSong The address of the wrapped song
     */
    function confirmMetadataUpdate(address wrappedSong) external onlyOwner {
        require(
            wsRedeemIndexList[wrappedSong] < managedWrappedSongs.length,
            "Not a managed wrapped song"
        );
        
        IMetadataModule metadataModule = IMetadataModule(protocolModule.getMetadataModule());
        metadataModule.confirmUpdateMetadata(wrappedSong);
    }

    /**
     * @dev Rejects a pending metadata update for a wrapped song
     * @param wrappedSong The address of the wrapped song
     */
    function rejectMetadataUpdate(address wrappedSong) external onlyOwner {
        require(
            wsRedeemIndexList[wrappedSong] < managedWrappedSongs.length,
            "Not a managed wrapped song"
        );
        
        IMetadataModule metadataModule = IMetadataModule(protocolModule.getMetadataModule());
        metadataModule.rejectUpdateMetadata(wrappedSong);
    }
}
