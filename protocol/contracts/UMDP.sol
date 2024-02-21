// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract UMDP is Ownable, ReentrancyGuard {
    // Structure to hold royalty information for an NFT
    struct RoyaltyInfo {
        address recipient;
        uint256 share; // Stored in basis points (1% = 100 basis points)
    }

    // Mapping from NFT contract address and token ID to royalty information
    mapping(address => mapping(uint256 => RoyaltyInfo[])) public royalties;

    // Mapping from ISRC to metadata URI
    mapping(string => string) private _ISRCtoMetadataURI;

    // Mapping to track if an ISRC has been registered
    mapping(string => bool) private _ISRCRegistered;

    constructor(address initialOwner) Ownable(initialOwner) {}

    // Function to set royalty information for an NFT
    function setRoyalties(address nftContract, uint256 tokenId, RoyaltyInfo[] calldata _royalties) external onlyOwner {
        delete royalties[nftContract][tokenId]; // Reset existing royalties
        for (uint256 i = 0; i < _royalties.length; i++) {
            royalties[nftContract][tokenId].push(_royalties[i]);
        }
        emit RoyaltiesSet(nftContract, tokenId, _royalties);
    }

    // Function to allocate revenue to royalties
    function allocateRevenue(address nftContract, uint256 tokenId, uint256 totalRevenue) external payable nonReentrant {
        uint256 totalAllocated = 0;
        for (uint256 i = 0; i < royalties[nftContract][tokenId].length; i++) {
            uint256 payment = (totalRevenue * royalties[nftContract][tokenId][i].share) / 10000;
            accruedRoyalties[royalties[nftContract][tokenId][i].recipient] += payment;
            totalAllocated += payment;
        }
        require(totalAllocated <= msg.value, "Allocated more than provided");
        emit RevenueAllocated(nftContract, tokenId, totalRevenue);
    }

    // Function to register an ISRC with its metadata URI
    function registerISRC(string memory isrc, string memory metadataURI) public onlyOwner {
        require(!_ISRCRegistered[isrc], "ISRC already registered");
        _ISRCtoMetadataURI[isrc] = metadataURI;
        _ISRCRegistered[isrc] = true;
        emit ISRCRegistered(isrc, metadataURI);
    }

    // Function to retrieve metadata URI by ISRC
    function getISRCMetadataURI(string memory isrc) public view returns (string memory) {
        require(_ISRCRegistered[isrc], "ISRC not registered");
        return _ISRCtoMetadataURI[isrc];
    }

    // Tracks accrued royalties for each recipient
    mapping(address => uint256) private accruedRoyalties;

    // Events
    event RoyaltiesSet(address indexed nftContract, uint256 indexed tokenId, RoyaltyInfo[] royalties);
    event RevenueAllocated(address indexed nftContract, uint256 indexed tokenId, uint256 totalRevenue);
    event RoyaltiesWithdrawn(address indexed recipient, uint256 amount);
    event ISRCRegistered(string isrc, string metadataURI);

    // Optimized function for stakeholders to withdraw their royalties
    function withdrawRoyalties() external nonReentrant {
        uint256 amount = accruedRoyalties[msg.sender];
        require(amount > 0, "No royalties to withdraw");
        accruedRoyalties[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit RoyaltiesWithdrawn(msg.sender, amount);
    }

    receive() external payable {}
}
