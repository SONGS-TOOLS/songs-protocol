import { log } from '@graphprotocol/graph-ts';
import { DistributorWalletCreated } from '../generated/distributorWalletFactory/DistributorWalletFactory';
import { Distributor } from '../generated/schema';

export function handleDistributorWalletCreated(
  event: DistributorWalletCreated
): void {
  let distributor = new Distributor(event.params.wallet);
  distributor.address = event.params.wallet;
  distributor.owner = event.params.distributor;
  log.info('DISTRIBUTOR WALLET CREATED EVENT', []);
  distributor.save();
}
