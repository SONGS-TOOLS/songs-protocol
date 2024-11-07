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

contract BuyoutTokenMarketPlace is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IProtocolModule public immutable protocolModule;
    
    struct Sale {
        bool active;
        address seller;
        uint256 tokensForSale;
        uint256 pricePerToken;
        uint256 totalSold;
        address stableCoin;
    }

    mapping(address => Sale) public sales; // wrappedSong => Sale
    mapping(address => uint256) public saleStartTimes;
    mapping(address => uint256) public accumulatedFunds;

    event BuyoutSaleStarted(
        address indexed wrappedSong,
        address indexed owner,
        uint256 amount,
        uint256 price,
        address stableCoinAddress
    );
    
    event BuyoutTokenSold(
        address indexed wrappedSong,
        address indexed buyer,
        address indexed recipient,
        uint256 amount,
        uint256 totalCost,
        address paymentToken
    );
    
    event BuyoutSaleEnded(
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
        address _stableCoin
    ) external whenNotPaused onlyWrappedSongOwner(wrappedSong) onlyVerifiedWSToken(wrappedSong) {
        require(amount > 0 && price > 0, "Invalid sale parameters");
        require(price <= type(uint256).max / amount, "Price too high");
        
        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();
        require(
            IWSTokenManagement(wsTokenManagement).balanceOf(msg.sender, 2) >= amount,
            "Insufficient buyout tokens"
        );

        require(!sales[wrappedSong].active, "Sale already active");

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
        
        saleStartTimes[wrappedSong] = block.timestamp;
        
        sales[wrappedSong] = Sale({
            active: true,
            seller: msg.sender,
            tokensForSale: amount,
            pricePerToken: price,
            totalSold: 0,
            stableCoin: _stableCoin
        });
        
        emit BuyoutSaleStarted(
            wrappedSong,
            msg.sender,
            amount,
            price,
            _stableCoin
        );
    }

    function buyToken(
        address wrappedSong,
        uint256 amount,
        address recipient
    ) external payable whenNotPaused nonReentrant onlyVerifiedWSToken(wrappedSong) {
        require(recipient != address(0), "Invalid recipient address");
        
        Sale storage sale = sales[wrappedSong];
        require(sale.active, "No active sale");
        require(
            block.timestamp <= saleStartTimes[wrappedSong] + protocolModule.maxSaleDuration(),
            "Sale expired"
        );
        require(amount > 0, "Amount must be greater than 0");
        require(sale.tokensForSale >= amount, "Not enough tokens available");

        uint256 totalCost = amount * sale.pricePerToken;
        require(totalCost / amount == sale.pricePerToken, "Overflow check");

        address wsTokenManagement = IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress();

        if (sale.stableCoin != address(0)) {
            require(msg.value == 0, "ETH not accepted for stable coin sale");
            IERC20(sale.stableCoin).safeTransferFrom(msg.sender, address(this), totalCost);
            accumulatedFunds[wrappedSong] += totalCost;
            emit ERC20Received(wrappedSong, sale.stableCoin, totalCost, msg.sender);
        } else {
            require(msg.value == totalCost, "Incorrect ETH amount");
            accumulatedFunds[wrappedSong] += msg.value;
        }

        sale.tokensForSale -= amount;
        sale.totalSold += amount;

        IWSTokenManagement(wsTokenManagement).safeTransferFrom(
            sale.seller,
            recipient,
            2, // tokenId for buyout
            amount,
            ""
        );

        if (sale.tokensForSale == 0) {
            sale.active = false;
            emit BuyoutSaleEnded(wrappedSong);
        }

        emit BuyoutTokenSold(wrappedSong, msg.sender, recipient, amount, totalCost, sale.stableCoin);
    }

    function endSale(
        address wrappedSong
    ) external onlyWrappedSongOwner(wrappedSong) onlyVerifiedWSToken(wrappedSong) {
        Sale storage sale = sales[wrappedSong];
        require(sale.active, "No active sale");
        require(sale.seller == msg.sender, "Not sale creator");
        
        sale.active = false;
        emit BuyoutSaleEnded(wrappedSong);
    }

    function withdrawFunds(
        address wrappedSong
    ) external 
        nonReentrant 
        onlyWrappedSongOwner(wrappedSong) 
        onlyVerifiedWSToken(wrappedSong) 
    {
        uint256 amount = accumulatedFunds[wrappedSong];
        require(amount > 0, "No funds to withdraw");
        
        address stableCoin = sales[wrappedSong].stableCoin;
        address payable recipient = payable(msg.sender);
        
        // Update state before external calls
        accumulatedFunds[wrappedSong] = 0;

        if (stableCoin != address(0)) {
            require(IERC20(stableCoin).balanceOf(address(this)) >= amount, "Insufficient contract balance");
            IERC20(stableCoin).safeTransfer(recipient, amount);
        } else {
            require(address(this).balance >= amount, "Insufficient ETH balance");
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "ETH transfer failed");
        }
        
        emit FundsWithdrawn(wrappedSong, recipient, amount);
    }

    function getSale(
        address wrappedSong
    ) external view returns (Sale memory) {
        return sales[wrappedSong];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Helper functions
    function isApprovedForTokens(
        address wrappedSong, 
        address seller
    ) public view returns (bool) {
        return IWSTokenManagement(IWrappedSongSmartAccount(wrappedSong).getWSTokenManagementAddress()).isApprovedForAll(seller, address(this));
    }

    function isSaleExpired(
        address wrappedSong
    ) public view returns (bool) {
        return block.timestamp > saleStartTimes[wrappedSong] + protocolModule.maxSaleDuration();
    }

    receive() external payable {}
} 