const { NFTStorage, File } = require('nft.storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const NFT_STORAGE_API_KEY = process.env.NFTSTORAGE_APIKEY;

async function* getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

async function main() {
  if (!NFT_STORAGE_API_KEY) {
    console.error('NFT_STORAGE_API_KEY is not set in the environment variables');
    process.exit(1);
  }

  const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });
  const files = [];

  for await (const filePath of getFiles(path.join(__dirname, 'public'))) {
    if (path.basename(filePath) === 'songs-license.png') {
      const content = await fs.promises.readFile(filePath);
      files.push(new File([content], path.relative(__dirname, filePath)));
    }
  }

  console.log('Uploading files to NFT.Storage...');
  const cid = await client.storeDirectory(files);
  console.log('Upload complete. CID:', cid);
  console.log(`View your files at: https://ipfs.io/ipfs/${cid}`);
}

main().catch((error) => {
  console.error('Error uploading files:', error);
  process.exit(1);
});