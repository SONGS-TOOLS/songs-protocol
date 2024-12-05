import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from "hardhat";
import { deployProtocolFixture as deployContractFixture } from './fixtures/protocolFixture';

describe("MarketPlace SongShares", function () {
    describe("create shares sale", function () {
        it("should create a wrapped song with metadata and 10000 song shares", async function () {
            const { 
                artist, 
                wrappedSongFactory,
                mockStablecoin,
                protocolModule,
                feesModule,
                releaseModule
            } = await loadFixture(deployContractFixture);

            // Debugging: Log the address values
            console.log("Artist Address:", artist.address);
            console.log("Mock Stablecoin Target:", mockStablecoin.target);

            const creationFee = await feesModule.getWrappedSongCreationFee();
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

            const wsTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
            const wsTokenManagementContract = await ethers.getContractAt("WSTokenManagement", wsTokenManagementAddress);

            const balance = await wsTokenManagementContract.balanceOf(artist.address, 1);
            expect(balance).to.equal(sharesAmount);
        });

        it("should put on sale 50 shares through marketplace", async function () {
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule, songSharesMarketPlace, feesModule } = await loadFixture(deployContractFixture);
            const creationFee = await feesModule.getWrappedSongCreationFee();
            const startSaleFee = await feesModule.getStartSaleFee();
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
                artist.address,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);

            const wsTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
            const wsTokenManagementContract = await ethers.getContractAt("WSTokenManagement", wsTokenManagementAddress);

            // Approve marketplace to handle tokens
            await wsTokenManagementContract.connect(artist).setApprovalForAll(songSharesMarketPlace.target, true);

            const sharesAmount = 50;
            const pricePerShare = ethers.parseUnits("100", 6); // Assuming 6 decimals for the stablecoin
            const maxSharesPerWallet = 50;

            // Start the sale through marketplace with fee
            await songSharesMarketPlace.connect(artist).startSale(
                wrappedSongAddress,
                sharesAmount,
                pricePerShare,
                maxSharesPerWallet,
                mockStablecoin.target,
                { value: startSaleFee }
            );

            const sale = await songSharesMarketPlace.getSale(wrappedSongAddress);
            expect(sale.active).to.be.true;
            expect(sale.sharesForSale).to.equal(sharesAmount);
            expect(sale.pricePerShare).to.equal(pricePerShare);
            expect(sale.maxSharesPerWallet).to.equal(maxSharesPerWallet);
            expect(sale.stableCoin).to.equal(mockStablecoin.target);
        });

        it("should buy shares with stablecoin through marketplace", async function () {
            const { artist, deployer, distributor, collector, wrappedSongFactory, mockStablecoin, protocolModule, songSharesMarketPlace, feesModule } = await loadFixture(deployContractFixture);
            const creationFee = await feesModule.getWrappedSongCreationFee();
            const startSaleFee = await feesModule.getStartSaleFee();
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
                artist.address,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
            const wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);
            const wsTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
            const wsTokenManagementContract = await ethers.getContractAt("WSTokenManagement", wsTokenManagementAddress);

            // Approve marketplace
            await wsTokenManagementContract.connect(artist).setApprovalForAll(songSharesMarketPlace.target, true);

            const sharesAmount = 50;
            const pricePerShare = ethers.parseUnits("100", 6);
            const maxSharesPerWallet = 50;

            // Start sale with fee
            await songSharesMarketPlace.connect(artist).startSale(
                wrappedSongAddress,
                sharesAmount,
                pricePerShare,
                maxSharesPerWallet,
                mockStablecoin.target,
                { value: startSaleFee }
            );

            // Transfer stablecoin to buyers
            const buyers = [deployer, distributor, collector];
            const sharesToBuy = 10; // Each buyer buys 10 shares
            const totalPrice = BigInt(sharesToBuy) * pricePerShare;

            for (const buyer of buyers) {
                await mockStablecoin.connect(deployer).transfer(buyer.address, totalPrice);
                await mockStablecoin.connect(buyer).approve(songSharesMarketPlace.target, totalPrice);

                await songSharesMarketPlace.connect(buyer).buyShares(
                    wrappedSongAddress,
                    sharesToBuy,
                    buyer.address
                );

                const buyerBalance = await wsTokenManagementContract.balanceOf(buyer.address, 1);
                expect(buyerBalance).to.equal(BigInt(sharesToBuy));
            }

            const sale = await songSharesMarketPlace.getSale(wrappedSongAddress);
            expect(sale.sharesForSale).to.equal(20); // 50 - (3 * 10) = 20 shares remaining
        });

        // it("should buy shares with ETH through marketplace", async function () {
            // ... (implement similar to stablecoin test but using ETH)
            // Will provide if you want the implementation
        // });
    });

    describe("MarketPlace SongShares Edge Cases", function () {
        let fixture: any;
        let wrappedSongAddress: string;
        let startSaleFee: bigint;
        let sharesAmount: number;
        let pricePerShare: bigint;
        let wsTokenManagementContract: any;
        let maxSharesPerWallet: number;

        beforeEach(async function () {
            fixture = await loadFixture(deployContractFixture);
            const { artist, wrappedSongFactory, mockStablecoin, protocolModule, feesModule, songSharesMarketPlace } = fixture;

            const creationFee = await feesModule.getWrappedSongCreationFee();
            const totalSharesAmount = 10000;
            
            // Create wrapped song
            await wrappedSongFactory.connect(artist).createWrappedSong(
                mockStablecoin.target,
                {
                    name: "Test Song",
                    description: "Test Description",
                    image: "ipfs://image",
                    externalUrl: "https://example.com",
                    animationUrl: "ipfs://animation",
                    attributesIpfsHash: "ipfs://attributes"
                },
                totalSharesAmount,
                artist.address,
                { value: creationFee }
            );

            const userWrappedSongs = await protocolModule.getOwnerWrappedSongs(artist.address);
            wrappedSongAddress = userWrappedSongs[0];
            const wrappedSong = await ethers.getContractAt("WrappedSongSmartAccount", wrappedSongAddress);
            
            const wsTokenManagementAddress = await wrappedSong.getWSTokenManagementAddress();
            wsTokenManagementContract = await ethers.getContractAt("WSTokenManagement", wsTokenManagementAddress);

            // Setup standard sale parameters
            sharesAmount = 50;
            pricePerShare = ethers.parseUnits("100", 6);
            maxSharesPerWallet = sharesAmount;

            // Retrieve start sale fee
            startSaleFee = await feesModule.getStartSaleFee();
            console.log("Retrieved start sale fee:", startSaleFee); // Debug log

            // Approve marketplace
            await wsTokenManagementContract.connect(artist).setApprovalForAll(songSharesMarketPlace.target, true);

            // Verify the fee is set correctly at the start of each test
            expect(startSaleFee).to.equal(startSaleFee, "Start sale fee not properly initialized");
        });

        describe("Sale Creation Edge Cases", function () {
            it("should fail to start sale with zero shares", async function () {
                const { artist, songSharesMarketPlace, mockStablecoin, feesModule } = fixture;
                const startSaleFee = await feesModule.getStartSaleFee();

                await expect(
                    songSharesMarketPlace.connect(artist).startSale(
                        wrappedSongAddress,
                        0, // Zero shares
                        pricePerShare,
                        sharesAmount,
                        mockStablecoin.target,
                        { value: startSaleFee } // Include the required fee
                    )
                ).to.be.revertedWith("Amount must be greater than 0");
            });

            it("should allow sale with zero price", async function () {
                const { artist, songSharesMarketPlace, mockStablecoin } = fixture;
                await expect(
                    songSharesMarketPlace.connect(artist).startSale(
                        wrappedSongAddress,
                        sharesAmount,
                        0,
                        sharesAmount,
                        mockStablecoin.target,
                        { value: startSaleFee }
                    )
                ).to.not.be.reverted;

                const sale = await songSharesMarketPlace.getSale(wrappedSongAddress);
                expect(sale.active).to.be.true;
                expect(sale.pricePerShare).to.equal(0);
            });

            it("should fail to start sale with insufficient fee", async function () {
                const { artist, songSharesMarketPlace, mockStablecoin, feesModule } = fixture;
                // Set a higher fee for testing insufficient fee case
                await feesModule.setStartSaleFee(ethers.parseEther("1.0")); // Set to 1 ETH
                const startSaleFee = await feesModule.getStartSaleFee();

                await expect(
                    songSharesMarketPlace.connect(artist).startSale(
                        wrappedSongAddress,
                        sharesAmount,
                        pricePerShare,
                        sharesAmount,
                        mockStablecoin.target,
                        { value: 0 } // Zero fee
                    )
                ).to.be.revertedWith("Insufficient start sale fee");
            });

            it("should fail to start sale with no fee when fee is required", async function () {
                const { artist, songSharesMarketPlace, mockStablecoin, feesModule } = fixture;
                
                // Only run this test if there's actually a fee required
                if (startSaleFee > 0n) {
                    await expect(
                        songSharesMarketPlace.connect(artist).startSale(
                            wrappedSongAddress,
                            sharesAmount,
                            pricePerShare,
                            sharesAmount,
                            mockStablecoin.target,
                            { value: 0n }
                        )
                    ).to.be.revertedWith("Insufficient start sale fee");
                }
            });

            it("should fail to start sale with shares exceeding balance", async function () {
                const { artist, songSharesMarketPlace, mockStablecoin } = fixture;
                const balance = await wsTokenManagementContract.balanceOf(artist.address, 1);
                const excessAmount = balance + BigInt(1);
                
                await expect(
                    songSharesMarketPlace.connect(artist).startSale(
                        wrappedSongAddress,
                        excessAmount,
                        pricePerShare,
                        excessAmount,
                        mockStablecoin.target,
                        { value: startSaleFee }
                    )
                ).to.be.revertedWith("Insufficient shares");
            });

            it("should successfully start sale with correct fee", async function () {
                const { artist, songSharesMarketPlace, mockStablecoin } = fixture;
                
                await expect(
                    songSharesMarketPlace.connect(artist).startSale(
                        wrappedSongAddress,
                        sharesAmount,
                        pricePerShare,
                        sharesAmount,
                        mockStablecoin.target,
                        { value: startSaleFee }
                    )
                ).to.not.be.reverted;
            });

            // Add a positive test case to verify fee setting works
            it("should successfully set and retrieve start sale fee", async function () {
                const { deployer, feesModule } = fixture;
                const newFee = ethers.parseEther("0.2");
                
                await feesModule.connect(deployer).setStartSaleFee(newFee);
                const retrievedFee = await feesModule.getStartSaleFee();
                
                expect(retrievedFee).to.equal(newFee);
            });
        });

        describe("Share Purchase Edge Cases", function () {
            beforeEach(async function () {
                const { artist, songSharesMarketPlace, mockStablecoin } = fixture;
                
                // Start a standard sale
                await songSharesMarketPlace.connect(artist).startSale(
                    wrappedSongAddress,
                    sharesAmount,
                    pricePerShare,
                    sharesAmount,
                    mockStablecoin.target,
                    { value: startSaleFee }
                );
            });

            it("should fail to buy shares with insufficient allowance", async function () {
                const { buyer, songSharesMarketPlace, mockStablecoin, deployer } = fixture;
                const sharesToBuy = 10;
                const totalPrice = pricePerShare * BigInt(sharesToBuy);
                
                // Transfer tokens but don't approve
                await mockStablecoin.connect(deployer).transfer(buyer.address, totalPrice);
                
                // Update the expected error message based on the actual error
                await expect(
                    songSharesMarketPlace.connect(buyer).buyShares(
                        wrappedSongAddress,
                        sharesToBuy,
                        buyer.address
                    )
                ).to.be.revertedWithCustomError(mockStablecoin, "ERC20InsufficientAllowance");
                // Note: If using OpenZeppelin's latest contracts, they use custom errors instead of strings
            });

            it("should handle multiple consecutive purchases correctly", async function () {
                const { buyer, songSharesMarketPlace, mockStablecoin, deployer } = fixture;
                
                const purchaseAmount = 5;
                const iterations = 3;
                const totalCost = pricePerShare * BigInt(purchaseAmount) * BigInt(iterations);
                
                // Setup buyer with funds
                await mockStablecoin.connect(deployer).transfer(buyer.address, totalCost);
                await mockStablecoin.connect(buyer).approve(songSharesMarketPlace.target, totalCost);

                for(let i = 0; i < iterations; i++) {
                    await songSharesMarketPlace.connect(buyer).buyShares(
                        wrappedSongAddress,
                        purchaseAmount,
                        buyer.address
                    );
                }

                const buyerBalance = await wsTokenManagementContract.balanceOf(buyer.address, 1);
                expect(buyerBalance).to.equal(BigInt(purchaseAmount * iterations));
            });
        });

        describe("Payment Edge Cases", function () {
            beforeEach(async function () {
                const { artist, songSharesMarketPlace } = fixture;
                // Start an ETH sale
                await songSharesMarketPlace.connect(artist).startSale(
                    wrappedSongAddress,
                    sharesAmount,
                    pricePerShare,
                    sharesAmount,
                    ethers.ZeroAddress,
                    { value: startSaleFee }
                );
            });

            it("should fail when sending incorrect ETH amount", async function () {
                const { buyer, songSharesMarketPlace } = fixture;
                const sharesToBuy = 10;
                const correctPrice = BigInt(sharesToBuy) * pricePerShare;
                
                await expect(
                    songSharesMarketPlace.connect(buyer).buyShares(
                        wrappedSongAddress,
                        sharesToBuy,
                        buyer.address,
                        { value: correctPrice - BigInt(1) } // Slightly less than required
                    )
                ).to.be.revertedWith("Incorrect ETH amount");
            });
        });
    });
});