// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IDistributorWallet.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/IDistributorWalletFactory.sol";
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IWSTokenManagement.sol";
contract WrappedSongSmartAccount is
    Ownable,
    IERC1155Receiver,
    ERC165,
    ReentrancyGuard,
    Initializable,
    IWrappedSongSmartAccount
{
    // State variables
    IWSTokenManagement public wsTokenManagement;
    IERC20 public stablecoin;
    IProtocolModule public protocolModule;
    IMetadataModule public metadataModule;

    uint256 public songSharesId;
    uint256 public wrappedSongTokenId;

    uint256 public ethBalance;

    struct EpochBalance {
        uint256 lastClaimedEpoch;
        uint256 lastClaimedETHEpoch;
    }

    mapping(address => EpochBalance) public userEpochBalances;

    struct DistributionEpoch {
        uint256 epochId;
        uint256 amount;
        uint256 earningsPerShare;
        uint256 timestamp;
        bool processed;
        string source;
        EpochType epochType;
        address sender;
        address token;  // address(0) for ETH
    }

    DistributionEpoch[] public distributionEpochs;

    uint256 private constant PRECISION = 1e18;
    uint256 private constant MAX_EPOCHS_PER_CLAIM = 50;

    bool public migrated;

    enum EpochType {
        DISTRIBUTOR,
        EXTERNAL
    }

    // Events
    event DistributionEpochProcessed(
        uint256 indexed epochId,
        uint256 amount,
        uint256 earningsPerShare,
        string source,
        address indexed token
    );

    event EpochEarningsClaimed(
        address indexed user,
        uint256 fromEpoch,
        uint256 toEpoch,
        uint256 amount,
        address indexed token
    );

    event ContractMigrated(address indexed newWrappedSongAddress);

    modifier notMigrated() {
        require(!migrated, "Contract has been migrated");
        _;
    }

    modifier onlyOwnerOrDistributor() {
        require(
            msg.sender == owner() ||
                msg.sender == protocolModule.getWrappedSongDistributor(address(this)),
            "Caller is not owner or wrapped song distributor"
        );
        _;
    }

    constructor(
        address _protocolModuleAddress
    ) Ownable(msg.sender) {
        require(_protocolModuleAddress != address(0), "Invalid protocol module");
        protocolModule = IProtocolModule(_protocolModuleAddress);
        metadataModule = IMetadataModule(IProtocolModule(_protocolModuleAddress).metadataModule());
        _disableInitializers();
    }

    function initialize(
        address _stablecoinAddress,
        address _owner,
        address /* _protocolModuleAddress */
    ) external override initializer {
        require(_stablecoinAddress != address(0), "Invalid stablecoin address");
        require(_owner != address(0), "Invalid owner address");
        
        _transferOwnership(_owner);
        stablecoin = IERC20(_stablecoinAddress);
        
        wrappedSongTokenId = 0;
        songSharesId = 1;
    }
    
    function setWSTokenManagement(address _wsTokenManagement) external {
        require(address(wsTokenManagement) == address(0), "WSToken already set");
        wsTokenManagement = IWSTokenManagement(_wsTokenManagement);
    }

    function getWSTokenManagementAddress() external view returns (address) {
        return address(wsTokenManagement);
    }
    function createSongShares(uint256 sharesAmount) external {
        require(
            wsTokenManagement.totalSupply(1) == 0,
            "Shares already initialized"
        );
        wsTokenManagement.createSongShares(sharesAmount);
    }

    function createBuyoutToken(
        uint256 amount,
        address recipient
    ) external onlyOwner {
        require(
            wsTokenManagement.totalSupply(2) == 0,
            "Buyout token already initialized"
        );
        wsTokenManagement.createBuyoutToken(amount, recipient);
    }

    function createLegalContract(
        string memory contractURI
    ) external onlyOwnerOrDistributor returns (uint256) {
        require(
            wsTokenManagement.totalSupply(3) == 0,
            "Legal contract already initialized"
        );
        return wsTokenManagement.createLegalContract(contractURI);
    }


    /******************************************************************************
     *                                                                             *
     *                           EARNINGS DISTRIBUTION                             *
     *                                                                             *
     ******************************************************************************/

    receive() external payable {
        if(msg.value > 0) {
            _createEpoch(msg.value, address(0), "External ETH", EpochType.EXTERNAL);
        }
    }

    function receiveERC20(address token, uint256 amount) external notMigrated {
        require(token == address(stablecoin), "Invalid token");
        
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        bool isDistributor = msg.sender == protocolModule.getWrappedSongDistributor(address(this));

        _createEpoch(
            amount,
            token,
            isDistributor ? "Distributor" : "External ERC20",
            isDistributor ? EpochType.DISTRIBUTOR : EpochType.EXTERNAL
        );
    }

    function _createEpoch(
        uint256 amount,
        address token,
        string memory source,
        EpochType epochType
    ) private {
        uint256 totalShares = wsTokenManagement.totalSupply(songSharesId);
        require(totalShares > 0, "No shares exist");

        uint256 newEarningsPerShare = (amount * PRECISION) / totalShares;
        
        distributionEpochs.push(DistributionEpoch({
            epochId: distributionEpochs.length,
            amount: amount,
            earningsPerShare: newEarningsPerShare,
            timestamp: block.timestamp,
            processed: true,
            source: source,
            epochType: epochType,
            sender: msg.sender,
            token: token
        }));

        if (token == address(0)) {
            ethBalance += amount;
        }

        emit DistributionEpochProcessed(
            distributionEpochs.length - 1,
            amount,
            newEarningsPerShare,
            source,
            token
        );
    }

    function receiveEpochEarnings(
        address token,
        uint256 amount,
        uint256 startEpoch,
        uint256 endEpoch
    ) external notMigrated {
        require(token == address(stablecoin), "Invalid token");
        
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        _createEpoch(
            amount,
            token,
            "Distributor",
            EpochType.DISTRIBUTOR
        );
    }

    function claimEarnings(
        address token,
        uint256 maxEpochs
    ) external nonReentrant notMigrated {
        uint256 currentShares = wsTokenManagement.balanceOf(msg.sender, songSharesId);
        require(currentShares > 0 || wsTokenManagement.balanceOfAt(msg.sender, songSharesId, block.timestamp - 1) > 0, "No shares owned");

        EpochBalance storage userBalance = userEpochBalances[msg.sender];
        uint256 startEpoch = token == address(0) ? 
            userBalance.lastClaimedETHEpoch : 
            userBalance.lastClaimedEpoch;
        uint256 endEpoch = distributionEpochs.length;
        
        require(endEpoch > startEpoch, "No new epochs");

        uint256 epochsToProcess = maxEpochs > 0 ? 
            maxEpochs : 
            MAX_EPOCHS_PER_CLAIM;
        uint256 actualEndEpoch = startEpoch + epochsToProcess;
        if (actualEndEpoch > endEpoch) {
            actualEndEpoch = endEpoch;
        }

        uint256 totalUnclaimed = 0;
        uint256 lastProcessedEpoch = startEpoch;

        for(uint256 i = startEpoch; i < actualEndEpoch; i++) {
            DistributionEpoch storage epoch = distributionEpochs[i];
            if (epoch.processed && epoch.token == token) {
                uint256 historicalShares = wsTokenManagement.balanceOfAt(msg.sender, songSharesId, epoch.timestamp);
                if (historicalShares > 0) {
                    uint256 share = (historicalShares * epoch.earningsPerShare) / PRECISION;
                    totalUnclaimed += share;
                }
            }
            lastProcessedEpoch = i + 1;
        }

        require(totalUnclaimed > 0, "No earnings to claim");

        if (token == address(0)) {
            userBalance.lastClaimedETHEpoch = lastProcessedEpoch;
            ethBalance -= totalUnclaimed;
            (bool success, ) = msg.sender.call{value: totalUnclaimed}("");
            require(success, "ETH transfer failed");
        } else {
            userBalance.lastClaimedEpoch = lastProcessedEpoch;
            require(IERC20(token).transfer(msg.sender, totalUnclaimed), "Transfer failed");
        }

        emit EpochEarningsClaimed(
            msg.sender,
            startEpoch,
            lastProcessedEpoch,
            totalUnclaimed,
            token
        );
    }

    function hasMoreEpochsToClaim(
        address account,
        address token
    ) external view returns (
        bool hasMore,
        uint256 nextEpoch,
        uint256 totalEpochs
    ) {
        EpochBalance storage userBalance = userEpochBalances[account];
        uint256 startEpoch = token == address(0) ? 
            userBalance.lastClaimedETHEpoch : 
            userBalance.lastClaimedEpoch;
        uint256 endEpoch = distributionEpochs.length;

        if (endEpoch > startEpoch) {
            return (true, startEpoch, endEpoch - startEpoch);
        }
        return (false, startEpoch, 0);
    }

    function getUnclaimedEpochs(
        address account,
        address token
    ) external view returns (
        uint256[] memory epochIds,
        uint256[] memory amounts,
        uint256[] memory timestamps,
        string[] memory sources
    ) {
        uint256 shares = wsTokenManagement.balanceOf(account, songSharesId);
        if (shares == 0) {
            return (new uint256[](0), new uint256[](0), new uint256[](0), new string[](0));
        }

        EpochBalance storage userBalance = userEpochBalances[account];
        uint256 startEpoch = token == address(0) ? 
            userBalance.lastClaimedETHEpoch : 
            userBalance.lastClaimedEpoch;
        uint256 endEpoch = distributionEpochs.length;

        uint256 count = 0;
        for(uint256 i = startEpoch; i < endEpoch; i++) {
            if (distributionEpochs[i].processed && distributionEpochs[i].token == token) {
                count++;
            }
        }

        epochIds = new uint256[](count);
        amounts = new uint256[](count);
        timestamps = new uint256[](count);
        sources = new string[](count);

        uint256 index = 0;
        for(uint256 i = startEpoch; i < endEpoch; i++) {
            DistributionEpoch storage epoch = distributionEpochs[i];
            if (epoch.processed && epoch.token == token) {
                epochIds[index] = epoch.epochId;
                amounts[index] = (shares * epoch.earningsPerShare) / PRECISION;
                timestamps[index] = epoch.timestamp;
                sources[index] = epoch.source;
                index++;
            }
        }

        return (epochIds, amounts, timestamps, sources);
    }

    function getPendingEarnings(
        address account,
        address token
    ) external view returns (uint256) {
        uint256 shares = wsTokenManagement.balanceOf(account, songSharesId);
        if (shares == 0) return 0;

        EpochBalance storage userBalance = userEpochBalances[account];
        uint256 startEpoch = token == address(0) ? 
            userBalance.lastClaimedETHEpoch : 
            userBalance.lastClaimedEpoch;
        uint256 endEpoch = distributionEpochs.length;

        uint256 totalPending = 0;
        for(uint256 i = startEpoch; i < endEpoch; i++) {
            DistributionEpoch storage epoch = distributionEpochs[i];
            if (epoch.processed && epoch.token == token) {
                totalPending += (shares * epoch.earningsPerShare) / PRECISION;
            }
        }

        return totalPending;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function migrateWrappedSong(
        address metadataAddress,
        address newWrappedSongAddress
    ) external onlyOwner {
        require(!migrated, "Contract already migrated");
        require(
            protocolModule.isAuthorizedContract(msg.sender),
            "Not authorized contract"
        );

        wsTokenManagement.migrateWrappedSong(metadataAddress);
        wsTokenManagement.transferOwnership(newWrappedSongAddress);

        metadataModule.removeMetadata(address(this));
        // TODO: Remove legal contract metadata

        migrated = true;
        emit ContractMigrated(newWrappedSongAddress);
    }

    // Add owner() override
    function owner() public view virtual override(Ownable, IWrappedSongSmartAccount) returns (address) {
        return super.owner();
    }

}
