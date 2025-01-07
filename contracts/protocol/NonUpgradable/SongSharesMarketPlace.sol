// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';
import './../Interfaces/IWSTokenManagement.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IWrappedSongSmartAccount.sol';
import './../Interfaces/IFeesModule.sol';
import './../Interfaces/IRegistryModule.sol';
contract SongSharesMarketPlace is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    uint256 private constant MAX_SHARES_LIMIT = 100_000_000; // Maximum of 100 million shares
    uint256 private constant PRICE_CEILING = 1e40;  // Prevent overflow in price calculations

    IProtocolModule public immutable protocolModule;
    IFeesModule public feesModule;
    struct Sale {
        bool active;
        address seller;
        uint256 sharesForSale;
        uint256 pricePerShare;
        uint256 maxSharesPerWallet;
        uint256 totalSold;
        address stableCoin;
    }

    mapping(address => Sale) public sales; // wrappedSong => Sale
    mapping(address => mapping(address => uint256)) public buyerPurchases; // wrappedSong => buyer => amount
    mapping(address => uint256) public saleStartTimes;
    mapping(address => uint256) public accumulatedFunds;

    event SharesSaleStarted(
        address indexed wrappedSong,
        address indexed owner,
        uint256 amount,
        uint256 price,
        uint256 maxSharesPerWallet,
        address stableCoinAddress
    );
    
    event SharesSold(
        address indexed wrappedSong,
        address indexed buyer,
        address indexed recipient,
        uint256 amount,
        uint256 totalCost,
        address paymentToken
    );
    
    event SharesSaleEnded(
        address indexed wrappedSong
    );
    
    event FundsWithdrawn(
        address indexed wrappedSong,
        address indexed to,
        uint256 amount
    );
    
    event ERC20Received(
        address indexed wrappedSong,
        address token,
        uint256 amount,
        address sender
    );

    constructor(address _protocolModule) Ownable(msg.sender) {
        protocolModule = IProtocolModule(_protocolModule);
    }

    modifier onlyWrappedSongOwner(address wrappedSong) {
        require(
            IWrappedSongSmartAccount(wrappedSong).owner() == msg.sender,
            "Not wrapped song owner"
        );
        _;
    }

    modifier onlyVerifiedWSToken(address wrappedSong) {
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        require(
            protocolModule.isWSTokenFromProtocol(wsTokenManagement),
            "Not a verified protocol WSToken"
        );
        _;
    }

    function startSale(
        address wrappedSong,
        uint256 amount,
        uint256 price,
        uint256 maxShares,
        address _stableCoin
    ) external payable whenNotPaused onlyWrappedSongOwner(wrappedSong) onlyVerifiedWSToken(wrappedSong) {
        feesModule = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule()).feesModule();
        require(msg.value >= feesModule.getStartSaleFee(), "Insufficient start sale fee");

        require(wrappedSong != address(0), "Invalid wrapped song address");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= MAX_SHARES_LIMIT, "Amount exceeds maximum limit");
        require(price <= PRICE_CEILING, "Price exceeds maximum limit");
        require(maxShares <= amount, "Max shares per wallet less than total");

        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        uint256 balance = IWSTokenManagement(wsTokenManagement).balanceOf(msg.sender, 1);
        require(balance >= amount, "Insufficient shares");
        require(!sales[wrappedSong].active, "Sale already active");

        if (_stableCoin != address(0)) {
            require(
                protocolModule.isTokenWhitelisted(_stableCoin),
                "Stablecoin is not whitelisted"
            );
            require(
                _stableCoin.code.length > 0,
                "Invalid stablecoin address"
            );
        }

        if (price > 0) {
            require(price <= type(uint256).max / amount, "Price overflow check");
        }
        
        saleStartTimes[wrappedSong] = block.timestamp;
        
        sales[wrappedSong] = Sale({
            active: true,
            seller: msg.sender,
            sharesForSale: amount,
            pricePerShare: price,
            maxSharesPerWallet: maxShares,
            totalSold: 0,
            stableCoin: _stableCoin
        });
        
        emit SharesSaleStarted(
            wrappedSong,
            msg.sender,
            amount,
            price,
            maxShares,
            _stableCoin
        );

        (bool success, ) = payable(address(protocolModule)).call{value: msg.value}("");
        require(success, "Fee transfer failed");
    }

    function buyShares(
        address wrappedSong,
        uint256 amount,
        address recipient
    ) external payable whenNotPaused nonReentrant {
        require(wrappedSong != address(0) && recipient != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        
        Sale storage sale = sales[wrappedSong];
        require(sale.active, "No active sale");
        require(
            block.timestamp <= saleStartTimes[wrappedSong] + protocolModule.maxSaleDuration(),
            "Sale expired"
        );
        require(amount <= sale.sharesForSale, "Not enough shares available");

        uint256 totalCost = amount * sale.pricePerShare;
        if (sale.pricePerShare > 0) {
            require(totalCost / amount == sale.pricePerShare, "Price calculation overflow");
        }

        uint256 newPurchaseTotal = buyerPurchases[wrappedSong][recipient] + amount;
        require(
            newPurchaseTotal >= buyerPurchases[wrappedSong][recipient],
            "Purchase amount overflow"
        );
        
        if (sale.maxSharesPerWallet > 0) {
            require(
                newPurchaseTotal <= sale.maxSharesPerWallet,
                "Exceeds maximum shares per wallet"
            );
        }

        sale.sharesForSale -= amount;
        sale.totalSold += amount;
        buyerPurchases[wrappedSong][recipient] = newPurchaseTotal;

        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();

        if (sale.stableCoin != address(0)) {
            require(msg.value == 0, "ETH not accepted for stable coin sale");
            IERC20(sale.stableCoin).safeTransferFrom(msg.sender, address(this), totalCost);
            accumulatedFunds[wrappedSong] += totalCost;
        } else {
            require(msg.value == totalCost, "Incorrect ETH amount");
            accumulatedFunds[wrappedSong] += msg.value;
        }

        IWSTokenManagement(wsTokenManagement).safeTransferFrom(
            sale.seller,
            recipient,
            1, // tokenId for shares
            amount,
            ""
        );

        if (sale.sharesForSale == 0) {
            sale.active = false;
            emit SharesSaleEnded(wrappedSong);
        }

        emit SharesSold(wrappedSong, msg.sender, recipient, amount, totalCost, sale.stableCoin);
    }

    function endSale(
        address wrappedSong
    ) external onlyWrappedSongOwner(wrappedSong) onlyVerifiedWSToken(wrappedSong) {
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        Sale storage sale = sales[wrappedSong];
        require(sale.active, "No active sale");
        require(sale.seller == msg.sender, "Not sale creator");
        
        sale.active = false;
        emit SharesSaleEnded(wrappedSong);
    }

    function withdrawFunds(
        address wrappedSong
    ) external nonReentrant onlyWrappedSongOwner(wrappedSong) onlyVerifiedWSToken(wrappedSong) {
        uint256 amount = accumulatedFunds[wrappedSong];
        require(amount > 0, "No funds to withdraw");
        
        address stableCoin = sales[wrappedSong].stableCoin;
        address payable recipient = payable(msg.sender);
        
        // Calculate protocol fee
        feesModule = IRegistryModule(IProtocolModule(protocolModule).getRegistryModule()).feesModule();
        uint256 feePercentage = feesModule.getWithdrawalFeePercentage();
        uint256 protocolFee = (amount * feePercentage) / 10000; //TODO: change to Amount of tokens
        uint256 userAmount = amount - protocolFee;
        
        accumulatedFunds[wrappedSong] = 0;

        if (stableCoin != address(0)) {
            require(
                IERC20(stableCoin).balanceOf(address(this)) >= amount,
                "Insufficient contract balance"
            );
            // Transfer user amount
            IERC20(stableCoin).safeTransfer(recipient, userAmount);
            // Transfer protocol fee
            if (protocolFee > 0) {
                IERC20(stableCoin).safeTransfer(protocolModule.getStablecoinFeeReceiver(), protocolFee);
            }
        } else {
            require(address(this).balance >= amount, "Insufficient ETH balance");
            // Transfer user amount
            (bool successUser, ) = recipient.call{value: userAmount}("");
            require(successUser, "ETH transfer to user failed");
            // Transfer protocol fee
            if (protocolFee > 0) {
                (bool successProtocol, ) = address(protocolModule).call{value: protocolFee}("");
                require(successProtocol, "ETH transfer to protocol failed");
            }
        }
        
        emit FundsWithdrawn(wrappedSong, recipient, userAmount);
        if (protocolFee > 0) {
            emit FundsWithdrawn(wrappedSong, protocolModule.getStablecoinFeeReceiver(), protocolFee);
        }
    }

    function getSale(
        address wrappedSong
    ) external view returns (Sale memory) {
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        return sales[wrappedSong];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function isApprovedForShares(
        address wrappedSong, 
        address seller
    ) public view returns (bool) {
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        return IWSTokenManagement(wsTokenManagement).isApprovedForAll(seller, address(this));
    }

    function isSaleExpired(
        address wrappedSong
    ) public view returns (bool) {
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        return block.timestamp > saleStartTimes[wrappedSong] + protocolModule.maxSaleDuration();
    }

    receive() external payable {}
} 