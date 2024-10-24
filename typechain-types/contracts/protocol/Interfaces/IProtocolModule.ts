/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export declare namespace IProtocolModule {
  export type ReviewPeriodStruct = {
    startTime: BigNumberish;
    endTime: BigNumberish;
    distributor: AddressLike;
  };

  export type ReviewPeriodStructOutput = [
    startTime: bigint,
    endTime: bigint,
    distributor: string
  ] & { startTime: bigint; endTime: bigint; distributor: string };
}

export interface IProtocolModuleInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "acceptWrappedSongForReview"
      | "addISCC"
      | "addISRC"
      | "addISWC"
      | "addUPC"
      | "confirmWrappedSongRelease"
      | "distributorWalletFactory"
      | "getPendingDistributorRequests"
      | "getWrappedSongDistributor"
      | "handleExpiredReviewPeriod"
      | "isAuthentic"
      | "isReleased"
      | "isValidToCreateWrappedSong"
      | "isccRegistry"
      | "isrcRegistry"
      | "iswcRegistry"
      | "metadataModule"
      | "paused"
      | "pendingDistributorRequests"
      | "rejectWrappedSongRelease"
      | "releaseFee"
      | "removeWrappedSongReleaseRequest"
      | "requestWrappedSongRelease"
      | "reviewPeriodDays"
      | "reviewPeriods"
      | "setMetadataModule"
      | "setPaused"
      | "setReleaseFee"
      | "setReviewPeriodDays"
      | "setWhitelistingManager"
      | "setWrappedSongAuthenticity"
      | "setWrappedSongCreationFee"
      | "upcRegistry"
      | "updateDistributorWalletFactory"
      | "whitelistingManager"
      | "wrappedSongAuthenticity"
      | "wrappedSongCreationFee"
      | "wrappedSongToDistributor"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "acceptWrappedSongForReview",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addISCC",
    values: [AddressLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "addISRC",
    values: [AddressLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "addISWC",
    values: [AddressLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "addUPC",
    values: [AddressLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "confirmWrappedSongRelease",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "distributorWalletFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPendingDistributorRequests",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getWrappedSongDistributor",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "handleExpiredReviewPeriod",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isAuthentic",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isReleased",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidToCreateWrappedSong",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isccRegistry",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isrcRegistry",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "iswcRegistry",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "metadataModule",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingDistributorRequests",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "rejectWrappedSongRelease",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "releaseFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeWrappedSongReleaseRequest",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "requestWrappedSongRelease",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "reviewPeriodDays",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reviewPeriods",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setMetadataModule",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "setPaused", values: [boolean]): string;
  encodeFunctionData(
    functionFragment: "setReleaseFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setReviewPeriodDays",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setWhitelistingManager",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setWrappedSongAuthenticity",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setWrappedSongCreationFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "upcRegistry",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateDistributorWalletFactory",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistingManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "wrappedSongAuthenticity",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "wrappedSongCreationFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "wrappedSongToDistributor",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptWrappedSongForReview",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addISCC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addISRC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addISWC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addUPC", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "confirmWrappedSongRelease",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributorWalletFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPendingDistributorRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWrappedSongDistributor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "handleExpiredReviewPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isAuthentic",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isReleased", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isValidToCreateWrappedSong",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isccRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isrcRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "iswcRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "metadataModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingDistributorRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rejectWrappedSongRelease",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "releaseFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeWrappedSongReleaseRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestWrappedSongRelease",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reviewPeriodDays",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reviewPeriods",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMetadataModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPaused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setReleaseFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setReviewPeriodDays",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setWhitelistingManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setWrappedSongAuthenticity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setWrappedSongCreationFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "upcRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateDistributorWalletFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistingManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "wrappedSongAuthenticity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "wrappedSongCreationFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "wrappedSongToDistributor",
    data: BytesLike
  ): Result;
}

export interface IProtocolModule extends BaseContract {
  connect(runner?: ContractRunner | null): IProtocolModule;
  waitForDeployment(): Promise<this>;

  interface: IProtocolModuleInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  acceptWrappedSongForReview: TypedContractMethod<
    [wrappedSong: AddressLike],
    [void],
    "nonpayable"
  >;

  addISCC: TypedContractMethod<
    [wrappedSong: AddressLike, iscc: string],
    [void],
    "nonpayable"
  >;

  addISRC: TypedContractMethod<
    [wrappedSong: AddressLike, isrc: string],
    [void],
    "nonpayable"
  >;

  addISWC: TypedContractMethod<
    [wrappedSong: AddressLike, iswc: string],
    [void],
    "nonpayable"
  >;

  addUPC: TypedContractMethod<
    [wrappedSong: AddressLike, upc: string],
    [void],
    "nonpayable"
  >;

  confirmWrappedSongRelease: TypedContractMethod<
    [wrappedSong: AddressLike],
    [void],
    "nonpayable"
  >;

  distributorWalletFactory: TypedContractMethod<[], [string], "view">;

  getPendingDistributorRequests: TypedContractMethod<
    [wrappedSong: AddressLike],
    [string],
    "view"
  >;

  getWrappedSongDistributor: TypedContractMethod<
    [wrappedSong: AddressLike],
    [string],
    "view"
  >;

  handleExpiredReviewPeriod: TypedContractMethod<
    [wrappedSong: AddressLike],
    [void],
    "nonpayable"
  >;

  isAuthentic: TypedContractMethod<
    [wrappedSong: AddressLike],
    [boolean],
    "view"
  >;

  isReleased: TypedContractMethod<
    [wrappedSong: AddressLike],
    [boolean],
    "view"
  >;

  isValidToCreateWrappedSong: TypedContractMethod<
    [creator: AddressLike],
    [boolean],
    "view"
  >;

  isccRegistry: TypedContractMethod<
    [wrappedSong: AddressLike],
    [string],
    "view"
  >;

  isrcRegistry: TypedContractMethod<
    [wrappedSong: AddressLike],
    [string],
    "view"
  >;

  iswcRegistry: TypedContractMethod<
    [wrappedSong: AddressLike],
    [string],
    "view"
  >;

  metadataModule: TypedContractMethod<[], [string], "view">;

  paused: TypedContractMethod<[], [boolean], "view">;

  pendingDistributorRequests: TypedContractMethod<
    [wrappedSong: AddressLike],
    [string],
    "view"
  >;

  rejectWrappedSongRelease: TypedContractMethod<
    [wrappedSong: AddressLike],
    [void],
    "nonpayable"
  >;

  releaseFee: TypedContractMethod<[], [bigint], "view">;

  removeWrappedSongReleaseRequest: TypedContractMethod<
    [wrappedSong: AddressLike],
    [void],
    "nonpayable"
  >;

  requestWrappedSongRelease: TypedContractMethod<
    [wrappedSong: AddressLike, distributor: AddressLike],
    [void],
    "nonpayable"
  >;

  reviewPeriodDays: TypedContractMethod<[], [bigint], "view">;

  reviewPeriods: TypedContractMethod<
    [wrappedSong: AddressLike],
    [IProtocolModule.ReviewPeriodStructOutput],
    "view"
  >;

  setMetadataModule: TypedContractMethod<
    [_metadataModule: AddressLike],
    [void],
    "nonpayable"
  >;

  setPaused: TypedContractMethod<[_paused: boolean], [void], "nonpayable">;

  setReleaseFee: TypedContractMethod<
    [_fee: BigNumberish],
    [void],
    "nonpayable"
  >;

  setReviewPeriodDays: TypedContractMethod<
    [_days: BigNumberish],
    [void],
    "nonpayable"
  >;

  setWhitelistingManager: TypedContractMethod<
    [_whitelistingManager: AddressLike],
    [void],
    "nonpayable"
  >;

  setWrappedSongAuthenticity: TypedContractMethod<
    [wrappedSong: AddressLike, _isAuthentic: boolean],
    [void],
    "nonpayable"
  >;

  setWrappedSongCreationFee: TypedContractMethod<
    [_fee: BigNumberish],
    [void],
    "nonpayable"
  >;

  upcRegistry: TypedContractMethod<
    [wrappedSong: AddressLike],
    [string],
    "view"
  >;

  updateDistributorWalletFactory: TypedContractMethod<
    [_newFactory: AddressLike],
    [void],
    "nonpayable"
  >;

  whitelistingManager: TypedContractMethod<[], [string], "view">;

  wrappedSongAuthenticity: TypedContractMethod<
    [wrappedSong: AddressLike],
    [boolean],
    "view"
  >;

  wrappedSongCreationFee: TypedContractMethod<[], [bigint], "view">;

  wrappedSongToDistributor: TypedContractMethod<
    [wrappedSong: AddressLike],
    [string],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "acceptWrappedSongForReview"
  ): TypedContractMethod<[wrappedSong: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addISCC"
  ): TypedContractMethod<
    [wrappedSong: AddressLike, iscc: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "addISRC"
  ): TypedContractMethod<
    [wrappedSong: AddressLike, isrc: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "addISWC"
  ): TypedContractMethod<
    [wrappedSong: AddressLike, iswc: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "addUPC"
  ): TypedContractMethod<
    [wrappedSong: AddressLike, upc: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "confirmWrappedSongRelease"
  ): TypedContractMethod<[wrappedSong: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "distributorWalletFactory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPendingDistributorRequests"
  ): TypedContractMethod<[wrappedSong: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "getWrappedSongDistributor"
  ): TypedContractMethod<[wrappedSong: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "handleExpiredReviewPeriod"
  ): TypedContractMethod<[wrappedSong: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "isAuthentic"
  ): TypedContractMethod<[wrappedSong: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isReleased"
  ): TypedContractMethod<[wrappedSong: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isValidToCreateWrappedSong"
  ): TypedContractMethod<[creator: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isccRegistry"
  ): TypedContractMethod<[wrappedSong: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "isrcRegistry"
  ): TypedContractMethod<[wrappedSong: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "iswcRegistry"
  ): TypedContractMethod<[wrappedSong: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "metadataModule"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "pendingDistributorRequests"
  ): TypedContractMethod<[wrappedSong: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "rejectWrappedSongRelease"
  ): TypedContractMethod<[wrappedSong: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "releaseFee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "removeWrappedSongReleaseRequest"
  ): TypedContractMethod<[wrappedSong: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "requestWrappedSongRelease"
  ): TypedContractMethod<
    [wrappedSong: AddressLike, distributor: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "reviewPeriodDays"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "reviewPeriods"
  ): TypedContractMethod<
    [wrappedSong: AddressLike],
    [IProtocolModule.ReviewPeriodStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "setMetadataModule"
  ): TypedContractMethod<[_metadataModule: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPaused"
  ): TypedContractMethod<[_paused: boolean], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setReleaseFee"
  ): TypedContractMethod<[_fee: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setReviewPeriodDays"
  ): TypedContractMethod<[_days: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setWhitelistingManager"
  ): TypedContractMethod<
    [_whitelistingManager: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setWrappedSongAuthenticity"
  ): TypedContractMethod<
    [wrappedSong: AddressLike, _isAuthentic: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setWrappedSongCreationFee"
  ): TypedContractMethod<[_fee: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upcRegistry"
  ): TypedContractMethod<[wrappedSong: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "updateDistributorWalletFactory"
  ): TypedContractMethod<[_newFactory: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "whitelistingManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "wrappedSongAuthenticity"
  ): TypedContractMethod<[wrappedSong: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "wrappedSongCreationFee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "wrappedSongToDistributor"
  ): TypedContractMethod<[wrappedSong: AddressLike], [string], "view">;

  filters: {};
}
