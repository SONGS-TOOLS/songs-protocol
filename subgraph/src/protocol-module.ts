import { BigInt, store } from "@graphprotocol/graph-ts";
import {
  MaxSaleDurationUpdated as MaxSaleDurationUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
} from "../generated/ProtocolModule/ProtocolModule";
import { Distributor, ProtocolConfig, ReleaseRequest, WrappedSong } from "../generated/schema";

export function getOrCreateProtocol(): ProtocolConfig {
  let protocol = ProtocolConfig.load("1") // or "SINGLETON"
  
  if (!protocol) {
    protocol = new ProtocolConfig("1")
    protocol.maxSaleDuration = BigInt.fromI32(30)
    protocol.save()
  }
  
  return protocol
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let protocol = getOrCreateProtocol()  
  protocol.save()
}

export function handleMaxSaleDurationUpdated(event: MaxSaleDurationUpdatedEvent): void {
  let protocol = getOrCreateProtocol()
  protocol.maxSaleDuration = event.params.newDuration
  protocol.save()
}

