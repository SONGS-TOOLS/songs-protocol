// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDistributorWalletFactory {
    function wrappedSongToDistributor(address wrappedSong) external view returns (address);
    function createDistributorWallet(address distributor) external returns (address);
    function getDistributorWallets(address distributor) external view returns (address[] memory);
    function getWrappedSongDistributor(address wrappedSong) external view returns (address);
    function checkIsDistributorWallet(address wallet) external view returns (bool);
}