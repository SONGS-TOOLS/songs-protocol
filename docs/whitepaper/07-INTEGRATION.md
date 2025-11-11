
## 5. Integration with Existing Infrastructure

### 5.1 Industry Standard Identifiers

The architecture preserves existing ISO standards:

**ISRC (International Standard Recording Code):**
- Identifies specific recordings
- Format: US-AB1-23-45678
- Already used by Spotify, Apple Music, YouTube, PROs
- Becomes primary key for on-chain registry queries

**ISWC (International Standard Musical Work Code):**
- Identifies compositions
- Format: T-345246800-1
- Same composition covered by different artists = same ISWC, different ISRCs
- Links masters to publishing rights

**ISCC (International Standard Content Code):**
- Content fingerprint generated from file
- Designed specifically for blockchain integration
- Prevents fraudulent uploads claiming existing ISRCs

Traditional publishers and platforms continue using familiar identifiers. The difference: queries now return cryptographically verified, immutable records instead of conflicting database entries.

### 5.2 Distributor Integration

Existing distributors can function as protocol validators:
1. Artists submit releases through familiar distributor interfaces
2. Distributors validate as they do currently
3. Instead of uploading to private servers, releases go to permanent storage
4. Distributors sign validation proofs with their keys
5. Payment flows automatically distribute to on-chain splits

This allows gradual adoption. Distributors continue providing customer service, quality control, and DSP relationships. The backend shifts from private infrastructure to shared permanent storage.

### 5.3 Streaming Platform Integration

Platforms retrieve masters through gateway APIs instead of maintaining their own storage. They cache regionally for performance but eliminate long-term archival costs. Licensing verification queries on-chain registry.

**Benefits:**
- Eliminate redundant storage costs
- Instant rights verification
- Automated royalty distribution
- Reduce infrastructure to caching and transcoding


---

## Navigation

- [← Previous: Proposed Architecture](06-PROPOSED-ARCHITECTURE.md)
- [Next: Economic Model →](08-ECONOMIC-MODEL.md)
- [↑ Index](INDEX.md)
- [Full Document](../MUSIC-INFRASTRUCTURE-WHITEPAPER.md)
