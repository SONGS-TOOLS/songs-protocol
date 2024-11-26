import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";

export interface ProtocolFixture {
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
  wrappedSongFactory: any;
  songSharesMarketPlace: any;
  metadataRenderer: any;
  buyer: HardhatEthersSigner;
  startSaleFee: bigint;
}

export async function deployProtocolFixture(): Promise<ProtocolFixture> {
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

  // Deploy template contracts
  const WrappedSongSmartAccount = await ethers.getContractFactory("WrappedSongSmartAccount");
  const wrappedSongTemplate = await WrappedSongSmartAccount.deploy(
    protocolModule.target // Only protocolModule is immutable
  );
  await wrappedSongTemplate.waitForDeployment();

  const WSTokenManagement = await ethers.getContractFactory("WSTokenManagement");
  const wsTokenTemplate = await WSTokenManagement.deploy(); // No constructor args needed
  await wsTokenTemplate.waitForDeployment();

  // Deploy WrappedSongFactory with templates
  const WrappedSongFactory = await ethers.getContractFactory("WrappedSongFactory");
  const wrappedSongFactory = await WrappedSongFactory.deploy(
    protocolModule.target,
    wrappedSongTemplate.target,
    wsTokenTemplate.target
  );
  await wrappedSongFactory.waitForDeployment();

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
  await protocolModule.setWrappedSongFactory(wrappedSongFactory.target);
  await protocolModule.setWrappedSongCreationFee(ethers.parseEther("0.1"));
  await protocolModule.whitelistToken(mockStablecoin.target);
  await protocolModule.setBaseURI("ipfs://");

  // Set the start sale fee explicitly after deployment
  const startSaleFee = ethers.parseEther("0.1"); // This returns a bigint in ethers v6
  const setFeeTx = await protocolModule.connect(deployer).setStartSaleFee(startSaleFee);
  await setFeeTx.wait();

  // Verify the fee was set correctly
  const verifiedFee = await protocolModule.getStartSaleFee();
  if (verifiedFee !== startSaleFee) {
    throw new Error(`Fee not set correctly. Expected ${startSaleFee}, got ${verifiedFee}`);
  }

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
    wrappedSongFactory,
    songSharesMarketPlace,
    metadataRenderer,
    buyer: accounts[0],
    startSaleFee
  };
}