// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './../Interfaces/IProtocolModule.sol';

interface IDistributorWallet {
    function stablecoin() external view returns (IERC20);
    function protocolModule() external view returns (IProtocolModule);
    function wrappedSongTreasury(address) external view returns (uint256);
    function managedWrappedSongs(uint256) external view returns (address);
    function currentBatchIndex() external view returns (uint256);

    function receivePayment(address _wrappedSong, uint256 _amount) external;
    function setAccounting(address _wrappedSong, uint256 _amount) external;
    function setAccountingBatch(address[] calldata _wrappedSongs, uint256[] calldata _amounts, uint256 _totalAmount, uint256 _batchSize) external;
    function redeem(address _wrappedSong) external;
    function confirmWrappedSongRelease(address wrappedSong) external;
    function confirmUpdateMetadata(address wrappedSong, uint256 tokenId) external;
    function rejectUpdateMetadata(address wrappedSong, uint256 tokenId) external;
    function acceptWrappedSongForReview(address wrappedSong) external;
    function rejectWrappedSongRelease(address wrappedSong) external;
}