import { DistributorWalletCreated } from '../generated/distributorWalletFactory/DistributorWalletFactory';
import { Distributor } from '../generated/schema';

export function handleDistributorWalletCreated(
  event: DistributorWalletCreated
): void {
  let distributor = new Distributor(event.params.distributor);
  distributor.address = event.params.distributor;
  distributor.save();
}
