// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import './../Interfaces/IMetadataModule.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/ILegalContractMetadata.sol';
import './../Interfaces/IWSTokenManagement.sol';

contract WSTokenManagement is 
    ERC1155Supply, 
    Ownable, 
    ReentrancyGuard, 
    Initializable,
    IWSTokenManagement 
{
    uint256 private _currentTokenId;
    address private _minter;

    mapping(uint256 => bool) private _tokenCreated;

    uint256 private constant _SONG_CONCEPT_ID = 0;
    uint256 private constant _SONG_SHARES_ID = 1;
    uint256 private constant _BUYOUT_TOKEN_ID = 2;
    uint256 private constant _LEGAL_CONTRACT_START_ID = 3;

    uint256 public totalShares;
    uint256 public currentLegalContractId = _LEGAL_CONTRACT_START_ID;

    address public override metadataModule;
    address public override protocolModule;
    address public override legalContractMetadata;

    event WSTokensCreated(address indexed smartAccount, address indexed minter);
    event SongSharesCreated(uint256 indexed sharesAmount, address indexed minter);
    event BuyoutTokenCreated(uint256 indexed amount, address indexed recipient);
    event LegalContractCreated(uint256 indexed tokenId, address indexed recipient, string contractURI);

    constructor() ERC1155('') Ownable(msg.sender) {
        _disableInitializers();
    }

    function transferOwnership(address newOwner) public virtual override(Ownable, IWSTokenManagement) {
        super.transferOwnership(newOwner);
    }

    function initialize(
        address _smartAccount,
        address _minterAddress,
        address _protocolModuleAddress
    ) external initializer {
        _transferOwnership(_smartAccount);
        _minter = _minterAddress;
        _currentTokenId = 0;
        protocolModule = _protocolModuleAddress;
        
        metadataModule = IProtocolModule(_protocolModuleAddress).getMetadataModule();
        legalContractMetadata = IProtocolModule(_protocolModuleAddress).getLegalContractMetadata();

        _mint(_smartAccount, _SONG_CONCEPT_ID, 1, '');
        _tokenCreated[_SONG_CONCEPT_ID] = true;
        emit WSTokensCreated(_smartAccount, _minterAddress);
    }

    function totalSupply(uint256 id) public view virtual override(ERC1155Supply, IWSTokenManagement) returns (uint256) {
        return super.totalSupply(id);
    }

    function uri(uint256 tokenId) public view virtual override(ERC1155, IWSTokenManagement) returns (string memory) {
        require(_tokenCreated[tokenId], "Token does not exist");
        
        if (tokenId >= _LEGAL_CONTRACT_START_ID) {
            return ILegalContractMetadata(legalContractMetadata).getLegalContractURI(owner(), tokenId);
        }
        
        return IMetadataModule(metadataModule).getTokenURI(owner(), tokenId);
    }

    function createSongShares(uint256 sharesAmount) external override onlyOwner {
        require(!_tokenCreated[_SONG_SHARES_ID], "Token ID already created");
        require(totalSupply(_SONG_SHARES_ID) == 0, "Shares already created");
        require(sharesAmount > 0, "Invalid shares amount");
        require(_minter != address(0), "Minter not set");

        _mint(_minter, _SONG_SHARES_ID, sharesAmount, '');
        totalShares = sharesAmount;
        _tokenCreated[_SONG_SHARES_ID] = true;
        emit SongSharesCreated(sharesAmount, _minter);
    }

    function createBuyoutToken(uint256 amount, address recipient) external override onlyOwner {
        require(!_tokenCreated[_BUYOUT_TOKEN_ID], "Token ID already created");
        require(amount > 0, "Invalid amount");
        require(recipient != address(0), "Invalid recipient");
        require(totalSupply(_BUYOUT_TOKEN_ID) == 0, "Buyout token already created");

        _mint(recipient, _BUYOUT_TOKEN_ID, amount, '');
        _tokenCreated[_BUYOUT_TOKEN_ID] = true;
        emit BuyoutTokenCreated(amount, recipient);
    }

    function createLegalContract(
        string memory contractURI
    ) external override onlyOwner returns (uint256 tokenId) {
        require(bytes(contractURI).length > 0, "Invalid URI");

        tokenId = currentLegalContractId++;
        require(!_tokenCreated[tokenId], "Token ID already created");

        _mint(owner(), tokenId, 1, '');
        ILegalContractMetadata(legalContractMetadata).setLegalContractURI(address(this), tokenId, contractURI);
        _tokenCreated[tokenId] = true;
        
        emit LegalContractCreated(tokenId, owner(), contractURI);
        return tokenId;
    }

    function migrateWrappedSong(address metadataAddress) external override onlyOwner {
        metadataModule = metadataAddress;
    }

    function SONG_CONCEPT_ID() external pure override returns (uint256) {
        return _SONG_CONCEPT_ID;
    }

    function SONG_SHARES_ID() external pure override returns (uint256) {
        return _SONG_SHARES_ID;
    }

    function BUYOUT_TOKEN_ID() external pure override returns (uint256) {
        return _BUYOUT_TOKEN_ID;
    }

    function LEGAL_CONTRACT_START_ID() external pure override returns (uint256) {
        return _LEGAL_CONTRACT_START_ID;
    }
}
