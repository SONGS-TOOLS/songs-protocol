import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture as deployContractFixture } from './fixtures/protocolFixture';

describe("SharesDistribution", function () {
    describe("create shares sale", function () {
        it("should create a wrapped song with metadata and 10000 song shares", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const sharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            await expect(wrappedSongFactory.connect(artist).createWrappedSong(
                mockStablecoin.target,
                metadata,
                sharesAmount,
                { value: creationFee }
            )).to.emit(wrappedSongFactory, "WrappedSongCreated");

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
            expect(userWrappedSongs.length).to.equal(1);

            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const newWSTokenManagementAddress = await wrappedSong.newWSTokenManagement();
            const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

            const balance = await newWSTokenManagementContract.balanceOf(artist.address, 1);
            expect(balance).to.equal(sharesAmount);
        });

        it("should put on sale 50 shares through marketplace", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule, songSharesMarketPlace } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const totalSharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            // Create a wrapped song first
            await wrappedSongFactory.connect(artist).createWrappedSong(
                mockStablecoin.target,
                metadata,
                totalSharesAmount,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const wsTokenManagement = await wrappedSong.newWSTokenManagement();
            const wsTokenManagementContract = await ethers.getContractAt("WSTokenManagement", wsTokenManagement);

            // Approve marketplace to handle tokens
            await wsTokenManagementContract.connect(artist).setApprovalForAll(songSharesMarketPlace.target, true);

            const sharesAmount = 50;
            const pricePerShare = ethers.parseUnits("100", 6); // Assuming 6 decimals for the stablecoin
            const maxSharesPerWallet = 1000;

            // Start the sale through marketplace
            await songSharesMarketPlace.connect(artist).startSale(
                wsTokenManagement,
                sharesAmount,
                pricePerShare,
                maxSharesPerWallet,
                mockStablecoin.target
            );

            const sale = await songSharesMarketPlace.getSale(wsTokenManagement);
            expect(sale.active).to.be.true;
            expect(sale.sharesForSale).to.equal(sharesAmount);
            expect(sale.pricePerShare).to.equal(pricePerShare);
            expect(sale.maxSharesPerWallet).to.equal(maxSharesPerWallet);
            expect(sale.stableCoin).to.equal(mockStablecoin.target);
        });

        it("should buy shares with stablecoin through marketplace", async function () {
            const { artist, deployer, distributor, collector, wrappedSongFactory, mockStablecoin, protocolModule, songSharesMarketPlace } = await loadFixture(deployContractFixture);
            const creationFee = await protocolModule.wrappedSongCreationFee();
            const totalSharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            // Create wrapped song
            await wrappedSongFactory.connect(artist).createWrappedSong(
                mockStablecoin.target,
                metadata,
                totalSharesAmount,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);
            const wsTokenManagement = await wrappedSong.newWSTokenManagement();
            const wsTokenManagementContract = await ethers.getContractAt("WSTokenManagement", wsTokenManagement);

            // Approve marketplace
            await wsTokenManagementContract.connect(artist).setApprovalForAll(songSharesMarketPlace.target, true);

            const sharesAmount = 50;
            const pricePerShare = ethers.parseUnits("100", 6);
            const maxSharesPerWallet = 1000;

            // Start sale
            await songSharesMarketPlace.connect(artist).startSale(
                wsTokenManagement,
                sharesAmount,
                pricePerShare,
                maxSharesPerWallet,
                mockStablecoin.target
            );

            // Transfer stablecoin to buyers
            const buyers = [deployer, distributor, collector];
            const sharesToBuy = 10; // Each buyer buys 10 shares
            const totalPrice = BigInt(sharesToBuy) * pricePerShare;

            for (const buyer of buyers) {
                await mockStablecoin.connect(deployer).transfer(buyer.address, totalPrice);
                await mockStablecoin.connect(buyer).approve(songSharesMarketPlace.target, totalPrice);

                await songSharesMarketPlace.connect(buyer).buyShares(
                    wsTokenManagement,
                    sharesToBuy,
                    buyer.address
                );

                const buyerBalance = await wsTokenManagementContract.balanceOf(buyer.address, 1);
                expect(buyerBalance).to.equal(BigInt(sharesToBuy));
            }

            const sale = await songSharesMarketPlace.getSale(wsTokenManagement);
            expect(sale.sharesForSale).to.equal(20); // 50 - (3 * 10) = 20 shares remaining
        });

        // it("should buy shares with ETH through marketplace", async function () {
            // ... (implement similar to stablecoin test but using ETH)
            // Will provide if you want the implementation
        // });
    });
});