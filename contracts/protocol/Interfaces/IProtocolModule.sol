// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IMetadataModule.sol";

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

    // Additional view functions
    function getWrappedSongDistributor(address wrappedSong) external view returns (address);
    function getPendingDistributorRequests(address wrappedSong) external view returns (address);
    function isReleased(address wrappedSong) external view returns (bool);
    function isAuthentic(address wrappedSong) external view returns (bool);
    function isValidToCreateWrappedSong(address creator) external view returns (bool);
}
