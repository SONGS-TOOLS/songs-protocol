const { execSync } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const deployKey = process.env.GRAPH_DEPLOY_KEY;
const studioSlug = process.env.GRAPH_STUDIO_SLUG; // Add this to your .env file

if (!deployKey || !studioSlug) {
  console.error('GRAPH_DEPLOY_KEY or GRAPH_STUDIO_SLUG is not set in the .env file');
  process.exit(1);
}

// Read the current version from a version file
const versionFilePath = path.resolve(__dirname, '..', 'subgraph', 'version.json');
let currentVersion = { version: '0.0.0' };

if (fs.existsSync(versionFilePath)) {
  currentVersion = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
}

// Increment the patch version
const [major, minor, patch] = currentVersion.version.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

// Save the new version
fs.writeFileSync(versionFilePath, JSON.stringify({ version: newVersion }, null, 2));

console.log(`Deploying version: ${newVersion}`);

try {
  execSync(
    `graph deploy --studio ${studioSlug} --version-label ${newVersion}`,
    { stdio: 'inherit', cwd: path.resolve(__dirname, '..', 'subgraph') }
  );
  console.log(`Successfully deployed version ${newVersion}`);
} catch (error) {
  console.error('Error deploying subgraph:', error);
  process.exit(1);
}