import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { MetadataUpdateConfirmed } from "../generated/schema"
import { MetadataUpdateConfirmed as MetadataUpdateConfirmedEvent } from "../generated/ProtocolModule/ProtocolModule"
import { handleMetadataUpdateConfirmed } from "../src/protocol-module"
import { createMetadataUpdateConfirmedEvent } from "./protocol-module-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let wrappedSong = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenId = BigInt.fromI32(234)
    let newMetadataUpdateConfirmedEvent = createMetadataUpdateConfirmedEvent(
      wrappedSong,
      tokenId
    )
    handleMetadataUpdateConfirmed(newMetadataUpdateConfirmedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MetadataUpdateConfirmed created and stored", () => {
    assert.entityCount("MetadataUpdateConfirmed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MetadataUpdateConfirmed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "wrappedSong",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "MetadataUpdateConfirmed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
