
## 4. Proposed Architecture

The architecture consists of four primary layers, each addressing specific problems identified in Section 2:

### 4.1 Rights Registry: Blockchain Layer
*(Addresses: Rights Fragmentation, Lack of Verifiability, Payment Opacity)*

**Problem Mapping:**

Current systems fragment rights across separate databases (Problem 1), lack cryptographic verification (Problem 5), and require manual reconciliation for payments (Problem 2). A blockchain-based registry provides a unified, verifiable source of truth with immutable audit trails.

**Technical Implementation:**

Blockchain provides immutable audit trails for mutable state: ownership changes, royalty splits, licensing agreements. This separates permanently immutable data (stored on Arweave) from legitimately mutable state (ownership that transfers, splits that update) while preserving complete history of all changes.

**Data Structure:**

```
Release {
  ISRC: "US-AB1-23-45678"        // International Standard Recording Code
  ISWC: "T-345246800-1"          // International Standard Musical Work Code  
  ISCC: "content-hash"            // Content fingerprint for verification
  arweave_tx: "transaction-id"    // Permanent storage address
  ownership_splits: [
    {address: "0x...", bps: 5000},  // 50.00% to first owner
    {address: "0x...", bps: 3000},  // 30.00% to second owner
    {address: "0x...", bps: 2000}   // 20.00% to third owner
  ]
  validation_proof: "signature"   // Cryptographic validator attestation
  timestamp: unix_timestamp       // Immutable creation timestamp
  metadata: {...}                 // Title, artist, credits, etc.
}
```

**Integration with Existing Standards:**

The structure bridges existing industry identifiers with cryptographic primitives:

- **ISRC**: Already used by Spotify, Apple Music, YouTube, all PROs - becomes the on-chain primary key
- **ISWC**: Links recordings to compositions, enabling publishing rights tracking
- **ISCC**: Content fingerprint prevents fraudulent uploads claiming existing ISRCs

Traditional stakeholders continue using familiar identifiers and workflows. The difference: queries now return cryptographically verified, immutable records instead of potentially conflicting database entries.

**Ownership Transfers:**

When ownership changes, new transactions update the registry. Previous states remain accessible on-chain, creating complete provenance:
```
Block 100: Alice owns 100% of ISRC
Block 200: Alice transfers 30% to Bob (Alice 70%, Bob 30%)
Block 300: Alice transfers 20% to Carol (Alice 50%, Bob 30%, Carol 20%)
```

Any party can reconstruct exact ownership at any historical point. Disputes resolve through cryptographic proof rather than competing database claims.

**Benefits:**
- Single source of truth for ownership across all stakeholders
- Cryptographic verification of ownership claims
- Complete, immutable audit trails for ownership changes
- Interoperability with existing industry identifiers and workflows
- Foundation for automated payment distribution

### 4.2 Permanent Storage Layer: Arweave
*(Addresses: Storage Redundancy, Temporal Misalignment)*

**Problem Mapping:**

Current infrastructure duplicates identical files across stakeholders (Problem 6) and operates on short technology lifecycles incompatible with 70-100 year copyright terms (Problem 3). Permanent storage addresses both by providing single-instance storage with guaranteed long-term availability.

**Technical Implementation:**

Arweave implements a blockweave structure where miners must prove they store random historical blocks to mine new ones. This creates incentive alignment: old data becomes more valuable to store as the network grows, not less. The mechanism ensures data permanence through economic incentives rather than trust in any single organization.

The network operates an endowment model where one-time upload payments fund storage costs for 200+ years, assuming storage cost deflation continues at historical rates (30-40% annually). As of late 2024, storage costs approximately $0.01 per MB.

**Economic Analysis:**

For a 40MB lossless master:
- Arweave: $0.40 (one-time)
- Traditional infrastructure (70 years, 6 stakeholders): $4,638
- Cost reduction: 99.99%

At industry scale (100,000 tracks):
- Arweave: $40,000
- Traditional infrastructure: $464M
- Absolute savings: $463.96M

**Data Addressing:**

Files stored on Arweave receive permanent transaction IDs (SHA-256 hashes) serving as immutable addresses (`ar://[tx-id]`). These addresses never change and remain accessible as long as the network exists. The protocol supports up to 2KB of queryable metadata tags per transaction, enabling indexed search across all uploads without reading file contents.

**Restricted Access Research & Development:**

**Current Challenge:** Arweave stores files publicly by default, but music industry requires controlled access to master recordings while maintaining permanence.

**SONGS Protocol Solution:** Research and development for decentralized access control to encrypted files on Arweave:
- **Encrypted Storage**: Master recordings stored encrypted on Arweave
- **Decentralized Access Control**: Access granted based on on-chain ownership, identity, or validation
- **Nillion Partnership**: Working with Nillion for decentralized encryption/decryption model
- **Private/Public Key System**: Cryptographic access control without centralized gatekeepers
- **Permanent but Private**: Files remain permanently stored but access is restricted

**Technical Architecture:**
- **Upload**: Files encrypted before Arweave storage
- **Access Control**: On-chain validation of ownership/identity
- **Decryption**: Decentralized decryption based on valid credentials
- **No Centralized Gatekeepers**: Access control through cryptographic proofs

**Benefits:**
- Eliminates redundant storage across stakeholders
- Guarantees availability beyond any organization's lifetime
- Provides verifiable data integrity through content addressing
- Reduces infrastructure costs by orders of magnitude
- **New**: Enables controlled access to permanent storage
- **New**: Decentralized encryption/decryption without centralized gatekeepers

### 4.3 Restricted Access Research: Nillion Partnership
*(Addresses: Storage Redundancy, Temporal Misalignment, Intermediary Value Extraction)*

**Problem Mapping:**

Current infrastructure requires centralized gatekeepers for access control (Problem 4), while permanent storage needs controlled access to encrypted files (Problem 3, Problem 6). SONGS Protocol is developing decentralized access control to encrypted files on Arweave.

**Research & Development Focus:**

**Nillion Partnership:** SONGS Protocol is working with Nillion to develop a decentralized model for accessing encrypted files on Arweave:

- **Decentralized Encryption/Decryption**: No centralized gatekeepers for file access
- **Private/Public Key System**: Cryptographic access control based on ownership/identity
- **On-Chain Validation**: Access granted through blockchain-based ownership proofs
- **Permanent but Private**: Files stored permanently but access is restricted
- **No Single Point of Failure**: Decentralized access control without centralized servers

**Technical Requirements:**

- **Encrypted Upload**: Files encrypted before Arweave storage
- **Access Control**: On-chain validation of ownership, identity, or validation status
- **Decentralized Decryption**: Access granted through cryptographic proofs
- **No Centralized Gatekeepers**: Access control through decentralized mechanisms
- **Permanent Storage**: Files remain accessible for 70+ years
- **Controlled Access**: Only authorized parties can decrypt files

**Use Cases:**

- **Master Recordings**: Controlled access to high-quality audio files
- **Legal Documents**: Restricted access to contracts and agreements
- **Metadata**: Sensitive information accessible only to authorized parties
- **Licensing**: Access granted based on valid licensing agreements

**Benefits:**

- **Permanent Storage**: Files guaranteed to be available for 70+ years
- **Controlled Access**: Only authorized parties can access files
- **Decentralized**: No single point of failure or centralized control
- **Cryptographic Security**: Access control through mathematical proofs
- **Cost Effective**: Single storage instance with controlled access
- **Industry Standard**: Meets music industry requirements for controlled access

### 4.4 Access Control Layer: Gateway Architecture
*(Addresses: Storage Redundancy, Intermediary Value Extraction)*

**Problem Mapping:**

While permanent storage solves data permanence, rights holders require controlled access (Problem 6). Access control must not recreate gatekeeping that enables intermediary value extraction (Problem 4). Gateway architecture solves both: shared storage layer with competitive access provision.

**Technical Implementation:**

Masters upload to Arweave encrypted. Decryption keys distribute through smart contract logic based on on-chain licenses. Only addresses with valid licensing rights receive keys.

HTTP gateways query the storage network and serve files to authorized requesters. Multiple independent gateways (public, private, regional, CDN-cached) can all serve any file. If one gateway fails, others remain operational. The data layer stays separate from the access layer.

**Access Logging:**

All access attempts log on-chain: who accessed what, when, under which license. This provides:
- Complete transparency for rights holders
- Audit trails for licensing compliance
- Evidence for dispute resolution
- Analytics for usage patterns

**Gateway Economics:**

Gateway operators charge small fees for fast, reliable access. This creates a competitive market:
- Low barriers to entry for gateway operation
- No lock-in to specific gateway providers
- Competition drives fees down and quality up
- Economic alignment between accessibility and profitability

**Benefits:**
- Controlled access without centralized gatekeeping
- Competitive market for access provision
- Complete transparency of access patterns
- Resilience through gateway diversity

### 4.5 Validation Layer: Distributor-Based Legal Verification
*(Addresses: Lack of Verifiability, Intermediary Value Extraction)*

**Problem Mapping:**

Open upload systems risk spam and fraudulent ownership claims (Problem 5). Traditional gatekeepers solve this but extract excessive value (Problem 4). SONGS Protocol creates a validator network where distributors provide legal verification services in exchange for fees, maintaining quality control while enabling competition.

**Validator Role (Current - Digital Distributors):**

Validators are primarily digital distributors who provide legal verification services:
- **Legal Verification**: Copyright checks, authorship verification, rights clearance
- **Quality Control**: Audio quality, metadata completeness, technical standards
- **ISRC Management**: Uniqueness verification, proper registration
- **Arweave Upload**: Execute permanent storage upload (for fee)
- **Monetization Activation**: Only validated songs can generate revenue

**Validator Requirements by Type:**

**Digital Distributors (Current):**
- Legal expertise in copyright and distribution
- Technical infrastructure for quality verification
- Relationships with streaming platforms
- Fee structure: Validation fee + Arweave upload cost
- Competition on service quality and pricing

**Future Validators:**
- **Collection Societies (PROs)**: Royalty collection expertise, jurisdiction-specific knowledge
- **Record Labels**: A&R expertise, artist development focus
- **Specialized Validators**: Genre-specific, region-specific, format-specific

**Economic Mechanism:**

Validators capture monetization and distribute payments using the protocol:
- **Validation Fee**: Payment for legal verification and quality control
- **Arweave Upload Fee**: Cost recovery for permanent storage
- **Distribution Services**: Validators handle monetization and payment distribution
- **Transparent Fees**: All validator fees visible on-chain for competition
- **Capitalist Competition**: Validators compete on service quality and fee transparency
- **Reputation Staking**: Poor validation damages future business

**Dispute Resolution (Future Feature):**

Protocol-level arbitration system:
- **Internal Arbitration**: On-chain dispute resolution mechanism
- **Legal Freeze**: Songs can be frozen during legal proceedings
- **Revenue Hold**: Earnings held until disputes resolved
- **Transparent Process**: All dispute actions logged immutably

**Benefits:**
- Legal compliance built into protocol
- Competitive market for validation services
- Artists maintain sovereignty over uploads
- Transparent dispute resolution
- Multiple validator options available

### 4.6 Payment Distribution Layer: Smart Contracts
*(Addresses: Payment Opacity, Intermediary Value Extraction)*

**Problem Mapping:**

Current payment systems require manual reconciliation across multiple intermediaries, creating delays (3-6 months), opacity, and value extraction at each layer (Problem 2, Problem 4). Smart contracts enable atomic, transparent distribution without intermediaries.

**Technical Implementation:**

Revenue flows through smart contracts that:
1. Receive payment with ISRC identifier
2. Query blockchain registry for ownership splits
3. Calculate distribution amounts (basis points)
4. Execute atomic transfer to all addresses
5. Log complete transaction on-chain

**Atomic Execution:**

All-or-nothing: everyone receives their split in a single transaction or the entire payment reverts. No partial payments. No reconciliation errors. No disputes about who got what.

```
Input: $1,000 to ISRC "US-AB1-23-45678"
Registry query: Alice 50%, Bob 30%, Carol 20%
Execution: 
  - Alice receives $500
  - Bob receives $300
  - Carol receives $200
  - OR entire transaction fails and money returns to sender
```

**Transparency:**

All payments are publicly verifiable but pseudonymous:
- Anyone can prove exactly what they received
- Timestamps are immutable
- Payment sources are traceable
- Identity privacy preserved through addresses

**Transaction Costs:**

On Layer 2 networks (Base, Arbitrum), a 3-way split costs approximately 100,000 gas. At current L2 gas prices, this represents $0.01-0.05 per distribution.

For a typical monthly payout:
- Traditional intermediary fees: 15-30% ($150-300 on $1,000)
- Smart contract execution: $0.01-0.05
- Savings: 99.98%+

**Settlement Speed:**

Traditional: 3-6 months from consumption to artist payment
Smart contracts: Minutes from platform deposit to final distribution

**Benefits:**
- Eliminates manual reconciliation overhead
- Reduces payment delays from months to minutes
- Provides complete transparency
- Removes intermediary fees (99%+ reduction)
- Enables micropayments (no minimum thresholds)

**Global Payment Flows:**

Smart contracts operate jurisdiction-agnostic. A single payment distribution transaction works identically regardless of:
- Where the artist is located
- Where the listener is located
- Which currency is used for initial payment
- Which legal framework governs the underlying rights

This addresses the jurisdictional fragmentation problem directly. Instead of:
```
Spanish stream → Spotify Spain → Spanish collection society → 
US PRO → Publishing administrator → Artist (9-18 months)
```

The flow becomes:
```
Spanish stream → Streaming platform → Smart contract → Artist (minutes)
```

The smart contract:
1. Receives payment in stablecoins or local currency (converted at source)
2. Queries on-chain registry for ownership splits
3. Distributes to all parties atomically
4. Logs transaction immutably

No reciprocal agreements between collection societies required. No manual reconciliation across jurisdictions. No currency conversion losses through multiple intermediaries. No geographic minimum payment thresholds.

**Cross-Border Capital Efficiency:**

Traditional system (Spanish listener → US artist):
- Administrative fees: 30-50% (stacked across multiple organizations)
- Time delay: 9-18 months
- Currency conversions: 3-5 (each with 2-3% spread)
- Black box leakage: ~15% of international revenue unattributable

Blockchain system:
- Transaction fee: $0.01-0.05 (L2 gas cost)
- Time delay: Minutes
- Currency conversion: Once, at source (stablecoin or direct conversion)
- Attribution: 100% (cryptographically verified)

For an artist earning $10,000/year internationally through traditional system:
- Receives: ~$5,000-7,000 after fees, delays, and black box losses
- Timeline: 9-18 months delayed

Through blockchain system:
- Receives: ~$9,999 (after minimal transaction fees)
- Timeline: Real-time to monthly settlement

### 4.7 Legal Integration Layer: Jurisdiction-Agnostic Licensing

**Problem Addressed:**

Current system requires separate contracts for each royalty type in each jurisdiction. Smart contracts can encode licensing terms once, applicable globally.

**Technical Implementation:**

**License Templates:**

Standard license types encoded as smart contract templates:
- Streaming mechanical license (reproduction right)
- Public performance license (both composition and recording)
- Synchronization license (time-limited, usage-specific)
- Download/sale license (one-time mechanical)

Each template includes:
- Authorized use parameters (streaming, download, sync, etc.)
- Payment terms (per-stream rate, lump sum, percentage)
- Time limitations (perpetual, term-limited, one-time)
- Geographic scope (global by default, can be restricted)
- Sublicensing rights

**Automated License Execution:**

When a streaming platform wants to license a catalog:

1. Platform submits license request on-chain (specifies: streaming rights, global territory, rate per stream)
2. Smart contract verifies platform identity and payment capacity
3. If terms match pre-approved template, license activates automatically
4. If custom terms needed, rights holder approves on-chain
5. License records immutably with exact terms, parties, timestamp

**On-Chain Licensing Benefits:**

- **Single license for global use** (no separate agreements per jurisdiction)
- **Automatic payment enforcement** (smart contract distributes royalties according to license)
- **Immutable audit trail** (all license terms, modifications, payments logged)
- **Programmatic compliance** (unauthorized use detectable on-chain)

**Integration with Legal Jurisdictions:**

Blockchain licenses do not replace legal contracts but streamline them:

1. **Master agreements**: One-time legal agreements between rights holder and platform establish general terms
2. **On-chain execution**: Specific licenses for specific tracks execute automatically within master agreement framework
3. **Legal enforceability**: Blockchain records serve as evidence in disputes, admissible in most jurisdictions
4. **Jurisdiction selection**: Master agreements specify governing law; on-chain records provide evidence regardless of jurisdiction

**Eliminating Contract Proliferation:**

Traditional model:
- Artist signs with publishing administrator
- Administrator registers with ~250 PROs globally
- Each PRO has reciprocal agreements with others
- Total contracts governing one song: 50-100+ entities involved

Blockchain model:
- Artist registers ownership on-chain (once)
- Licensing agreements execute via smart contracts (automated)
- Platforms pay smart contract (automatic distribution)
- Total active contracts: 1 (master agreement with platform)

**Cross-Border Royalty Collection:**

Current model requires PROs in each territory to:
1. Collect local usage data
2. Report to foreign PROs via reciprocal agreements
3. Reconcile data formats (often manual)
4. Transfer payments (currency conversion, wire fees)
5. Each step takes months and incurs 10-15% fees

Blockchain model:
1. Platform reports usage to smart contract (real-time)
2. Smart contract distributes payment (automatic, seconds)
3. No intermediaries required
4. Works identically for domestic and international streams

**Global Capital Flow Transformation:**

The architecture enables truly global music markets without geographic friction:

**Current State:**
- Artist must choose: maximize coverage (lose 30-50% to fees) or limit territories (lose international revenue)
- Small independent artists cannot afford global collection infrastructure
- Revenue from smaller territories often uncollected due to administrative overhead
- Black box royalties (~$2B/year) lost to system friction

**Blockchain State:**
- Global coverage by default (no additional infrastructure needed)
- Independent artists access same infrastructure as major labels
- All territories collected equally (no marginal cost per territory)
- Black box eliminated through cryptographic attribution

**Economic Impact:**

For a mid-tier artist earning $100K/year globally:

Traditional system:
- Administrative fees (30-50%): -$30-50K
- Black box losses (15%): -$15K
- Unclaimed territories: -$10K
- Net received: $45-55K
- Time to payment: 9-18 months average

Blockchain system:
- Transaction costs: -$100-500
- No black box (cryptographic attribution): $0 loss
- All territories collected: $0 loss
- Net received: $99.5-99.9K
- Time to payment: Real-time to monthly

**Result:** 80-120% increase in artist revenue without increasing consumer prices or platform costs. The difference comes from eliminating geographic friction and administrative overhead.

**Benefits:**
- Single source of truth replaces ~250 territorial PROs
- One smart contract replaces dozens of legal agreements
- Real-time global settlement replaces 9-18 month international reconciliation
- Micropayments flow globally without minimum thresholds
- Black box royalties eliminated through cryptographic attribution
- Artist revenue increases 80-120% without changing consumer pricing

### 4.8 Architecture Summary: Problem-Solution Mapping

The following table shows how each architectural layer addresses the seven identified problems:

| Problem | Root Cause | Architectural Solution | Mechanism |
|---------|-----------|----------------------|-----------|
| **1. Rights Fragmentation** | Separate databases, no shared infrastructure | Blockchain Registry | Single source of truth, cryptographically verifiable |
| **2. Payment Opacity + Jurisdictional Fragmentation** | Manual reconciliation, multiple intermediaries, ~250 territorial PROs | Smart Contract Distribution + Legal Integration Layer | Atomic execution, jurisdiction-agnostic licensing, eliminates reciprocal agreements |
| **3. Temporal Misalignment** | Short tech lifecycles vs. 70-100 year rights | Permanent Storage (Arweave) | Economic incentives for perpetual storage |
| **4. Intermediary Value Extraction** | Information asymmetry, infrastructure control, geographic gatekeeping | Disintermediation + Validation Layer | Permissionless access, competitive validators, global by default |
| **5. Lack of Verifiability** | Trust-based databases | Cryptographic Proofs | Public key signatures, content hashing, immutable logs |
| **6. Storage Redundancy** | Each stakeholder maintains copies | Shared Storage + Gateways | Single storage layer, multiple access points |
| **7. Payment-Consumption Disconnection** | Pooled subscription model, algorithmic distribution | Competitive Market Infrastructure | Open metadata access, proper game theory, multiple platform options |

**System Integration:**

The layers work together as a unified system with sovereign upload and validation:

1. **Sovereign Upload**: Artist uploads draft song to protocol (optional: pay for immediate permanent storage)
2. **Instant Tokenization**: 10,000 SongShares created immediately with ownership structure
3. **Distribution Request**: Artist requests distribution to validator (distributor)
4. **Validation & Certification**: Validator evaluates, certifies, and signs song for monetization
5. **Permanent Storage**: Distributor takes fee and publishes to permanent storage (if not done by artist)
6. **Blockchain Registry**: Records ownership splits, links ISRC to permanent storage, stores validator signature
7. **Monetization Ready**: Song becomes available for distribution and revenue generation
8. **Gateway Access**: Controlled access to files based on on-chain licenses
9. **Smart Contracts**: Automatic payment distribution according to token ownership splits
10. **Token Redemption**: SongShare holders can redeem their portion of earnings
11. **Dispute Resolution**: Internal arbitration system for legal conflicts (future)
12. **Collection Integration**: PROs can sign and collect royalties (future - not currently active)

**Key Features:**
- **Sovereign Layer**: Artists maintain control over initial upload
- **Validation Required**: Legal verification before monetization
- **Competitive Validators**: Multiple distributor options with transparent fees
- **Monetization Capture**: Validators capture and distribute payments using protocol
- **Capitalist Competition**: Service quality and fee transparency drive competition
- **Current Scope**: Only master recording rights (SongShares) tokenized
- **Dispute Handling**: Protocol-level arbitration system (future)
- **PRO Integration**: Seamless connection to traditional collection systems (future)

Each step is cryptographically verifiable. The architecture creates a legally compliant, competitive ecosystem where artists maintain sovereignty while ensuring proper legal verification and dispute resolution.

**Emergent Properties:**

The combination creates capabilities impossible in current systems:
- Instant verification of ownership for any release
- Guaranteed availability beyond any organization's lifetime
- Payment settlement in minutes instead of months
- Complete transparency without sacrificing privacy
- Order-of-magnitude cost reductions across the entire stack


---

## Navigation

- [← Previous: Technical Requirements](05-TECHNICAL-REQUIREMENTS.md)
- [Next: Integration with Existing Infrastructure →](07-INTEGRATION.md)
- [↑ Index](INDEX.md)
- [Full Document](../MUSIC-INFRASTRUCTURE-WHITEPAPER.md)
