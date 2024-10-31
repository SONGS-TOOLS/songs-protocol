# Smart Contract Events Documentation

## DistributorWallet Events

### WrappedSongReleaseRequested
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song

### WrappedSongReleased
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song

### WrappedSongRedeemed
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `amount` (uint256) - The amount redeemed

### WrappedSongReleaseRejected
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song

### WrappedSongAcceptedForReview
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song

### FundsReceived
Parameters:
- `from` (indexed address) - The address sending the funds
- `amount` (uint256) - The total amount received
- `currency` (string) - The currency type ("ETH" or "Stablecoin")
- `wrappedSongs` (address[]) - Array of wrapped song addresses
- `amounts` (uint256[]) - Array of amounts corresponding to each wrapped song

## DistributorWalletFactory Events

### DistributorWalletCreated
Parameters:
- `distributor` (indexed address) - The address of the distributor
- `wallet` (address) - The address of the created wallet

### WrappedSongReleased
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `distributor` (indexed address) - The address of the distributor

## ERC20Whitelist Events

### TokenWhitelisted
Parameters:
- `token` (indexed address) - The address of the whitelisted token
- `name` (string) - The name of the token
- `symbol` (string) - The symbol of the token

### TokenRemovedFromWhitelist
Parameters:
- `token` (indexed address) - The address of the removed token

### AuthorizedCallerSet
Parameters:
- `caller` (indexed address) - The address of the authorized caller

## MarketPlace Events

### SharesSaleStarted
Parameters:
- `tokenId` (uint256) - The ID of the token
- `amount` (uint256) - The amount of shares for sale
- `price` (uint256) - The price per share
- `owner` (indexed address) - The owner of the shares
- `maxSharesPerWallet` (uint256) - Maximum shares per wallet
- `stableCoinAddress` (address) - The address of the stablecoin

### SharesSold
Parameters:
- `tokenId` (uint256) - The ID of the token
- `buyer` (address) - The address of the buyer
- `amount` (uint256) - The amount of shares sold

### SharesSaleEnded
Parameters: none

### FundsWithdrawn
Parameters:
- `to` (indexed address) - The address receiving the funds
- `amount` (uint256) - The amount withdrawn

### ERC20Received
Parameters:
- `token` (address) - The address of the ERC20 token
- `amount` (uint256) - The amount received
- `sender` (address) - The address of the sender

### EmergencyWithdrawal
Parameters:
- `token` (indexed address) - The address of the token
- `to` (indexed address) - The address receiving the funds
- `amount` (uint256) - The amount withdrawn

## MetadataModule Events

### MetadataCreated
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `newMetadata` (Metadata) - The new metadata structure

### MetadataUpdateRequested
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `newMetadata` (Metadata) - The proposed metadata structure

### MetadataUpdated
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `newMetadata` (Metadata) - The updated metadata structure

### MetadataUpdateRejected
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song

## ProtocolModule Events

### Paused
Parameters:
- `isPaused` (bool) - The paused state

### MetadataUpdated
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `tokenId` (indexed uint256) - The ID of the token
- `newMetadata` (string) - The updated metadata

### MetadataUpdateRequested
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `tokenId` (indexed uint256) - The ID of the token
- `newMetadata` (string) - The proposed metadata

### WrappedSongReleased
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `distributor` (indexed address) - The address of the distributor

### WrappedSongReleaseRequested
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `distributor` (indexed address) - The address of the distributor
- `creator` (indexed address) - The address of the creator

### WrappedSongReleaseRejected
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `distributor` (indexed address) - The address of the distributor

### DistributorAcceptedReview
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `distributor` (indexed address) - The address of the distributor

### ReviewPeriodExpired
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `distributor` (indexed address) - The address of the distributor

### WrappedSongAuthenticitySet
Parameters:
- `wrappedSong` (indexed address) - The address of the wrapped song
- `isAuthentic` (bool) - The authenticity status

## WSTokenManagement Events

### WSTokensCreated
Parameters:
- `smartAccount` (indexed address) - The address of the smart account
- `minter` (indexed address) - The address of the minter

### SongSharesCreated
Parameters:
- `sharesAmount` (indexed uint256) - The amount of shares created
- `minter` (indexed address) - The address of the minter

### BuyoutTokenCreated
Parameters:
- `amount` (indexed uint256) - The amount of buyout tokens
- `recipient` (indexed address) - The address of the recipient

### LegalContractCreated
Parameters:
- `tokenId` (indexed uint256) - The ID of the legal contract token
- `recipient` (indexed address) - The address of the recipient
- `contractURI` (string) - The URI of the legal contract

### LegalContractURIUpdated
Parameters:
- `tokenId` (indexed uint256) - The ID of the legal contract token
- `newURI` (string) - The new URI of the legal contract

## WhitelistingManager Events

### NFTContractUpdated
Parameters:
- `newNFTContract` (indexed address) - The address of the new NFT contract

### NFTRequirementToggled
Parameters:
- `enabled` (bool) - The enabled state of the NFT requirement

## WrappedSongFactory Events

### WrappedSongCreated
Parameters:
- `owner` (indexed address) - The address of the owner
- `wrappedSongSmartAccount` (indexed address) - The address of the wrapped song smart account
- `stablecoin` (address) - The address of the stablecoin
- `wsTokenManagement` (address) - The address of the token management contract
- `sharesAmount` (uint256) - The amount of shares created

## WrappedSongSmartAccount Events

### EarningsReceived
Parameters:
- `token` (indexed address) - The address of the token
- `amount` (uint256) - The amount received
- `earningsPerShare` (uint256) - The earnings per share

### EarningsClaimed
Parameters:
- `account` (indexed address) - The address claiming earnings
- `token` (indexed address) - The address of the token
- `amount` (uint256) - The amount claimed
- `totalAmount` (uint256) - The total amount of earnings

### EarningsUpdated
Parameters:
- `account` (indexed address) - The address being updated
- `newEarnings` (uint256) - The new earnings amount
- `totalEarnings` (uint256) - The total earnings amount

### ContractMigrated
Parameters:
- `newWrappedSongAddress` (indexed address) - The address of the new wrapped song contract

# Subgraph Mappings That Need Updates

1. `distributor-wallet-factory.ts`:
   - Needs significant update to handle modified `FundsReceived` event which now includes arrays for wrapped songs and amounts
   - Current handler:
   ```typescript
   export function handleFundsReceived(event: FundsReceived): void {
     // Need to create new entity to track fund distribution across multiple songs
     let fundDistribution = new FundDistribution(event.transaction.hash.toHex());
     fundDistribution.from = event.params.from;
     fundDistribution.totalAmount = event.params.amount;
     fundDistribution.currency = event.params.currency;
     
     // Create arrays to store the distribution details
     let wrappedSongs: string[] = [];
     let amounts: BigInt[] = [];
     
     for (let i = 0; i < event.params.wrappedSongs.length; i++) {
       wrappedSongs.push(event.params.wrappedSongs[i].toHexString());
       amounts.push(event.params.amounts[i]);
       
       // Update individual wrapped song treasury
       let wrappedSong = WrappedSong.load(event.params.wrappedSongs[i].toHexString());
       if (wrappedSong) {
         wrappedSong.treasury = wrappedSong.treasury.plus(event.params.amounts[i]);
         wrappedSong.save();
       }
     }
     
     fundDistribution.wrappedSongs = wrappedSongs;
     fundDistribution.amounts = amounts;
     fundDistribution.timestamp = event.block.timestamp;
     fundDistribution.save();
   }
   ```

2. `schema.graphql` needs update to include new entities:
   ```graphql
   type FundDistribution @entity {
     id: ID!
     from: Bytes!
     totalAmount: BigInt!
     currency: String!
     wrappedSongs: [String!]!
     amounts: [BigInt!]!
     timestamp: BigInt!
   }
   ```

3. `metadata-module.ts`:
   - No updates needed, current handlers match contract events

4. `protocol-module.ts`:
   - Add handler for new `Paused` event
   - Update `WrappedSongReleaseRequested` handler to include creator parameter

5. `wrapped-song-factory.ts`:
   - No updates needed, current handlers match contract events

6. `wrapped-song-smart-account.ts`:
   - Add handler for new `ContractMigrated` event
   - Update earnings-related handlers for new event parameters

7. `ws-token-management.ts`:
   - Add handlers for new `LegalContractCreated` and `LegalContractURIUpdated` events
   - Update `WSTokensCreated` handler for new parameters

8. `whitelisting-manager.ts`:
   - No updates needed, current handlers match contract events

The most significant updates are needed in the distributor-wallet-factory and protocol-module mappings to handle the new events and modified event parameters. 