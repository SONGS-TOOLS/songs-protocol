import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture } from './fixtures/protocolFixture';

describe("WrappedSong Creation Fees", function () {
    describe("Stablecoin Fee Management", function () {
        it("should set and get wrapped song creation fee", async function () {
            const { feesModule, deployer } = await loadFixture(deployProtocolFixture);
            const newFee = ethers.parseUnits("100", 6); // 100 USDC

            await feesModule.connect(deployer).setWrappedSongCreationFee(newFee);
            const fee = await feesModule.getWrappedSongCreationFee();
            expect(fee).to.equal(newFee);
        });

        it("should set and get stablecoin fee receiver", async function () {
            const { protocolModule, deployer, collector } = await loadFixture(deployProtocolFixture);
            
            await protocolModule.connect(deployer).setStablecoinFeeReceiver(collector.address);
            const receiver = await protocolModule.getStablecoinFeeReceiver();
            expect(receiver).to.equal(collector.address);
        });

        it("should toggle pay in stablecoin setting", async function () {
            const { feesModule, deployer } = await loadFixture(deployProtocolFixture);
            
            // Enable stablecoin payments
            await feesModule.connect(deployer).setPayInStablecoin(true);
            expect(await feesModule.isPayInStablecoin()).to.be.true;

            // Disable stablecoin payments
            await feesModule.connect(deployer).setPayInStablecoin(false);
            expect(await feesModule.isPayInStablecoin()).to.be.false;
        });

        it("should create wrapped song with stablecoin fee", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule, feesModule, collector, deployer } = await loadFixture(deployProtocolFixture);
            
            // Setup stablecoin fee payment
            const creationFee = ethers.parseUnits("100", 6); // 100 USDC
            await feesModule.connect(deployer).setWrappedSongCreationFee(creationFee);
            await feesModule.connect(deployer).setPayInStablecoin(true);
            await protocolModule.connect(deployer).setStablecoinFeeReceiver(collector.address);

            // Mint USDC to artist
            await mockStablecoin.mint(artist.address, creationFee);
            await mockStablecoin.connect(artist).approve(wrappedSongFactory.target, creationFee);

            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            // Create wrapped song with stablecoin fee
            await expect(wrappedSongFactory.connect(artist).createWrappedSong(
                mockStablecoin.target,
                metadata,
                1000,
                artist.address,
                { value: 0 } // No ETH needed
            )).to.emit(wrappedSongFactory, "WrappedSongCreated")
              .to.emit(wrappedSongFactory, "CreationFeeCollected");

            // Verify fee collection
            const collectorBalance = await mockStablecoin.balanceOf(collector.address);
            expect(collectorBalance).to.equal(creationFee);
        });

        it("should fail to create wrapped song with insufficient stablecoin approval", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule, feesModule, collector, deployer } = await loadFixture(deployProtocolFixture);
            
            // Setup stablecoin fee payment
            const creationFee = ethers.parseUnits("100", 6);
            await feesModule.connect(deployer).setWrappedSongCreationFee(creationFee);
            await feesModule.connect(deployer).setPayInStablecoin(true);
            await protocolModule.connect(deployer).setStablecoinFeeReceiver(collector.address);

            // Mint USDC to artist but don't approve
            await mockStablecoin.mint(artist.address, creationFee);

            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            // Attempt to create wrapped song without approval
            await expect(wrappedSongFactory.connect(artist).createWrappedSong(
                mockStablecoin.target,
                metadata,
                1000,
                artist.address,
                { value: 0 }
            )).to.be.revertedWithCustomError(mockStablecoin, "ERC20InsufficientAllowance");
        });

        it("should fail to create wrapped song with insufficient stablecoin balance", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule, feesModule, collector, deployer } = await loadFixture(deployProtocolFixture);
            
            // Setup stablecoin fee payment
            const creationFee = ethers.parseUnits("100", 6);
            await feesModule.connect(deployer).setWrappedSongCreationFee(creationFee);
            await feesModule.connect(deployer).setPayInStablecoin(true);
            await protocolModule.connect(deployer).setStablecoinFeeReceiver(collector.address);

            // Approve without having balance
            await mockStablecoin.connect(artist).approve(wrappedSongFactory.target, creationFee);

            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            // Attempt to create wrapped song without balance
            await expect(wrappedSongFactory.connect(artist).createWrappedSong(
                mockStablecoin.target,
                metadata,
                1000,
                artist.address,
                { value: 0 }
            )).to.be.revertedWithCustomError(mockStablecoin, "ERC20InsufficientBalance");
        });

        it("should accumulate fees correctly", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule, feesModule, collector, deployer } = await loadFixture(deployProtocolFixture);
            
            // Setup stablecoin fee payment
            const creationFee = ethers.parseUnits("100", 6);
            await feesModule.connect(deployer).setWrappedSongCreationFee(creationFee);
            await feesModule.connect(deployer).setPayInStablecoin(true);
            await protocolModule.connect(deployer).setStablecoinFeeReceiver(collector.address);

            // Create multiple wrapped songs
            const numSongs = 3;
            const totalFee = creationFee * BigInt(numSongs);

            // Mint USDC to artist
            await mockStablecoin.mint(artist.address, totalFee);
            await mockStablecoin.connect(artist).approve(wrappedSongFactory.target, totalFee);

            const metadata = {
                name: "Test Song",
                description: "Test Description",
                image: "ipfs://image",
                externalUrl: "https://example.com",
                animationUrl: "ipfs://animation",
                attributesIpfsHash: "ipfs://attributes"
            };

            // Create multiple wrapped songs
            for (let i = 0; i < numSongs; i++) {
                await wrappedSongFactory.connect(artist).createWrappedSong(
                    mockStablecoin.target,
                    metadata,
                    1000,
                    artist.address,
                    { value: 0 }
                );
            }

            // Verify accumulated fees
            const accumulatedFees = await wrappedSongFactory.accumulatedFees(mockStablecoin.target);
            expect(accumulatedFees).to.equal(totalFee);

            // Verify collector balance
            const collectorBalance = await mockStablecoin.balanceOf(collector.address);
            expect(collectorBalance).to.equal(totalFee);
        });

        it("should not allow fee withdrawal by non-owner", async function () {
            const { artist, wrappedSongFactory, mockStablecoin } = await loadFixture(deployProtocolFixture);
            
            await expect(wrappedSongFactory.connect(artist).withdrawAccumulatedFees(
                mockStablecoin.target,
                artist.address
            )).to.be.revertedWith("Only protocol owner can withdraw fees");
        });
    });
}); 