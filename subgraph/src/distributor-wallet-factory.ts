import { BigInt, log } from "@graphprotocol/graph-ts";
import { DistributorWalletCreated } from "../generated/distributorWalletFactory/DistributorWalletFactory";
import { Distributor } from "../generated/schema";
import { DistributorWallet } from "../generated/templates";

export function handleDistributorWalletCreated(
  event: DistributorWalletCreated
): void {
  let distributor = new Distributor(event.params.wallet);
  distributor.address = event.params.wallet;
  distributor.owner = event.params.distributor;
  distributor.currentEpochId = BigInt.fromI32(0);
  distributor.currentWSIndex = BigInt.fromI32(0);
  distributor.stablecoinAddress = event.params.stablecoin;
  distributor.save();
  DistributorWallet.create(event.params.wallet);
}
