const { execSync } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const environment = process.argv[2] || 'dev';
const action = process.argv[3] || 'all';



// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const deployKey = process.env.GRAPH_DEPLOY_KEY;
const studioSlug = environment === 'prod' ? process.env.GRAPH_STUDIO_SLUG : process.env.GRAPH_STUDIO_SLUG_DEV;

if (!deployKey || !studioSlug) {
  console.error('GRAPH_DEPLOY_KEY or GRAPH_STUDIO_SLUG is not set in the .env file');
  process.exit(1);
}
let newVersion = null;
if(action === 'deploy' || action === 'all'){
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
      devVersion = parsed.versionDev;
      
    }else{
      const [major, minor, patch] = parsed.versionDev.split('.').map(Number);
      devVersion = `${major}.${minor + 1}.0`;
      prodVersion = parsed.version;
    }
  }
  currentVersion = { version: prodVersion, versionDev: devVersion };
  newVersion = environment === 'prod' ? prodVersion : devVersion;

  // Save the new version
  fs.writeFileSync(versionFilePath, JSON.stringify(currentVersion, null, 2));

  console.log(`Deploying version: ${newVersion}`);
  console.log(`Deploying to studio: ${studioSlug}`);
  console.log(`Deploying with key: ${deployKey}`);
  console.log(`Deploying to environment: ${environment}`);
  console.log(`Deploying with action: ${action}`);
}

try {
  const subgraphManifest = environment === 'prod' ? path.resolve(__dirname, '..', 'subgraph', 'subgraph-prod.yaml') : path.resolve(__dirname, '..', 'subgraph', 'subgraph-dev.yaml');
  const subgraphName = studioSlug;
  const subgraphYamlPath = path.resolve(__dirname, '..', 'subgraph', 'subgraph.yaml');
  const subgraphPath = path.resolve(__dirname, '..', 'subgraph');

  // Copy the manifest file to subgraph.yaml
  fs.copyFileSync(subgraphManifest, subgraphYamlPath);
  console.log(`Copied ${subgraphManifest} to subgraph.yaml`);

  if(action === 'codegen' || action === 'all'){
    execSync(
      `graph codegen`,
    { stdio: 'inherit', cwd: path.resolve(__dirname, '..', 'subgraph') }
    );
  }

  if(action === 'build' || action === 'all'){
    execSync(
    `graph build`,
    { stdio: 'inherit', cwd: path.resolve(__dirname, '..', 'subgraph') }
    );
  }

  if(action === 'deploy' || action === 'all'){
    execSync(
      `goldsky subgraph deploy ${subgraphName}/${newVersion} --path ${subgraphPath}`,
      { stdio: 'inherit', cwd: path.resolve(__dirname, '..', 'subgraph') }
    );
  }

} catch (error) {
  
  console.error('Error deploying subgraph:', error);
  
  // Rollback version if it was incremented
  if (newVersion) {
    const versionFilePath = path.resolve(__dirname, '..', 'subgraph', 'version.json');
    if (fs.existsSync(versionFilePath)) {
      const parsed = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
      let currentVersion;
      
      if (environment === 'prod') {
        const [major, minor, patch] = parsed.version.split('.').map(Number);
        currentVersion = {
          version: `${major}.${minor - 1}.0`,
          versionDev: parsed.versionDev
        };
      } else {
        const [major, minor, patch] = parsed.versionDev.split('.').map(Number);
        currentVersion = {
          version: parsed.version,
          versionDev: `${major}.${minor - 1}.0`
        };
      }
      
      // Save the rolled back version
      fs.writeFileSync(versionFilePath, JSON.stringify(currentVersion, null, 2));
      console.log('Version rolled back due to deployment error');
    }
  }
  
  process.exit(1);
}