// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import './../Interfaces/IMetadataModule.sol';
import './../Interfaces/IProtocolModule.sol';

contract WSTokenManagement is ERC1155Supply, Ownable, ReentrancyGuard {
  uint256 private _currentTokenId;
  address private immutable _minter;

  mapping(uint256 => bool) private _tokenCreated;

  uint256 public constant SONG_CONCEPT_ID = 0;
  uint256 public constant SONG_SHARES_ID = 1;
  uint256 public constant BUYOUT_TOKEN_ID = 2;
  uint256 public constant LEGAL_CONTRACT_START_ID = 3;

  uint256 public totalShares;
  mapping(uint256 => string) public legalContractURIs;
  uint256 public currentLegalContractId = LEGAL_CONTRACT_START_ID;

  IMetadataModule public metadataModule;
  IProtocolModule public protocolModule;

  event WSTokensCreated(address indexed smartAccount, address indexed minter);
  event SongSharesCreated(uint256 indexed sharesAmount, address indexed minter);
  event BuyoutTokenCreated(uint256 indexed amount, address indexed recipient);
  event LegalContractCreated(uint256 indexed tokenId, address indexed recipient, string contractURI);
  event LegalContractURIUpdated(uint256 indexed tokenId, string newURI);

  modifier onlyMinter() {
    require(msg.sender == _minter, 'Caller is not the minter');
    _;
  }

  modifier onlyMetadataModule() {
    require(
      msg.sender == address(metadataModule),
      'Only MetadataModule can update token URIs'
    );
    _;
  }

  constructor(
    address _smartAccountAddress,
    address _minterAddress,
    address _metadataModuleAddress,
    address _protocolModuleAddress
  ) ERC1155('') Ownable(_smartAccountAddress) {
    _minter = _minterAddress;
    _currentTokenId = 0;
    metadataModule = IMetadataModule(_metadataModuleAddress);
    protocolModule = IProtocolModule(_protocolModuleAddress);

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
    legalContractURIs[tokenId] = contractURI;
    _tokenCreated[tokenId] = true;
    
    emit LegalContractCreated(tokenId, owner(), contractURI);
    return tokenId;
  }



  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    if (tokenId >= LEGAL_CONTRACT_START_ID && tokenId < currentLegalContractId) {
      return legalContractURIs[tokenId];
    }
    return metadataModule.getTokenURI(owner(), tokenId);
  }

  function migrateWrappedSong(address metadataAddress) external onlyOwner {
    metadataModule = IMetadataModule(metadataAddress);
  }


  /**
   * @dev Override _beforeTokenTransfer to prevent transfers of non-created tokens.
   */
  // TODO: Triple Check

  // function _beforeTokenTransfer(
  //   address operator,
  //   address from,
  //   address to,
  //   uint256[] memory ids,
  //   uint256[] memory amounts,
  //   bytes memory data
  // ) internal virtual override(ERC1155) {
  //   super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    
  //   for (uint256 i = 0; i < ids.length; i++) {
  //     require(_tokenCreated[ids[i]], "Token ID not created");
  //   }
  // }
}
