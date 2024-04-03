// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SmartWallet.sol";

contract SmartWalletFactory {
    event SmartWalletCreated(address indexed owner, address indexed smartWallet);

    // Mapping from owner to list of owned wallets
    mapping(address => address[]) public ownerWallets;

    function createSmartWallet(address _songNFT, address _royaltiesToken) public {
        SmartWallet newWallet = new SmartWallet(msg.sender, _songNFT, _royaltiesToken);
        ownerWallets[msg.sender].push(address(newWallet));
        emit SmartWalletCreated(msg.sender, address(newWallet));
    }

    // Get the list of wallets owned by a specific address
    function getOwnerWallets(address _owner) public view returns (address[] memory) {
        return ownerWallets[_owner];
    }
}
