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
  feesModule: any;
  releaseModule: any;
  identityModule: any;
  registryModule: any;
  buyoutTokenMarketPlace: any;
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


  // Deploy mock stablecoin
  const MockToken = await ethers.getContractFactory("MockToken");
  const mockStablecoin = await MockToken.deploy("Mock USDC", "MUSDC");
  await mockStablecoin.waitForDeployment();


  // Deploy FeesModule
  const FeesModule = await ethers.getContractFactory("FeesModule");
  const feesModule = await FeesModule.deploy();
  await feesModule.waitForDeployment();

  // Deploy ReleaseModule
  const ReleaseModule = await ethers.getContractFactory("ReleaseModule");
  const releaseModule = await ReleaseModule.deploy();
  await releaseModule.waitForDeployment();

  // Deploy IdentityModule
  const IdentityModule = await ethers.getContractFactory("IdentityModule");
  const identityModule = await IdentityModule.deploy();
  await identityModule.waitForDeployment();

  await identityModule.initialize(await releaseModule.getAddress());

  // Deploy RegistryModule
  const RegistryModule = await ethers.getContractFactory("RegistryModule");
  const registryModule = await RegistryModule.deploy();
  await registryModule.waitForDeployment();

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
  const metadataModule = await MetadataModule.deploy(deployer.address);
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

  // Deploy BuyoutTokenMarketPlace
  const BuyoutTokenMarketPlace = await ethers.getContractFactory("BuyoutTokenMarketPlace");
  const buyoutTokenMarketPlace = await BuyoutTokenMarketPlace.deploy(protocolModule.target);
  await buyoutTokenMarketPlace.waitForDeployment();

  // Deploy WrappedSongSmartAccount template
  const WrappedSongSmartAccount = await ethers.getContractFactory("WrappedSongSmartAccount");
  const wrappedSongTemplate = await WrappedSongSmartAccount.deploy();
  await wrappedSongTemplate.waitForDeployment();

  // Deploy WSTokenManagement template
  const WSTokenManagement = await ethers.getContractFactory("WSTokenManagement");
  const wsTokenTemplate = await WSTokenManagement.deploy();
  await wsTokenTemplate.waitForDeployment();

  // Deploy WrappedSongFactory
  const WrappedSongFactory = await ethers.getContractFactory("WrappedSongFactory");
  const wrappedSongFactory = await WrappedSongFactory.deploy();
  await wrappedSongFactory.waitForDeployment();
  console.log("WrappedSongFactory deployed");

  await wrappedSongFactory.setWrappedSongTemplate(await wrappedSongTemplate.getAddress());
  await wrappedSongFactory.setWSTokenTemplate(await wsTokenTemplate.getAddress());
  await wrappedSongFactory.setProtocolModule(await protocolModule.getAddress());

  // Set fees in FeesModule
  console.log("Setting fees in FeesModule...");
  await feesModule.setReleaseFee(ethers.parseEther("0"));
  await feesModule.setWrappedSongCreationFee(ethers.parseEther("0")); 
  await feesModule.setStartSaleFee(0);
  await feesModule.setWithdrawalFeePercentage(0);
  await feesModule.setDistributorCreationFee(ethers.parseEther("0"));
  await feesModule.setUpdateMetadataFee(ethers.parseEther("0"));
  console.log("Fees set in FeesModule");

  // Setup protocol configurations
  console.log("Setting up protocol configurations...");
  await metadataModule.setProtocolModule(protocolModule.target);
  console.log("MetadataModule protocol set");
  
  await metadataModule.connect(deployer).transferOwnership(protocolModule.target);
  console.log("MetadataModule ownership transferred");
  
  await erc20Whitelist.connect(deployer).setAuthorizedCaller(protocolModule.target);
  console.log("ERC20Whitelist caller authorized");
  
  await protocolModule.setMetadataModule(metadataModule.target);
  console.log("ProtocolModule metadata set");
  
  await protocolModule.setMetadataRenderer(metadataRenderer.target);
  console.log("ProtocolModule renderer set");
  
  await protocolModule.setWrappedSongFactory(wrappedSongFactory.target);
  console.log("ProtocolModule factory set");
  
  await protocolModule.whitelistToken(mockStablecoin.target);
  console.log("Token whitelisted");
  
  await protocolModule.setRegistryModule(registryModule.target);
  console.log("ProtocolModule registry set");
  
  await protocolModule.setBaseURI("https://ipfs.io/ipfs//");
  console.log("Base URI set");
  
  
  // Initialize modules
  await registryModule.initialize(
    feesModule.target,
    releaseModule.target,
    identityModule.target,
    metadataModule.target,
    legalContractMetadata.target,
    erc20Whitelist.target
  );
  console.log("RegistryModule initialized");
  
  await releaseModule.initialize(
    feesModule.target,
    erc20Whitelist.target,
    distributorWalletFactory.target,
    metadataModule.target
  );
  console.log("ReleaseModule initialized");
  console.log("Protocol setup complete!");


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
    startSaleFee: ethers.parseEther("0.1"),
    feesModule,
    releaseModule,
    identityModule,
    registryModule,
    buyoutTokenMarketPlace
  };
}