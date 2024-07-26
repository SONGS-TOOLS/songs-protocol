// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract WhitelistingManager is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    IERC721Enumerable public nftContract;
    bool public nftRequirementEnabled;

    event NFTContractUpdated(address indexed newNFTContract);
    event NFTRequirementToggled(bool enabled);

    /**
     * @dev Initializes the contract setting the initial owner and enabling the NFT requirement.
     * @param initialOwner The address of the initial owner.
     */
    function initialize(address initialOwner) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        transferOwnership(initialOwner);
        nftRequirementEnabled = true;
    }

    /**
     * @dev Authorizes the upgrade of the contract. Only the owner can authorize upgrades.
     * @param newImplementation The address of the new implementation contract.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev Sets the NFT contract address. Only the owner can set the NFT contract.
     * @param _newNFTContract The address of the new NFT contract.
     */
    function setNFTContract(address _newNFTContract) external onlyOwner {
        nftContract = IERC721Enumerable(_newNFTContract);
        emit NFTContractUpdated(_newNFTContract);
    }

    /**
     * @dev Toggles the NFT requirement for creating a wrapped song. Only the owner can toggle this requirement.
     * @param _enabled A boolean indicating whether the NFT requirement is enabled or not.
     */
    function toggleNFTRequirement(bool _enabled) external onlyOwner {
        nftRequirementEnabled = _enabled;
        emit NFTRequirementToggled(_enabled);
    }

    /**
     * @dev Checks if the creator is valid to create a wrapped song based on the NFT requirement.
     * @param _creator The address of the creator.
     * @return A boolean indicating if the creator is valid to create a wrapped song.
     */
    function isValidToCreateWrappedSong(address _creator) public view returns (bool) {
        if (!nftRequirementEnabled) {
            return true;
        }
        return nftContract.balanceOf(_creator) > 0;
    }
}