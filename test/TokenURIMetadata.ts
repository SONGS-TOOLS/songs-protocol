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
      description: '',
      image: 'QmcpB2wEwLDKsu7jKBb1EDqgQCCBeL29VAx6M9bFepyGyj',
      externalUrl: 'https://app.songs-tools.com/wrapped-songs/Tamago',
      animationUrl: 'QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      attributesIpfsHash: 'QmVArHJSVf1Eqn695Ki1BT86byqYM7fDwsM5yx3s6Y3eim',
    };

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
        "attributes"
      ]);

      expect(decodedMetadata.name).to.equal(`◒ - ${metadata.name}`);
      expect(decodedMetadata.description).to.equal(metadata.description);
      expect(decodedMetadata.image).to.include(metadata.image);
      expect(decodedMetadata.external_url).to.equal(metadata.externalUrl);
      expect(decodedMetadata.animation_url).to.include(metadata.animationUrl);
      expect(decodedMetadata.attributes).to.include(metadata.attributesIpfsHash);
    });

    it("Should return correct metadata format for Token ID 1 (SongShares)", async function () {
      const { wsTokensManagement, wrappedSong, metadata } = await loadFixture(deployFixture);
      
      const tokenUri = await wsTokensManagement.uri(1);
      const decodedMetadata = decodeBase64Json(tokenUri);

      expect(decodedMetadata).to.have.all.keys([
        "name",
        "description",
        "image",
        "external_url",
        "animation_url",
        "attributes"
      ]);

      expect(decodedMetadata.name).to.equal(`§ - ${metadata.name}`);
      expect(decodedMetadata.description).to.include("These are the SongShares");
      expect(decodedMetadata.description).to.include(wrappedSong.target.toString().toLowerCase());
      expect(decodedMetadata.image).to.include("data:image/svg+xml;base64,");
      expect(decodedMetadata.external_url).to.equal(metadata.externalUrl);
      expect(decodedMetadata.animation_url).to.include(metadata.animationUrl);
      expect(decodedMetadata.attributes).to.include(metadata.attributesIpfsHash);
    });

    it("Should verify SVG image format for Token ID 1", async function () {
      const { wsTokensManagement, wrappedSong } = await loadFixture(deployFixture);
      
      const tokenUri = await wsTokensManagement.uri(1);
      const decodedMetadata = decodeBase64Json(tokenUri);
      
      const svgBase64 = decodedMetadata.image.replace("data:image/svg+xml;base64,", "");
      const svgContent = Buffer.from(svgBase64, "base64").toString();

      expect(svgContent).to.include("<svg");
      expect(svgContent).to.include("</svg>");
      expect(svgContent).to.include("<circle");
      expect(svgContent).to.include("<linearGradient");
      expect(svgContent).to.include("<pattern");
    });

    it("Should update metadata and reflect changes in token URI", async function () {
      const { wrappedSong, wsTokensManagement, metadataModule } = await loadFixture(deployFixture);
      
      const updatedMetadata = {
        name: "Updated Song",
        description: "Updated description",
        image: "ipfs://QmUpdated/image.jpg",
        externalUrl: "https://updated.com",
        animationUrl: "ipfs://QmUpdated/audio.mp3",
        attributesIpfsHash: "ipfs://QmUpdated/attributes.json"
      };

      await metadataModule.connect(user).updateMetadata(wrappedSong.target, updatedMetadata);
      
      const tokenUri = await wsTokensManagement.uri(0);
      const decodedMetadata = decodeBase64Json(tokenUri);

      expect(decodedMetadata.name).to.equal(`◒ - ${updatedMetadata.name}`);
      expect(decodedMetadata.description).to.equal(updatedMetadata.description);
      expect(decodedMetadata.image).to.include(updatedMetadata.image);
    });
  });

  it("Should allow collector to buy shares", async function() {
    const { collector, artist, mockStablecoin, wrappedSong } = await loadFixture(deployFixture);
    // Test logic using collector and artist accounts
  });

  it("Should allow distributor to manage releases", async function() {
    const { distributor, protocolAdmin, wrappedSong } = await loadFixture(deployFixture);
    // Test logic using distributor and admin accounts
  });
}); 