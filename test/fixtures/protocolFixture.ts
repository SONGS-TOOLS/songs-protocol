import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";

export interface ProtocolFixture {
  deployer: HardhatEthersSigner;
  protocolAdmin: HardhatEthersSigner;
  distributor: HardhatEthersSigner;
  artist: HardhatEthersSigner;
  collector: HardhatEthersSigner;
  treasury: HardhatEthersSigner;
  accounts: HardhatEthersSigner[];
  whitelistingManager: any;
  distributorWalletFactory: any;
  erc20Whitelist: any;
  metadataModule: any;
  legalContractMetadata: any;
  protocolModule: any;
  mockStablecoin: any;
  wrappedSongFactory: any;
  songSharesMarketPlace: any;
  metadataRenderer: any;
}

export async function deployProtocolFixture(): Promise<ProtocolFixture> {
  const [
    deployer,
    protocolAdmin,
    distributor,
    artist,
    collector,
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

  // Deploy SongSharesMarketPlace
  const SongSharesMarketPlace = await ethers.getContractFactory("SongSharesMarketPlace");
  const songSharesMarketPlace = await SongSharesMarketPlace.deploy(protocolModule.target);
  await songSharesMarketPlace.waitForDeployment();

  // Deploy mock stablecoin
  const MockToken = await ethers.getContractFactory("MockToken");
  const mockStablecoin = await MockToken.deploy("Mock USDC", "MUSDC");
  await mockStablecoin.waitForDeployment();

  // Deploy WrappedSongFactory
  const WrappedSongFactory = await ethers.getContractFactory("WrappedSongFactory");
  const wrappedSongFactory = await WrappedSongFactory.deploy(protocolModule.target);
  await wrappedSongFactory.waitForDeployment();

  // Setup protocol configurations
  await metadataModule.setProtocolModule(await protocolModule.getAddress());
  await metadataModule.connect(deployer).transferOwnership(protocolModule.target);
  await erc20Whitelist.connect(deployer).setAuthorizedCaller(protocolModule.target);
  await protocolModule.setMetadataModule(metadataModule.target);
  await protocolModule.setMetadataRenderer(metadataRenderer.target);
  await protocolModule.setWrappedSongFactory(wrappedSongFactory.target);
  await protocolModule.setWrappedSongCreationFee(ethers.parseEther("0.1"));
  await protocolModule.whitelistToken(mockStablecoin.target);
  await protocolModule.setBaseURI("ipfs://");

  return {
    deployer,
    protocolAdmin,
    distributor,
    artist,
    collector,
    treasury,
    accounts,
    whitelistingManager,
    distributorWalletFactory,
    erc20Whitelist,
    metadataModule,
    legalContractMetadata,
    protocolModule,
    mockStablecoin,
    wrappedSongFactory,
    songSharesMarketPlace,
    metadataRenderer
  };
}