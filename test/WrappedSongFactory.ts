import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture as deployContractFixture } from './fixtures/protocolFixture';

describe("WrappedSongFactory", function () {

    describe("createWrappedSong", function () {
        it("should create a wrapped song with new metadata module", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule,feesModule } = await loadFixture(deployContractFixture);
            const creationFee = await feesModule.getWrappedSongCreationFee();
            const sharesAmount = 1;
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
                artist.address,
                 { value: creationFee }))
                .to.emit(wrappedSongFactory, "WrappedSongCreated");

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
            expect(userWrappedSongs.length).to.equal(1);
        });

        it("should fail to create a wrapped song with metadata with insufficient fee", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, feesModule } = await loadFixture(deployContractFixture);
            await feesModule.setWrappedSongCreationFee(ethers.parseEther("1"));

            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            await expect(wrappedSongFactory.connect(artist).createWrappedSong(
                mockStablecoin.target, metadata, 1000, artist.address, { value: 0 }))
                .to.be.revertedWith("Incorrect ETH fee amount");
        });

        it("should create a wrapped song with metadata and 10000 song shares", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule, feesModule } = await loadFixture(deployContractFixture);
            const creationFee = await feesModule.wrappedSongCreationFee();
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
                artist.address,
                { value: creationFee }
            )).to.emit(wrappedSongFactory, "WrappedSongCreated");

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
            expect(userWrappedSongs.length).to.equal(1);

            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const newWSTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
            const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

            const balance = await newWSTokenManagementContract.balanceOf(artist.address, 1);
            expect(balance).to.equal(sharesAmount);
        });

        it("should create 5 wrapped songs with different owners", async function () {
            const { artist, deployer, distributor, collector, protocolAdmin, wrappedSongFactory, mockStablecoin, protocolModule, distributorWalletFactory, feesModule } = await loadFixture(deployContractFixture);
            const creationFee = await feesModule.wrappedSongCreationFee();
            const sharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };
            const users = [artist, deployer, distributor, collector, protocolAdmin];

            for (const user of users) {
                await expect(wrappedSongFactory.connect(user).createWrappedSong(
                    mockStablecoin.target,
                    metadata,
                    sharesAmount,
                    user.address,
                    { value: creationFee }
                )).to.emit(wrappedSongFactory, "WrappedSongCreated");

                const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
                expect(userWrappedSongs.length).to.equal(1);

                const wrappedSongAddress = userWrappedSongs[0];
                const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

                const newWSTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
                const newWSTokenManagementContract = await ethers.getContractAt("WSTokenManagement", newWSTokenManagementAddress);

                const balance = await newWSTokenManagementContract.balanceOf(user.address, 1);
                expect(balance).to.equal(sharesAmount);
            }

        });


        it("should request the release of 5 wrapped songs", async function () {
            const { artist, deployer, distributor, collector, protocolAdmin, releaseModule, wrappedSongFactory, mockStablecoin, protocolModule, distributorWalletFactory, feesModule } = await loadFixture(deployContractFixture);
            const creationFee = await feesModule.wrappedSongCreationFee();
            const sharesAmount = 10000;
            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };
            const users = [artist, deployer, distributor, collector, protocolAdmin];

            const distributorCreationFee = await feesModule.distributorCreationFee();
            await expect(distributorWalletFactory.connect(deployer).createDistributorWallet(
                mockStablecoin.target,
                protocolModule.target,
                distributor.address,
                { value: distributorCreationFee }
            )).to.emit(distributorWalletFactory, "DistributorWalletCreated");

            const wallets = await distributorWalletFactory.getDistributorWallets(distributor.address);
            expect(wallets.length).to.equal(1);

            for (const user of users) {
                await expect(wrappedSongFactory.connect(user).createWrappedSong(
                    mockStablecoin.target,
                    metadata,
                    sharesAmount,
                    user.address,
                    { value: creationFee }
                )).to.emit(wrappedSongFactory, "WrappedSongCreated");

                const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(user.address);
                expect(userWrappedSongs.length).to.equal(1);

                const wrappedSongAddress = userWrappedSongs[0];

                const releaseFee = await feesModule.releaseFee();
                await expect(releaseModule.connect(user).requestWrappedSongRelease(wrappedSongAddress, wallets[0], { value: releaseFee })).to.emit(releaseModule, "WrappedSongReleaseRequested");
            }
        });
    });
});