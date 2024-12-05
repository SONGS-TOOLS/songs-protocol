// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./../Interfaces/IFeesModule.sol";
import "./../Interfaces/IReleaseModule.sol";
import "./../Interfaces/IIdentityModule.sol";
import "./../Interfaces/IMetadataModule.sol";
import "./../Interfaces/ILegalContractMetadata.sol";
import "./../Interfaces/IERC20Whitelist.sol";
contract RegistryModule is Ownable {
    IFeesModule public feesModule;
    IReleaseModule public releaseModule;
    IIdentityModule public identityModule;
    IMetadataModule public metadataModule;
    ILegalContractMetadata public legalContractMetadata;
    IERC20Whitelist public erc20whitelist;

    bool private initialized;

    event FeesModuleUpdated(address indexed newModule);
    event ReleaseModuleUpdated(address indexed newModule);
    event IdentityModuleUpdated(address indexed newModule);
    event MetadataModuleUpdated(address indexed newModule);
    event LegalContractMetadataUpdated(address indexed newModule);
    event Erc20WhitelistUpdated(address indexed newModule);
    constructor() Ownable(msg.sender) {
        // This constructor is now empty as the initialization logic is moved to the initialize function
    }   

    function initialize(
        address _feesModule,
        address _releaseModule,
        address _identityModule,
        address _metadataModule,
        address _legalContractMetadata,
        address _erc20whitelist
    ) external onlyOwner {
        require(!initialized, "Contract is already initialized");
        initialized = true;

        feesModule = IFeesModule(_feesModule);
        releaseModule = IReleaseModule(_releaseModule);
        identityModule = IIdentityModule(_identityModule);
        metadataModule = IMetadataModule(_metadataModule);
        legalContractMetadata = ILegalContractMetadata(_legalContractMetadata);
        erc20whitelist = IERC20Whitelist(_erc20whitelist);
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
    function updateErc20Whitelist(IERC20Whitelist _newErc20Whitelist) external onlyOwner {
        require(address(_newErc20Whitelist) != address(0), "Invalid Erc20Whitelist address");
        erc20whitelist = _newErc20Whitelist;
        emit Erc20WhitelistUpdated(address(_newErc20Whitelist));
    }
}
