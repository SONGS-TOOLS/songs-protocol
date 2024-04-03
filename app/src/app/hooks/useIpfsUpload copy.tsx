// hooks/useIpfsUpload.ts
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { useState } from 'react';

const useIpfsUploadThirdWeb = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
  
    const uploadIpfs = async (file: File): Promise<{ cid?: string; url?: string } | undefined> => {
        setIsUploading(true);
        setUploadError(null);
  
        try {
            const storage = new ThirdwebStorage({
                secretKey: process.env.YOUR_THIRDWEB_SECRET_KEY,
            });
  
            const upload = await storage.upload(file);
            const url = storage.resolveScheme(upload);
  
            console.log(url);
            setIsUploading(false);
            return { cid: upload, url };
        } catch (error: any) {
            console.error("Upload to IPFS failed", error);
            setIsUploading(false);
            setUploadError("Upload to IPFS failed: " + error.message);
            return undefined;
        }
    };
  
    return { uploadIpfs, isUploading, uploadError };
};

export default useIpfsUploadThirdWeb;
