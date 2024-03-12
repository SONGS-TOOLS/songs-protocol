// components/FileUpload.js
import { uploadToWeb3StorageDID } from '@/app/lib/web3storage';
import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    try {
      const { cid, url } = await uploadToWeb3StorageDID(file, file.name);
      alert(`File uploaded successfully. CID: ${cid}, URL: ${url}`);
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
}
