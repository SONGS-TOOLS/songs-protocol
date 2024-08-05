// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/access/AccessControl.sol"; 
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// Universal Music Distribution Protocol 
// v0.1 (UMDP)

contract UMDP is Ownable, ReentrancyGuard, AccessControl {
    // Role for managing ISRC (International Standard Recording Code)
    bytes32 public constant ISRC_MANAGER_ROLE = keccak256("ISRC_MANAGER_ROLE");

    // Struct to store royalty information
    struct RoyaltyInfo {
        address recipient; // Address of the royalty recipient
        uint256 share; // Royalty share in basis points (1% = 100 basis points)
    }

    // Mapping from NFT contract address and token ID to an array of RoyaltyInfo
    mapping(address => mapping(uint256 => RoyaltyInfo[])) public royalties;

    // Mapping from ISRC to metadata URI
    mapping(string => string) private _ISRCtoMetadataURI;

    // Mapping from NFT contract address and token ID to its associated ISRC
    mapping(address => mapping(uint256 => string)) private _nftToISRC;

    // Mapping to track accrued royalties for each recipient
    mapping(address => uint256) private accruedRoyalties;

    // Mapping to track if an ISRC has been registered
    mapping(string => bool) private _ISRCRegistered;

    // Events for logging actions within the contract
    event RoyaltiesSet(address indexed nftContract, uint256 indexed tokenId, RoyaltyInfo[] royalties);
    event RevenueAllocated(address indexed nftContract, uint256 indexed tokenId, uint256 totalRevenue);
    event RoyaltiesWithdrawn(address indexed recipient, uint256 amount);
    event ISRCRegistered(string isrc, string metadataURI);
    event NFTISRCSet(address indexed nftContract, uint256 indexed tokenId, string isrc);

    // Constructor to set up roles and ownership
    constructor(address initialOwner) Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(ISRC_MANAGER_ROLE, initialOwner);
    }

    // Function to set royalties for an NFT
    function setRoyalties(address nftContract, uint256 tokenId, RoyaltyInfo[] calldata _royalties) external {
        // TODO: check for the percentanges to not overflow.
        delete royalties[nftContract][tokenId];
        for (uint256 i = 0; i < _royalties.length; i++) {
            royalties[nftContract][tokenId].push(_royalties[i]);
        }
        emit RoyaltiesSet(nftContract, tokenId, _royalties);
    }

    function getRoyalties(address nftContract, uint256 tokenId) public view returns (RoyaltyInfo[] memory) {
        return royalties[nftContract][tokenId];
    }

    // Function to allocate revenue to the set royalties, ensuring the call is non-reentrant
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

    // Function to associate an ISRC with an NFT, restricted to ISRC Manager role
    function setNFTISRC(address nftContract, uint256 tokenId, string memory isrc) public onlyRole(ISRC_MANAGER_ROLE) {
        require(!_ISRCRegistered[isrc], "ISRC already registered");
        require(bytes(_nftToISRC[nftContract][tokenId]).length == 0, "NFT already has an ISRC associated");
        _nftToISRC[nftContract][tokenId] = isrc;
        _ISRCRegistered[isrc] = true;
        emit NFTISRCSet(nftContract, tokenId, isrc);
    }

    // Function to retrieve metadata URI by ISRC
    function getISRCMetadataURI(string memory isrc) public view returns (string memory) {
        require(_ISRCRegistered[isrc], "ISRC not registered");
        return _ISRCtoMetadataURI[isrc];
    }

    // Function for royalty recipients to withdraw their accrued royalties
    function withdrawRoyalties() external nonReentrant {
        uint256 amount = accruedRoyalties[msg.sender];
        require(amount > 0, "No royalties to withdraw");
        accruedRoyalties[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit RoyaltiesWithdrawn(msg.sender, amount);
    }

    // Functions to manage ISRC Manager role
    function grantISRCManagerRole(address account) public onlyOwner {
        grantRole(ISRC_MANAGER_ROLE, account);
    }

    function revokeISRCManagerRole(address account) public onlyOwner {
        revokeRole(ISRC_MANAGER_ROLE, account);
    }

    // Receive function to accept incoming ether payments
    receive() external payable {}
}
