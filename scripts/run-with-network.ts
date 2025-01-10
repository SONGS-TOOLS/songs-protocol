import { execSync } from 'child_process';

const scriptName = process.argv[2];
const network = process.argv[3] || 'localhost';

interface Scripts {
  [key: string]: string;
}
const scripts: Scripts = {
  'deploy-songs': `npx hardhat run scripts/deploy-ws.ts --network ${network}`,
  'deploy-protocol': `npx hardhat run scripts/deploy-protocol.ts --network ${network}${network === 'baseSepolia' ? ' && ts-node scripts/update-subgraph-config.ts' : ''}`,
  'deploy-protocol-main': `npx hardhat run scripts/deploy-protocol-main.ts --network ${network}${network === 'baseSepolia' ? ' && ts-node scripts/update-subgraph-config.ts' : ''}`,
  'deploy-license': `npx hardhat run scripts/deploy-license.ts --network ${network}`,
  'deploy': `npx hardhat run scripts/deploy.ts --network ${network}`,
  'deploy-ws-2': `npx hardhat run scripts/deploy-ws-2.ts --network ${network}`,
  'deploy-all': `npm run deploy:protocol ${network} && npm run deploy:songs ${network}`,
  'deploy-one': `npm run deploy:protocol ${network} && npx hardhat run scripts/deploy-ws-one.ts --network ${network}`,
  'deploy-distributor': `npx hardhat run scripts/deploy-distributor.ts --network ${network}`,
  'deploy-protocol-distributor': `npm run deploy:protocol ${network} && npx hardhat run scripts/deploy-distributor.ts --network ${network}`,
};

if (!scripts[scriptName]) {
  console.error(`Unknown script: ${scriptName}`);
  process.exit(1);
}

console.log(`Executing script for network: ${network}`);

try {
  execSync(scripts[scriptName], { stdio: 'inherit' });
} catch (error) {
  console.error(`Error executing script: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}