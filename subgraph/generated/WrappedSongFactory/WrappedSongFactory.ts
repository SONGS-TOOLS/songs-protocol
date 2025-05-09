// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class CreationFeeCollected extends ethereum.Event {
  get params(): CreationFeeCollected__Params {
    return new CreationFeeCollected__Params(this);
  }
}

export class CreationFeeCollected__Params {
  _event: CreationFeeCollected;

  constructor(event: CreationFeeCollected) {
    this._event = event;
  }

  get wrappedSong(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get token(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class FeesWithdrawn extends ethereum.Event {
  get params(): FeesWithdrawn__Params {
    return new FeesWithdrawn__Params(this);
  }
}

export class FeesWithdrawn__Params {
  _event: FeesWithdrawn;

  constructor(event: FeesWithdrawn) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get recipient(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class WrappedSongCreated extends ethereum.Event {
  get params(): WrappedSongCreated__Params {
    return new WrappedSongCreated__Params(this);
  }
}

export class WrappedSongCreated__Params {
  _event: WrappedSongCreated;

  constructor(event: WrappedSongCreated) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get wrappedSongSmartAccount(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get stablecoin(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get wsTokenManagement(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get sharesAmount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get metadata(): WrappedSongCreatedMetadataStruct {
    return changetype<WrappedSongCreatedMetadataStruct>(
      this._event.parameters[5].value.toTuple(),
    );
  }
}

export class WrappedSongCreatedMetadataStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get description(): string {
    return this[1].toString();
  }

  get image(): string {
    return this[2].toString();
  }

  get externalUrl(): string {
    return this[3].toString();
  }

  get animationUrl(): string {
    return this[4].toString();
  }

  get attributesIpfsHash(): string {
    return this[5].toString();
  }
}

export class WrappedSongFactory extends ethereum.SmartContract {
  static bind(address: Address): WrappedSongFactory {
    return new WrappedSongFactory("WrappedSongFactory", address);
  }

  accumulatedFees(param0: Address): BigInt {
    let result = super.call(
      "accumulatedFees",
      "accumulatedFees(address):(uint256)",
      [ethereum.Value.fromAddress(param0)],
    );

    return result[0].toBigInt();
  }

  try_accumulatedFees(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "accumulatedFees",
      "accumulatedFees(address):(uint256)",
      [ethereum.Value.fromAddress(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  metadataModule(): Address {
    let result = super.call("metadataModule", "metadataModule():(address)", []);

    return result[0].toAddress();
  }

  try_metadataModule(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "metadataModule",
      "metadataModule():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  protocolModule(): Address {
    let result = super.call("protocolModule", "protocolModule():(address)", []);

    return result[0].toAddress();
  }

  try_protocolModule(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "protocolModule",
      "protocolModule():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  wrappedSongTemplate(): Address {
    let result = super.call(
      "wrappedSongTemplate",
      "wrappedSongTemplate():(address)",
      [],
    );

    return result[0].toAddress();
  }

  try_wrappedSongTemplate(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "wrappedSongTemplate",
      "wrappedSongTemplate():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  wsTokenTemplate(): Address {
    let result = super.call(
      "wsTokenTemplate",
      "wsTokenTemplate():(address)",
      [],
    );

    return result[0].toAddress();
  }

  try_wsTokenTemplate(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "wsTokenTemplate",
      "wsTokenTemplate():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _protocolModule(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _wrappedSongTemplate(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _wsTokenTemplate(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateWrappedSongCall extends ethereum.Call {
  get inputs(): CreateWrappedSongCall__Inputs {
    return new CreateWrappedSongCall__Inputs(this);
  }

  get outputs(): CreateWrappedSongCall__Outputs {
    return new CreateWrappedSongCall__Outputs(this);
  }
}

export class CreateWrappedSongCall__Inputs {
  _call: CreateWrappedSongCall;

  constructor(call: CreateWrappedSongCall) {
    this._call = call;
  }

  get _stablecoin(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get songMetadata(): CreateWrappedSongCallSongMetadataStruct {
    return changetype<CreateWrappedSongCallSongMetadataStruct>(
      this._call.inputValues[1].value.toTuple(),
    );
  }

  get sharesAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class CreateWrappedSongCall__Outputs {
  _call: CreateWrappedSongCall;

  constructor(call: CreateWrappedSongCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class CreateWrappedSongCallSongMetadataStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get description(): string {
    return this[1].toString();
  }

  get image(): string {
    return this[2].toString();
  }

  get externalUrl(): string {
    return this[3].toString();
  }

  get animationUrl(): string {
    return this[4].toString();
  }

  get attributesIpfsHash(): string {
    return this[5].toString();
  }
}

export class WithdrawAccumulatedFeesCall extends ethereum.Call {
  get inputs(): WithdrawAccumulatedFeesCall__Inputs {
    return new WithdrawAccumulatedFeesCall__Inputs(this);
  }

  get outputs(): WithdrawAccumulatedFeesCall__Outputs {
    return new WithdrawAccumulatedFeesCall__Outputs(this);
  }
}

export class WithdrawAccumulatedFeesCall__Inputs {
  _call: WithdrawAccumulatedFeesCall;

  constructor(call: WithdrawAccumulatedFeesCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get recipient(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class WithdrawAccumulatedFeesCall__Outputs {
  _call: WithdrawAccumulatedFeesCall;

  constructor(call: WithdrawAccumulatedFeesCall) {
    this._call = call;
  }
}
