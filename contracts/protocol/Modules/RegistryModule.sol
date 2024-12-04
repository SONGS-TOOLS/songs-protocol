// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./../Interfaces/IFeesModule.sol";
import "./../Interfaces/IReleaseModule.sol";
import "./../Interfaces/IIdentityModule.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/ILegalContractMetadata.sol";

contract ModuleRegistry is Ownable {
    IFeesModule public feesModule;
    IReleaseModule public releaseModule;
    IIdentityModule public identityModule;
    IMetadataModule public metadataModule;
    ILegalContractMetadata public legalContractMetadata;

    event FeesModuleUpdated(address indexed newModule);
    event ReleaseModuleUpdated(address indexed newModule);
    event IdentityModuleUpdated(address indexed newModule);
    event MetadataModuleUpdated(address indexed newModule);
    event LegalContractMetadataUpdated(address indexed newModule);
    constructor(
        address _feesModule,
        address _releaseModule,
        address _identityModule,
        address _metadataModule,
        address _legalContractMetadata
    ) Ownable(msg.sender) {
        feesModule = IFeesModule(_feesModule);
        releaseModule = IReleaseModule(_releaseModule);
        identityModule = IIdentityModule(_identityModule);
        metadataModule = IMetadataModule(_metadataModule);
        legalContractMetadata = ILegalContractMetadata(_legalContractMetadata);
    }   

    function updateFeesModule(IFeesModule _newFeesModule) external onlyOwner {
        require(address(_newFeesModule) != address(0), "Invalid FeesModule address");
        feesModule = _newFeesModule;
        emit FeesModuleUpdated(address(_newFeesModule));
    }

    function updateReleaseModule(IReleaseModule _newReleaseModule) external onlyOwner {
        require(address(_newReleaseModule) != address(0), "Invalid ReleaseModule address");
        releaseModule = _newReleaseModule;
        emit ReleaseModuleUpdated(address(_newReleaseModule));
    }

    function updateIdentityModule(IIdentityModule _newIdentityModule) external onlyOwner {
        require(address(_newIdentityModule) != address(0), "Invalid IdentityModule address");
        identityModule = _newIdentityModule;
        emit IdentityModuleUpdated(address(_newIdentityModule));
    }

    function updateMetadataModule(IMetadataModule _newMetadataModule) external onlyOwner {
        require(address(_newMetadataModule) != address(0), "Invalid MetadataModule address");
        metadataModule = _newMetadataModule;
        emit MetadataModuleUpdated(address(_newMetadataModule));
    }

    function updateLegalContractMetadata(ILegalContractMetadata _newLegalContractMetadata) external onlyOwner {
        require(address(_newLegalContractMetadata) != address(0), "Invalid LegalContractMetadata address");
        legalContractMetadata = _newLegalContractMetadata;
        emit LegalContractMetadataUpdated(address(_newLegalContractMetadata));
    }
}
