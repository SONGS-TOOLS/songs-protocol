
## 2. Current State Analysis

### 2.1 Market Structure and Power Dynamics

The global music industry operates as a concentrated market dominated by three major label groups (Universal Music Group, Sony Music Entertainment, Warner Music Group) that control supply chain access, distribution agreements, and venue relationships. This concentration creates gatekeeping dynamics where artist success depends on securing relationships with centralized intermediaries who leverage information asymmetry and infrastructure control to extract disproportionate value.

Economic characteristics exhibit zero-sum properties at scale. Artist advances function as venture capital investments: labels recoup costs from successful releases to offset losses from unsuccessful ones. This model concentrates economic returns on a small percentage of releases while distributing costs across the entire catalog. Streaming platforms have commoditized music consumption, with average per-stream payments trending toward zero, rendering streaming valuable primarily for discovery rather than monetization.

Parallel to this mainstream structure exists a smaller electronic music ecosystem with distinct distribution channels, curation mechanisms, and monetization models. These two structures operate largely independently despite serving similar fundamental functions, demonstrating that alternative organizational models can coexist with dominant paradigms.

Despite democratized production tools, quality remains highly concentrated. Estimates suggest 96-98% of music uploaded to streaming platforms fails to achieve significant listenership. Algorithmic curation masks this distribution by exposing users primarily to the statistically successful subset.

### 2.2 Problem 1: Rights Fragmentation

Music rights fragment across multiple legal dimensions, each tracked in separate databases with no unified source of truth:

**Rights Types:**
- **Master rights** (sound recording ownership) - managed by labels and distributors
- **Publishing rights** (composition ownership) - managed by publishers
- **Performance rights** (public performance royalties) - tracked by PROs (ASCAP, BMI, SESAC, etc.)
- **Mechanical rights** (reproduction licenses) - managed by mechanical licensing collectives
- **Synchronization rights** (audiovisual usage) - negotiated case-by-case

**Current State:**

Each stakeholder maintains partial records. Labels track master ownership. Publishers track composition ownership. PROs track performance data. No system provides complete ownership history. Rights verification requires querying multiple databases that may contain conflicting information. Ownership disputes arise not from genuine disagreement but from database inconsistencies and lack of shared infrastructure.

When ownership changes hands, updates propagate slowly across systems. Historical records may be incomplete or lost entirely. Chain of custody cannot be verified cryptographically. Ownership claims depend on trusting database administrators rather than mathematical proof.

**Consequences:**
- Disputes require expensive legal reconciliation of conflicting records
- Ownership history cannot be reconstructed with certainty
- New stakeholders face high costs discovering who owns what
- Orphaned works remain unlicensed because ownership cannot be verified
- Market liquidity for rights remains low due to verification friction

### 2.3 Problem 2: Payment Opacity and Reconciliation Complexity

Royalty distribution operates through opaque, multi-layered processes requiring extensive manual reconciliation:

**Payment Flow:**

1. Streaming platforms calculate usage based on proprietary algorithms
2. Platforms pay distributors based on private agreements
3. Distributors reconcile payments against their internal databases
4. Distributors split payments to labels based on contracts
5. Labels split payments to artists based on potentially different contracts
6. Each step requires manual accounting reconciliation

**Time Delays:**

Typical payment cycles span 3-6 months from consumption to artist payment. Some payments take years. Delays compound through the chain: platform delays + distributor delays + label delays. Artists cannot verify whether they received correct amounts without auditing multiple intermediaries.

**Information Asymmetry:**

Streaming platforms do not publish per-stream rates. Distributors negotiate private deals with platforms. Labels negotiate private deals with distributors. Artists negotiate private deals with labels. No party has complete visibility into the full payment chain. This asymmetry enables value extraction at each layer through "breakage" (unattributed revenue), favorable rounding, and contractual ambiguity.

**Reconciliation Costs:**

Each stakeholder employs accounting staff to reconcile payments manually. Errors are common. Disputes require costly audits. Small payments (often <$1) fail to route due to minimum payment thresholds. These "dust" amounts accumulate into significant sums across millions of tracks but remain unclaimed due to reconciliation overhead.

**Jurisdictional Fragmentation:**

The complexity multiplies across international borders. Music royalties fragment across multiple legal frameworks, each requiring separate collection infrastructure:

**Royalty Types by Jurisdiction:**

1. **Performance Royalties** (composition, public performance)
   - US: ASCAP, BMI, SESAC (competing PROs)
   - UK: PRS for Music
   - France: SACEM
   - Germany: GEMA
   - Each country: separate PRO with distinct rules
   - ~250 organizations globally

2. **Mechanical Royalties** (composition, reproduction)
   - US: Mechanical Licensing Collective (MLC) post-2018
   - EU: varies by country (SIAE in Italy, SGAE in Spain, etc.)
   - Collection rates and rules differ per jurisdiction

3. **Neighboring Rights** (recording, public performance)
   - US: SoundExchange
   - UK: PPL
   - Not recognized in all jurisdictions
   - Reciprocal agreements required for cross-border collection

4. **Synchronization Rights**
   - Negotiated case-by-case
   - No standardized collection mechanism
   - Separate contracts per jurisdiction for broadcast rights

**Required Contracts:**

For an artist to collect royalties globally, they must maintain relationships with:

- **Publishing administrator** (to register compositions with PROs worldwide)
- **Separate PRO in each major territory** (or international agreements through primary PRO)
- **Mechanical licensing agent** (varies by country)
- **Neighboring rights organizations** (SoundExchange, PPL, etc.)
- **Sub-publishers** in foreign territories (for sync licensing)
- **Distributor** with DSP agreements in each region
- **Label** (if applicable) with collection infrastructure

Each relationship requires separate contracts. Each organization takes administrative fees (5-15%). Each operates on different payment cycles. Each uses different data formats and reporting standards.

**Cross-Border Payment Reality:**

When a Spanish listener streams a US-based artist's track on Spotify:

1. Spotify Spain reports usage to local collection society
2. Society reconciles with Spotify's private data
3. Society reports to US PRO via reciprocal agreement
4. US PRO reconciles with their database
5. US PRO pays publishing administrator (minus 10-15% fee)
6. Administrator pays artist/publisher split
7. **Total time: 9-18 months from stream to artist payment**

This process repeats independently for:
- Performance royalties (composition)
- Mechanical royalties (composition)
- Neighboring rights (recording)
- Potential sync licensing (if applicable)

**Geographic Inefficiency:**

Artists lose significant revenue to geographic friction:
- **Black box royalties**: Revenue collected but unattributable due to data mismatches between systems (~$2B annually)
- **Administrative fees** stack: 10-15% per organization × multiple organizations = 30-50% total fees
- **Exchange rate losses** on currency conversions across multiple transfers
- **Unclaimed royalties** when artists don't register with all relevant organizations in all territories
- **Minimum payment thresholds** mean small amounts never route internationally

**Contract Complexity:**

Each royalty type requires distinct legal agreements:

- **Performance rights agreement** (with PRO in each territory)
- **Mechanical licensing agreement** (with MLC/equivalent in each territory)
- **Neighboring rights agreement** (with SoundExchange/PPL/equivalents)
- **Publishing administration agreement** (global or territory-specific)
- **Distribution agreement** (with digital distributor)
- **Label agreement** (if applicable, often includes portions of above)
- **Sub-publishing agreements** (for territories not covered by main publisher)

None of these contracts are interoperable. Each uses different terminology. Each has different audit rights, payment schedules, and termination clauses. Managing this matrix requires legal expertise and ongoing administrative overhead.

**The Global Coordination Problem:**

No single database tracks worldwide royalty collection. An artist cannot query "how much am I owed globally?" They must:
- Contact each PRO in each territory
- Request statements from each organization
- Reconcile conflicting data formats
- Convert currencies manually
- Track which organizations paid for which usage types

This system was designed for physical distribution in an era of national markets. Digital distribution made music instantly global but the collection infrastructure remained jurisdictionally fragmented.

### 2.4 Problem 3: Temporal Misalignment

Music copyrights persist 70-100 years while technology infrastructure operates on fundamentally different timescales:

**Copyright Duration:**
- Life of author + 70 years (most jurisdictions)
- 95 years from publication (corporate works in US)
- A track released in 2024 remains under copyright until 2095-2120

**Technology Lifecycles:**
- Cloud storage providers: 10-20 year average operational lifetimes
- Technology platforms: subject to acquisition, pivot, shutdown
- Labels and distributors: merge, acquire, sometimes go bankrupt
- File formats and codecs: become obsolete within decades

**The Gap:**

Legal obligations outlast the entities managing them. No current infrastructure guarantees 70-year availability. When companies fail or exit the market, they may abandon archives. When technologies become obsolete, files may become unreadable. Migration between systems introduces version control problems and potential data loss.

**Historical Evidence:**

Universal Music's 2008 warehouse fire destroyed masters from Nirvana, Sonic Youth, and countless others. These were "backed up," yet somehow irreplaceable. MySpace lost 12 years of user-uploaded music during a server migration. Countless smaller labels have disappeared entirely, taking catalogs with them.

The industry treats music as temporary data despite permanent legal obligations. This creates existential risk for cultural assets that should outlast the organizations managing them.

### 2.5 Problem 4: Intermediary Value Extraction

Centralized gatekeepers capture 30-70% of music revenue through control of infrastructure and information rather than proportional value provision:

**Value Capture by Layer:**

- Streaming platforms: retain 25-35% of subscription/ad revenue before paying out
- Distributors: charge 7-30% of digital revenue for primarily technical routing
- Labels (traditional deals): retain 70-85% of artist revenue through advance recoupment and overhead charges
- Publishers: retain 30-50% of composition revenue
- PROs: charge administrative fees of 5-15%

**Compounding Extraction:**

These fees stack. An artist on a traditional label deal may receive 10-15% of the revenue generated by their music after all intermediaries extract their share. Independent artists fare better but still lose 30-50% to distributor and platform fees.

**Information Asymmetry as Leverage:**

Intermediaries maintain proprietary databases, private platform relationships, and complex contract structures that create switching costs. Artists cannot easily verify whether they received correct payments. Distributors claim their fees reflect "market value" but operate in oligopolistic markets with limited competition. Labels justify their share through opaque "overhead" charges and marketing costs that may not benefit the specific artist.

**Misaligned Incentives:**

Distributors profit from volume regardless of quality, creating incentives to onboard as many releases as possible rather than curate. Labels profit from artist dependence, creating incentives to maintain information asymmetry rather than transparency. Platforms profit from algorithmic engagement, creating incentives for addictive UX rather than artist discovery.

### 2.6 Problem 5: Lack of Verifiability

Ownership claims cannot be cryptographically verified, creating ongoing disputes and fraud risks:

**Current Verification Process:**

Ownership verification depends on trusting database administrators. There is no mathematical proof of ownership, only database entries. Disputes between parties claiming the same rights cannot be resolved cryptographically and require legal arbitration. Historical ownership changes cannot be audited independently.

**Fraud Vectors:**

- Unauthorized uploads of others' works to streaming platforms
- Claims of ownership on public domain or Creative Commons works
- Disputes over sample clearance and derivative works
- Estate disputes when original artists die without clear succession

**The Universal Music v. Believe Case:**

In 2024, Universal Music sued distributor Believe and TuneCore for allowing systematic copyright infringement. Tens of thousands of tracks uploaded through these distributors allegedly violated Universal's copyrights. The case illustrates that current systems cannot automatically verify ownership before distribution begins. Manual review scales poorly. Cryptographic proof doesn't exist.

**Consequences:**

Rights holders spend millions on copyright enforcement. Platforms implement Content ID systems that generate false positives. Legitimate creators get demonetized due to fraudulent claims. Small creators cannot afford legal defense against fraudulent claims. The system depends on legal threats rather than technical verification.

### 2.7 Problem 6: Storage Redundancy and Access Fragmentation

Every stakeholder in the supply chain maintains independent copies of identical master recordings, multiplying costs without improving availability:

**Redundant Infrastructure:**

- Artist/studio storage systems
- Label archival servers
- Distributor content delivery infrastructure
- Streaming platform CDN networks (typically 5-10 geographic regions)
- Third-party backup services
- Long-term archival services

A typical 40MB lossless master replicates 6-8 times, creating 240-320MB of redundant storage per track. At industry scale (100 million tracks), this represents 24-32 petabytes of duplicated data.

**Cost Implications:**

Assuming AWS S3 pricing (~$0.023/GB/month), storing 40MB across 6 stakeholders costs $0.00552/month, or $4.64 over 70 years per track. At 1 million tracks: $4.64M in storage costs. At 100 million tracks (industry scale): $464M over 70 years. This assumes no storage cost inflation and excludes geographic redundancy, backup systems, and operational overhead.

**Access Fragmentation Despite Redundancy:**

Despite duplication, access remains fragmented. Labels cannot retrieve distributor copies. Streaming platforms cannot access label servers. File transfers between stakeholders require manual coordination. Version conflicts arise when different parties have different versions. The industry regularly experiences lost masters, access delays, and orphaned works despite redundancy.

**Operational Overhead:**

Each stakeholder employs IT staff to maintain storage infrastructure. Storage migrations during platform changes risk data loss. File format upgrades require mass transcoding. Geographic expansion requires deploying new infrastructure. All costs multiply across stakeholders managing identical data.

### 2.8 Problem 7: Payment-Consumption Disconnection

Streaming platforms have fundamentally disconnected payment from consumption, creating a system where subscription fees are pooled and distributed algorithmically rather than flowing directly from listener to artist:

**The Historical Model: Direct Payment-Consumption Relationship**

Physical media (vinyl, cassette, CD) maintained a direct economic relationship:
- **Consumer pays** → **Retailer** → **Distributor** → **Label** → **Artist**
- Each purchase directly funded the specific artist's work
- Clear chain of custody from payment to creator
- Artist revenue directly correlated with consumer demand

**The Streaming Disruption: Pooled Payment Model**

Streaming platforms broke this direct relationship:
- **Consumer pays** → **Platform subscription** → **Algorithmic distribution** → **Artist**
- Subscription fees are pooled across all users
- Distribution based on platform algorithms, not direct consumer choice
- No direct economic signal from listener to artist

**The P2P Parallel: Legalized File Sharing**

Streaming represents a mature, legalized version of P2P file sharing:
- **P2P Era**: Free access to all music, no direct payment to artists
- **Streaming Era**: Subscription access to all music, minimal payment to artists
- Both models prioritize access over monetization
- Both disconnect payment from consumption

**Economic Consequences:**

**For Artists:**
- Average per-stream payment: $0.003-0.005 (fraction of a cent)
- Revenue depends on platform algorithms, not fan support
- No direct economic relationship with listeners
- Must compete for algorithmic visibility rather than fan loyalty

**For Listeners:**
- Subscription provides access to all music
- No direct way to support favorite artists financially
- Payment goes to platform, not to specific artists
- Creates passive consumption rather than active support

**For the Industry:**
- Revenue concentrated in platform subscriptions
- Artists become dependent on algorithmic distribution
- Fan loyalty disconnected from financial support
- Creates race to bottom for per-stream rates

**The Algorithmic Middleman:**

Spotify and other platforms act as algorithmic intermediaries:
- **Subscription money** → **Platform** → **Algorithm** → **Artist**
- Algorithms determine who gets paid based on engagement metrics
- No transparency in how subscription fees are distributed
- Artists cannot directly monetize their fan base

**The Urgency for Reconnection:**

There is an urgent need to reconnect direct payment-consumption relationships while maintaining streaming's user experience:
- **Direct fan funding**: Listeners can directly support artists they love
- **Transparent distribution**: Clear visibility into how payments flow
- **Economic signals**: Fan support directly translates to artist revenue
- **Same UX**: Maintain streaming's convenience and access

**SONGS Protocol Solution:**

SONGS Protocol creates a foundational infrastructure layer with a sovereign upload system and validator network:

**Sovereign Upload System:**
- **SONGS App**: Artists upload songs directly to the protocol (sovereign layer)
- **Future Clients**: Multiple applications can access the same protocol
- **Initial State**: Songs exist on protocol but are not yet monetizable
- **Validation Required**: Songs must be validated before distribution

**Validator Network (Distributors):**
- **Current Validators**: Digital distributors (DistroKid, TuneCore, etc.)
- **Future Validators**: Other distribution types, collection societies
- **Validation Process**: Legal verification, copyright checks, authorship verification
- **Arweave Upload**: Validators execute permanent storage upload (for a fee)
- **Monetization Ready**: Only validated songs can generate revenue

**Dispute Resolution System (Future):**
- **Internal Arbitration**: Protocol-level dispute resolution mechanism
- **Legal Disputes**: Songs can be frozen during legal proceedings
- **Revenue Hold**: Earnings held until disputes are resolved
- **Transparent Process**: All dispute actions logged on-chain

**Collection Society Integration (Future - Not Currently Active):**
- **PRO Signatures**: Collection societies can sign sovereign uploads (future feature)
- **Publishing Rights**: No tokenization of publishing rights currently active
- **Other Royalties**: Only master recording rights (SongShares) are currently tokenized
- **Protocol Integration**: Seamless connection between protocol and traditional systems (future)

**How It Works:**

1. **Sovereign Upload**: Artist uploads draft song to protocol (optional: pay for immediate permanent storage)
2. **Instant Tokenization**: 10,000 SongShares created immediately with ownership structure
3. **Distribution Request**: Artist requests distribution to validator (distributor)
4. **Validation & Certification**: Validator evaluates, certifies, and signs song for monetization
5. **Permanent Storage**: Distributor takes fee and publishes to permanent storage (if not done by artist)
6. **Monetization Ready**: Song becomes available for distribution and revenue
7. **Token Redemption**: SongShare holders can redeem their portion of earnings
8. **Dispute Handling**: Internal arbitration system for legal conflicts (future)
9. **Collection Integration**: PROs can sign and collect royalties (future)

**Result**: Creates a competitive, legally compliant ecosystem where:
- **Artists** maintain sovereignty over their work
- **Validators (Distributors)** capture monetization and distribute payments transparently
- **Capitalist Competition** drives service quality and fee transparency
- **Legal compliance** is built into the protocol
- **Disputes** are handled transparently (future)
- **Collection societies** can integrate seamlessly (future)
- **Multiple distribution options** remain available
- **Current Focus**: Only master recording rights (SongShares) are tokenized


---

## Navigation

- [← Previous: Introduction](03-INTRODUCTION.md)
- [Next: Technical Requirements →](05-TECHNICAL-REQUIREMENTS.md)
- [↑ Index](INDEX.md)
- [Full Document](../MUSIC-INFRASTRUCTURE-WHITEPAPER.md)
