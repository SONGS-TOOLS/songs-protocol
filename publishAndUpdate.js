const { exec } = require('child_process');
const util = require('util');
const execProm = util.promisify(exec);
const path = require('path');
const fs = require('fs');

async function runCommand(command, workingDirectory = '.') {
  try {
    const { stdout, stderr } = await execProm(command, { cwd: workingDirectory });
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`Error executing command "${command}": ${error}`);
    process.exit(1);
  }
}

async function updatePackageVersion(packageDirectory) {
  await runCommand('yarn version --patch', packageDirectory);
  const packageJsonPath = path.join(packageDirectory, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

async function updateDependencyVersion(appDirectory, packageName, newVersion) {
  const packageJsonPath = path.join(appDirectory, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.dependencies[packageName] = `^${newVersion}`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  await runCommand('yarn install', appDirectory); // Ensure yarn.lock is updated
}

async function main() {
  const uiComponentsDir = path.join(__dirname, 'ui-components');
  const appDir = path.join(__dirname, 'app');
  const packageName = '@gordo-d/mufi-ui-components';

  console.log('Updating package version...');
  const newVersion = await updatePackageVersion(uiComponentsDir);

  console.log(`Building and publishing ${packageName}@${newVersion}...`);
  await runCommand('yarn build', uiComponentsDir);
  await runCommand('yarn publish --new-version ' + newVersion, uiComponentsDir);

  console.log(`Updating ${packageName} version in mufi-app to ${newVersion}...`);
  await updateDependencyVersion(appDir, packageName, newVersion);

  console.log('Committing and pushing changes...');
  await runCommand(`git add .`, appDir);
  await runCommand(`git commit -m "Update ${packageName} to ${newVersion}"`, appDir);
  await runCommand('git push', appDir);

  console.log('Process completed successfully.');
}

main();
