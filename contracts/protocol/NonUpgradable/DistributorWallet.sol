// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './WrappedSongSmartAccount.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IWrappedSongSmartAccount.sol';

contract DistributorWallet is Ownable {
    struct RevenueEpoch {
        uint256 epochId;
        uint256 amount;
        uint256 timestamp;
        bool claimed;
        string source;  // e.g., "Spotify", "Apple Music"
    }

    IERC20 public immutable stablecoin;
    IProtocolModule public immutable protocolModule;
    
    // Track epochs per wrapped song
    mapping(address => RevenueEpoch[]) public revenueEpochs;
    mapping(address => uint256) public lastProcessedEpoch;
    mapping(address => uint256) public wrappedSongTreasury;
    address[] public managedWrappedSongs;
    uint256 public currentBatchIndex;

    event WrappedSongReleaseRequested(address indexed wrappedSong);
    event WrappedSongReleased(address indexed wrappedSong);
    event WrappedSongRedeemed(address indexed wrappedSong, uint256 amount);
    event WrappedSongReleaseRejected(address indexed wrappedSong);
    event WrappedSongAcceptedForReview(address indexed wrappedSong);
    event FundsReceived(
        address indexed from,
        uint256 amount,
        string currency,
        address[] wrappedSongs,
        uint256[] amounts
    );

    event NewRevenueEpoch(
        address indexed wrappedSong, 
        uint256 indexed epochId, 
        uint256 amount,
        string source
    );
    event EpochsProcessed(
        address indexed wrappedSong, 
        uint256 fromEpoch, 
        uint256 toEpoch, 
        uint256 totalAmount
    );

    /**
     * @dev Constructor to initialize the contract with the given parameters.
     * @param _stablecoin The address of the stablecoin contract.
     * @param _protocolModule The address of the protocol module contract.
     * @param _owner The address of the owner.
     */
    constructor(
        address _stablecoin,
        address _protocolModule,
        address _owner
    ) Ownable(_owner) {
        protocolModule = IProtocolModule(_protocolModule);
        stablecoin = IERC20(_stablecoin);
    }

    /******************************************************************************
     *                                                                             *
     *                             EARNINGS FUNCTIONS                               *
     *                                                                             *
     * This section contains functions related to receiving and managing earnings  *
     * for wrapped songs. It includes functionality for receiving individual and   *
     * batch payments in stablecoin and updating the treasury balances.           *
     *                                                                             *
     ******************************************************************************/

    /**
     * @dev Receives stablecoin and updates the treasury for the specified wrapped songs.
     * @param _wrappedSongs The addresses of the wrapped songs.
     * @param _amounts The amounts of stablecoin to be received for each wrapped song.
     * @param _totalAmount The total amount of stablecoin to be received.
     */
    function receiveBatchPaymentStablecoin(
        address[] calldata _wrappedSongs, 
        uint256[] calldata _amounts, 
        uint256 _totalAmount,
        string calldata _source
    ) external onlyOwner {
        require(_wrappedSongs.length == _amounts.length, "Length mismatch");
        
        // Single transfer for batch
        require(
            stablecoin.transferFrom(msg.sender, address(this), _totalAmount),
            "Transfer failed"
        );

        // Create epochs for each wrapped song
        for (uint256 i = 0; i < _wrappedSongs.length; i++) {
            revenueEpochs[_wrappedSongs[i]].push(RevenueEpoch({
                epochId: revenueEpochs[_wrappedSongs[i]].length,
                amount: _amounts[i],
                timestamp: block.timestamp,
                claimed: false,
                source: _source
            }));

            emit NewRevenueEpoch(
                _wrappedSongs[i], 
                revenueEpochs[_wrappedSongs[i]].length - 1, 
                _amounts[i],
                _source
            );
        }
    }

    // Redemption Functions

    /**
     * @dev Redeems the amount for the owner of the wrapped song.
     * @param _wrappedSong The address of the wrapped song.
     */
    function redeemWrappedSongEarnings(address _wrappedSong) external {
        uint256 startEpoch = lastProcessedEpoch[_wrappedSong];
        uint256 endEpoch = revenueEpochs[_wrappedSong].length;
        require(endEpoch > startEpoch, "No new epochs");

        uint256 totalAmount = 0;
        for(uint256 i = startEpoch; i < endEpoch; i++) {
            RevenueEpoch storage epoch = revenueEpochs[_wrappedSong][i];
            if (!epoch.claimed) {
                totalAmount += epoch.amount;
                epoch.claimed = true;
            }
        }

        require(totalAmount > 0, "No unclaimed amount");
        
        // Update state
        lastProcessedEpoch[_wrappedSong] = endEpoch;

        // Transfer to wrapped song with epoch info
        require(stablecoin.approve(_wrappedSong, totalAmount), "Approval failed");
        IWrappedSongSmartAccount(_wrappedSong).receiveEpochEarnings(
            address(stablecoin),
            totalAmount,
            startEpoch,
            endEpoch
        );

        emit EpochsProcessed(_wrappedSong, startEpoch, endEpoch, totalAmount);
    }

    // View function to get unclaimed epochs info
    function getUnclaimedEpochs(address _wrappedSong) 
        external 
        view 
        returns (
            uint256[] memory epochIds,
            uint256[] memory amounts,
            uint256[] memory timestamps,
            string[] memory sources
        ) 
    {
        uint256 startEpoch = lastProcessedEpoch[_wrappedSong];
        uint256 endEpoch = revenueEpochs[_wrappedSong].length;
        uint256 count = 0;

        // First count unclaimed epochs
        for(uint256 i = startEpoch; i < endEpoch; i++) {
            if (!revenueEpochs[_wrappedSong][i].claimed) {
                count++;
            }
        }

        // Initialize arrays with correct size
        epochIds = new uint256[](count);
        amounts = new uint256[](count);
        timestamps = new uint256[](count);
        sources = new string[](count);

        // Fill arrays
        uint256 index = 0;
        for(uint256 i = startEpoch; i < endEpoch; i++) {
            RevenueEpoch storage epoch = revenueEpochs[_wrappedSong][i];
            if (!epoch.claimed) {
                epochIds[index] = epoch.epochId;
                amounts[index] = epoch.amount;
                timestamps[index] = epoch.timestamp;
                sources[index] = epoch.source;
                index++;
            }
        }

        return (epochIds, amounts, timestamps, sources);
    }

    /******************************************************************************
     *                                                                             *
     *                           METADATA MANAGEMENT                               *
     *                                                                             *
     * This section contains functions related to managing metadata for wrapped    *
     * songs. It includes functionality for confirming and rejecting metadata     *
     * updates requested by wrapped song owners.                                   *
     *                                                                             *
     ******************************************************************************/

    /**
     * @dev Confirms the update to the metadata.
     * @param wrappedSong The address of the wrapped song.
     */
    function confirmUpdateMetadata(address wrappedSong) external onlyOwner {
        require(
            !protocolModule.metadataModule().isMetadataUpdateConfirmed(wrappedSong),
            'No pending metadata update for this wrapped song'
        );
        require(
            protocolModule.getWrappedSongDistributor(wrappedSong) == address(this),
            'Not the distributor for this wrapped song'
        );
        protocolModule.metadataModule().confirmUpdateMetadata(wrappedSong);
    }

    /**
     * @dev Rejects the update to the metadata.
     * @param wrappedSong The address of the wrapped song.
     */
    function rejectUpdateMetadata(address wrappedSong) external onlyOwner {
        require(
            !protocolModule.metadataModule().isMetadataUpdateConfirmed(wrappedSong),
            'No pending metadata update for this wrapped song'
        );
        require(
            protocolModule.getWrappedSongDistributor(wrappedSong) == address(this),
            'Not the distributor for this wrapped song'
        );
        protocolModule.metadataModule().rejectUpdateMetadata(wrappedSong);
    }

    /******************************************************************************
     *                                                                             *
     *                       WRAPPED SONG MANAGEMENT                               *
     *                                                                             *
     * This section contains functions related to managing wrapped songs and       *
     * their lifecycle. It includes functionality for confirming releases,         *
     * accepting songs for review, and rejecting release requests.                *
     *                                                                             *
     ******************************************************************************/

    /**
     * @dev Confirms the release of a wrapped song and adds it to the managed wrapped songs.
     * @param wrappedSong The address of the wrapped song to be released.
     */
    function confirmWrappedSongRelease(address wrappedSong) external onlyOwner {
        require(
            protocolModule.getPendingDistributorRequests(wrappedSong) == address(this),
            'Not the pending distributor for this wrapped song'
        );

        protocolModule.confirmWrappedSongRelease(wrappedSong);
        managedWrappedSongs.push(wrappedSong);

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

    // Fallback Functions

    /**
     * @dev Fallback function to receive Ether payments.
     */
    receive() external payable {
        // Handle Ether payments
    }

    /**
     * @dev Fallback function to handle calls to the contract.
     */
    fallback() external payable {
        // Handle other calls
    }

    // ERC20 Token Handling

    /**
     * @dev Receives ERC20 tokens.
     */
    function receiveERC20() external {
        // Handle ERC20 token reception
    }

    /******************************************************************************
     *                                                                             *
     *                           REGISTRY MANAGEMENT                               *
     *                                                                             *
     * This section contains functions related to managing registry codes (ISRC,   *
     * UPC, ISWC, ISCC) for wrapped songs through the protocol module.            *
     *                                                                             *
     ******************************************************************************/

    /**
     * @dev Adds an ISRC code for a wrapped song
     * @param wrappedSong The address of the wrapped song
     * @param isrc The ISRC code to add
     */
    function addISRC(address wrappedSong, string memory isrc) external onlyOwner {
        protocolModule.addISRC(wrappedSong, isrc);
    }

    /**
     * @dev Adds a UPC code for a wrapped song
     * @param wrappedSong The address of the wrapped song
     * @param upc The UPC code to add
     */
    function addUPC(address wrappedSong, string memory upc) external onlyOwner {
        protocolModule.addUPC(wrappedSong, upc);
    }

    /**
     * @dev Adds an ISWC code for a wrapped song
     * @param wrappedSong The address of the wrapped song
     * @param iswc The ISWC code to add
     */
    function addISWC(address wrappedSong, string memory iswc) external onlyOwner {
        protocolModule.addISWC(wrappedSong, iswc);
    }

    /**
     * @dev Adds an ISCC code for a wrapped song
     * @param wrappedSong The address of the wrapped song
     * @param iscc The ISCC code to add
     */
    function addISCC(address wrappedSong, string memory iscc) external onlyOwner {
        protocolModule.addISCC(wrappedSong, iscc);
    }

    /**
     * @dev Sets the authenticity status for a wrapped song
     * @param wrappedSong The address of the wrapped song
     * @param isAuthentic The authenticity status to set
     */
    function setWrappedSongAuthenticity(address wrappedSong, bool isAuthentic) external onlyOwner {
        require(
            protocolModule.getWrappedSongDistributor(wrappedSong) == address(this),
            "Not the distributor for this wrapped song"
        );
        protocolModule.setWrappedSongAuthenticity(wrappedSong, isAuthentic);
    }

}
