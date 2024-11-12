// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWrappedSongTypes {
    struct EpochBalance {
        uint256 lastClaimedEpoch;
        uint256 lastClaimedETHEpoch;
    }

    struct EarningsEpoch {
        uint256 epochId;
        uint256 amount;
        uint256 earningsPerShare;
        uint256 timestamp;
        address sender;
    }
} 