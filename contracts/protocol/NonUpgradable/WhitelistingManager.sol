// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';

contract WhitelistingManager is Ownable {
  IERC721Enumerable public nftContract;
  bool public nftRequirementEnabled;

  event NFTContractUpdated(address indexed newNFTContract);
  event NFTRequirementToggled(bool enabled);

  /**
   * @dev Initializes the contract setting the initial owner and enabling the NFT requirement.
   * @param initialOwner The address of the initial owner.
   */
  constructor(address initialOwner) Ownable(msg.sender) {
    transferOwnership(initialOwner);
  }

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
  function isValidToCreateWrappedSong(
    address _creator
  ) public view returns (bool) {
    if (!nftRequirementEnabled) {
      return true;
    }
    return nftContract.balanceOf(_creator) > 0;
  }
}
