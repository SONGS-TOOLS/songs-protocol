const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const execProm = util.promisify(exec);

async function runCommand(command, workingDirectory = process.cwd()) {
  console.log(`Executing: ${command} in ${workingDirectory}`);
  try {
    const { stdout, stderr } = await execProm(command, { cwd: workingDirectory });
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`Error executing command "${command}": ${error}`);
    process.exit(1);
  }
}

async function checkEnvironmentVariables() {
  if (!process.env.NPM_TOKEN) {
    console.error("NPM_TOKEN is not set. Please set it before continuing.");
    process.exit(1);
  }
}

async function prepareUiComponents() {
  const uiComponentsDir = path.join(__dirname, 'ui-components');
  await runCommand('yarn cache clean', uiComponentsDir);
  await runCommand('yarn upgrade', uiComponentsDir);
  await runCommand('yarn build', uiComponentsDir);
  await runCommand(`npm publish --access public`, uiComponentsDir);
}

async function prepareApp() {
  const appDir = path.join(__dirname, 'app');
  await runCommand('yarn upgrade @gordo-d/mufi-ui-components', appDir);
  await runCommand('yarn install', appDir);
  await runCommand('yarn test', appDir);
  await runCommand('yarn build', appDir);
}

async function main() {
  console.log("Starting preparation for production...");
  await checkEnvironmentVariables();
  await prepareUiComponents();
  await prepareApp();
  console.log("Preparation for production completed successfully.");
}

main();
