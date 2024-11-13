import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployProtocolFixture } from "./fixtures/protocolFixture";

describe("Token URI Metadata Tests", function () {
  async function deployFixture() {
    // Deploy protocol
    const protocol = await loadFixture(deployProtocolFixture);
    
    // Create initial metadata
    const metadata = {
      name: 'Tamago',
      description: 'Test song description',
      image: 'QmcpB2wEwLDKsu7jKBb1EDqgQCCBeL29VAx6M9bFepyGyj',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Tamago',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    };

    // Set base URI in protocol
    await protocol.protocolModule.setBaseURI("ipfs://");

    // Create wrapped song as artist
    const creationFee = await protocol.protocolModule.wrappedSongCreationFee();
    await protocol.wrappedSongFactory.connect(protocol.artist).createWrappedSong(
      protocol.mockStablecoin.target,
      metadata,
      10000,
      { value: creationFee }
    );

    // Get the created wrapped song
    const artistWrappedSongs = await protocol.protocolModule.getOwnerWrappedSongs(protocol.artist.address);
    const wrappedSong = await ethers.getContractAt(
      "WrappedSongSmartAccount",
      artistWrappedSongs[0]
    );

    // Get the WSTokenManagement instance
    const wsTokensManagement = await ethers.getContractAt(
      "WSTokenManagement",
      await wrappedSong.getWSTokenManagementAddress()
    );

    return {
      ...protocol,
      wrappedSong,
      wsTokensManagement,
      metadata
    };
  }

  function decodeBase64Json(uri: string) {
    const base64Data = uri.replace("data:application/json;base64,", "");
    const jsonString = Buffer.from(base64Data, "base64").toString();
    return JSON.parse(jsonString);
  }

  describe("Token URI Metadata", function () {
    it("Should return correct metadata format for Token ID 0 (Wrapped Song)", async function () {
      const { wrappedSong, metadata } = await loadFixture(deployFixture);
      const wsTokensManagement = await ethers.getContractAt(
        "WSTokenManagement",
        await wrappedSong.getWSTokenManagementAddress()
      );
      const tokenUri = await wsTokensManagement.uri(0);
      const decodedMetadata = decodeBase64Json(tokenUri);

      expect(decodedMetadata).to.have.all.keys([
        "name",
        "description",
        "image",
        "external_url",
        "animation_url",
        "attributes",
        "registryCodes",
        "authenticity"
      ]);

      expect(decodedMetadata.name).to.equal(`◒ ${metadata.name}`);
      expect(decodedMetadata.description).to.equal(metadata.description);
      expect(decodedMetadata.image).to.include(`ipfs://${metadata.image}`);
      expect(decodedMetadata.external_url).to.equal(metadata.externalUrl);
      expect(decodedMetadata.animation_url).to.include(`ipfs://${metadata.animationUrl}`);
      expect(decodedMetadata.attributes).to.include(`ipfs://${metadata.attributesIpfsHash}`);
      
      // Check registry codes structure
      expect(decodedMetadata.registryCodes).to.have.all.keys([
        "ISRC",
        "UPC",
        "ISWC",
        "ISCC"
      ]);

      // Check authenticity structure
      expect(decodedMetadata.authenticity).to.have.property('isAuthentic');
      expect(decodedMetadata.authenticity.isAuthentic).to.be.false; // Default should be false
    });

    it("Should return correct metadata format for Token ID 1 (Song Shares)", async function () {
      const { wrappedSong, metadata } = await loadFixture(deployFixture);
      const wsTokensManagement = await ethers.getContractAt(
        "WSTokenManagement",
        await wrappedSong.getWSTokenManagementAddress()
      );
      const tokenUri = await wsTokensManagement.uri(1);
      const decodedMetadata = decodeBase64Json(tokenUri);

      expect(decodedMetadata.name).to.equal(`§ ${metadata.name}`);
      expect(decodedMetadata.description).to.include("These are the SongShares representing your share");
      expect(decodedMetadata.image).to.include(`ipfs://${metadata.image}`);
      expect(decodedMetadata.authenticity).to.have.property('isAuthentic');
      expect(decodedMetadata.registryCodes).to.have.all.keys([
        "ISRC",
        "UPC",
        "ISWC",
        "ISCC"
      ]);
    });

    it("Should update authenticity status correctly through distributor", async function () {
      const { deployer, artist, distributor, protocolModule, wrappedSong, distributorWalletFactory, mockStablecoin } = await loadFixture(deployFixture);
      
      // Create distributor wallet
      await distributorWalletFactory.connect(deployer).createDistributorWallet(
        mockStablecoin.target,
        protocolModule.target,
        distributor.address
      );

      const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
      const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

      // Request release
      await protocolModule.connect(artist).requestWrappedSongRelease(
        wrappedSong.target,
        distributorWallet.target
      );

      // Confirm release through the distributor wallet
      await distributorWallet.connect(distributor).confirmWrappedSongRelease(wrappedSong.target);

      // Set authenticity through the distributor wallet contract
      await distributorWallet.connect(distributor).setWrappedSongAuthenticity(wrappedSong.target, true);

      // Get token URI and check authenticity
      const wsTokensManagement = await ethers.getContractAt(
        "WSTokenManagement",
        await wrappedSong.getWSTokenManagementAddress()
      );
      const tokenUri = await wsTokensManagement.uri(0);
      const decodedMetadata = decodeBase64Json(tokenUri);

      expect(decodedMetadata.authenticity.isAuthentic).to.be.true;
    });

    it("Should not allow setting authenticity when protocol is paused", async function () {
      const { deployer, artist, distributor, protocolModule, wrappedSong, distributorWalletFactory, mockStablecoin } = await loadFixture(deployFixture);
      
      // Create distributor wallet
      await distributorWalletFactory.connect(deployer).createDistributorWallet(
        mockStablecoin.target,
        protocolModule.target,
        distributor.address
      );

      const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
      const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

      // Request and confirm release
      await protocolModule.connect(artist).requestWrappedSongRelease(
        wrappedSong.target,
        distributorWallet.target
      );
      await distributorWallet.connect(distributor).confirmWrappedSongRelease(wrappedSong.target);

      // Pause the protocol
      await protocolModule.connect(deployer).pause();

      // Try to set authenticity while paused
      await expect(
        protocolModule.connect(distributor).setWrappedSongAuthenticity(wrappedSong.target, true)
      ).to.be.revertedWithCustomError(protocolModule, "EnforcedPause");
    });

    it("Should allow setting authenticity after unpausing", async function () {
      const { deployer, artist, distributor, protocolModule, wrappedSong, distributorWalletFactory, mockStablecoin } = await loadFixture(deployFixture);
      
      // Create distributor wallet
      await distributorWalletFactory.connect(deployer).createDistributorWallet(
        mockStablecoin.target,
        protocolModule.target,
        distributor.address
      );

      const distributorWallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
      const distributorWallet = await ethers.getContractAt("DistributorWallet", distributorWallets[0]);

      // Request and confirm release
      await protocolModule.connect(artist).requestWrappedSongRelease(
        wrappedSong.target,
        distributorWallet.target
      );
      await distributorWallet.connect(distributor).confirmWrappedSongRelease(wrappedSong.target);

      // Pause and then unpause the protocol
      await protocolModule.connect(deployer).pause();
      await protocolModule.connect(deployer).unpause();

      // Set authenticity through the distributor wallet
      await expect(
        distributorWallet.connect(distributor).setWrappedSongAuthenticity(wrappedSong.target, true)
      ).to.not.be.reverted;

      // Verify authenticity was set
      const wsTokensManagement = await ethers.getContractAt(
        "WSTokenManagement",
        await wrappedSong.getWSTokenManagementAddress()
      );
      const tokenUri = await wsTokensManagement.uri(0);
      const decodedMetadata = decodeBase64Json(tokenUri);
      expect(decodedMetadata.authenticity.isAuthentic).to.be.true;
    });
  });
}); 