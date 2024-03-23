// hooks/useIpfsUpload.ts
import { create } from "ipfs-http-client";
import { useState } from 'react';

const useIpfsUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
  
    const uploadIpfs = async (file: File): 
    Promise<{ cid?: string; url?: string } | undefined> => {
        setIsUploading(true);
        setUploadError(null);
  
        try {
            const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
            const secret = process.env.NEXT_PUBLIC_INFURA_SECRET;
            const client = create({
                host: "ipfs.infura.io",
                port: 5001,
                protocol: "https",
                headers: {
                    authorization: `Basic ${Buffer.from(`${projectId}:${secret}`, "utf-8").toString("base64")}`,
                },
            });
  
            const result = await client.add(file);
            const cid = result.cid.toString();
            const url = `https://ipfs.infura.io/ipfs/${result.cid}`;
  
            setIsUploading(false);
            return { cid, url };
        } catch (error: any) {
            console.error("Upload to IPFS failed", error);
            setIsUploading(false);
            setUploadError("Upload to IPFS failed: " + error.message);
            return undefined;
        }
    };
  
    return { uploadIpfs, isUploading, uploadError };
};

export default useIpfsUpload;
