import { expect } from "chai";
import { ethers, network } from "hardhat";
describe("COLORS", function() {
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  // contracts
  let c: {
    colors: any,
    rented: any,
    prices: any,
    colorParser: any,
    secrets: any,
    auctionHouse: any,
  } = {
    colors: null,
    rented: null,
    prices: null,
    colorParser: null,
    secrets: null,
    auctionHouse: null,
  }

  before(async function() {
    console.log("MASTER BEFORE");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    c = await require("./../scripts/deploy_colors").main();
    console.log("deployed");
  });
  
  beforeEach(async function() {
    // c = await require("./../scripts/deploy_colors").main();
    // console.log("deployed");
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function() {
    it("Should set the right owner", async function() {
      expect(await c.colors.owner()).to.equal(owner.address);
    });

    it("Supply is zero", async function() {
      expect(await c.colors.totalSupply()).to.equal(0);
    });
  });

  describe("Contract interactions", function() {

    it('Creating an Auction', async () => {
      // connect to contract with other account
      const connectedAddr1 = c.auctionHouse.connect(addr1);
      const connectedOwner = c.auctionHouse.connect(owner);

      // checks if Mint Event happens and receives the correct data
      await expect(await connectedAddr1.createAuction(
        5,
        10
        ))
        .to.emit(c.auctionHouse, "AuctionCreated")
/*         .withArgs(
          addr1.address,
          priceVal,
          newTokenUriFolder
        ); */

      });

    it("Owner is AuctionHouse contract", async function() {
      const auction = await c.auctionHouse.auctions(0);
      console.log("tokenId", auction[0]);
      expect(await c.colors.ownerOf(auction[0])).to.equal(c.auctionHouse.address);
    });
/* 
    it("Create Bid Underpriced", async function() {
      const connectedAddr1 = c.auctionHouse.connect(addr1);
      const connectedAddr2 = c.auctionHouse.connect(addr2);
      const connectedOwner = c.auctionHouse.connect(owner);

      const auction = await c.auctionHouse.auctions(0);
      const tokenId = auction[0];

      const priceVal = ethers.utils.parseEther("0.001");
      
      await expect(await connectedAddr1.createBid(tokenId, 
        { value: priceVal }))
        .to.be.reverted;
    }); */

    it("Create Bid", async function() {
      const connectedAddr1 = c.auctionHouse.connect(addr1);
      const connectedAddr2 = c.auctionHouse.connect(addr2);
      const connectedOwner = c.auctionHouse.connect(owner);

      const auction = await c.auctionHouse.auctions(0);
      const tokenId = auction[0];

      const priceVal = ethers.utils.parseEther("0.01");
      
      await expect(await connectedAddr1.createBid(tokenId, 
        { value: priceVal }))
        .to.emit(c.auctionHouse, "AuctionBid")
    });

    it("Create Another Bid", async function() {
      const connectedAddr1 = c.auctionHouse.connect(addr1);
      const connectedAddr2 = c.auctionHouse.connect(addr2);
      const connectedOwner = c.auctionHouse.connect(owner);

      const auction = await c.auctionHouse.auctions(0);
      const tokenId = auction[0];
      // const amount = parseInt(auction[1].toString());

      // const bid = amount + amount * 0.05;
      // const priceVal = bid;
      const priceVal = ethers.utils.parseEther("0.02");
      await expect(await connectedAddr2.createBid(tokenId, 
        { value: priceVal }))
        .to.emit(c.auctionHouse, "AuctionBid")
    });

    it("Create Out of Auction Bid", async function() {
      const connectedAddr1 = c.auctionHouse.connect(addr1);
      const connectedAddr2 = c.auctionHouse.connect(addr2);
      const connectedOwner = c.auctionHouse.connect(owner);

      const auction = await c.auctionHouse.auctions(0);
      const tokenId = auction[0];
      // const amount = parseInt(auction[1].toString());
      await network.provider.send("evm_increaseTime", [220000]);

      const priceVal = ethers.utils.parseEther("0.2");
      await expect(await connectedAddr1.createBid(tokenId, 
        { value: priceVal }))
        .to.be.revertedWith('Auction expired')
    });

    it("Settle Auction", async function() {
      const connectedAddr1 = c.auctionHouse.connect(addr1);
      const connectedAddr2 = c.auctionHouse.connect(addr2);
      const connectedOwner = c.auctionHouse.connect(owner);

      const auction = await c.auctionHouse.auctions(0);
      const tokenId = auction[0];
      // const amount = parseInt(auction[1].toString());

      await expect(await connectedAddr1.settleAuction(tokenId))
      .to.emit(c.auctionHouse, "AuctionSettled")
    });

    it("Final Owner", async function() {
      const connectedAddr2 = c.colors.connect(addr2);
      const connectedOwner = c.auctionHouse.connect(owner);

      const auction = await c.auctionHouse.auctions(0);
      const tokenId = auction[0];
      // const amount = parseInt(auction[1].toString());
      expect(await c.colors.ownerOf(tokenId)).to.equal(addr2.address);
    });

    it("New owner change color8", async function() {
      const connectedAddr2 = c.colors.connect(addr2);
      const connectedOwner = c.auctionHouse.connect(owner);

      const auction = await c.auctionHouse.auctions(0);
      const tokenId = auction[0];
      // const amount = parseInt(auction[1].toString());
      expect(await connectedAddr2.changeColor(tokenId, 34, 252, 234)).to.emit(c.colors, "ChangeColor")
    });

   /*  it("Fail if minting with less amount sent", async function() {
      const priceVal = ethers.utils.parseEther("0.0");
      const newTokenUriFolder = "customUriFolder"
      const connectedAddr1 = ssCol.connect(addr1);

      // checks if Mint Event happens and receives the correct data
      await expect(connectedAddr1.mintMetadata(newTokenUriFolder, { value: priceVal }))
        .to.be.revertedWith("3");
    });

    it('Is possible to retrieve the correct token URI', async () => {
      // connect to contract with other account
      const connectedAddr1 = ssCol.connect(addr1);
      const priceVal = ethers.utils.parseEther("0.1");
      const newTokenUriFolder = "testURIToken/metadata.json"

      // checks if Mint Event happens and receives the correct data
      await expect(connectedAddr1.mintMetadata(newTokenUriFolder, { value: priceVal }))

      const tokenId = 0
      let metadata = await ssCol.tokenURI(tokenId);
      assert.equal(`${contractData.baseURI}${contractData.defaultTokenURI}`, metadata);
    })

    it('Change Base URI and retrieve tokenURI successfully', async () => {
      // connect to contract with other account
      const connectedAddr1 = ssCol.connect(addr1);
      const connectedOwner = ssCol.connect(owner);
      const priceVal = ethers.utils.parseEther("0.1");
      const new_baseURI = "https://base.com/"
      const newTokenUriFolder = "customUriFolder"

      // checks if Mint Event happens and receives the correct data
      await expect(connectedAddr1.mintMetadata(newTokenUriFolder, { value: priceVal }))
      await connectedOwner.setBaseURI(new_baseURI);

      const tokenId = 0
      let metadata = await ssCol.tokenURI(tokenId);
      assert.equal(`${new_baseURI}${newTokenUriFolder}`, metadata);
    })

    it('It will not mint over supply', async () => {
      // connect to contract with other account
      const connectedAddr1 = ssCol.connect(addr1);
      const priceVal = ethers.utils.parseEther("0.1");
      const newTokenUriFolder = "customUriFolder"
      const supply = await ssCol.supply()

      for (let index = 0; index < supply; index++) {
        await connectedAddr1.mintMetadata(newTokenUriFolder, { value: priceVal })
      }

      // checks if Mint Event happens and receives the correct data
      await expect(connectedAddr1.mintMetadata(newTokenUriFolder, { value: priceVal }))
        .to.be.revertedWith("2");
    }) */

  });

  describe("Contract interactions", function() {

    it('Creating an Auction', async () => {
      // connect to contract with other account
      const connectedAddr1 = c.auctionHouse.connect(addr1);
      const connectedOwner = c.auctionHouse.connect(owner);

      // checks if Mint Event happens and receives the correct data
      const auction = await c.auctionHouse.auctions(0);
      const tokenId = auction[0];
      // const amount = parseInt(auction[1].toString());
      expect(await c.colors.ownerOf(tokenId)).to.equal(addr2.address);
      await expect(await connectedAddr1.createAuction(
        5,
        10
        ))
        .to.emit(c.auctionHouse, "AuctionCreated")
/*         .withArgs(
          addr1.address,
          priceVal,
          newTokenUriFolder
        ); */

      });
    });
});

