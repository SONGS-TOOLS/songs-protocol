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
        uint256 totalAmount;
        uint256[] amountsPerWS;
        uint256 timestamp;
    }

    uint256 currentEpochId;
    uint256 wsRedeemIndexStatus;

    IERC20 public immutable stablecoin;
    IProtocolModule public immutable protocolModule;

    // Track epochs per wrapped song
    mapping(uint256 => RevenueEpoch) public distributionEpochs;
    // Track epochs epochs redemption per wrapped song
    mapping(uint256 => mapping(uint256 => address)) public epochsRedeemption;
    // 
    mapping(address => uint256) public wsRedeemIndexList;

    mapping(address => mapping(address => uint256)) public lastRedeemedEpochPerWSPerSender;

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
        address indexed distributor, 
        uint256 indexed epochId, 
        uint256 totalAmount,
        uint256 timestamp
    );

    event EpochsRedeemed(
        address indexed wrappedSong, 
        address indexed shareHolder, 
        uint256[] localAmounts,
        uint256[] localEpochTimestamps,
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
     * @param _amounts The amounts of stablecoin to be received for each wrapped song IMPORTANT ordered by index.
     * @param _totalAmount The total amount of stablecoin to be received.
     */
    function createDistributionEpoch(
        // TODO: why calldata?
        // address[] calldata _wrappedSongs, 
        uint256[] calldata _amounts, 
        uint256 _totalAmount
    ) external onlyOwner {
        // require(_amounts.length, "Length mismatch");
        // TODO: Estimate gas, estimage max WS list size so upload
        
        // Send totalAmount funds
        require(
            stablecoin.transferFrom(msg.sender, address(this), _totalAmount),
            "Transfer failed"
        );

        uint256 epochId = currentEpochId++;
        
        // Create onchain epoch
        distributionEpochs[currentEpochId++] = RevenueEpoch({
            epochId: epochId,
            amountsPerWS: _amounts, // Array ordered by WS index
            totalAmount: _totalAmount,
            timestamp: block.timestamp
        });

        // Increase current Distributor Epoch
        currentEpochId = currentEpochId++;

        emit NewRevenueEpoch(
            address(this), 
            epochId, 
            _totalAmount,
            block.timestamp
        );
    }

    // Redemption Functions

    /**
     * @dev Redeems the amount for the wrapped song.
     * @param _wrappedSong The address of the wrapped song.
     */
    function claimEarnigsByTokenHolder(address _wrappedSong) external {
        require(lastRedeemedEpochPerWSPerSender[_wrappedSong][msg.sender] < currentEpochId, "Nothing to redeem");

        // GET ALL INFO
        
        // Get the SONGSHARES balance of the Sender
        address wsTokenManagement = IWrappedSongSmartAccount(_wrappedSong).getWSTokenManagementAddress();
        uint256 balance = IWSTokenManagement(wsTokenManagement).balanceOf(msg.sender, 1);
        uint256 totalShares = IWSTokenManagement(wsTokenManagement).totalShares();

        // Get last sender epoch
        uint256 lastRedeemedEpochId = lastRedeemedEpochPerWSPerSender[_wrappedSong][msg.sender];

        uint256 nextEpoch = lastRedeemedEpochId++;

        // Get the WS Index in the Epoch
        uint256 wsIndex = wsRedeemIndexList[_wrappedSong];

        // BUILD STATE
        uint256 amountToRedeem;

        // TODO: Check if storage works correctly
        uint256[] storage localAmounts;
        uint256[] storage localEpochTimestamps;

        // LOOP to all lacking to redeem epochs
        for(uint256 epochTimestamp = nextEpoch; epochTimestamp < currentEpochId; epochTimestamp++) {
            // GET THE EPOCH
            RevenueEpoch memory epoch = distributionEpochs[epochTimestamp];
            
            // CALCULATE PARTS
            uint256 balanceAtEpoch = IWSTokenManagement(wsTokenManagement).balanceOfAt(msg.sender, 1, epochTimestamp);
            uint256 songShareAmount = (epoch.amountsPerWS[wsIndex] / totalShares) * balanceAtEpoch;
            amountToRedeem = amountToRedeem + songShareAmount;
            localAmounts.push(songShareAmount);
            localEpochTimestamps.push(epochTimestamp);
        }

        // UPDATE the last Redeemed epoch per user
        lastRedeemedEpochPerWSPerSender[_wrappedSong][msg.sender] = currentEpochId;

        // SEND FUNDS
        // Transfer to wrapped song with epoch info
        require(stablecoin.approve(msg.sender, amountToRedeem), "Approval failed");
        // Transfer to wrapped song with epoch info
        require(IERC20(stablecoin).transferFrom(msg.sender, address(this), amountToRedeem),
            "Transfer failed");

        // This mapping Seems not necesary
        emit EpochsRedeemed(_wrappedSong, msg.sender, localAmounts, localEpochTimestamps, amountToRedeem);
    }


    // View function to get unclaimed epochs info
    function getUnclaimedEpochsEarnings(address _wrappedSong) 
        external 
        view 
        returns (
            uint256[] memory amounts,
            uint256[] memory epochTimestamps,
            uint256 unclaimedEarnings
        ) 
    {
        address wsTokenManagement = IWrappedSongSmartAccount(_wrappedSong).getWSTokenManagementAddress();
        uint256 balance = IWSTokenManagement(wsTokenManagement).balanceOf(msg.sender, 1);
        uint256 totalShares = IWSTokenManagement(wsTokenManagement).totalShares();

        // LAST REDEEMED EPOCH PER ACCOUNT
        uint256 lastRedeemedEpochId = lastRedeemedEpochPerWSPerSender[_wrappedSong][msg.sender];

        uint256 nextEpoch = lastRedeemedEpochId++;

        // Get the WS Index in the Epoch
        uint256 wsIndex = wsRedeemIndexList[_wrappedSong];

        uint256 amountToRedeem;

        // TODO: Check if storage works correctly
        uint256[] storage localAmounts;
        uint256[] storage localEpochTimestamps;

        // LOOP to all lacking to redeem epochs
        for(uint256 epochTimestamp = nextEpoch; epochTimestamp < currentEpochId; epochTimestamp++) {
            // GET THE EPOCH
            RevenueEpoch memory epoch = distributionEpochs[epochTimestamp];
            
            // GET THE EPOCH
            uint256 balanceAtEpoch = IWSTokenManagement(wsTokenManagement).balanceOfAt(msg.sender, 1, epochTimestamp);
            uint256 songShareAmount = (epoch.amountsPerWS[wsIndex] / totalShares) * balanceAtEpoch;
            amountToRedeem = amountToRedeem + songShareAmount;
            localAmounts.push(songShareAmount);
            localEpochTimestamps.push(epochTimestamp);
        }

        return (
            localAmounts,
            epochTimestamps,
            amountToRedeem
        );
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

        // Get index of last released Wrapped Song and create the next
        uint256 newWSIndex = wsRedeemIndexStatus++;

        // Assign new index to WS
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
