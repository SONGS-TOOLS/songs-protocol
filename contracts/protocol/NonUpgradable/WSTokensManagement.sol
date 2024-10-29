// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './../Interfaces/IMetadataModule.sol';
import './../Interfaces/IProtocolModule.sol';

contract WSTokenManagement is ERC1155Supply, Ownable, ReentrancyGuard {
  using SafeERC20 for IERC20;

  uint256 private _currentTokenId;
  address private immutable _minter;

  mapping(uint256 => string) private _tokenURIs;

  uint256 public constant SONG_CONCEPT_ID = 0;
  uint256 public constant SONG_SHARES_ID = 1;

  
  uint256 public sharesForSale;
  uint256 public pricePerShare;
  bool public saleActive;
  uint256 public totalShares;

  uint256 public maxSharesPerWallet;
  IERC20 public stableCoin;
  IMetadataModule public metadataModule;
  IProtocolModule public protocolModule;

  string private _baseURI;

  event WSTokensCreated(address indexed smartAccount, address indexed minter);
  event SharesSaleStarted(
    uint256 amount,
    uint256 price,
    address indexed owner,
    uint256 maxSharesPerWallet,
    address stableCoinAddress
  );
  event SharesSold(address buyer, uint256 amount);
  event SharesSaleEnded();
  event FundsWithdrawn(address indexed to, uint256 amount);
  event ERC20Received(address token, uint256 amount, address sender);
  event MetadataUpdated(string newMetadata);

  modifier onlyMinter() {
    require(msg.sender == _minter, 'Caller is not the minter');
    _;
  }

  modifier onlyMetadataModule() {
    require(
      msg.sender == address(metadataModule),
      'Only MetadataModule can update token URIs'
    );
    _;
  }

  constructor(
    address _smartAccountAddress,
    address _minterAddress,
    address _metadataModuleAddress,
    address _protocolModuleAddress
  ) ERC1155('') Ownable(_smartAccountAddress) {
    _minter = _minterAddress;
    _currentTokenId = 0;
    metadataModule = IMetadataModule(_metadataModuleAddress);
    protocolModule = IProtocolModule(_protocolModuleAddress);
    emit WSTokensCreated(_smartAccountAddress, _minterAddress);
  }

  /**
   * @dev Creates a new song concept NFT and fungible shares for it.
   * @param sharesAmount The total amount of shares to create.
   */
  function createSongTokens(
    uint256 sharesAmount
  ) public onlyOwner {
    // Create song concept NFT to the WrappedSongSmartAccount
    _mint(owner(), SONG_CONCEPT_ID, 1, '');
    // Create fungible SongShares to the minter
    _mint(_minter, SONG_SHARES_ID, sharesAmount, '');
    totalShares = sharesAmount;
  }

  /**
   * @dev Starts a sale of song shares.
   * @param amount The amount of shares to put up for sale.
   * @param price The price per share in wei or stable coin units.
   * @param maxShares The maximum shares a wallet can buy. If 0, no restriction.
   * @param _stableCoin The address of the stable coin to use for the sale. If address(0), use ETH.
   */
  function startSharesSale(
    uint256 amount,
    uint256 price,
    uint256 maxShares,
    address _stableCoin
  ) external onlyMinter {
    require(
      amount > 0 &&
        price > 0 &&
        balanceOf(_minter, SONG_SHARES_ID) >= amount &&
        amount <= totalShares,
      'Invalid sale parameters'
    );
    if (_stableCoin != address(0)) {
      
      require(
        protocolModule.isTokenWhitelisted(_stableCoin),
        'Stablecoin is not whitelisted'
      );

      require(
        _stableCoin.code.length > 0 && IERC20(_stableCoin).totalSupply() > 0,
        'Invalid ERC20 token'
      );
      
      stableCoin = IERC20(_stableCoin);
    } else {
      stableCoin = IERC20(address(0));
    }

    sharesForSale = amount;
    pricePerShare = price;
    maxSharesPerWallet = maxShares;
    saleActive = true;
    emit SharesSaleStarted(
      amount,
      price,
      owner(),
      maxSharesPerWallet,
      _stableCoin
    );
  }

  /**
   * @dev Allows users to buy shares during an active sale.
   * @param amount The amount of shares to buy.
   */
  function buyShares(uint256 amount) external payable nonReentrant {
    require(saleActive, 'No active sale');
    require(amount > 0, 'Amount must be greater than 0');
    require(amount <= sharesForSale, 'Not enough shares available');
    uint256 totalCost = amount * pricePerShare;

    if (address(stableCoin) != address(0)) {
      require(msg.value == 0, 'ETH not accepted for stable coin sale');
      stableCoin.safeTransferFrom(msg.sender, address(this), totalCost);
    } else {
      require(msg.value == totalCost, 'Incorrect ETH amount');
    }

    if (maxSharesPerWallet > 0) {
      require(
        balanceOf(msg.sender, SONG_SHARES_ID) + amount <= maxSharesPerWallet,
        'Exceeds maximum shares per wallet'
      );
    }

    sharesForSale -= amount;
    _safeTransferFrom(_minter, msg.sender, SONG_SHARES_ID, amount, '');

    if (sharesForSale == 0) {
      saleActive = false;
      emit SharesSaleEnded();
    }

    emit SharesSold(msg.sender, amount);
  }

  /**
   * @dev Ends the current share sale.
   */
  function endSharesSale() external onlyMinter {
    require(saleActive, 'No active sale');
    saleActive = false;
    sharesForSale = 0;
    emit SharesSaleEnded();
  }

  /**
   * @dev Withdraws the contract's balance to the smart account contract.
   */
  function withdrawFunds() external onlyMinter nonReentrant {
    if (address(stableCoin) != address(0)) {
      uint256 balance = stableCoin.balanceOf(address(this));
      require(balance > 0, 'No stable coin funds to withdraw');
      stableCoin.safeTransfer(_minter, balance);
      emit FundsWithdrawn(_minter, balance);
    } else {
      uint256 balance = address(this).balance;
      require(balance > 0, 'No ETH funds to withdraw');
      (bool success, ) = _minter.call{value: balance}('');
      require(success, 'ETH transfer failed');
      emit FundsWithdrawn(_minter, balance);
    }
  }

  /**
   * @dev Sets the maximum shares a wallet can buy.
   * @param maxShares The maximum shares per wallet.
   */
  function setMaxSharesPerWallet(uint256 maxShares) external onlyOwner {
    maxSharesPerWallet = maxShares;
  }

  // Function to receive ERC20 tokens
  function onERC20Received(
    address token,
    uint256 amount
  ) external returns (bytes4) {
    emit ERC20Received(token, amount, msg.sender);
    return this.onERC20Received.selector;
  }

  function uri(
    uint256 tokenId
  ) public view virtual override returns (string memory) {
    return metadataModule.getTokenURI(owner(), tokenId);
  }

  function migrateWrappedSong(address metadataAddress) external onlyOwner {
    metadataModule = IMetadataModule(metadataAddress);
  }


  // Function to allow the contract to receive ETH
  receive() external payable {}
}
