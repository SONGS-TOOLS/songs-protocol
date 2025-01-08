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
  feesModule: any;
  releaseModule: any;
  identityModule: any;
  registryModule: any;
  buyoutTokenMarketPlace: any;
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
  const WrappedSongFactoryV2 = await ethers.getContractFactory("WrappedSongFactoryV2");
  const wrappedSongFactoryV2 = await WrappedSongFactoryV2.deploy(
    protocolModule.target,
    wrappedSongTemplate.target,
    wsTokenTemplate.target
  );
  await wrappedSongFactoryV2.waitForDeployment();
  console.log("WrappedSongFactory deployed");

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
  
  await protocolModule.setWrappedSongFactory(wrappedSongFactoryV2.target);
  console.log("ProtocolModule factory set");
  
  await protocolModule.whitelistToken(mockStablecoin.target);
  console.log("Token whitelisted");
  
  await protocolModule.setRegistryModule(registryModule.target);
  console.log("ProtocolModule registry set");
  
  await protocolModule.setBaseURI("ipfs://");
  console.log("Base URI set");
  

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
    feesModule,
    releaseModule,
    identityModule,
    registryModule,
    buyoutTokenMarketPlace
  };
} 