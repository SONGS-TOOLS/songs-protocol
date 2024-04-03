"use client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getContractEvents } from "viem/actions";
import { useClient } from "wagmi";
import { config } from "../../config";

// Define an interface for the hook's parameters
interface UseLogsParams {
    address: `0x${string}`;
    eventName: string;
    abi: any[]; // ABI could be more specifically typed based on your contract
    args?: {};
  }
  
  // Define the return type of the hook
  interface UseLogsReturn {
    logs: any[] | null; // Replace `any` with a more specific type based on the logs structure
    isLoading: boolean;
    error: Error | null;
  }
  
  export function useLogs({
    address = '0x0',
    eventName = 'Transfer',
    abi = [],
    args,
  }: UseLogsParams): UseLogsReturn {
    const [logs, setLogs] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const publicClient:any = useClient({ config: config });

    useEffect(() => {
      const fetchLogs = async () => {
        setIsLoading(true);
        if (!address || !eventName) {
          console.warn('No address');
          return;
        }
        try {
          console.log('logs', { 
            address: address,
            abi: abi,
            eventName: eventName,
            args: args,
          })
          const logs = await getContractEvents(publicClient, 
            { 
              address: address,
              abi: abi,
              eventName: eventName,
              // args: args,
            }
            ) 
          // const logs = await publicClient.getContractEvents({ address, abi, eventName });
          console.log('LOGS RESULT',logs);
          setLogs(logs);
        } catch (error) {
          console.log('LOGS ERROR',error);
          setError(error as Error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchLogs();
    }, [address, eventName, abi]);
  
    return { logs, isLoading, error };
  }
  

// Define an interface for the query options parameter
interface UsePublicLogsOptions {
    queryKey: string[];
    params: any; // This should be replaced with a specific type based on your query params
    options?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>;
  }
  
  // Define the return type of the hook
  interface UsePublicLogsReturn {
    data: any | undefined; // Replace `any` with a more specific type based on your data structure
    isLoading: boolean;
    error: Error | null;
  }
  
  export function usePublicLogs(queryOptions: UsePublicLogsOptions): UsePublicLogsReturn {
    const publicClient:any = useClient({ config: config });
  
    const { data, isLoading, error } = useQuery<any, Error>({
      queryKey: ['logs', publicClient.uid, ...queryOptions.queryKey],
      queryFn: () => publicClient.getLogs(queryOptions.params),
      ...queryOptions.options,
    });
  
    return { data, isLoading, error };
  }
  
// Define an interface for the asset parameter
interface Asset {
    // Add properties based on what `watchAsset` expects
  }
  
  // Define the return type of the hook
  interface UseWatchAssetReturn {
    mutate: (asset: Asset) => void;
    isLoading: boolean;
    error: Error | null;
  }
  
// Define an interface for the asset parameter
interface Asset {
    // Add properties based on what `watchAsset` expects
  }
  
  // Define the return type of the hook
  interface UseWatchAssetReturn {
    mutate: (asset: Asset) => void;
    isLoading: boolean;
    error: Error | null;
  }
  
//   export function useWatchAsset(): UseWatchAssetReturn {
//     const { data: walletClient } = useConnectorClient(config);
  
//     const { mutate, isLoading, error } = useMutation<any, Error, Asset>({
//       mutationFn: (asset) => walletClient?.watchAsset(asset),
//     });
  
//     return { mutate, isLoading, error };
//   }
  