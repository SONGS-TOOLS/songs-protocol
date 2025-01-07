// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IDistributorWallet.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/IDistributorWalletFactory.sol";
import "./../Interfaces/IWrappedSongSmartAccount.sol";
import "./../Interfaces/IWSTokenManagement.sol";
import "./../Interfaces/IRegistryModule.sol";
import "./../Interfaces/IReleaseModule.sol";

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
    IReleaseModule public releaseModule;
    uint256 public songSharesId;
    uint256 public wrappedSongTokenId;

    uint256 public ethBalance;
    uint256 private _pendingStablecoinEarnings;

    struct EpochBalance {
        uint256 lastClaimedEpoch;
        uint256 lastClaimedETHEpoch;
    }

    mapping(address => EpochBalance) private _userEpochBalances;

    struct EarningsEpoch {
        uint256 epochId;
        uint256 amount;
        uint256 earningsPerShare;
        uint256 timestamp;
        address sender;
    }

    // Make arrays private
    EarningsEpoch[] private _ethEarningsEpochs;
    EarningsEpoch[] private _stablecoinEarningsEpochs;

    uint256 private constant PRECISION = 1e18;
    uint256 private constant MAX_EPOCHS_PER_CLAIM = 50;

    bool public migrated;

    // Events
    event EarningsEpochProcessed(
        uint256 indexed epochId,
        uint256 amount,
        uint256 earningsPerShare,
        bool isETH
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
                msg.sender == releaseModule.getWrappedSongDistributor(address(this)),
            "Caller is not owner or wrapped song distributor"
        );
        _;
    }

    constructor(
    ) Ownable(msg.sender) {
        _disableInitializers();
    }

    function initialize(
        address _stablecoinAddress,
        address _owner,
        address _protocolModuleAddress
    ) external override initializer {
        require(_protocolModuleAddress != address(0), "Invalid protocol module address");
        require(_stablecoinAddress != address(0), "Invalid stablecoin address");
        require(_owner != address(0), "Invalid owner address");
        
        protocolModule = IProtocolModule(_protocolModuleAddress);
        metadataModule = IMetadataModule(IProtocolModule(_protocolModuleAddress).metadataModule());
        releaseModule = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule()).releaseModule();
        
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
    
    function setSymbol(string memory newSymbol) external onlyOwner {
        require(bytes(newSymbol).length > 0, "Symbol cannot be empty");
        wsTokenManagement.updateSymbol(newSymbol);
    }


    /******************************************************************************
     *                                                                             *
     *                           EARNINGS DISTRIBUTION                             *
     *                                                                             *
     ******************************************************************************/

    receive() external payable {
        ethBalance += msg.value;
    }

    function receiveERC20(address token, uint256 amount) external notMigrated {
        require(token == address(stablecoin), "Invalid token");
        
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        _pendingStablecoinEarnings += amount;
    }

    function claimETHEarnings(uint256 maxEpochs) external nonReentrant notMigrated {
        uint256 currentShares = wsTokenManagement.balanceOf(msg.sender, songSharesId);
        require(currentShares > 0 || wsTokenManagement.balanceOfAt(msg.sender, songSharesId, block.timestamp - 1) > 0, "No shares owned");

        EpochBalance storage userBalance = _userEpochBalances[msg.sender];
        uint256 startEpoch = userBalance.lastClaimedETHEpoch;
        uint256 endEpoch = _ethEarningsEpochs.length;
        
        require(endEpoch > startEpoch, "No new epochs");

        uint256 epochsToProcess = maxEpochs > 0 ? 
            Math.min(maxEpochs, endEpoch - startEpoch) : 
            Math.min(MAX_EPOCHS_PER_CLAIM, endEpoch - startEpoch);

        uint256 totalUnclaimed;

        for(uint256 i = startEpoch; i < startEpoch + epochsToProcess; i++) {
            EarningsEpoch memory epoch = _ethEarningsEpochs[i];
            uint256 historicalShares = wsTokenManagement.balanceOfAt(
                msg.sender, 
                songSharesId, 
                epoch.timestamp
            );
            
            if (historicalShares > 0) {
                // Safe multiplication and division to prevent overflow
                uint256 shareMultiplied = historicalShares * epoch.earningsPerShare;
                require(shareMultiplied / historicalShares == epoch.earningsPerShare, "Multiplication overflow");
                
                uint256 share = shareMultiplied / PRECISION;
                require(share <= epoch.amount, "Share calculation overflow");
                
                totalUnclaimed += share;
                require(totalUnclaimed >= share, "Total unclaimed overflow");
            }
        }

        require(totalUnclaimed > 0, "No ETH earnings to claim");
        require(totalUnclaimed <= ethBalance, "Insufficient contract balance");

        userBalance.lastClaimedETHEpoch = startEpoch + epochsToProcess;
        ethBalance -= totalUnclaimed;

        (bool success, ) = msg.sender.call{value: totalUnclaimed}("");
        require(success, "ETH transfer failed");

        emit EpochEarningsClaimed(
            msg.sender,
            startEpoch,
            startEpoch + epochsToProcess,
            totalUnclaimed,
            address(0)
        );
    }

    function claimStablecoinEarnings(uint256 maxEpochs) external nonReentrant notMigrated {
        uint256 currentShares = wsTokenManagement.balanceOf(msg.sender, songSharesId);
        require(currentShares > 0 || wsTokenManagement.balanceOfAt(msg.sender, songSharesId, block.timestamp - 1) > 0, "No shares owned");

        EpochBalance storage userBalance = _userEpochBalances[msg.sender];
        uint256 startEpoch = userBalance.lastClaimedEpoch;
        uint256 endEpoch = _stablecoinEarningsEpochs.length;
        
        require(endEpoch > startEpoch, "No new epochs");

        // Limit the number of epochs that can be processed in a single transaction
        uint256 epochsToProcess = maxEpochs > 0 ? maxEpochs : MAX_EPOCHS_PER_CLAIM;
        uint256 actualEndEpoch = Math.min(startEpoch + epochsToProcess, endEpoch);

        uint256 totalUnclaimed = 0;
        uint256 gasCheckpoint = gasleft();

        for(uint256 i = startEpoch; i < actualEndEpoch; i++) {
            // Gas check to prevent out-of-gas errors
            if (gasleft() < 100000) {  // Conservative gas limit
                actualEndEpoch = i;
                break;
            }

            EarningsEpoch memory epoch = _stablecoinEarningsEpochs[i];
            uint256 historicalShares = wsTokenManagement.balanceOfAt(msg.sender, songSharesId, epoch.timestamp);
            if (historicalShares > 0) {
                uint256 share = (historicalShares * epoch.earningsPerShare) / PRECISION;
                totalUnclaimed += share;
            }
        }

        require(totalUnclaimed > 0, "No stablecoin earnings to claim");

        // Update the last claimed epoch only if we successfully processed claims
        userBalance.lastClaimedEpoch = actualEndEpoch;
        require(IERC20(stablecoin).transfer(msg.sender, totalUnclaimed), "Transfer failed");

        emit EpochEarningsClaimed(
            msg.sender,
            startEpoch,
            actualEndEpoch,
            totalUnclaimed,
            address(stablecoin)
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
        EpochBalance storage userBalance = _userEpochBalances[account];
        uint256 startEpoch = token == address(0) ? 
            userBalance.lastClaimedETHEpoch : 
            userBalance.lastClaimedEpoch;
        uint256 endEpoch = token == address(0) ? 
            _ethEarningsEpochs.length : 
            _stablecoinEarningsEpochs.length;

        if (endEpoch > startEpoch) {
            return (true, startEpoch, endEpoch - startEpoch);
        }
        return (false, startEpoch, 0);
    }

    function getUnclaimedETHEpochs(
        address account
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

        EpochBalance storage userBalance = _userEpochBalances[account];
        uint256 startEpoch = userBalance.lastClaimedETHEpoch;
        uint256 endEpoch = _ethEarningsEpochs.length;

        epochIds = new uint256[](endEpoch - startEpoch);
        amounts = new uint256[](endEpoch - startEpoch);
        timestamps = new uint256[](endEpoch - startEpoch);
        sources = new string[](endEpoch - startEpoch);

        for(uint256 i = startEpoch; i < endEpoch; i++) {
            EarningsEpoch memory epoch = _ethEarningsEpochs[i];
            epochIds[i - startEpoch] = epoch.epochId;
            uint256 historicalShares = wsTokenManagement.balanceOfAt(account, songSharesId, epoch.timestamp);
            amounts[i - startEpoch] = (historicalShares * epoch.earningsPerShare) / PRECISION;
            timestamps[i - startEpoch] = epoch.timestamp;
        }

        return (epochIds, amounts, timestamps, sources);
    }

    function getUnclaimedStablecoinEpochs(
        address account
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

        EpochBalance storage userBalance = _userEpochBalances[account];
        uint256 startEpoch = userBalance.lastClaimedEpoch;
        uint256 endEpoch = _stablecoinEarningsEpochs.length;

        epochIds = new uint256[](endEpoch - startEpoch);
        amounts = new uint256[](endEpoch - startEpoch);
        timestamps = new uint256[](endEpoch - startEpoch);
        sources = new string[](endEpoch - startEpoch);

        for(uint256 i = startEpoch; i < endEpoch; i++) {
            EarningsEpoch memory epoch = _stablecoinEarningsEpochs[i];
            epochIds[i - startEpoch] = epoch.epochId;
            uint256 historicalShares = wsTokenManagement.balanceOfAt(account, songSharesId, epoch.timestamp);
            amounts[i - startEpoch] = (historicalShares * epoch.earningsPerShare) / PRECISION;
            timestamps[i - startEpoch] = epoch.timestamp;
        }

        return (epochIds, amounts, timestamps, sources);
    }

    function getPendingETHEarnings(address account) external view returns (uint256) {
        uint256 shares = wsTokenManagement.balanceOf(account, songSharesId);
        if (shares == 0) return 0;

        EpochBalance storage userBalance = _userEpochBalances[account];
        uint256 startEpoch = userBalance.lastClaimedETHEpoch;
        uint256 endEpoch = _ethEarningsEpochs.length;

        uint256 totalPending = 0;
        for(uint256 i = startEpoch; i < endEpoch; i++) {
            EarningsEpoch memory epoch = _ethEarningsEpochs[i];
            uint256 historicalShares = wsTokenManagement.balanceOfAt(account, songSharesId, epoch.timestamp);
            totalPending += (historicalShares * epoch.earningsPerShare) / PRECISION;
        }

        return totalPending;
    }

    function getPendingStablecoinEarnings(address account) external view returns (uint256) {
        uint256 shares = wsTokenManagement.balanceOf(account, songSharesId);
        if (shares == 0) return 0;

        EpochBalance storage userBalance = _userEpochBalances[account];
        uint256 startEpoch = userBalance.lastClaimedEpoch;
        uint256 endEpoch = _stablecoinEarningsEpochs.length;

        uint256 totalPending = 0;
        for(uint256 i = startEpoch; i < endEpoch; i++) {
            EarningsEpoch memory epoch = _stablecoinEarningsEpochs[i];
            uint256 historicalShares = wsTokenManagement.balanceOfAt(account, songSharesId, epoch.timestamp);
            totalPending += (historicalShares * epoch.earningsPerShare) / PRECISION;
        }

        return totalPending;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external pure override returns (bytes4) {
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
        address newMetadataAddress,
        address newWrappedSongAddress
    ) external {
        require(!migrated, "Contract already migrated");
        require(newWrappedSongAddress != address(0), "Invalid new wrapped song address");
        require(newMetadataAddress != address(0), "Invalid metadata address");
        require(address(wsTokenManagement) != address(0), "WSTokenManagement not set");

        require(
            protocolModule.isAuthorizedContract(msg.sender),
            "Caller not authorized"
        );

        // Mark as migrated first to prevent reentrancy
        migrated = true;

        // Transfer WSTokenManagement ownership
        wsTokenManagement.migrateWrappedSong( newMetadataAddress, newWrappedSongAddress);

        // Transfer any remaining stablecoin balance
        uint256 stablecoinBalance = stablecoin.balanceOf(address(this));
        
        if (stablecoinBalance > 0) {
            stablecoin.transfer(newWrappedSongAddress, stablecoinBalance);
        }

        // Transfer any remaining ETH balance
        uint256 remainingETH = address(this).balance;
        
        if (remainingETH > 0) {
            (bool success, ) = newWrappedSongAddress.call{value: remainingETH}("");
            if (!success) {
                revert("ETH transfer failed");
            }
        }

        emit ContractMigrated(newWrappedSongAddress);
    }

    // Add owner() override
    function owner() public view virtual override(Ownable, IWrappedSongSmartAccount) returns (address) {
        return super.owner();
    }

    // Add function to create ETH distribution epoch
    function createETHDistributionEpoch() external notMigrated {
        uint256 amount = ethBalance; // Use accumulated ETH
        require(amount > 0, "No ETH to distribute");
        
        uint256 totalShares = wsTokenManagement.totalSupply(songSharesId);
        require(totalShares > 0, "No shares exist");

        uint256 newEarningsPerShare = (amount * PRECISION) / totalShares;
        
        _ethEarningsEpochs.push(EarningsEpoch({
            epochId: _ethEarningsEpochs.length,
            amount: amount,
            earningsPerShare: newEarningsPerShare,
            timestamp: block.timestamp,
            sender: msg.sender
        }));

        emit EarningsEpochProcessed(
            _ethEarningsEpochs.length - 1,
            amount,
            newEarningsPerShare,
            true
        );
    }

    // Add function to create stablecoin distribution epoch
    function createStablecoinDistributionEpoch() external notMigrated {
        require(_pendingStablecoinEarnings > 0, "No new earnings to distribute");
        
        uint256 totalShares = wsTokenManagement.totalSupply(songSharesId);
        require(totalShares > 0, "No shares exist");

        uint256 newEarningsPerShare = (_pendingStablecoinEarnings * PRECISION) / totalShares;
        
        uint256 currentTotalAmount = _stablecoinEarningsEpochs.length > 0 
            ? _stablecoinEarningsEpochs[_stablecoinEarningsEpochs.length - 1].amount + _pendingStablecoinEarnings
            : _pendingStablecoinEarnings;
        
        _stablecoinEarningsEpochs.push(EarningsEpoch({
            epochId: _stablecoinEarningsEpochs.length,
            amount: currentTotalAmount,
            earningsPerShare: newEarningsPerShare,
            timestamp: block.timestamp,
            sender: msg.sender
        }));

        emit EarningsEpochProcessed(
            _stablecoinEarningsEpochs.length - 1,
            _pendingStablecoinEarnings,
            newEarningsPerShare,
            false
        );

        _pendingStablecoinEarnings = 0;
    }

    // Add getter for pending earnings
    function getPendingStablecoinDistribution() external view returns (uint256) {
        return _pendingStablecoinEarnings;
    }

    // Add explicit getter functions
    function ethEarningsEpochs(uint256 index) external view returns (IWrappedSongTypes.EarningsEpoch memory) {
        EarningsEpoch storage epoch = _ethEarningsEpochs[index];
        return IWrappedSongTypes.EarningsEpoch({
            epochId: epoch.epochId,
            amount: epoch.amount,
            earningsPerShare: epoch.earningsPerShare,
            timestamp: epoch.timestamp,
            sender: epoch.sender
        });
    }

    function stablecoinEarningsEpochs(uint256 index) external view returns (IWrappedSongTypes.EarningsEpoch memory) {
        EarningsEpoch storage epoch = _stablecoinEarningsEpochs[index];
        return IWrappedSongTypes.EarningsEpoch({
            epochId: epoch.epochId,
            amount: epoch.amount,
            earningsPerShare: epoch.earningsPerShare,
            timestamp: epoch.timestamp,
            sender: epoch.sender
        });
    }

    function userEpochBalances(address user) external view returns (IWrappedSongTypes.EpochBalance memory) {
        return IWrappedSongTypes.EpochBalance({
            lastClaimedEpoch: _userEpochBalances[user].lastClaimedEpoch,
            lastClaimedETHEpoch: _userEpochBalances[user].lastClaimedETHEpoch
        });
    }

}
