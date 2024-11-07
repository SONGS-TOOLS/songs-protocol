// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IMetadataModule.sol";
import "./IERC20Whitelist.sol";
import "./ILegalContractMetadata.sol";

interface IProtocolModule {
    // Structs
    struct ReviewPeriod {
        uint256 startTime;
        uint256 endTime;
        address distributor;
    }

    // View functions
    function wrappedSongCreationFee() external view returns (uint256);
    function releaseFee() external view returns (uint256);
    function distributorWalletFactory() external view returns (address);
    function whitelistingManager() external view returns (address);
    function isrcRegistry(address wrappedSong) external view returns (string memory);
    function upcRegistry(address wrappedSong) external view returns (string memory);
    function iswcRegistry(address wrappedSong) external view returns (string memory);
    function isccRegistry(address wrappedSong) external view returns (string memory);
    function wrappedSongToDistributor(address wrappedSong) external view returns (address);
    function pendingDistributorRequests(address wrappedSong) external view returns (address);
    function wrappedSongAuthenticity(address wrappedSong) external view returns (bool);
    function reviewPeriods(address wrappedSong) external view returns (ReviewPeriod memory);
    function paused() external view returns (bool);
    function reviewPeriodDays() external view returns (uint256);
    function metadataModule() external view returns (IMetadataModule);
    function erc20whitelist() external view returns (IERC20Whitelist);
    function legalContractMetadata() external view returns (ILegalContractMetadata);

    // State-changing functions
    function setPaused(bool _paused) external;
    function requestWrappedSongRelease(address wrappedSong, address distributor) external;
    function removeWrappedSongReleaseRequest(address wrappedSong) external;
    function acceptWrappedSongForReview(address wrappedSong) external;
    function confirmWrappedSongRelease(address wrappedSong) external;
    function rejectWrappedSongRelease(address wrappedSong) external;
    function handleExpiredReviewPeriod(address wrappedSong) external;
    function setWrappedSongCreationFee(uint256 _fee) external;
    function setReleaseFee(uint256 _fee) external;
    function updateDistributorWalletFactory(address _newFactory) external;
    function setWhitelistingManager(address _whitelistingManager) external;
    function addISRC(address wrappedSong, string memory isrc) external;
    function addUPC(address wrappedSong, string memory upc) external;
    function addISWC(address wrappedSong, string memory iswc) external;
    function addISCC(address wrappedSong, string memory iscc) external;
    function setWrappedSongAuthenticity(address wrappedSong, bool _isAuthentic) external;
    function setReviewPeriodDays(uint256 _days) external;
    function setMetadataModule(address _metadataModule) external;
    function setERC20Whitelist(address _erc20whitelist) external;
    function whitelistToken(address token) external;
    function removeTokenFromWhitelist(address token) external;

    // Additional view functions
    function getWrappedSongDistributor(address wrappedSong) external view returns (address);
    function getPendingDistributorRequests(address wrappedSong) external view returns (address);
    function isReleased(address wrappedSong) external view returns (bool);
    function isAuthentic(address wrappedSong) external view returns (bool);
    function isValidToCreateWrappedSong(address creator) external view returns (bool);
    function isTokenWhitelisted(address token) external view returns (bool);
    function isAuthorizedContract(address contractAddress) external view returns (bool);
    function setAuthorizedContract(address contractAddress, bool isAuthorized) external;
    function wrappedSongFactoryAddress() external view returns (address);
    function setWrappedSongFactory(address _wrappedSongFactory) external;
    function addOwnerWrappedSong(address owner, address wrappedSong) external;
    function setSmartAccountToWSToken(address smartAccount, address wsToken) external;
    function getOwnerWrappedSongs(address owner) external view returns (address[] memory);
    function maxSaleDuration() external view returns (uint256);
    function setMaxSaleDuration(uint256 _duration) external;
    function isWSTokenFromProtocol(address wsTokenManagement) external view returns (bool);
    function setWSTokenFromProtocol(address wsTokenManagement) external;
    function getBaseURI() external view returns (string memory);
    function setBaseURI(string memory _baseURI) external;
    function getLegalContractMetadata() external view returns (address);
    function getMetadataModule() external view returns (address);
}
