// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import './DistributorWallet.sol';
import './../Interfaces/IProtocolModule.sol';

contract DistributorWalletFactory is Ownable {
  mapping(address => address[]) public distributorWallets; 
  mapping(address => address) public wrappedSongToDistributor;
  mapping(address => bool) public isDistributorWallet; // New mapping to track distributor wallets

  event DistributorWalletCreated(address indexed distributor, address wallet);
  event WrappedSongReleased(
    address indexed wrappedSong,
    address indexed distributor
  );

  constructor(address initialOwner) Ownable(initialOwner) {
  }

  /**
   * @dev Creates a new distributor wallet for the given distributor address.
   * @return The address of the newly created distributor wallet.
   */
  function createDistributorWallet(
    address _stablecoin,
    address _protocolModule,
    address _owner
  ) external onlyOwner returns (address) {
    // Check if the stablecoin is whitelisted
    require(
      IProtocolModule(_protocolModule).isTokenWhitelisted(_stablecoin),
      "Stablecoin is not whitelisted"
    );

    DistributorWallet newWallet = new DistributorWallet(
      _stablecoin,
      _protocolModule,
      _owner
    );
    address walletAddress = address(newWallet);

    distributorWallets[_owner].push(walletAddress); // Append to the array
    isDistributorWallet[walletAddress] = true; // Mark as a distributor wallet
    
    emit DistributorWalletCreated(_owner, walletAddress); // Corrected event parameter

    return walletAddress;
  }

  /**
   * @dev Returns the distributor wallet addresses for the given distributor.
   * @param ownerOfWallets The address of the distributor.
   * @return The addresses of the distributor wallets owned by an address.
   */
  function getDistributorWallets(
    address ownerOfWallets
  ) external view returns (address[] memory) {
    return distributorWallets[ownerOfWallets];
  }

  /**
   * @dev Returns the distributor address for the given wrapped song.
   * @param wrappedSong The address of the wrapped song.
   * @return The address of the distributor.
   */
  function getWrappedSongDistributor(
    address wrappedSong
  ) external view returns (address) {
    return wrappedSongToDistributor[wrappedSong];
  }

  /**
   * @dev Checks if an address is a distributor wallet.
   * @param wallet The address to check.
   * @return True if the address is a distributor wallet, false otherwise.
   */
  function checkIsDistributorWallet(address wallet) external view returns (bool) {
    return isDistributorWallet[wallet];
  }
}