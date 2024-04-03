"use client";

// contexts/Web3StorageContext.tsx
import { create } from "@web3-storage/w3up-client";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Web3StorageConfig {
  spaceName?: string;
  email?: string;
  // Add any other config options related to Web3.Storage or your app's needs
}

interface Web3StorageContextType {
  client: any; // Use a more specific type if available
  space: any; // Use a more specific type if available
  setupSpace?: (config: Web3StorageConfig) => Promise<void>;
}

const Web3StorageContext = createContext<Web3StorageContextType | undefined>(
  undefined
);

export const Web3StorageProvider: React.FC<{
  children: React.ReactNode;
  config: Web3StorageConfig;
}> = ({ children, config }) => {
  const [client, setClient] = useState<any>(null);
  const [space, setSpace] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const web3StorageClient = await create();
      setClient(web3StorageClient);
      // Optionally auto-setup space based on initial config
      console.log('web3storage Client', web3StorageClient);
      if (!web3StorageClient) {
        console.error("Web3.Storage client is not initialized");
        return;
      }
      if (!config.email) {
        console.error("Config file error: email is required");
        return;
      }
      if (!config.spaceName) {
        console.error("Config file error: spaceName is required");
        return;
      }
      
      const space = await web3StorageClient.createSpace(config.spaceName);

    //   const myAccount = await web3StorageClient.login(config.email as `${string}@${string}`);
  
    //   await myAccount.provision(space.did());
      console.log(space.did());

      await space.save();
  
      await web3StorageClient.setCurrentSpace(space.did() as `did:${string}:${string}`);
  
    //   const recovery = await space.createRecovery(myAccount.did());
    //   await web3StorageClient.capability.access.delegate({
    //     space: space.did(),
    //     delegations: [recovery],
    //   });

      console.log('web3storage Space', space);

      setClient(web3StorageClient);
      setSpace(space);
    };
    init();
  }, [config]); // Depend on config to re-init if config changes


  const setupSpace = async (config: Web3StorageConfig) => {
    if (!client) {
      console.error("Web3.Storage client is not initialized");
      return;
    }
    const space = await client.createSpace(config.spaceName);

    const myAccount = await client.login(config.email);

    await myAccount.provision(space.did());

    await space.save();

    await client.setCurrentSpace(space.did());

    const recovery = await space.createRecovery(myAccount.did());
    await client.capability.access.delegate({
      space: space.did(),
      delegations: [recovery],
    });

    return space;
  };

  return (
    <Web3StorageContext.Provider value={{ client, space, setupSpace }}>
      {children}
    </Web3StorageContext.Provider>
  );
};

export const useWeb3Storage = () => {
  const context = useContext(Web3StorageContext);
  if (context === undefined) {
    throw new Error("useWeb3Storage must be used within a Web3StorageProvider");
  }
  return context;
};
