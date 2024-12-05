// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./../Interfaces/IERC20Whitelist.sol";

contract FeesModule is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public wrappedSongCreationFee;
    uint256 public releaseFee;
    uint256 public distributorCreationFee;
    uint256 public updateMetadataFee;
    uint256 public withdrawalFeePercentage; // Base 10000 (e.g., 250 = 2.5%)
    uint256 public constant MAX_WITHDRAWAL_FEE = 1000; // 10% maximum fee
    uint256 private _startSaleFee;

    bool public payInStablecoin;
    uint256 public currentStablecoinIndex;

    mapping(address => uint256) public accumulatedFees; // token => amount

    event WrappedSongCreationFeeUpdated(uint256 newFee);
    event ReleaseFeeUpdated(uint256 newFee);
    event DistributorCreationFeeUpdated(uint256 newFee);
    event UpdateMetadataFeeUpdated(uint256 newFee);
    event PayInStablecoinUpdated(bool newPayInStablecoin);
    event ReleaseFeeCollected(address indexed wrappedSong, address indexed token, uint256 amount);
    event StartSaleFeeUpdated(uint256 newFee);
    event WithdrawalFeePercentageUpdated(uint256 newPercentage);
    event FeesWithdrawn(address indexed token, address indexed recipient, uint256 amount);

    constructor(address _owner) Ownable(_owner) {
    }

      function setCurrentStablecoinIndex(uint256 _index) external onlyOwner {
        currentStablecoinIndex = _index;
    }

    function setWrappedSongCreationFee(uint256 _fee) external onlyOwner {
        wrappedSongCreationFee = _fee;
        emit WrappedSongCreationFeeUpdated(_fee);
    }

    function setReleaseFee(uint256 _fee) external onlyOwner {
        releaseFee = _fee;
        emit ReleaseFeeUpdated(_fee);
    }

    function setDistributorCreationFee(uint256 _fee) external onlyOwner {
        distributorCreationFee = _fee;
        emit DistributorCreationFeeUpdated(_fee);
    }

    function setUpdateMetadataFee(uint256 _fee) external onlyOwner {
        updateMetadataFee = _fee;
        emit UpdateMetadataFeeUpdated(_fee);
    }

    function setPayInStablecoin(bool _payInStablecoin) external onlyOwner {
        payInStablecoin = _payInStablecoin;
        emit PayInStablecoinUpdated(_payInStablecoin);
    }

    function setStartSaleFee(uint256 newFee) external onlyOwner {
        _startSaleFee = newFee;
        emit StartSaleFeeUpdated(newFee);
    }

    function setWithdrawalFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= MAX_WITHDRAWAL_FEE, "Fee too high");
        withdrawalFeePercentage = _feePercentage;
        emit WithdrawalFeePercentageUpdated(_feePercentage);
    }

    /**************************************************************************
     * Getter Functions 
     *************************************************************************/

    function getWithdrawalFeePercentage() external view returns (uint256) {
        return withdrawalFeePercentage;
    }

    function getStartSaleFee() external view returns (uint256) {
        return _startSaleFee;
    }

    function getReleaseFee() external view returns (uint256) {
        return releaseFee;
    }

    function getWrappedSongCreationFee() external view returns (uint256) {
        return wrappedSongCreationFee;
    }

    function isPayInStablecoin() external view returns (bool) {
        return payInStablecoin;
    }

    function getCurrentStablecoinIndex() external view returns (uint256) {
        return currentStablecoinIndex;
    }

    function getUpdateMetadataFee() external view returns (uint256) {
        return updateMetadataFee;
    }

    function getDistributorCreationFee() external view returns (uint256) {
        return distributorCreationFee;
    }

    function getPayInStablecoin() external view returns (bool) {
        return payInStablecoin; 
    }
    
    receive() external payable {}
    fallback() external payable {}
}
