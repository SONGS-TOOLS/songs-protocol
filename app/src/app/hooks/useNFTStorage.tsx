import { File, NFTStorage } from 'nft.storage';
import { useState } from 'react';

const useIpfsNFTStorageUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadIpfs = async (file: File): Promise<{ cid?: string; url?: string } | undefined> => {
        setIsUploading(true);
        setUploadError(null);

        try {
            const NFT_STORAGE_KEY = process.env.NFTSTORAGE_APIKEY || "";
            const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
            const cid = await nftstorage.storeBlob(file);
            setIsUploading(false);
            return { cid: cid, url:`https://nftstorage.link/ipfs/${cid}`};
        } catch (error: any) {
            console.error("Upload to IPFS failed", error);
            setIsUploading(false);
            setUploadError("Upload to IPFS failed: " + error.message);
            return undefined;
        }
    };

    return { uploadIpfs, isUploading, uploadError };
};

export default useIpfsNFTStorageUpload;
