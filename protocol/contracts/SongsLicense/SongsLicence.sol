// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import './ITokenURIProvider2.sol';

/// @title Songs License Contract
/// @notice This contract allows minting of ERC721 tokens representing song licenses.
/// @dev Inherits from OpenZeppelin's ERC721 and Ownable contracts.
contract SongsLicense is ERC721, Ownable {
  /*///////////////////////////////////////////////////////////////
                               STORAGE
    //////////////////////////////////////////////////////////////*/

  /// @dev Tracks the current token ID to be minted.
  uint256 private _currentTokenId = 0;

  /// @dev Maps token IDs to their respective names.
  mapping(uint256 => string) private _names;

  /// @dev The base URI for token metadata.
  string private baseURI;

  /// @dev The base IPFS for token image.
  string private imageHash;
  string private htmlHash;

  ITokenURIProvider private tokenURIProvider;

  /*///////////////////////////////////////////////////////////////
                           CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

  /// @notice Initializes the contract with a name and symbol for the token collection.
  constructor(
    string memory name,
    string memory symbol,
    address _tokenURIProvider
  ) ERC721(name, symbol) Ownable(msg.sender) {
    tokenURIProvider = ITokenURIProvider(_tokenURIProvider);
  }

  /*///////////////////////////////////////////////////////////////
                       MINTING FUNCTIONS
    //////////////////////////////////////////////////////////////*/

  /// @notice Mints a new token with the given name and URI to the caller.
  /// @param name The name of the song license.
  function mint(string memory name) public payable {
    _mintToken(msg.sender, name, msg.value);
  }

  /// @notice Mints a new token with the given name and URI to a specified address.
  /// @param to The address to receive the minted token.
  /// @param name The name of the song license.
  function mintFor(address to, string memory name) public payable {
    _mintToken(to, name, msg.value);
  }

  /// @dev Internal function to handle the minting logic.
  /// @param to The address to receive the minted token.
  /// @param name The name of the song license.
  /// @param amount The amount of Ether sent with the transaction.
  function _mintToken(address to, string memory name, uint256 amount) internal {
    require(_currentTokenId < 10000, "Maximum token limit reached");
    require(bytes(name).length <= 15, 'Name exceeds 15 characters');
    uint256 newTokenId = _currentTokenId;
    _mint(to, newTokenId);
    _names[newTokenId] = name;
    unchecked {
      _currentTokenId++;
    }
    emit TokenMintedWithPayment(to, newTokenId, name, amount);
  }
    //////////////////////////////////////////////////////////////*/

  /// @notice Returns the URI for a given token ID.
  /// @param tokenId The ID of the token.
  /// @return The URI pointing to the token metadata.
  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory) {
    require(
      _ownerOf(tokenId) != address(0),
      'ERC721: URI query for nonexistent token'
    );

    string memory name = _names[tokenId];
    return
      tokenURIProvider.tokenURI(tokenId, name, baseURI, imageHash, htmlHash);
  }

  /*///////////////////////////////////////////////////////////////
                       TOKEN NAME FUNCTIONS
    //////////////////////////////////////////////////////////////*/

  /// @notice Returns the name for a given token ID.
  /// @param tokenId The ID of the token.
  /// @return The name of the song license.
  function getName(uint256 tokenId) public view returns (string memory) {
    return _names[tokenId];
  }

  /*///////////////////////////////////////////////////////////////
                       BURN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

  /// @notice Burns the specified token. Can only be called by the owner of the token.
  /// @param tokenId The ID of the token to burn.
  function burn(uint256 tokenId) public {
    require(ownerOf(tokenId) == _msgSender(), 'Caller is not the owner');
    _burn(tokenId);
    delete _names[tokenId];
    emit TokenBurned(tokenId);
  }

  /*///////////////////////////////////////////////////////////////
                       ADMIN ACTIONS
    //////////////////////////////////////////////////////////////*/

  /// @notice Allows the owner to withdraw any ERC20 tokens sent to the contract.
  /// @param token The ERC20 token to withdraw.
  /// @param to The address to receive the withdrawn tokens.
  function recoverTokens(IERC20 token, address to) external onlyOwner {
    uint256 amount = token.balanceOf(address(this));
    token.transfer(to, amount);
  }

  /// @notice Allows the owner to withdraw any ETH sent to the contract.
  /// @param to The address to receive the withdrawn ETH.
  function recoverETH(address to) external onlyOwner {
    uint256 ethBalance = address(this).balance;
    (bool success, ) = to.call{value: ethBalance}('');
    require(success, 'ETH transfer failed');
  }

  /// @notice Admin function to burn any specified token. Can only be called by the contract owner.
  /// @param tokenId The ID of the token to burn.
  function adminBurn(uint256 tokenId) public onlyOwner {
    _burn(tokenId);
    delete _names[tokenId];
    emit TokenBurned(tokenId);
  }

  /// @notice Sets the base URI for token metadata.
  /// @param newBaseURI The new base URI.
  function setBaseURI(string memory newBaseURI) public onlyOwner {
    baseURI = newBaseURI;
  }

  /// @notice Sets the Image Hash
  /// @param newImageHash The new image hash.
  function setImageHash(string memory newImageHash) public onlyOwner {
    imageHash = newImageHash;
  }

  /// @notice Sets the HTML Hash
  /// @param newHtmlHash The new HTML hash.
  function setHtmlHash(string memory newHtmlHash) public onlyOwner {
    htmlHash = newHtmlHash;
  }

  /// @notice Allows the owner to set a new token URI provider.
  /// @param _tokenURIProvider The address of the new token URI provider.
  function setTokenURIProvider(address _tokenURIProvider) external onlyOwner {
    tokenURIProvider = ITokenURIProvider(_tokenURIProvider);
  }

  /*///////////////////////////////////////////////////////////////
                       EVENTS
    //////////////////////////////////////////////////////////////*/

  event TokenMintedWithPayment(
    address indexed to,
    uint256 indexed tokenId,
    string name,
    uint256 amount
  );
  event TokenBurned(uint256 indexed tokenId);
}
