// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract WSTokenManagement is ERC1155Supply, Ownable, ReentrancyGuard {
  uint256 private _currentTokenId;
  address private immutable _minter;

  mapping(uint256 => string) private _tokenURIs;
  mapping(uint256 => uint256) public songToFungibleShares;
  mapping(uint256 => uint256) private songToConceptNFT;
  mapping(uint256 => uint256) public fungibleTokenShares;
  mapping(uint256 => address[]) private _shareholders;

  uint256 public constant SONG_SHARES_ID = 1;
  uint256 public sharesForSale;
  uint256 public pricePerShare;
  bool public saleActive;
  uint256 public totalShares;

  event SharesSaleStarted(uint256 amount, uint256 price);
  event SharesSold(address buyer, uint256 amount);
  event SharesSaleEnded();
  event FundsWithdrawn(address indexed to, uint256 amount);

  /**
   * @dev Initializes the contract with the given initial owner.
   * @param _smartAccountAddress Wrapped Song smartAccount address.
   * @param _minterAddress Wrapped Song smartAccount address.
   */
  constructor(
    address _smartAccountAddress,
    address _minterAddress
  ) ERC1155('') Ownable(_smartAccountAddress) {
    _minter = _minterAddress;
    _currentTokenId = 0;
  }

  /**
   * @dev Transfers tokens back to the main owner instead of burning.
   * @param account The address of the account to transfer tokens from.
   * @param id The ID of the token to transfer.
   * @param amount The amount of tokens to transfer.
   */
  function burn(address account, uint256 id, uint256 amount) external {
    require(balanceOf(account, id) >= amount, 'Insufficient token balance');
    require(msg.sender == account, 'Caller is not the token owner');

    address mainOwner = owner();
    _safeTransferFrom(account, mainOwner, id, amount, '');
    _removeShareholder(id, account);
  }

  /**
   * @dev Sets the token URI for a specific token ID.
   * @param tokenId The ID of the token to set the URI for.
   * @param tokenURI The URI to be set for the token.
   */
  function setTokenURI(
    uint256 tokenId,
    string memory tokenURI
  ) public onlyOwner {
    _tokenURIs[tokenId] = tokenURI;
  }

  /**
   * @dev Creates a new song concept NFT.
   * @param songURI The URI containing metadata for the song.
   * @param smartWallet The address of the smart wallet to mint the NFT to.
   * @return songId The ID of the newly created song concept NFT.
   */
  function createSongConcept(
    string memory songURI,
    address smartWallet
  ) public onlyOwner returns (uint256 songId) {
    songId = 0;
    _mint(smartWallet, songId, 1, '');
    setTokenURI(songId, songURI);
    songToConceptNFT[songId] = songId;
    return songId;
  }

  /**
   * @dev Creates fungible shares for a specific song.
   * @param songId The ID of the song to create shares for.
   * @param sharesAmount The total amount of shares to create.
   * @param sharesURI The URI containing metadata for the shares.
   * @param creator The address of the owner to mint the shares to.
   * @return sharesId The ID of the newly created fungible shares.
   */
  function createFungibleSongShares(
    uint256 songId,
    uint256 sharesAmount,
    string memory sharesURI,
    address creator
  ) public onlyOwner returns (uint256 sharesId) {
    require(
      songToConceptNFT[songId] == 0,
      "Invalid song ID, concept NFT doesn't exist"
    );
    require(
      songToFungibleShares[songId] == 0,
      'Shares already created for this song'
    );

    sharesId = SONG_SHARES_ID;
    _mint(creator, sharesId, sharesAmount, '');
    setTokenURI(sharesId, sharesURI);
    songToFungibleShares[songId] = sharesId;
    fungibleTokenShares[sharesId] = sharesAmount;
    totalShares = sharesAmount;
    return sharesId;
  }

  /**
   * @dev Starts a sale of song shares.
   * @param amount The amount of shares to put up for sale.
   * @param price The price per share in wei.
   */
  function startSharesSale(uint256 amount, uint256 price) external onlyOwner {
    require(!saleActive, 'Sale is already active');
    require(amount > 0, 'Amount must be greater than 0');
    require(price > 0, 'Price must be greater than 0');
    require(
      balanceOf(owner(), SONG_SHARES_ID) >= amount,
      'Insufficient shares'
    );
    require(amount <= totalShares, 'Amount exceeds total shares');

    sharesForSale = amount;
    pricePerShare = price;
    saleActive = true;

    emit SharesSaleStarted(amount, price);
  }

  /**
   * @dev Allows users to buy shares during an active sale.
   * @param amount The amount of shares to buy.
   */
  function buyShares(uint256 amount) external payable nonReentrant {
    require(saleActive, 'No active sale');
    require(amount > 0, 'Amount must be greater than 0');
    require(amount <= sharesForSale, 'Not enough shares available');
    require(msg.value == amount * pricePerShare, 'Incorrect payment amount');

    sharesForSale -= amount;
    _safeTransferFrom(owner(), msg.sender, SONG_SHARES_ID, amount, '');

    if (sharesForSale == 0) {
      saleActive = false;
      emit SharesSaleEnded();
    }

    emit SharesSold(msg.sender, amount);
  }

  /**
   * @dev Ends the current share sale.
   */
  function endSharesSale() external onlyOwner {
    require(saleActive, 'No active sale');
    saleActive = false;
    sharesForSale = 0;
    emit SharesSaleEnded();
  }

  /**
   * @dev Withdraws the contract's balance to the smart account contract.
   */
  function withdrawFunds() external onlyOwner nonReentrant {
    uint256 balance = address(this).balance;
    require(balance > 0, 'No funds to withdraw');

    address payable smartAccount = payable(owner());
    (bool success, ) = smartAccount.call{value: balance}('');
    require(success, 'Transfer failed');

    emit FundsWithdrawn(smartAccount, balance);
  }

  /**
   * @dev Retrieves the URI for a specific token ID.
   * @param tokenId The ID of the token to get the URI for.
   * @return The URI of the specified token.
   */
  function uri(uint256 tokenId) public view override returns (string memory) {
    return _tokenURIs[tokenId];
  }

  /**
   * @dev Returns the list of shareholder addresses for a given shares ID.
   * @param sharesId The ID of the shares.
   * @return An array of shareholder addresses.
   */
  function getShareholderAddresses(
    uint256 sharesId
  ) public view returns (address[] memory) {
    return _shareholders[sharesId];
  }

  /**
   * @dev Retrieves the total amount of fungible shares for a specific shares ID.
   * @param sharesId The ID of the shares to query.
   * @return The total amount of shares for the specified ID.
   */
  function getFungibleTokenShares(
    uint256 sharesId
  ) public view returns (uint256) {
    return fungibleTokenShares[sharesId];
  }

  /**
   * @dev Retrieves the fungible shares ID associated with a specific song.
   * @param songId The ID of the song to query.
   * @return The ID of the fungible shares associated with the specified song.
   */
  function getSharesIdForSong(uint256 songId) public view returns (uint256) {
    require(
      songToConceptNFT[songId] != 0,
      "Invalid song ID, concept NFT doesn't exist"
    );
    return songToFungibleShares[songId];
  }

  /**
   * @dev Removes a shareholder from the list if they no longer hold tokens.
   * @param sharesId The ID of the shares.
   * @param shareholder The address of the shareholder.
   */
  function _removeShareholder(uint256 sharesId, address shareholder) internal {
    if (balanceOf(shareholder, sharesId) == 0) {
      address[] storage shareholders = _shareholders[sharesId];
      uint256 lastIndex = shareholders.length - 1;
      for (uint i = 0; i < shareholders.length; i++) {
        if (shareholders[i] == shareholder) {
          if (i != lastIndex) {
            shareholders[i] = shareholders[lastIndex];
          }
          shareholders.pop();
          break;
        }
      }
    }
  }
}
