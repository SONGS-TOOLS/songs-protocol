import { create } from '@web3-storage/w3up-client';

// Helper function to convert IPFS URI to URL
export const IPFSUriToUrl = (cid) => {
  const ipfsGateway = "https://w3s.link/ipfs";
  return `${ipfsGateway}/${cid}`;
};

// Initialize and configure the Web3.Storage client
async function initClient() {
  const client = await create();
  return client;
}

// Function to create and provision a space for uploads
async function setupCurrentSpace(client:any, spaceName:string, email:string) {

  await client.setCurrentSpace(process.env.WEB3STORAGE_DID);

}

// Function to create and provision a space for uploads
async function setupSpace(client:any, spaceName:string, email:string) {
  // Create a space
  const space = await client.createSpace(spaceName);

  // Log in or create an account
  const myAccount = await client.login(email);

  // Assuming the email is verified and a payment plan is selected
  await myAccount.provision(space.did());

  // Save space to the client's state store
  await space.save();

  // Set the created space as the current space
  await client.setCurrentSpace(space.did());

  // Setup recovery for the space
  const recovery = await space.createRecovery(myAccount.did());
  await client.capability.access.delegate({
    space: space.did(),
    delegations: [recovery],
  });

  return space;
}

export async function createUserSpace(client:any, spaceName:string, email:string) {
    const space = await client.createSpace(spaceName);
    const myAccount = await client.login(email);
  
    // Save space information in local storage for later retrieval
    if (typeof window !== "undefined") {
      localStorage.setItem('web3StorageSpace', JSON.stringify({ spaceName, did: space.did(), email }));
    }
  
    return space;
  }


// Adjusted to use an existing space for uploads
export async function uploadToWeb3Storage(data:any, filename:string) {
    const client = await initClient();
  
    // Retrieve space information from local storage
    let spaceInfo = {};
    if (typeof window !== "undefined") {
      const storedInfo = localStorage.getItem('web3StorageSpace');
      if (storedInfo) {
        spaceInfo = JSON.parse(storedInfo);
      } else {
        throw new Error("Space information not found. Please create a space first.");
      }
    }
  
    // Set the current space based on retrieved information
    // await client.setCurrentSpace(spaceInfo.did);
  
    // Prepare file for upload
    const file = new File([data], filename, { type: 'text/plain' });
  
    // Upload file
    const cid = await client.uploadFile(file);
  
    // Generate URL to view the file on an IPFS gateway
    const url = IPFSUriToUrl(cid);
  
    return { cid, url };
  }

// Adjusted to use an existing space for uploads
export async function uploadToWeb3StorageDID(data: any, filename: string) {
    const client = await initClient();
  
    // Retrieve space information from local storage
    let spaceInfo = {};
    if (typeof window !== "undefined") {
      const storedInfo = localStorage.getItem('web3StorageSpace');
      if (storedInfo) {
        spaceInfo = JSON.parse(storedInfo);
      } else {
        throw new Error("Space information not found. Please create a space first.");
      }
    }
  
    // Set the current space based on retrieved information
    await client.setCurrentSpace(process.env.WEB3STORAGE_DID as `did:${string}:${string}`);
  
    // Prepare file for upload
    const file = new File([data], filename, { type: 'text/plain' });
  
    // Upload file
    const cid = await client.uploadFile(file);
  
    // Generate URL to view the file on an IPFS gateway
    const url = IPFSUriToUrl(cid);
  
    return { cid, url };
  }