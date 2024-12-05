pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../Interfaces/IFeesModule.sol";
import "../Interfaces/IERC20Whitelist.sol";
import "../Interfaces/IDistributorWalletFactory.sol";
import "../Interfaces/IMetadataModule.sol";

contract ReleaseModule is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IFeesModule public feesModule;
    IERC20Whitelist public erc20whitelist;
    IDistributorWalletFactory public distributorWalletFactory;
    IMetadataModule public metadataModule;

    // Accumulated fees per release
    mapping(address => uint256) public accumulatedFees;
    mapping(address => address) public wrappedSongToDistributor;
    mapping(address => address) public pendingDistributorRequests;

    struct ReviewPeriod {
        uint256 startTime;
        uint256 endTime;
        address distributor;
    }

    mapping(address => ReviewPeriod) public reviewPeriods;

    // Global release settings
    bool public releasesEnabled = true;
    uint256 public reviewPeriodDays = 7;

    address public stablecoinFeeReceiver;

    event ReleaseFeeCollected(address indexed creator, address indexed token, uint256 amount);
    event WrappedSongReleased(address indexed wrappedSong, address indexed distributor);
    event WrappedSongReleaseRequested(address indexed wrappedSong, address indexed distributor, address indexed creator);
    event WrappedSongReleaseRejected(address indexed wrappedSong, address indexed distributor);
    event DistributorAcceptedReview(address indexed wrappedSong, address indexed distributor);
    event ReviewPeriodExpired(address indexed wrappedSong, address indexed distributor);
    event ReleasesEnabledChanged(bool enabled);
    event FeesWithdrawn(address indexed token, address indexed recipient, uint256 amount);

    constructor(
    ) Ownable(msg.sender) {
    }

    function initialize(
        address _feesModule,
        address _erc20whitelist,
        address _distributorWalletFactory,
        address _metadataModule
    ) external onlyOwner {
        require(
            address(feesModule) == address(0) &&
            address(erc20whitelist) == address(0) &&
            address(distributorWalletFactory) == address(0) &&
            address(metadataModule) == address(0),
            "Already initialized"
        );

        feesModule = IFeesModule(_feesModule);
        erc20whitelist = IERC20Whitelist(_erc20whitelist);
        distributorWalletFactory = IDistributorWalletFactory(_distributorWalletFactory);
        metadataModule = IMetadataModule(_metadataModule);
    }

    function requestWrappedSongReleaseWithMetadata(
        address wrappedSong,
        address distributor,
        IMetadataModule.Metadata memory newMetadata
    ) external payable {
        require(releasesEnabled, "Releases are currently disabled");
        _validateReleaseRequest(wrappedSong, distributor);
        _handleReleaseFee(wrappedSong);
        metadataModule.updateMetadata(wrappedSong, newMetadata);
        _processReleaseRequest(wrappedSong, distributor);
    }

    function requestWrappedSongRelease(
        address wrappedSong,
        address distributor
    ) external payable {
        require(releasesEnabled, "Releases are currently disabled");
        _validateReleaseRequest(wrappedSong, distributor);
        _handleReleaseFee(wrappedSong);
        _processReleaseRequest(wrappedSong, distributor);
    }

    function _validateReleaseRequest(
        address wrappedSong,
        address distributor
    ) internal view {
        require(msg.sender == Ownable(wrappedSong).owner(), "Only wrapped song owner can request release");
        require(distributor != address(0), "Invalid distributor wallet address");
        require(distributor.code.length > 0, "Distributor wallet must be a contract");
        require(distributorWalletFactory.checkIsDistributorWallet(distributor), "Invalid distributor wallet: not registered in factory");
        require(wrappedSongToDistributor[wrappedSong] == address(0), "Wrapped song already released");
    }

    function _processReleaseRequest(
        address wrappedSong,
        address distributor
    ) internal {
        pendingDistributorRequests[wrappedSong] = distributor;
        emit WrappedSongReleaseRequested(wrappedSong, distributor, msg.sender);
    }

    function removeWrappedSongReleaseRequest(address wrappedSong) external {
        require(msg.sender == Ownable(wrappedSong).owner(), "Only wrapped song owner can remove release request");
        require(pendingDistributorRequests[wrappedSong] != address(0), "No pending release request");
        require(distributorWalletFactory.checkIsDistributorWallet(pendingDistributorRequests[wrappedSong]), "Distributor does not exist");
        delete pendingDistributorRequests[wrappedSong];
    }

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
        delete reviewPeriods[wrappedSong];

        emit WrappedSongReleased(wrappedSong, msg.sender);
    }


    function handleExpiredReviewPeriod(address wrappedSong) external {
        ReviewPeriod memory review = reviewPeriods[wrappedSong];
        require(block.timestamp > review.endTime, "Review period has not expired");

        delete reviewPeriods[wrappedSong];
        emit ReviewPeriodExpired(wrappedSong, review.distributor);
    }


    function rejectWrappedSongRelease(address wrappedSong) external {
        address pendingDistributor = pendingDistributorRequests[wrappedSong];
        require(pendingDistributor == msg.sender, "Not the pending distributor");
        require(distributorWalletFactory.checkIsDistributorWallet(msg.sender), "Distributor does not exist");

        delete pendingDistributorRequests[wrappedSong];
        delete reviewPeriods[wrappedSong];

        emit WrappedSongReleaseRejected(wrappedSong, msg.sender);
    }

    function updateWrappedSongDistributor(
        address wrappedSong,
        address newDistributor
    ) external {
        address currentDistributor = wrappedSongToDistributor[wrappedSong];
        require(currentDistributor != address(0), "Wrapped song not released yet");
        require(msg.sender == currentDistributor, "Only current distributor can update distributor");
        require(newDistributor != address(0), "Invalid new distributor address");
        require(newDistributor.code.length > 0, "New distributor must be a contract");
        wrappedSongToDistributor[wrappedSong] = newDistributor;
    }


    function isReleased(address wrappedSong) external view returns (bool) {
        return wrappedSongToDistributor[wrappedSong] != address(0);
    }

    function setReviewPeriodDays(uint256 _days) external onlyOwner {
        reviewPeriodDays = _days;
    }

    function setReleasesEnabled(bool _enabled) external onlyOwner {
        releasesEnabled = _enabled;
        emit ReleasesEnabledChanged(_enabled);
    }

    function setStablecoinFeeReceiver(address newReceiver) external onlyOwner {
        require(newReceiver != address(0), "Invalid receiver address");
        stablecoinFeeReceiver = newReceiver;
    }

    /**************************************************************************
   * Getters
   *************************************************************************/

   function getStablecoinFeeReceiver() external view returns (address) {
    return stablecoinFeeReceiver;
   }

  /**
   * @dev Returns the distributor address for a given wrapped song.
   * @param wrappedSong The address of the wrapped song.
   * @return The address of the distributor.
   */
  function getWrappedSongDistributor(
    address wrappedSong
  ) external view returns (address) {
    return wrappedSongToDistributor[wrappedSong];
  }

  /**
   * @dev Returns the pending distributor address for a given wrapped song.
   * @param wrappedSong The address of the wrapped song.
   * @return The address of the pending distributor.
   */
  function getPendingDistributorRequests(
    address wrappedSong
  ) external view returns (address) {
    return pendingDistributorRequests[wrappedSong];
  }


    /**************************************************************************
   * Withdrawal & Fees
   *************************************************************************/


    function _handleReleaseFee(address wrappedSong) internal {
        uint256 feeAmount = feesModule.getReleaseFee();
        bool payInStablecoin = feesModule.isPayInStablecoin();
        uint256 currentStablecoinIndex = feesModule.getCurrentStablecoinIndex();

        if (feeAmount > 0) {
            if (payInStablecoin) {
                address stablecoin = erc20whitelist.getWhitelistedTokenAtIndex(currentStablecoinIndex);
                require(stablecoin != address(0), "No whitelisted stablecoin available");

                IERC20(stablecoin).safeTransferFrom(msg.sender, stablecoinFeeReceiver, feeAmount);
                accumulatedFees[stablecoin] += feeAmount;

                emit ReleaseFeeCollected(msg.sender, stablecoin, feeAmount);
            } else {
                require(msg.value >= feeAmount, "Incorrect ETH fee amount");
                accumulatedFees[address(0)] += msg.value;

                if (msg.value > feeAmount) {
                    (bool refundSuccess, ) = msg.sender.call{value: msg.value - feeAmount}("");
                    require(refundSuccess, "ETH refund failed");
                }

                emit ReleaseFeeCollected(msg.sender, address(0), msg.value);
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

    receive() external payable {}

    fallback() external payable {}
}
