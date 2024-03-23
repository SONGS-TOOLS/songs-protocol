// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './SongManagement_1155.sol';

contract SmartWallet is Ownable {
  SongManagement public songManagementContract;
  IERC20 public stablecoin;

  constructor(
    address _songManagementAddress,
    address _stablecoinAddress,
    address _owner
  ) Ownable(_owner) {
    require(
      _songManagementAddress != address(0),
      'Invalid SongManagement address'
    );
    require(_stablecoinAddress != address(0), 'Invalid stablecoin address');

    // ONLY IF WE WANT AND 1155 per account (not useful)
    // songManagementContract = new SongManagement();
    // songManagementContract.transferOwnership(address(this));

    songManagementContract = SongManagement(_songManagementAddress);
    stablecoin = IERC20(_stablecoinAddress);
    // Assuming the SmartWallet itself does not need to be the owner of the SongManagement contract,
    // but rather just needs to interact with it.
  }

  // Function to register a new song
  function registerSong(
    string memory songURI
  ) public onlyOwner returns (uint256 songId) {
    return songManagementContract.createSongConcept(songURI, address(this));
  }

  // Function to mint participation NFTs for song participants
  function mintParticipationNFTs(
    uint256 songId,
    address[] memory participants
  ) public onlyOwner {
    songManagementContract.mintParticipationNFTs(songId, participants);
  }

  // Function to create fungible song shares
  function createFungibleSongShares(
    uint256 songId,
    uint256 sharesAmount
  ) public onlyOwner returns (uint256 sharesId) {
    return
      songManagementContract.createFungibleSongShares(songId, sharesAmount);
  }

  // Function for participants to exchange their NFTs for shares
  // This function can be called by participants directly, assuming they have been granted permission to burn their NFTs for shares
  function exchangeNFTForShares(uint256 nftId, uint256 sharesAmount) public {
    songManagementContract.exchangeNFTForShares(nftId, sharesAmount);
  }

  // Function to distribute royalties for a specific song's shares
  function distributeRoyalties(
    uint256 sharesId,
    uint256 totalRoyaltyAmount
  ) public {
    require(
      stablecoin.balanceOf(address(this)) >= totalRoyaltyAmount,
      'Insufficient balance for distribution'
    );

    // Assuming totalSupply() or an equivalent method exists to get the total number of shares distributed
    uint256 totalShares = songManagementContract.getFungibleTokenShares(
      sharesId
    );
    require(totalShares > 0, 'No shares exist for distribution');

    // Placeholder for distribution logic
    address[] memory shareOwners; // You'll need a way to enumerate or otherwise identify all share owners
    uint256 shareOwnerCount = shareOwners.length; // Determine the number of share owners

    for (uint256 i = 0; i < shareOwnerCount; i++) {
      address shareOwner = shareOwners[i];
      uint256 ownerShares = songManagementContract.balanceOf(
        shareOwner,
        sharesId
      );

      if (ownerShares > 0) {
        uint256 ownerRoyalty = (totalRoyaltyAmount * ownerShares) / totalShares;
        stablecoin.transfer(shareOwner, ownerRoyalty);
      }
    }
  }

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

  // Function to accept payment in stablecoin for shares or other purposes
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

  // Function to handle refunds or other disbursements from the wallet
  function makePayment(uint256 amount, address to) public onlyOwner {
    require(
      stablecoin.balanceOf(address(this)) >= amount,
      'Insufficient funds'
    );

    bool success = stablecoin.transfer(to, amount);
    require(success, 'Transfer failed');
  }

  function getTokenBalance(uint256 tokenId) public view returns (uint256) {
    return songManagementContract.balanceOf(address(this), tokenId);
  }

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

  function batchTransferTokens(
    uint256[] memory tokenIds,
    uint256[] memory amounts,
    address to
  ) public onlyOwner {
    // Ensure arrays are of the same length to prevent mismatch
    require(
      tokenIds.length == amounts.length,
      'Arrays must be of the same length'
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

  function canReceiveERC20() external pure returns (bool) {
    return true;
  }
}
