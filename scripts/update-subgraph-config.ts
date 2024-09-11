import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

function updateSubgraphConfig() {
  const deployInfoPath = path.join(__dirname, '..', 'subgraph', 'deployment-info.json');
  const subgraphYamlPath = path.join(__dirname, '..', 'subgraph', 'subgraph.yaml');

  // Read deployment info
  const deployInfo = JSON.parse(readFileSync(deployInfoPath, 'utf8'));

  // Read subgraph.yaml
  let subgraphYaml = readFileSync(subgraphYamlPath, 'utf8');

  // Replace placeholders
  subgraphYaml = subgraphYaml.replace('{{networkName}}', 'base-sepolia');
  subgraphYaml = subgraphYaml.replace('{{protocolModuleAddress}}', deployInfo.protocolModuleAddress);
  subgraphYaml = subgraphYaml.replace('{{wrappedSongFactoryAddress}}', deployInfo.wrappedSongFactoryAddress);
  subgraphYaml = subgraphYaml.replace(/{{startBlock}}/g, deployInfo.startBlock.toString());

  // Write updated subgraph.yaml
  writeFileSync(subgraphYamlPath, subgraphYaml);

  console.log(`Updated subgraph.yaml with deployment info for base-sepolia`);
}

updateSubgraphConfig();