// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './../Interfaces/IProtocolModule.sol';

interface IDistributorWallet {
    function wrappedSongTreasury(address) external view returns (uint256);
    function managedWrappedSongs(uint256) external view returns (address);
    function currentBatchIndex() external view returns (uint256);

    function receivePaymentETH(address _wrappedSong) external payable;
    function receivePaymentStablecoin(address _wrappedSong, uint256 _amount) external;
    function receiveBatchPaymentETH(address[] calldata _wrappedSongs, uint256[] calldata _amounts) external payable;
    function receiveBatchPaymentStablecoin(address[] calldata _wrappedSongs, uint256[] calldata _amounts, uint256 _totalAmount) external;

    function redeemWrappedSongEarnings(address _wrappedSong) external;
    function redeemETH(address payable _wrappedSong) external;

    function confirmWrappedSongRelease(address wrappedSong) external;
    function acceptWrappedSongForReview(address wrappedSong) external;
    function rejectWrappedSongRelease(address wrappedSong) external;

    function addISRC(address wrappedSong, string memory isrc) external;
    function addUPC(address wrappedSong, string memory upc) external;
    function addISWC(address wrappedSong, string memory iswc) external;
    function addISCC(address wrappedSong, string memory iscc) external;

    function owner() external view returns (address);

    function receiveERC20() external;
    function setWrappedSongAuthenticity(address wrappedSong, bool isAuthentic) external;
}
