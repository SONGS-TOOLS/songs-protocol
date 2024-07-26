// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import './SongManagement_1155.sol';
import './Protocol.sol';

contract WrappedSong is OwnableUpgradeable, UUPSUpgradeable {
  SongManagement public songManagementContract;
  IERC20Upgradeable public stablecoin;
  ProtocolModule public protocolModule;

  bool public isReleased;
  string public isrc;
  bool public isAuthentic;
  address public distributorWallet;

  uint256 public songSharesId;
  uint256 public wrappedSongTokenId;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @dev Initializes the contract with the given parameters.
   * @param _songManagementAddress The address of the SongManagement contract.
   * @param _stablecoinAddress The address of the stablecoin contract.
   * @param _owner The address of the owner.
   * @param _protocolModuleAddress The address of the ProtocolModule contract.
   */
  function initialize(
    address _songManagementAddress,
    address _stablecoinAddress,
    address _owner,
    address _protocolModuleAddress
  ) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();

    require(
      _songManagementAddress != address(0),
      'Invalid SongManagement address'
    );
    require(_stablecoinAddress != address(0), 'Invalid stablecoin address');

    songManagementContract = SongManagement(_songManagementAddress);
    stablecoin = IERC20Upgradeable(_stablecoinAddress);
    protocolModule = ProtocolModule(_protocolModuleAddress);
    transferOwnership(_owner);

    isReleased = false;
    isAuthentic = false;
  }

  /**
   * @dev Authorizes the upgrade of the contract. Only the owner can authorize upgrades.
   * @param newImplementation The address of the new implementation contract.
   */
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}

  /**
   * @dev Requests the release of the wrapped song.
   * @param _distributorWallet The address of the distributor wallet.
   */
  function requestWrappedSongRelease(address _distributorWallet) external onlyOwner {
    require(!isReleased, "Already released");
    protocolModule.requestWrappedSongRelease(address(this), _distributorWallet);
  }

  /**
   * @dev Sets the distributor wallet address. Only the owner can set the distributor wallet.
   * @param _distributorWallet The address of the distributor wallet.
   */
  function setDistributorWallet(address _distributorWallet) external onlyOwner {
    distributorWallet = _distributorWallet;
  }

  /**
   * @dev Sets the ISRC for the wrapped song. Only the distributor can set the ISRC.
   * @param _isrc The ISRC of the wrapped song.
   */
  function setISRC(string memory _isrc) external {
    require(msg.sender == distributorWallet, 'Only distributor can set ISRC');
    isrc = _isrc;
  }

  /**
   * @dev Sets the authenticity status of the wrapped song. Only the distributor can set the authenticity status.
   * @param _isAuthentic The authenticity status of the wrapped song.
   */
  function setAuthenticityStatus(bool _isAuthentic) external {
    require(
      msg.sender == distributorWallet,
      'Only distributor can set authenticity status'
    );
    isAuthentic = _isAuthentic;
  }

  // The following functions remain largely unchanged from the original SmartWallet contract:

  /**
   * @dev Registers a new song with the given URI.
   * @param songURI The URI of the song.
   * @return songId The ID of the registered song.
   */
  function registerSong(
    string memory songURI
  ) public onlyOwner returns (uint256 songId) {
    songId = songManagementContract.createSongConcept(songURI, address(this));
    wrappedSongTokenId = songId;
    return songId;
  }

  /**
   * @dev Mints participation NFTs for the given song ID and participants.
   * @param songId The ID of the song.
   * @param participants The addresses of the participants.
   */
  function mintParticipationNFTs(
    uint256 songId,
    address[] memory participants
  ) public onlyOwner {
    songManagementContract.mintParticipationNFTs(songId, participants);
  }

  /**
   * @dev Creates fungible song shares for the given song ID and shares amount.
   * @param songId The ID of the song.
   * @param sharesAmount The amount of shares to be created.
   * @return sharesId The ID of the created shares.
   */
  function createFungibleSongShares(
    uint256 songId,
    uint256 sharesAmount
  ) public onlyOwner returns (uint256 sharesId) {
    sharesId = songManagementContract.createFungibleSongShares(
      songId,
      sharesAmount
    );
    songSharesId = sharesId;
    return sharesId;
  }

  /**
   * @dev Exchanges an NFT for shares.
   * @param nftId The ID of the NFT.
   * @param sharesAmount The amount of shares to be exchanged.
   */
  function exchangeNFTForShares(uint256 nftId, uint256 sharesAmount) public {
    songManagementContract.exchangeNFTForShares(nftId, sharesAmount);
  }

  /**
   * @dev Distributes royalties to shareholders.
   * @param sharesId The ID of the shares.
   * @param totalRoyaltyAmount The total amount of royalties to be distributed.
   */
  function distributeRoyalties(
    uint256 sharesId,
    uint256 totalRoyaltyAmount
  ) public {
    require(
      stablecoin.balanceOf(address(this)) >= totalRoyaltyAmount,
      'Insufficient balance for distribution'
    );

    uint256 totalShares = songManagementContract.getTotalShares(sharesId);
    require(totalShares > 0, 'No shares exist for distribution');

    uint256 amountPerShare = totalRoyaltyAmount / totalShares;

    address[] memory shareholders = songManagementContract
      .getShareholderAddresses(sharesId);
    for (uint i = 0; i < shareholders.length; i++) {
      address shareholder = shareholders[i];
      uint256 shareholderShares = songManagementContract.balanceOf(
        shareholder,
        sharesId
      );
      uint256 shareholderRoyalty = amountPerShare * shareholderShares;

      require(
        stablecoin.transfer(shareholder, shareholderRoyalty),
        'Royalty transfer failed'
      );
    }
  }

  /**
   * @dev Sells shares to a buyer.
   * @param sharesId The ID of the shares.
   * @param amount The amount of shares to be sold.
   * @param price The price of the shares.
   * @param buyer The address of the buyer.
   */
  function sellShares(
    uint256 sharesId,
    uint256 amount,
    uint256 price,
    address buyer
  ) public onlyOwner {
    require(
      stablecoin.balanceOf(buyer) >= price,
      'Buyer does not have enough stablecoin'
    );
    require(
      songManagementContract.balanceOf(address(this), sharesId) >= amount,
      'Not enough shares available for sale'
    );

    // Transfer stablecoin from the buyer to the SmartWallet
    stablecoin.transferFrom(buyer, address(this), price);

    // Transfer the shares from the SmartWallet to the buyer
    songManagementContract.safeTransferFrom(
      address(this),
      buyer,
      sharesId,
      amount,
      ''
    );
  }

  /**
   * @dev Transfers shares to a recipient.
   * @param sharesId The ID of the shares.
   * @param amount The amount of shares to be transferred.
   * @param recipient The address of the recipient.
   */
  function transferShares(
    uint256 sharesId,
    uint256 amount,
    address recipient
  ) public onlyOwner {
    require(
      songManagementContract.balanceOf(address(this), sharesId) >= amount,
      'Not enough shares to transfer'
    );

    // Transfer the shares from the SmartWallet to the recipient
    songManagementContract.safeTransferFrom(
      address(this),
      recipient,
      sharesId,
      amount,
      ''
    );
  }

  /**
   * @dev Accepts payment in stablecoin for shares or other purposes.
   * @param amount The amount of stablecoin to be accepted.
   * @param from The address from which the payment is made.
   */
  function acceptPayment(uint256 amount, address from) public onlyOwner {
    // Ensure that the SmartWallet contract is allowed to move the specified amount of tokens on behalf of the `from` address.
    // This requires the `from` address to have called `approve` method on the stablecoin contract, setting an allowance for this SmartWallet contract.
    require(
      stablecoin.allowance(from, address(this)) >= amount,
      'Payment not approved'
    );

    // Use transferFrom to move the tokens from the sender to this contract.
    bool success = stablecoin.transferFrom(from, address(this), amount);
    require(success, 'Transfer failed');
  }

  /**
   * @dev Handles refunds or other disbursements from the wallet.
   * @param amount The amount of stablecoin to be disbursed.
   * @param to The address to which the payment is made.
   */
  function makePayment(uint256 amount, address to) public onlyOwner {
    require(
      stablecoin.balanceOf(address(this)) >= amount,
      'Insufficient funds'
    );

    bool success = stablecoin.transfer(to, amount);
    require(success, 'Transfer failed');
  }

  /**
   * @dev Returns the token balance of the specified token ID.
   * @param tokenId The ID of the token.
   * @return The balance of the token.
   */
  function getTokenBalance(uint256 tokenId) public view returns (uint256) {
    return songManagementContract.balanceOf(address(this), tokenId);
  }

  /**
   * @dev Transfers tokens to a recipient.
   * @param tokenId The ID of the token.
   * @param amount The amount of tokens to be transferred.
   * @param to The address of the recipient.
   */
  function transferToken(
    uint256 tokenId,
    uint256 amount,
    address to
  ) public onlyOwner {
    // Ensure the SmartWallet has enough of the token to transfer
    require(getTokenBalance(tokenId) >= amount, 'Insufficient token balance');
    // Perform the safe transfer
    songManagementContract.safeTransferFrom(
      address(this),
      to,
      tokenId,
      amount,
      ''
    );
  }

  /**
   * @dev Batch transfers tokens to a recipient.
   * @param tokenIds The IDs of the tokens.
   * @param amounts The amounts of tokens to be transferred.
   * @param to The address of the recipient.
   */
  function batchTransferTokens(
    uint256[] memory tokenIds,
    uint256[] memory amounts,
    address to
  ) public onlyOwner {
    // Ensure arrays are of the same length to prevent mismatch
    require(
      tokenIds.length == amounts.length,
      'Arrays must be the same length'
    );
    // Perform the safe batch transfer
    songManagementContract.safeBatchTransferFrom(
      address(this),
      to,
      tokenIds,
      amounts,
      ''
    );
  }

  /**
   * @dev Indicates whether the contract can receive ERC20 tokens.
   * @return A boolean indicating if the contract can receive ERC20 tokens.
   */
  function canReceiveERC20() external pure returns (bool) {
    return true;
  }
}