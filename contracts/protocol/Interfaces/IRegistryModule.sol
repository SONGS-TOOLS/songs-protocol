// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IFeesModule.sol";
import "./IReleaseModule.sol";
import "./IIdentityModule.sol";
import "./IERC20Whitelist.sol";
import "./IMetadataModule.sol";
import "./ILegalContractMetadata.sol";
interface IRegistryModule {
    // View functions to get module addresses
    function feesModule() external view returns (IFeesModule);
    function releaseModule() external view returns (IReleaseModule);
    function identityModule() external view returns (IIdentityModule);
    function erc20whitelist() external view returns (IERC20Whitelist);
    function metadataModule() external view returns (IMetadataModule);
    function legalContractMetadata() external view returns (ILegalContractMetadata);
    function initialize(
        address _feesModule,
        address _releaseModule,
        address _identityModule,
        address _metadataModule,
        address _legalContractMetadata,
        address _erc20whitelist
    ) external;

    // Functions to update module addresses
    function updateFeesModule(IFeesModule _newFeesModule) external;
    function updateReleaseModule(IReleaseModule _newReleaseModule) external;
    function updateIdentityModule(IIdentityModule _newIdentityModule) external;
    function updateErc20Whitelist(IERC20Whitelist _newErc20Whitelist) external;
    function updateMetadataModule(IMetadataModule _newMetadataModule) external;
    function updateLegalContractMetadata(ILegalContractMetadata _newLegalContractMetadata) external;
}
