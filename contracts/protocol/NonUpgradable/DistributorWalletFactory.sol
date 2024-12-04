// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./DistributorWallet.sol";
import "./../Interfaces/IProtocolModule.sol";
import "./../Interfaces/IRegistryModule.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DistributorWalletFactory is Ownable {
  using SafeERC20 for IERC20;

  mapping(address => address[]) public distributorWallets;
  mapping(address => address) public wrappedSongToDistributor;
  mapping(address => bool) public isDistributorWallet; // New mapping to track distributor wallets

  mapping(address => uint256) public accumulatedFees;

  event DistributorWalletCreated(
    address indexed distributor,
    address wallet,
    address stablecoin
  );
  event WrappedSongReleased(
    address indexed wrappedSong,
    address indexed distributor
  );

  event FeesWithdrawn(
    address indexed token,
    address indexed recipient,
    uint256 amount
  );

  event CreationFeeCollected(
    address indexed wrappedSong,
    address indexed token,
    uint256 amount
  );

  constructor(address initialOwner) Ownable(initialOwner) {}

  function _handleCreationFee(
    address _protocolModule,
    address _stablecoin
  ) internal {
    // Access the FeesModule through the registryModule
    IFeesModule feesModule = IRegistryModule(IProtocolModule(_protocolModule).getRegistryModule()).feesModule();
    uint256 creationFee = feesModule.getDistributorCreationFee();
    bool payInStablecoin = feesModule.isPayInStablecoin();

    if (creationFee > 0) {
      if (payInStablecoin) {
        // Transfer stablecoin fee from user to this contract
        IERC20(_stablecoin).safeTransferFrom(
          msg.sender,
          IProtocolModule(_protocolModule).getStablecoinFeeReceiver(),
          creationFee
        );

        // Add to accumulated fees
        accumulatedFees[_stablecoin] += creationFee;

        emit CreationFeeCollected(address(0), _stablecoin, creationFee); // address(0) since wrapped song not created yet
      } else {
        // Check if correct ETH amount was sent
        require(msg.value >= creationFee, "Incorrect ETH fee amount");

        // Add to accumulated fees for ETH (address(0))
        accumulatedFees[address(0)] += msg.value;

        // Refund excess ETH if anyza
        if (msg.value > creationFee) {
          (bool refundSuccess, ) = msg.sender.call{
            value: msg.value - creationFee
          }("");
          require(refundSuccess, "ETH refund failed");
        }

        emit CreationFeeCollected(address(0), address(0), msg.value);
      }
    }
  }

  /**
   * @dev Creates a new distributor wallet for the given distributor address.
   * @return The address of the newly created distributor wallet.
   */
  function createDistributorWallet(
    address _stablecoin,
    address _protocolModule,
    address _owner
  ) external payable onlyOwner returns (address) {
    // Check if the stablecoin is whitelisted
    require(
      IProtocolModule(_protocolModule).isTokenWhitelisted(_stablecoin),
      "Stablecoin is not whitelisted"
    );
    require(!IProtocolModule(_protocolModule).paused(), "Protocol is paused");

    _handleCreationFee(_protocolModule, _stablecoin);

    DistributorWallet newWallet = new DistributorWallet(
      _stablecoin,
      _protocolModule,
      _owner
    );
    address walletAddress = address(newWallet);

    distributorWallets[_owner].push(walletAddress); // Append to the arra y
    isDistributorWallet[walletAddress] = true; // Mark as a distributor wallet

    emit DistributorWalletCreated(_owner, walletAddress, _stablecoin); // Corrected event parameter

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
  function checkIsDistributorWallet(
    address wallet
  ) external view returns (bool) {
    return isDistributorWallet[wallet];
  }

  function withdrawAccumulatedFees(
    address token,
    address recipient,
    address _protocolModule
  ) external {
    require(
      msg.sender == address(IProtocolModule(_protocolModule).owner()),
      "Only protocol owner can withdraw fees"
    );

    uint256 amount = accumulatedFees[token];
    require(amount > 0, "No fees to withdraw");

    accumulatedFees[token] = 0;

    if (token == address(0)) {
      (bool success, ) = payable(recipient).call{value: amount}("");
      require(success, "ETH transfer failed");
    } else {
      IERC20(token).safeTransfer(recipient, amount);
    }

    emit FeesWithdrawn(token, recipient, amount);
  }

  receive() external payable {}

  fallback() external payable {}
}
