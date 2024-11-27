import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";

export interface ProtocolV2Fixture {
  deployer: HardhatEthersSigner;
  protocolAdmin: HardhatEthersSigner;
  distributor: HardhatEthersSigner;
  artist: HardhatEthersSigner;
  collector: HardhatEthersSigner;
  collector2: HardhatEthersSigner;
  collector3: HardhatEthersSigner;
  treasury: HardhatEthersSigner;
  accounts: HardhatEthersSigner[];
  whitelistingManager: any;
  distributorWalletFactory: any;
  erc20Whitelist: any;
  metadataModule: any;
  legalContractMetadata: any;
  protocolModule: any;
  mockStablecoin: any;
  wrappedSongFactoryV2: any;
  songSharesMarketPlace: any;
  metadataRenderer: any;
  buyer: HardhatEthersSigner;
  startSaleFee: bigint;
}

export async function deployProtocolV2Fixture(): Promise<ProtocolV2Fixture> {
  const [
    deployer,
    protocolAdmin,
    distributor,
    artist,
    collector,
    collector2,
    collector3,
    treasury,
    ...accounts
  ] = await ethers.getSigners();

  // Deploy WhitelistingManager
  const WhitelistingManager = await ethers.getContractFactory("WhitelistingManager");
  const whitelistingManager = await WhitelistingManager.deploy(deployer.address);
  await whitelistingManager.waitForDeployment();

  // Deploy DistributorWalletFactory
  const DistributorWalletFactory = await ethers.getContractFactory("DistributorWalletFactory");
  const distributorWalletFactory = await DistributorWalletFactory.deploy(deployer.address);
  await distributorWalletFactory.waitForDeployment();

  // Deploy ERC20Whitelist
  const ERC20Whitelist = await ethers.getContractFactory("ERC20Whitelist");
  const erc20Whitelist = await ERC20Whitelist.deploy(deployer.address);
  await erc20Whitelist.waitForDeployment();

  // Deploy MetadataRenderer
  const MetadataRenderer = await ethers.getContractFactory("MetadataRenderer");
  const metadataRenderer = await MetadataRenderer.deploy();
  await metadataRenderer.waitForDeployment();

  // Deploy MetadataModule
  const MetadataModule = await ethers.getContractFactory("MetadataModule");
  const metadataModule = await MetadataModule.deploy();
  await metadataModule.waitForDeployment();
  console.log("MetadataModule V2 deployed at:", metadataModule.target);

  // Deploy LegalContractMetadata
  const LegalContractMetadata = await ethers.getContractFactory("LegalContractMetadata");
  const legalContractMetadata = await LegalContractMetadata.deploy();
  await legalContractMetadata.waitForDeployment();

  // Deploy ProtocolModule
  const ProtocolModule = await ethers.getContractFactory("ProtocolModule");
  const protocolModule = await ProtocolModule.deploy(
    distributorWalletFactory.target,
    whitelistingManager.target,
    erc20Whitelist.target,
    metadataModule.target,
    legalContractMetadata.target
  );
  await protocolModule.waitForDeployment();

  // Deploy mock stablecoin
  const MockToken = await ethers.getContractFactory("MockToken");
  const mockStablecoin = await MockToken.deploy("Mock USDC", "MUSDC");
  await mockStablecoin.waitForDeployment();

  // Deploy V2 template contracts
  const WrappedSongV2 = await ethers.getContractFactory("WrappedSongSmartAccount");
  const wrappedSongV2Template = await WrappedSongV2.deploy(protocolModule.target);
  await wrappedSongV2Template.waitForDeployment();

  const WSTokenManagementV2 = await ethers.getContractFactory("WSTokenManagement");
  const wsTokenManagementV2Template = await WSTokenManagementV2.deploy();
  await wsTokenManagementV2Template.waitForDeployment();

  // Deploy V2 factory
  const FactoryV2 = await ethers.getContractFactory("WrappedSongFactoryV2");
  const wrappedSongFactoryV2 = await FactoryV2.deploy(
    protocolModule.target,
    wrappedSongV2Template.target,
    wsTokenManagementV2Template.target
  );
  await wrappedSongFactoryV2.waitForDeployment();

  // Deploy SongSharesMarketPlace
  const SongSharesMarketPlace = await ethers.getContractFactory("SongSharesMarketPlace");
  const songSharesMarketPlace = await SongSharesMarketPlace.deploy(protocolModule.target);
  await songSharesMarketPlace.waitForDeployment();

  // Setup protocol configurations
  await metadataModule.setProtocolModule(protocolModule.target);
  await metadataModule.connect(deployer).transferOwnership(protocolModule.target);
  await erc20Whitelist.connect(deployer).setAuthorizedCaller(protocolModule.target);
  await protocolModule.setMetadataModule(metadataModule.target);
  await protocolModule.setMetadataRenderer(metadataRenderer.target);
  await protocolModule.setWrappedSongFactory(wrappedSongFactoryV2.target);
  await protocolModule.setWrappedSongCreationFee(ethers.parseEther("0.1"));
  await protocolModule.setReleaseFee(ethers.parseEther("0.1"));
  await protocolModule.setDistributorCreationFee(ethers.parseEther("0.1"));
  await protocolModule.setUpdateMetadataFee(ethers.parseEther("0.1"));
  await protocolModule.whitelistToken(mockStablecoin.target);
  await protocolModule.setBaseURI("ipfs://");

  // Set the start sale fee
  const startSaleFee = ethers.parseEther("0.1");
  await protocolModule.connect(deployer).setStartSaleFee(startSaleFee);

  // Additional V2-specific configurations
  await protocolModule.setAuthorizedContract(wrappedSongFactoryV2.target, true);
  await protocolModule.connect(deployer).transferOwnership(deployer.address);


  return {
    deployer,
    protocolAdmin,
    distributor,
    artist,
    collector,
    collector2,
    collector3,
    treasury,
    accounts,
    whitelistingManager,
    distributorWalletFactory,
    erc20Whitelist,
    metadataModule,
    legalContractMetadata,
    protocolModule,
    mockStablecoin,
    wrappedSongFactoryV2,
    songSharesMarketPlace,
    metadataRenderer,
    buyer: accounts[0],
    startSaleFee
  };
} 