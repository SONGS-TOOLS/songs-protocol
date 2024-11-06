// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';
import './../Interfaces/IWSTokensManagement.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/IWrappedSongSmartAccount.sol';

contract SongSharesMarketPlace is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IProtocolModule public immutable protocolModule;
    
    struct Sale {
        bool active;
        address seller;
        uint256 sharesForSale;
        uint256 pricePerShare;
        uint256 maxSharesPerWallet;
        uint256 totalSold;
        address stableCoin;
    }

    mapping(address => Sale) public sales; // wsTokenManagement => Sale
    mapping(address => mapping(address => uint256)) public buyerPurchases; // wsTokenManagement => buyer => amount
    mapping(address => uint256) public saleStartTimes;
    mapping(address => uint256) public accumulatedFunds;

    event SharesSaleStarted(
        address indexed wsTokenManagement,
        address indexed owner,
        uint256 amount,
        uint256 price,
        uint256 maxSharesPerWallet,
        address stableCoinAddress
    );
    
    event SharesSold(
        address indexed wsTokenManagement,
        address indexed buyer,
        address indexed recipient,
        uint256 amount,
        uint256 totalCost,
        address paymentToken
    );
    
    event SharesSaleEnded(
        address indexed wsTokenManagement
    );
    
    event FundsWithdrawn(
        address indexed wsTokenManagement,
        address indexed to,
        uint256 amount
    );
    
    event ERC20Received(
        address indexed wsTokenManagement,
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
    ) external whenNotPaused onlyWrappedSongOwner(wrappedSong) onlyVerifiedWSToken(wrappedSong) {
        
        require(amount > 0 && price > 0, "Invalid sale parameters");
        require(price <= type(uint256).max / amount, "Price too high");
        require(maxShares <= amount, "Max shares per wallet exceeds total");

        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        require(
            IWSTokensManagement(wsTokenManagement).balanceOf(msg.sender, 1) >= amount,
            "Insufficient shares"
        );
        require(!sales[wsTokenManagement].active, "Sale already active");

        if (_stableCoin != address(0)) {
            require(
                protocolModule.isTokenWhitelisted(_stableCoin),
                "Stablecoin is not whitelisted"
            );
            require(
                _stableCoin.code.length > 0 && IERC20(_stableCoin).totalSupply() > 0,
                "Invalid ERC20 token"
            );
        }
        
        saleStartTimes[wsTokenManagement] = block.timestamp;
        
        sales[wsTokenManagement] = Sale({
            active: true,
            seller: msg.sender,
            sharesForSale: amount,
            pricePerShare: price,
            maxSharesPerWallet: maxShares,
            totalSold: 0,
            stableCoin: _stableCoin
        });
        
        emit SharesSaleStarted(
            wsTokenManagement,
            msg.sender,
            amount,
            price,
            maxShares,
            _stableCoin
        );
    }

    function buyShares(
        address wrappedSong,
        uint256 amount,
        address recipient
    ) external payable whenNotPaused nonReentrant onlyVerifiedWSToken(wrappedSong) {
        require(recipient != address(0), "Invalid recipient address");
        
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();

        Sale storage sale = sales[wsTokenManagement];
        require(sale.active, "No active sale");
        require(
            block.timestamp <= saleStartTimes[wsTokenManagement] + protocolModule.maxSaleDuration(),
            "Sale expired"
        );
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= sale.sharesForSale, "Not enough shares available");

        uint256 totalCost = amount * sale.pricePerShare;
        require(totalCost / amount == sale.pricePerShare, "Overflow check");

        uint256 newPurchaseTotal = buyerPurchases[wsTokenManagement][recipient] + amount;
        if (sale.maxSharesPerWallet > 0) {
            require(
                newPurchaseTotal <= sale.maxSharesPerWallet,
                "Exceeds maximum shares per wallet"
            );
        }

        if (sale.stableCoin != address(0)) {
            require(msg.value == 0, "ETH not accepted for stable coin sale");
            IERC20(sale.stableCoin).safeTransferFrom(msg.sender, address(this), totalCost);
            accumulatedFunds[wsTokenManagement] += totalCost;
            emit ERC20Received(wsTokenManagement, sale.stableCoin, totalCost, msg.sender);
        } else {
            require(msg.value == totalCost, "Incorrect ETH amount");
            accumulatedFunds[wsTokenManagement] += msg.value;
        }

        sale.sharesForSale -= amount;
        sale.totalSold += amount;
        buyerPurchases[wsTokenManagement][recipient] = newPurchaseTotal;

        IWSTokensManagement(wsTokenManagement).safeTransferFrom(
            sale.seller,
            recipient,
            1, // tokenId for shares
            amount,
            ""
        );

        if (sale.sharesForSale == 0) {
            sale.active = false;
            emit SharesSaleEnded(wsTokenManagement);
        }

        emit SharesSold(wsTokenManagement, msg.sender, recipient, amount, totalCost, sale.stableCoin);
    }

    function endSale(
        address wrappedSong
    ) external onlyWrappedSongOwner(wrappedSong) onlyVerifiedWSToken(wrappedSong) {
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        Sale storage sale = sales[wsTokenManagement];
        require(sale.active, "No active sale");
        require(sale.seller == msg.sender, "Not sale creator");
        
        sale.active = false;
        emit SharesSaleEnded(wsTokenManagement);
    }

    function withdrawFunds(
        address wrappedSong
    ) external nonReentrant onlyWrappedSongOwner(wrappedSong) onlyVerifiedWSToken(wrappedSong) {
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        uint256 amount = accumulatedFunds[wsTokenManagement];
        require(amount > 0, "No funds to withdraw");
        
        address stableCoin = sales[wsTokenManagement].stableCoin;
        address payable recipient = payable(msg.sender);
        
        accumulatedFunds[wsTokenManagement] = 0;

        if (stableCoin != address(0)) {
            require(IERC20(stableCoin).balanceOf(address(this)) >= amount, "Insufficient contract balance");
            IERC20(stableCoin).safeTransfer(recipient, amount);
        } else {
            require(address(this).balance >= amount, "Insufficient ETH balance");
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "ETH transfer failed");
        }
        
        emit FundsWithdrawn(wsTokenManagement, recipient, amount);
    }

    function getSale(
        address wrappedSong
    ) external view returns (Sale memory) {
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        return sales[wsTokenManagement];
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
        return IWSTokensManagement(wsTokenManagement).isApprovedForAll(seller, address(this));
    }

    function isSaleExpired(
        address wrappedSong
    ) public view returns (bool) {
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        return block.timestamp > saleStartTimes[wsTokenManagement] + protocolModule.maxSaleDuration();
    }

    receive() external payable {}
} 