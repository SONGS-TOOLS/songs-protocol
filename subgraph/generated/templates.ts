// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Address,
  DataSourceTemplate,
  DataSourceContext,
} from "@graphprotocol/graph-ts";

export class DistributorWallet extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("DistributorWallet", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "DistributorWallet",
      [address.toHex()],
      context,
    );
  }
}

export class WrappedSongSmartAccount extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("WrappedSongSmartAccount", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "WrappedSongSmartAccount",
      [address.toHex()],
      context,
    );
  }
}

export class Attributes extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("Attributes", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("Attributes", [cid], context);
  }
}

export class WSTokenManagement extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("WSTokenManagement", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "WSTokenManagement",
      [address.toHex()],
      context,
    );
  }
}
