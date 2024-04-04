const { exec } = require('child_process');
const util = require('util');
const execProm = util.promisify(exec);
const path = require('path');
const fs = require('fs');

// Function to run shell commands asynchronously and log the output
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

// Function to increment the package version and return the new version number
async function updatePackageVersion(packageDirectory) {
  await runCommand('yarn version --patch', packageDirectory);
  const packageJsonPath = path.join(packageDirectory, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

// Function to update the dependency version in the mufi-app package.json and install the update
async function updateDependencyVersion(appDirectory, packageName, newVersion) {
  const packageJsonPath = path.join(appDirectory, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.dependencies[packageName] = `^${newVersion}`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  await runCommand('yarn install', appDirectory);
}

// Function to get the current Git branch name
async function getCurrentGitBranch(directory) {
  const { stdout } = await execProm('git branch --show-current', { cwd: directory });
  return stdout.trim();
}

// Main function orchestrating the version update, build, publish, and Git operations
async function main() {
  const uiComponentsDir = path.join(__dirname, 'ui-components');
  const appDir = path.join(__dirname, 'app');
  const packageName = '@gordo-d/mufi-ui-components';

  console.log('Updating package version...');
  const newVersion = await updatePackageVersion(uiComponentsDir);

  console.log(`Building and publishing ${packageName}@${newVersion}...`);
  await runCommand('yarn build', uiComponentsDir);
  await runCommand(`yarn publish --new-version ${newVersion}`, uiComponentsDir);

  console.log(`Updating ${packageName} version in mufi-app to ${newVersion}...`);
  await updateDependencyVersion(appDir, packageName, newVersion);

  // Get the current branch to use in git push
  const currentBranch = await getCurrentGitBranch(appDir);

  console.log('Committing and pushing changes...');
  await runCommand('git add .', appDir);
  await runCommand(`git commit -m "Update ${packageName} to ${newVersion}"`, appDir);
  // Ensure the changes are pushed to the correct branch
  await runCommand(`git push origin ${currentBranch}`, appDir);

  console.log('Process completed successfully.');
}

main();
