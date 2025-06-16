import { createPublicClient, http, parseAbiItem, decodeEventLog, Log } from 'viem'
import { baseSepolia } from 'viem/chains'

// Define all possible events
const marketPlaceEvents = [
  parseAbiItem('event SharesSaleStarted(address indexed seller, address indexed song, uint256 price, uint256 duration, uint256 maxShares, address paymentToken)'),
  parseAbiItem('event SharesSold(address indexed seller, address indexed buyer, address indexed song, uint256 amount, uint256 price, address paymentToken)'),
  parseAbiItem('event SharesSaleEnded(address indexed song)'),
  parseAbiItem('event FundsWithdrawn(address indexed song, address indexed recipient, uint256 amount)')
]

// Event topic signatures
const EVENT_TOPICS = {
  SHARES_SALE_STARTED: '0x7e13ce3c75f9b5edb5e31305c6f620962f35f6554a1d3b8d7189be71041902ba',
  SHARES_SALE_ENDED: '0x50e9428f1419cdaec089c86c412fd52565cbe415f195d893357a3a8b2a0e646a',
  SHARES_SOLD: '0x16a6b05063764eec367f7f75e1d59322471f7bd0cc347509f5796d7ce8e3e866'
}

// Create a public client
const client = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

// Define the log type
type MarketPlaceLog = Log & {
  id: string
  data: `0x${string}`
  topics: `0x${string}`[]
  blockTimestamp: number
  removed: boolean
}

// Example log data
const log: MarketPlaceLog = {
  id: "log_0x6b3cd962ecd2ede9d7d11ce1779a15ad9ff9efd243b2466a7a11b08342b60c51_104",
  blockNumber: 21157513n,
  blockHash: "0x6b3cd962ecd2ede9d7d11ce1779a15ad9ff9efd243b2466a7a11b08342b60c51",
  transactionHash: "0x44d0f9f1f75e04c2d9afc28f6fe1fb26bc1bf734698ca17476c1718d771f4926",
  transactionIndex: 26,
  logIndex: 104,
  address: "0x9fc221d5240ea5422a75c32d2026bb12ca47d05a",
  data: "0x00000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000186a000000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000036cbd53842c5426634e7929541ec2318f3dcf7e",
  topics: [
    "0x7e13ce3c75f9b5edb5e31305c6f620962f35f6554a1d3b8d7189be71041902ba",
    "0x0000000000000000000000007057214362870392c7492b59f22b7d5212adecca",
    "0x00000000000000000000000059dd6b7f6fbae92662f4bff96da67a8960bafaf1"
  ],
  blockTimestamp: 1738083314,
  removed: false
}

// Function to decode any market place event
function decodeMarketPlaceEvent(log: MarketPlaceLog) {
  try {
    const decodedEvent = decodeEventLog({
      abi: marketPlaceEvents,
      data: log.data,
      topics: log.topics,
    })

    return {
      eventName: decodedEvent.eventName,
      args: decodedEvent.args,
      // Include additional context
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      blockTimestamp: log.blockTimestamp
    }
  } catch (error) {
    console.error('Error decoding event:', error)
    return null
  }
}

// Function to check if a log matches specific event topics
function matchesEventTopics(log: { topics: `0x${string}`[] }, topics: string[]): boolean {
  return topics.includes(log.topics[0])
}

// Function to fetch and decode events from a block range with topic filtering
async function fetchAndDecodeEvents(
  fromBlock: bigint, 
  toBlock: bigint, 
  filterTopics: string[] = [
    EVENT_TOPICS.SHARES_SALE_STARTED,
    EVENT_TOPICS.SHARES_SALE_ENDED,
    EVENT_TOPICS.SHARES_SOLD
  ]
) {
  try {
    const logs = await client.getLogs({
      address: '0x9fc221d5240ea5422a75c32d2026bb12ca47d05a',
      events: marketPlaceEvents,
      fromBlock,
      toBlock,
    })

    // Filter logs by topics
    const filteredLogs = logs.filter(log => matchesEventTopics(log, filterTopics))

    return filteredLogs.map(log => {
      const enhancedLog: MarketPlaceLog = {
        ...log,
        id: `${log.transactionHash}_${log.logIndex}`,
        blockTimestamp: Date.now(), // You might want to fetch this from the block
        removed: false
      }
      return decodeMarketPlaceEvent(enhancedLog)
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return []
  }
}

// Example usage
const decodedEvent = decodeMarketPlaceEvent(log)
console.log('Decoded event:', JSON.stringify(decodedEvent, null, 2))

// Example usage of fetching events with topic filtering
// Uncomment to use:
// fetchAndDecodeEvents(21157513n, 21157513n).then(events => {
//   events.forEach(event => {
//     if (event) {
//       console.log(`Event ${event.eventName}:`, event.args)
//     }
//   })
// }) 