// hooks/useWeb3StorageUpload.ts
import { useWeb3Storage } from '@/context/Web3StorageContext';
import { useState } from 'react';
import { IPFSUriToUrl } from '../lib/web3storage';

export const useWeb3StorageUpload = () => {
  const { client } = useWeb3Storage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{ cid?: string; url?: string } | null>(null);

  const uploadFile = async (file: File, filename: string) => {
    if (!client) {
      console.error("Web3.Storage client is not initialized");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileData = new File([file], filename, { type: 'text/plain' });
      const cid = await client.uploadFile(fileData);
      const url = IPFSUriToUrl(cid);
      setUploadResult({ cid, url });
    } catch (error: any) {
      console.error(`Upload failed: ${error.message}`);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, uploadError, uploadResult };
};
