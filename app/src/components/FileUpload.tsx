// components/FileUpload.tsx
import useIpfsUpload from '@/app/hooks/useIpfsUpload'; // Adjust import path as necessary
import React, { useState } from 'react';

interface FileUploadProps {
    defaultFilename?: string;
    onFileSelected?: (file: File) => void;
    onUploadSuccess?: (cid: string, url: string) => void;
    formats?: string;
    immediateUpload?: boolean;
    maxSizeInBytes?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
    defaultFilename,
    onFileSelected,
    onUploadSuccess,
    formats = ".mp3,.wav,.aac,.flac",
    immediateUpload = true,
    maxSizeInBytes = 10 * 1024 * 1024,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const { uploadIpfs, isUploading, uploadError } = useIpfsUpload();
  
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            onFileSelected?.(selectedFile);
          
            if (immediateUpload) {
                await handleUpload(selectedFile);
            }
        }
    };

    const handleUpload = async (file: File) => {
        if (file.size > maxSizeInBytes) {
            alert(`File size should not exceed ${maxSizeInBytes / 1024 / 1024} MB.`);
            return;
        }
      
        const result = await uploadIpfs(file);
      
        if (result?.cid && result.url) {
            onUploadSuccess?.(result.cid, result.url);
        } else {
            alert('Upload failed: ' + uploadError);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept={formats} disabled={isUploading} />
            {!immediateUpload && file && <button onClick={() => file && handleUpload(file)} disabled={isUploading}>Upload File</button>}
            {uploadError && <p className="error">{uploadError}</p>}
        </div>
    );
};

export default FileUpload;
