// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IFeesModule.sol";
import "./IReleaseModule.sol";
import "./IIdentityModule.sol";

interface IRegistryModule {
    // View functions to get module addresses
    function feesModule() external view returns (IFeesModule);
    function releaseModule() external view returns (IReleaseModule);
    function identityModule() external view returns (IIdentityModule);

    // Functions to update module addresses
    function updateFeesModule(IFeesModule _newFeesModule) external;
    function updateReleaseModule(IReleaseModule _newReleaseModule) external;
    function updateIdentityModule(IIdentityModule _newIdentityModule) external;
}
