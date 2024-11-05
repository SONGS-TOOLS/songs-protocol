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

    mapping(address => Sale) public sales; // wsTokenManagement => Sale
    mapping(address => uint256) public saleStartTimes;
    mapping(address => uint256) public accumulatedFunds;

    event BuyoutSaleStarted(
        address indexed wsTokenManagement,
        address indexed owner,
        uint256 amount,
        uint256 price,
        address stableCoinAddress
    );
    
    event BuyoutTokenSold(
        address indexed wsTokenManagement,
        address indexed buyer,
        address indexed recipient,
        uint256 amount,
        uint256 totalCost,
        address paymentToken
    );
    
    event BuyoutSaleEnded(
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
        require(_protocolModule != address(0) && _protocolModule.code.length > 0, "Invalid protocol");
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
        require(
            protocolModule.isWSTokenFromProtocol(wsTokenManagement),
            "Not a verified protocol WSToken"
        );
        _;
    }

    function startSale(
        address wsTokenManagement,
        uint256 amount,
        uint256 price,
        address _stableCoin
    ) external whenNotPaused onlyWrappedSongOwner(wsTokenManagement) onlyVerifiedWSToken(wsTokenManagement) {
        require(amount > 0 && price > 0, "Invalid sale parameters");
        require(price <= type(uint256).max / amount, "Price too high");
        
        require(
            IWSTokenManagement(wsTokenManagement).balanceOf(msg.sender, 2) >= amount,
            "Insufficient buyout tokens"
        );
        require(
            IWSTokenManagement(wsTokenManagement).isApprovedForAll(msg.sender, address(this)),
            "MarketPlace not approved to transfer tokens"
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
            tokensForSale: amount,
            pricePerToken: price,
            totalSold: 0,
            stableCoin: _stableCoin
        });
        
        emit BuyoutSaleStarted(
            wsTokenManagement,
            msg.sender,
            amount,
            price,
            _stableCoin
        );
    }

    function buyToken(
        address wsTokenManagement,
        uint256 amount,
        address recipient
    ) external payable whenNotPaused nonReentrant onlyVerifiedWSToken(wsTokenManagement) {
        require(recipient != address(0), "Invalid recipient address");
        Sale storage sale = sales[wsTokenManagement];
        require(sale.active, "No active sale");
        require(
            block.timestamp <= saleStartTimes[wsTokenManagement] + protocolModule.maxSaleDuration(),
            "Sale expired"
        );
        require(amount > 0, "Amount must be greater than 0");
        require(sale.tokensForSale >= amount, "Not enough tokens available");
        require(
            IWSTokenManagement(wsTokenManagement).isApprovedForAll(sale.seller, address(this)),
            "MarketPlace approval revoked"
        );

        uint256 totalCost = amount * sale.pricePerToken;
        require(totalCost / amount == sale.pricePerToken, "Overflow check");

        if (sale.stableCoin != address(0)) {
            require(msg.value == 0, "ETH not accepted for stable coin sale");
            IERC20(sale.stableCoin).safeTransferFrom(msg.sender, address(this), totalCost);
            accumulatedFunds[wsTokenManagement] += totalCost;
            emit ERC20Received(wsTokenManagement, sale.stableCoin, totalCost, msg.sender);
        } else {
            require(msg.value == totalCost, "Incorrect ETH amount");
            accumulatedFunds[wsTokenManagement] += msg.value;
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
            emit BuyoutSaleEnded(wsTokenManagement);
        }

        emit BuyoutTokenSold(wsTokenManagement, msg.sender, recipient, amount, totalCost, sale.stableCoin);
    }

    function endSale(
        address wsTokenManagement
    ) external onlyWrappedSongOwner(wsTokenManagement) onlyVerifiedWSToken(wsTokenManagement) {
        Sale storage sale = sales[wsTokenManagement];
        require(sale.active, "No active sale");
        require(sale.seller == msg.sender, "Not sale creator");
        
        sale.active = false;
        emit BuyoutSaleEnded(wsTokenManagement);
    }

    function withdrawFunds(
        address wsTokenManagement
    ) external 
        nonReentrant 
        onlyWrappedSongOwner(wsTokenManagement) 
        onlyVerifiedWSToken(wsTokenManagement) 
    {
        uint256 amount = accumulatedFunds[wsTokenManagement];
        require(amount > 0, "No funds to withdraw");
        
        address stableCoin = sales[wsTokenManagement].stableCoin;
        address payable recipient = payable(msg.sender);
        
        // Update state before external calls
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
        address wsTokenManagement
    ) external view returns (Sale memory) {
        return sales[wsTokenManagement];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Helper functions
    function isApprovedForTokens(
        address wsTokenManagement, 
        address seller
    ) public view returns (bool) {
        return IWSTokenManagement(wsTokenManagement).isApprovedForAll(seller, address(this));
    }

    function isSaleExpired(
        address wsTokenManagement
    ) public view returns (bool) {
        return block.timestamp > saleStartTimes[wsTokenManagement] + protocolModule.maxSaleDuration();
    }

    receive() external payable {}
} 