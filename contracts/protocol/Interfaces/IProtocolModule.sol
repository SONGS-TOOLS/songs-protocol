// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IProtocolModule {

    // Existing view functions
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
    function paused() external view returns (bool);
    function reviewPeriodDays() external view returns (uint256);

    // Existing state-changing functions
    function requestWrappedSongRelease(address wrappedSong, address distributor) external;
    function removeWrappedSongReleaseRequest(address wrappedSong) external;
    function confirmWrappedSongRelease(address wrappedSong) external;
    function rejectWrappedSongRelease(address wrappedSong) external;
    function setWrappedSongCreationFee(uint256 _fee) external;
    function setReleaseFee(uint256 _fee) external;
    function updateDistributorWalletFactory(address _newFactory) external;
    function setWhitelistingManager(address _whitelistingManager) external;
    function addISRC(address wrappedSong, string memory isrc) external;
    function addUPC(address wrappedSong, string memory upc) external;
    function addISWC(address wrappedSong, string memory iswc) external;
    function addISCC(address wrappedSong, string memory iscc) external;

    // Metadata updates
    function requestUpdateMetadata(address wrappedSong, uint256 tokenId, string memory newMetadata) external;
    function confirmUpdateMetadata(address wrappedSong, uint256 tokenId) external;
    function rejectUpdateMetadata(address wrappedSong, uint256 tokenId) external;
    function clearPendingMetadataUpdate(address wrappedSong, uint256 tokenId) external;

    // New functions based on the updated ProtocolModule.sol
    function acceptWrappedSongForReview(address wrappedSong) external;
    function handleExpiredReviewPeriod(address wrappedSong) external;
    function setReviewPeriodDays(uint256 _days) external;
    function setPaused(bool _paused) external;

    // Existing view functions
    function getWrappedSongDistributor(address wrappedSong) external view returns (address);
    function getPendingDistributorRequests(address wrappedSong) external view returns (address);
    function getPendingMetadataUpdate(address wrappedSong, uint256 tokenId) external view returns (string memory);
    function isMetadataUpdateConfirmed(address wrappedSong, uint256 tokenId) external view returns (bool);
    function isReleased(address wrappedSong) external view returns (bool);
    function isAuthentic(address wrappedSong) external view returns (bool);
    function isValidToCreateWrappedSong(address creator) external view returns (bool);

    // New view function for review periods
    function reviewPeriods(address wrappedSong) external view returns (uint256 startTime, uint256 endTime, address distributor);

    // Existing state-changing function
    function setWrappedSongAuthenticity(address wrappedSong, bool isAuthentic) external;
}