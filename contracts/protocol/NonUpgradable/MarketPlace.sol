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

contract MarketPlace is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IProtocolModule public immutable protocolModule;
    struct Sale {
        address seller;
        uint256 tokenId;
        uint256 sharesForSale;
        uint256 pricePerShare;
        uint256 maxSharesPerWallet;
        address stableCoin;
        bool active;
        uint256 totalSold;
        mapping(address => uint256) buyerPurchases;
    }

    // Simplified mappings - remove saleId
    mapping(address => Sale) public sales;
    // Remove these as they're no longer needed
    // mapping(address => uint256) public currentSaleId;
    // mapping(address => uint256) public totalSales;
    
    // Update saleStartTimes mapping
    mapping(address => uint256) public saleStartTimes;

    // wsTokenManagement => accumulated funds
    mapping(address => mapping(address => uint256)) public accumulatedFunds;

    // Add mapping to track verified WSTokenManagement contracts
    mapping(address => bool) public isVerifiedWSToken;

    event SharesSaleStarted(
        address indexed wsTokenManagement,
        address indexed owner,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 maxSharesPerWallet,
        address stableCoinAddress
    );
    event SharesSold(
        address indexed wsTokenManagement,
        uint256 tokenId,
        address buyer,
        uint256 amount
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

    // Add reentrancy guard for all fund movements
    mapping(address => mapping(address => bool)) private withdrawalInProgress;

    // Add emergency withdrawal function for contract owner
    event EmergencyWithdrawal(address indexed token, address indexed to, uint256 amount);

    constructor(address _protocolModule) Ownable(msg.sender) {
        protocolModule = IProtocolModule(_protocolModule);
    }

    modifier onlyWrappedSongOwner(address wsTokenManagement) {
        require(
            IWrappedSongSmartAccount(wsTokenManagement).owner() == msg.sender,
            "Not wrapped song owner"
        );
        _;
    }

    modifier onlyVerifiedWSToken(address wsTokenManagement) {
        require(isVerifiedWSToken[wsTokenManagement], "Not a verified protocol WSToken");
        _;
    }

    // Add function to verify WSToken through its WrappedSongSmartAccount
    function verifyWSToken(address wrappedSongAddress) external {
        // Get WSTokenManagement address from WrappedSongSmartAccount
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSongAddress).getWSTokenManagementAddress();
        
        // Verify that the WrappedSongSmartAccount is from our protocol
        require(
            protocolModule.isReleased(wrappedSongAddress) || 
            IWrappedSongSmartAccount(wrappedSongAddress).owner() != address(0),
            "Not a valid protocol wrapped song"
        );

        isVerifiedWSToken[wsTokenManagement] = true;
    }

    function startSharesSale(
        address wsTokenManagement,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 maxShares,
        address _stableCoin
    ) external whenNotPaused onlyWrappedSongOwner(wsTokenManagement) onlyVerifiedWSToken(wsTokenManagement) {
        require(amount > 0 && price > 0, "Invalid sale parameters");
        
        // Check both balance and allowance for specific tokenId
        require(
            IWSTokenManagement(wsTokenManagement).balanceOf(msg.sender, tokenId) >= amount,
            "Insufficient shares"
        );
        require(
            IWSTokenManagement(wsTokenManagement).isApprovedForAll(msg.sender, address(this)),
            "MarketPlace not approved to transfer shares"
        );

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

        Sale storage newSale = sales[wsTokenManagement];
        require(!newSale.active, "Sale already active for this token");
        
        saleStartTimes[wsTokenManagement] = block.timestamp;
        
        newSale.seller = msg.sender;
        newSale.tokenId = tokenId;
        newSale.sharesForSale = amount;
        newSale.pricePerShare = price;
        newSale.maxSharesPerWallet = maxShares;
        newSale.stableCoin = _stableCoin;
        newSale.active = true;
        newSale.totalSold = 0;

        emit SharesSaleStarted(
            wsTokenManagement,
            msg.sender,
            tokenId,
            amount,
            price,
            maxShares,
            _stableCoin
        );
    }

    function buyShares(
        address wsTokenManagement,
        uint256 amount
    ) external payable whenNotPaused nonReentrant onlyVerifiedWSToken(wsTokenManagement) {
        Sale storage sale = sales[wsTokenManagement];
        require(sale.active, "No active sale");
        require(
            block.timestamp <= saleStartTimes[wsTokenManagement] + protocolModule.maxSaleDuration(),
            "Sale expired"
        );
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= sale.sharesForSale, "Not enough shares available");

        uint256 totalCost = amount * sale.pricePerShare;
        uint256 newPurchaseTotal = sale.buyerPurchases[msg.sender] + amount;

        if (sale.maxSharesPerWallet > 0) {
            require(
                newPurchaseTotal <= sale.maxSharesPerWallet,
                "Exceeds maximum shares per wallet"
            );
        }

        if (sale.stableCoin != address(0)) {
            require(msg.value == 0, "ETH not accepted for stable coin sale");
            IERC20(sale.stableCoin).safeTransferFrom(msg.sender, address(this), totalCost);
            accumulatedFunds[wsTokenManagement][sale.stableCoin] += totalCost;
            emit ERC20Received(wsTokenManagement, sale.stableCoin, totalCost, msg.sender);
        } else {
            require(msg.value == totalCost, "Incorrect ETH amount");
            accumulatedFunds[wsTokenManagement][address(0)] += msg.value;
        }

        sale.sharesForSale -= amount;
        sale.totalSold += amount;
        sale.buyerPurchases[msg.sender] = newPurchaseTotal;

        IWSTokenManagement(wsTokenManagement).safeTransferFrom(
            sale.seller,
            msg.sender,
            sale.tokenId,
            amount,
            ""
        );

        if (sale.sharesForSale == 0) {
            sale.active = false;
            emit SharesSaleEnded(wsTokenManagement);
        }

        emit SharesSold(wsTokenManagement, sale.tokenId, msg.sender, amount);
    }

    function endSharesSale(
        address wsTokenManagement
    ) external onlyWrappedSongOwner(wsTokenManagement) onlyVerifiedWSToken(wsTokenManagement) {
        Sale storage sale = sales[wsTokenManagement];
        require(sale.active, "No active sale");
        require(sale.seller == msg.sender, "Not sale creator");
        
        sale.active = false;
        emit SharesSaleEnded(wsTokenManagement);
    }


    // TODO: Triple Check
    function withdrawFunds(
        address wsTokenManagement,
        address token
    ) external 
        nonReentrant 
        onlyWrappedSongOwner(wsTokenManagement) 
        onlyVerifiedWSToken(wsTokenManagement) 
    {
        uint256 amount = accumulatedFunds[wsTokenManagement][token];
        require(amount > 0, "No funds to withdraw");

        // Update state before external calls
        accumulatedFunds[wsTokenManagement][token] = 0;

        // Use pull pattern for withdrawals
        if (token == address(0)) {
            (bool success, ) = msg.sender.call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(msg.sender, amount);
        }

        emit FundsWithdrawn(wsTokenManagement, msg.sender, amount);
    }

    function getSale(
        address wsTokenManagement
    ) external view returns (
        address seller,
        uint256 tokenId,
        uint256 sharesForSale,
        uint256 pricePerShare,
        uint256 maxSharesPerWallet,
        address stableCoin,
        bool active,
        uint256 totalSold
    ) {
        Sale storage sale = sales[wsTokenManagement];
        return (
            sale.seller,
            sale.tokenId,
            sale.sharesForSale,
            sale.pricePerShare,
            sale.maxSharesPerWallet,
            sale.stableCoin,
            sale.active,
            sale.totalSold
        );
    }

    function getBuyerPurchases(
        address wsTokenManagement,
        address buyer
    ) external view returns (uint256) {
        return sales[wsTokenManagement].buyerPurchases[buyer];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Add function to remove verification if needed
    function removeWSTokenVerification(address wsTokenManagement) external onlyOwner {
        isVerifiedWSToken[wsTokenManagement] = false;
    }

    receive() external payable {}

    // Add helper function to check approval status
    function isApprovedForShares(address wsTokenManagement, address seller) public view returns (bool) {
        return IWSTokenManagement(wsTokenManagement).isApprovedForAll(seller, address(this));
    }

    // Add function to check if a sale has expired
    function isSaleExpired(
        address wsTokenManagement
    ) public view returns (bool) {
        return block.timestamp > saleStartTimes[wsTokenManagement] + protocolModule.maxSaleDuration();
    }
}