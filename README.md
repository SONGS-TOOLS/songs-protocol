# SONGS Protocol

![SONGS PROTOCOL](https://www.songs-tools.com/card-twitter.png)

### The Open Music Distribution Protocol

SONGS Protocol is a decentralized infrastructure layer that addresses seven structural problems in the music industry: rights fragmentation, payment opacity, temporal misalignment, intermediary value extraction, lack of verifiability, storage redundancy, and payment-consumption disconnection.

> **Status**: 🟢 **LIVE** - Protocol v1 operational since February 2025  
> **3,000+ songs** | **1,100+ artists** | **$5,000+ distributed**

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/SONGS-TOOLS/songs-protocol.git
cd songs-protocol

# Install dependencies
yarn install

# Compile contracts
yarn compile

# Run tests
yarn test
```

### Key Scripts

```bash
# Compile contracts
yarn compile

# Run tests
yarn test

# Deploy protocol
yarn deploy:protocol

# Deploy wrapped songs
yarn deploy:songs

# Subgraph operations
yarn subgraph:codegen
yarn subgraph:build
yarn subgraph:deploy
```

---

## 📚 Documentation

### Whitepaper

The complete technical and economic analysis is available in the [documentation](./docs/):

- **[📖 Whitepaper Index](./docs/whitepaper/INDEX.md)** - Comprehensive table of contents
- **[📄 Executive Summary](./docs/whitepaper/02-EXECUTIVE-SUMMARY.md)** - Problem, solution, and current status
- **[📋 Full Document](./docs/MUSIC-INFRASTRUCTURE-WHITEPAPER.md)** - Complete whitepaper (2,036 lines)

> **⚠️ Note**: The whitepaper is a Work In Progress (WIP). Content may change as development continues.

### Quick Links

- [Documentation Overview](./docs/README.md)
- [Technical Architecture](./docs/whitepaper/06-PROPOSED-ARCHITECTURE.md)
- [Implementation Roadmap](./docs/whitepaper/13-IMPLEMENTATION-ROADMAP.md)
- [Economic Model](./docs/whitepaper/08-ECONOMIC-MODEL.md)

---

## 🎯 Key Features

### Protocol Capabilities

- **Permanent Storage**: Arweave integration for immutable, permanent storage ($0.40 one-time vs $4,600 traditional)
- **Blockchain Registry**: Single source of truth with cryptographic verification
- **Smart Contracts**: Atomic payment distribution in minutes, not months
- **Fractional Ownership**: 10,000 SongShares per song (ERC1155 tokens)
- **Automated Distribution**: Transparent, verifiable royalty distribution
- **Global by Default**: Single on-chain registration replaces ~250 territorial contracts

### Economic Impact

- **99.99% storage cost reduction** over 70 years
- **99.98% payment fee reduction** through disintermediation
- **Minutes vs months** for international payment settlement
- **80-120% artist revenue increase** without changing consumer pricing
- **Eliminates black box royalties** through cryptographic attribution

---

## 🏗️ Architecture

### Core Components

- **WrappedSong**: Main NFT representing songs (ERC721)
- **WSTokenManagement**: ERC1155 token management for SongShares
- **SongSharesMarketPlace**: Trading functionality for song shares
- **DistributorWallet**: Automated revenue distribution
- **WhitelistingManager**: Access control and permissions

### Technology Stack

- **Solidity**: Smart contract development
- **Hardhat**: Development environment and testing
- **TypeScript**: Tests and deployment scripts
- **The Graph**: Blockchain event indexing (Subgraph)
- **Arweave**: Permanent storage layer

---

## 📊 Protocol Status

**SONGS Protocol v1 is operational since February 2025:**

- ✅ **3,000+ songs uploaded** to permanent storage
- ✅ **1,100+ artists verified** using the protocol
- ✅ **10,000 SongShares per song** created (fractional ownership tokens)
- ✅ **$5,000+ in distribution earnings** distributed to SongShare owners
- ✅ **SongShares (v1)** - Recording rights tokens active and trading

### Current Phase

- **Phase 1 (COMPLETED)**: Core protocol deployed, 3,000+ releases, 1,100+ artists
- **Phase 2 (CURRENT)**: Gateway network expansion, platform integrations
- **Phase 3 (NEXT)**: Major platform integration, 50,000+ releases, $1M+ distributed

---

## 🛠️ Development

### Project Structure

```
├── contracts/          # Smart contracts
│   ├── protocol/       # Core protocol contracts
│   ├── Alpha/          # Alpha version contracts
│   └── SongsLicense/   # License-related contracts
├── scripts/            # Deployment scripts
├── test/               # Test suite
├── subgraph/           # The Graph subgraph
├── docs/               # Documentation and whitepaper
└── abis/               # Contract ABIs
```

### Testing

```bash
# Run all tests
yarn test

# Run specific test file
yarn test test/WrappedSongFactory.ts

# Run with gas reporting
yarn test --gas
```

### Deployment

```bash
# Deploy to local network
yarn serve

# Deploy protocol (requires network config)
yarn deploy:protocol

# Deploy wrapped songs
yarn deploy:songs
```

---

## 🔗 Resources

### Documentation

- [Full Documentation](./docs/README.md)
- [Whitepaper](./docs/whitepaper/INDEX.md)
- [Smart Contract Events](./docs/smart-contracts-events.md)

### External Links

- **Website**: [https://songs-tools.com](https://songs-tools.com)
- **Protocol Status**: Live since February 2025

---

## 📝 The Seven Structural Problems

SONGS Protocol addresses seven interconnected problems in the music industry:

1. **Rights Fragmentation** - ~250 territorial PROs with no unified source of truth
2. **Payment Opacity** - 9-18 month international payment cycles, 30-50% administrative fees
3. **Temporal Misalignment** - 70-100 year copyrights vs. 10-year tech lifecycles
4. **Intermediary Value Extraction** - 30-70% revenue capture through gatekeeping
5. **Lack of Verifiability** - Trust-based systems vulnerable to fraud and disputes
6. **Storage Redundancy** - Identical files duplicated across all stakeholders
7. **Payment-Consumption Disconnection** - Streaming creates monopolistic platforms

[Learn more about the problems and solutions →](./docs/whitepaper/04-CURRENT-STATE-ANALYSIS.md)

---

## 🤝 Contributing

We welcome contributions! Please see our development guidelines:

1. Review the [documentation](./docs/README.md)
2. Check existing issues and pull requests
3. Follow the coding standards in [.cursor/rules](./.cursor/rules)
4. Write tests for new features
5. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

---

## 📞 Contact

- **Email**: gordo@songs-tools.com
- **Website**: [https://songs-tools.com](https://songs-tools.com)
- **Repository**: [https://github.com/SONGS-TOOLS/songs-protocol](https://github.com/SONGS-TOOLS/songs-protocol)

---

## 🙏 Acknowledgments

SONGS Protocol is built on the shoulders of:
- OpenZeppelin for secure contract libraries
- Hardhat for development tooling
- The Graph for blockchain indexing
- Arweave for permanent storage
- The Ethereum ecosystem for decentralized infrastructure

---

**Last Updated**: November 12, 2025  
**Protocol Version**: v1 (Live since February 2025)  
**Status**: 🟢 Operational