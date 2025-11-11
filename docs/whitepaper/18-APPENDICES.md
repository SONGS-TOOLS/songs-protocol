
## Appendix A: Glossary

**Arweave:** Decentralized storage network designed for permanent data storage using a blockweave structure and endowment model.

**Blockweave:** Data structure where new blocks link to random previous blocks, creating incentives to store historical data.

**ISRC:** International Standard Recording Code - unique identifier for sound recordings.

**ISWC:** International Standard Musical Work Code - unique identifier for musical compositions.

**ISCC:** International Standard Content Code - content fingerprint for digital media.

**L2:** Layer 2 blockchain networks that process transactions off the main chain for lower costs and higher throughput.

**PRO:** Performance Rights Organization - collects royalties for public performance of compositions.

**SongShares:** Token representing fractional ownership of recording rights.

**Smart Contract:** Self-executing code on blockchain that automatically enforces agreement terms.

**Validator:** Entity that verifies release quality and metadata accuracy, staking reputation on approvals.


## Appendix B: Cost Calculation Methodology

### Traditional Infrastructure (70-year storage)

**Assumptions:**
- AWS S3 Standard Storage: $0.023/GB/month (as of 2024)
- 40MB lossless master file
- 6 major stakeholders each storing complete copy
- 70-year copyright period
- No storage cost deflation (conservative)

**Calculation:**
```
Storage per stakeholder = 0.040 GB
Monthly cost per stakeholder = 0.040 × $0.023 = $0.00092
Annual cost per stakeholder = $0.00092 × 12 = $0.01104
70-year cost per stakeholder = $0.01104 × 70 = $0.7728
Total cost (6 stakeholders) = $0.7728 × 6 = $4.6368
```

### Permanent Storage (Arweave)

**Assumptions:**
- Arweave cost: ~$0.01/MB (as of late 2024, fluctuates with AR token price)
- 40MB lossless master file
- One-time payment
- 200+ year endowment model

**Calculation:**
```
Total cost = 40 MB × $0.01/MB = $0.40
```

### Cost Ratio
```
Traditional / Permanent = $4.64 / $0.40 = 11.6
```

This represents a 11,595% cost difference over 70 years.


## Appendix C: Transaction Cost Analysis

### Blockchain Operations

**Assumptions:**
- Base L2 network (Ethereum scaling solution)
- Current gas prices: ~0.001 Gwei base fee on L2
- ETH price: $3,000 (example)

**Release Registration:**
```
Gas required: ~100,000 gas
Cost: 100,000 × 0.001 Gwei × $3,000 / 10^9 = $0.30
```

**Royalty Distribution (3-way split):**
```
Gas required: ~100,000 gas
Cost: 100,000 × 0.001 Gwei × $3,000 / 10^9 = $0.30
```

**Monthly operational cost for artist with 10 active releases:**
- Registration: $3.00 (one-time)
- Distributions: $0.30/month (assuming monthly payouts)
- Annual cost: $3.60/year

Compare to traditional distributor fees (15-30% of revenue) or accounting overhead for manual split calculations.


**Protocol Status:** SONGS Protocol v1 Live Since February 2025  
**Live Metrics:** 3,000+ songs, 1,100+ artists, $5,000+ distributed  


**Authors:** Sergio Gordo
**Contact:** gordo@songs-tools.com
**License:** [To be determined]


**Document Status:** Working Draft v1.1 - Updated with Live Protocol Data  

---

## Navigation

- [← Previous: References](17-REFERENCES.md)
- [↑ Index](INDEX.md)
- [Full Document](../MUSIC-INFRASTRUCTURE-WHITEPAPER.md)
