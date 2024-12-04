// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFeesModule {
    // Getters
    function isPayInStablecoin() external view returns (bool);
    function getCurrentStablecoinIndex() external view returns (uint256);
    function getStartSaleFee() external view returns (uint256);
    function getReleaseFee() external view returns (uint256);
    function getWithdrawalFeePercentage() external view returns (uint256);
    function getWrappedSongCreationFee() external view returns (uint256);
    function getUpdateMetadataFee() external view returns (uint256);
    function getDistributorCreationFee() external view returns (uint256);

    // Setters
    function setWrappedSongCreationFee(uint256 _fee) external;
    function setReleaseFee(uint256 _fee) external;
    function setDistributorCreationFee(uint256 _fee) external;
    function setUpdateMetadataFee(uint256 _fee) external;
    function setPayInStablecoin(bool _payInStablecoin) external;
    function setStartSaleFee(uint256 newFee) external;
    function setWithdrawalFeePercentage(uint256 _feePercentage) external;


    // Other functions
    function withdrawAccumulatedFees(address token, address recipient) external;
    function _handleReleaseFee(
        address wrappedSong,
        address erc20whitelist,
        address msgSender,
        uint256 msgValue
    ) external;
} 