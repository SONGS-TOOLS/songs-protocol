// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Interfaces/IMetadataModule.sol";
interface IReleaseModule {
    // Functions
    function requestWrappedSongReleaseWithMetadata(
        address wrappedSong,
        address distributor,
        IMetadataModule.Metadata memory newMetadata
    ) external payable;

    function requestWrappedSongRelease(
        address wrappedSong,
        address distributor
    ) external payable;

    function initialize(
        address _feesModule,
        address _erc20whitelist,
        address _distributorWalletFactory,
        address _metadataModule
    ) external;

    function removeWrappedSongReleaseRequest(address wrappedSong) external;

    function acceptWrappedSongForReview(address wrappedSong) external;

    function confirmWrappedSongRelease(address wrappedSong) external;

    function handleExpiredReviewPeriod(address wrappedSong) external;

    function rejectWrappedSongRelease(address wrappedSong) external;

    function isReleased(address wrappedSong) external view returns (bool);

    function setReviewPeriodDays(uint256 _days) external;

    function setReleasesEnabled(bool _enabled) external;

    function withdrawAccumulatedFees(address token, address recipient) external;

    function getWrappedSongDistributor(address wrappedSong) external view returns (address);

    function getPendingDistributorRequests(address wrappedSong) external view returns (address);
}
