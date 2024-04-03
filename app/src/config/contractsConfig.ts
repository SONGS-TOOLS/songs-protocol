import MusicFactoryAbi from '@/contracts/MusicERC721Factory.json';
import UMDPAbi from '@/contracts/UMDP.json';
import contracts from '@/contracts/contractAddresses-sepolia.json';
import { Address } from 'viem';


export const UMDPConfig = {
    abi: UMDPAbi,
    address: contracts.UMDP as Address,
}
export const MusicFactoryConfig = {
    abi: MusicFactoryAbi,
    address: contracts.MusicERC721Factory as Address,
}