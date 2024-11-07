// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import './../Interfaces/IMetadataModule.sol';
import './../Interfaces/IProtocolModule.sol';
import './../Interfaces/ILegalContractMetadata.sol';

contract WSTokenManagement is ERC1155Supply, Ownable, ReentrancyGuard {
  uint256 private _currentTokenId;
  address private immutable _minter;

  mapping(uint256 => bool) private _tokenCreated;

  uint256 public constant SONG_CONCEPT_ID = 0;
  uint256 public constant SONG_SHARES_ID = 1;
  uint256 public constant BUYOUT_TOKEN_ID = 2;
  uint256 public constant LEGAL_CONTRACT_START_ID = 3;

  uint256 public totalShares;
  uint256 public currentLegalContractId = LEGAL_CONTRACT_START_ID;

  IMetadataModule public metadataModule;
  IProtocolModule public protocolModule;
  ILegalContractMetadata public legalContractMetadata;

  event WSTokensCreated(address indexed smartAccount, address indexed minter);
  event SongSharesCreated(uint256 indexed sharesAmount, address indexed minter);
  event BuyoutTokenCreated(uint256 indexed amount, address indexed recipient);
  event LegalContractCreated(uint256 indexed tokenId, address indexed recipient, string contractURI);

  constructor(
    address _smartAccountAddress,
    address _minterAddress,
    address _protocolModuleAddress
  ) ERC1155('') Ownable(_smartAccountAddress) {
    _minter = _minterAddress;
    _currentTokenId = 0;
    protocolModule = IProtocolModule(_protocolModuleAddress);
    
    // Load modules from ProtocolModule
    metadataModule = IMetadataModule(protocolModule.getMetadataModule());
    legalContractMetadata = ILegalContractMetadata(protocolModule.getLegalContractMetadata());

    // Create song concept NFT to the WrappedSongSmartAccount
    _mint(_smartAccountAddress, SONG_CONCEPT_ID, 1, '');
    _tokenCreated[SONG_CONCEPT_ID] = true;
    emit WSTokensCreated(_smartAccountAddress, _minterAddress);
  }

  /**
   * @dev Creates the fungible song shares.
   * @param sharesAmount The amount of shares to create.
   */
  function createSongShares(uint256 sharesAmount) external onlyOwner {
    require(!_tokenCreated[SONG_SHARES_ID], "Token ID already created");
    require(totalSupply(SONG_SHARES_ID) == 0, "Shares already created");
    require(sharesAmount > 0, "Invalid shares amount");

    _mint(_minter, SONG_SHARES_ID, sharesAmount, '');
    totalShares = sharesAmount;
    _tokenCreated[SONG_SHARES_ID] = true;
    emit SongSharesCreated(sharesAmount, _minter);
  }

  /**
   * @dev Creates a buyout token.
   * @param amount The amount of buyout tokens to create.
   * @param recipient The address that will receive the buyout token.
   */
  function createBuyoutToken(uint256 amount, address recipient) external onlyOwner {
    require(!_tokenCreated[BUYOUT_TOKEN_ID], "Token ID already created");
    require(amount > 0, "Invalid amount");
    require(recipient != address(0), "Invalid recipient");
    require(totalSupply(BUYOUT_TOKEN_ID) == 0, "Buyout token already created");

    _mint(recipient, BUYOUT_TOKEN_ID, amount, '');
    _tokenCreated[BUYOUT_TOKEN_ID] = true;
    emit BuyoutTokenCreated(amount, recipient);
  }

  /**
   * @dev Creates a new legal contract token with a specific URI.
   * @param contractURI The URI for the legal contract.
   * @return tokenId The ID of the newly created legal contract token.
   */
  function createLegalContract(
    string memory contractURI
  ) external onlyOwner returns (uint256 tokenId) {
    require(bytes(contractURI).length > 0, "Invalid URI");

    tokenId = currentLegalContractId++;
    require(!_tokenCreated[tokenId], "Token ID already created");

    _mint(owner(), tokenId, 1, '');
    legalContractMetadata.setLegalContractURI(address(this), tokenId, contractURI);
    _tokenCreated[tokenId] = true;
    
    emit LegalContractCreated(tokenId, owner(), contractURI);
    return tokenId;
  }

  /**
   * @dev Returns the URI for a token.
   * @param tokenId The ID of the token.
   * @return The URI for the token.
   */
  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    require(_tokenCreated[tokenId], "Token does not exist");
    
    if (tokenId >= LEGAL_CONTRACT_START_ID) {
      return legalContractMetadata.getLegalContractURI(owner(), tokenId);
    }
    
    // For tokens 0-2, use the metadata module
    return metadataModule.getTokenURI(owner(), tokenId);
  }

  function migrateWrappedSong(address metadataAddress) external onlyOwner {
    metadataModule = IMetadataModule(metadataAddress);
  }

}
