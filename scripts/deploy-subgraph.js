const { execSync } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const environment = process.argv[2] || 'dev';


// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const deployKey = process.env.GRAPH_DEPLOY_KEY;
const studioSlug = environment === 'prod' ? process.env.GRAPH_STUDIO_SLUG : process.env.GRAPH_STUDIO_SLUG_DEV;

if (!deployKey || !studioSlug) {
  console.error('GRAPH_DEPLOY_KEY or GRAPH_STUDIO_SLUG is not set in the .env file');
  process.exit(1);
}

// Read the current version from a version file
const versionFilePath = path.resolve(__dirname, '..', 'subgraph', 'version.json');
let prodVersion = '0.0.1';
let devVersion = '0.0.1';
let currentVersion = { version: prodVersion, versionDev: devVersion };


if (fs.existsSync(versionFilePath)) {
  const parsed = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
  if (environment === 'prod') {
    const [major, minor, patch] = parsed.version.split('.').map(Number);
    prodVersion = `${major}.${minor + 1}.0`;
  }else{
    const [major, minor, patch] = parsed.versionDev.split('.').map(Number);
    devVersion = `${major}.${minor + 1}.0`;
  }
}
currentVersion = { version: prodVersion, versionDev: devVersion };
let newVersion = environment === 'prod' ? prodVersion : devVersion;

// Save the new version
fs.writeFileSync(versionFilePath, JSON.stringify(currentVersion, null, 2));

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