#!/usr/bin/env node

/**
 * UPF CLI - NPM Update & Publish Script
 * 
 * This script automates the process of:
 * 1. Checking git status
 * 2. Committing changes
 * 3. Bumping version
 * 4. Publishing to npm
 * 5. Pushing to GitHub
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command) {
  try {
    return execSync(command, { stdio: 'inherit', cwd: process.cwd() });
  } catch (error) {
    log(`\n❌ Error executing: ${command}`, 'red');
    throw error;
  }
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  log('\n╔════════════════════════════════════════╗', 'cyan');
  log('║   🚀 UPF CLI - NPM Update & Publish   ║', 'cyan');
  log('╚════════════════════════════════════════╝\n', 'cyan');

  // Check if we're in the right directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ Error: package.json not found!', 'red');
    log('   Please run this script from the frontend-cli directory.', 'yellow');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const currentVersion = packageJson.version;
  const packageName = packageJson.name;

  log(`📦 Package: ${packageName}`, 'cyan');
  log(`📌 Current Version: ${currentVersion}\n`, 'cyan');

  // Step 1: Check git status
  log('📋 Step 1: Checking git status...', 'yellow');
  try {
    exec('git status --short');
  } catch (error) {
    log('⚠️  Git is not initialized or no changes detected', 'yellow');
  }

  const hasChanges = await ask('\n❓ Do you have uncommitted changes? (y/n): ');
  
  if (hasChanges.toLowerCase() === 'y') {
    const commitMessage = await ask('📝 Enter commit message: ');
    
    log('\n📤 Adding all changes...', 'yellow');
    exec('git add .');
    
    log('💾 Committing changes...', 'yellow');
    exec(`git commit -m "${commitMessage}"`);
    
    log('✅ Changes committed!\n', 'green');
  }

  // Step 2: Choose version bump type
  log('📋 Step 2: Choose version bump type:', 'yellow');
  log('   1) Patch (bug fixes):     0.7.1 → 0.7.2', 'cyan');
  log('   2) Minor (new features):  0.7.1 → 0.8.0', 'cyan');
  log('   3) Major (breaking):      0.7.1 → 1.0.0', 'cyan');
  log('   4) Custom version\n', 'cyan');

  const bumpType = await ask('👉 Select option (1-4): ');

  let newVersion;
  let npmCommand;

  switch (bumpType) {
    case '1':
      npmCommand = 'npm version patch';
      break;
    case '2':
      npmCommand = 'npm version minor';
      break;
    case '3':
      npmCommand = 'npm version major';
      break;
    case '4':
      newVersion = await ask('📌 Enter new version (e.g., 0.8.0): ');
      npmCommand = `npm version ${newVersion}`;
      break;
    default:
      log('❌ Invalid option', 'red');
      process.exit(1);
  }

  // Step 3: Bump version
  log('\n📈 Step 3: Bumping version...', 'yellow');
  exec(npmCommand);

  // Read new version
  const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  newVersion = updatedPackageJson.version;
  log(`✅ Version bumped to: ${newVersion}\n`, 'green');

  // Step 4: Confirm publish
  const confirmPublish = await ask(`❓ Ready to publish ${packageName}@${newVersion} to npm? (y/n): `);
  
  if (confirmPublish.toLowerCase() !== 'y') {
    log('❌ Publish cancelled', 'red');
    log('   You can manually run: npm publish --access public', 'yellow');
    rl.close();
    process.exit(0);
  }

  // Step 5: Publish to npm
  log('\n🚀 Step 5: Publishing to npm...', 'yellow');
  try {
    exec('npm publish --access public');
    log(`✅ Successfully published ${packageName}@${newVersion}!\n`, 'green');
  } catch (error) {
    log('❌ Failed to publish to npm', 'red');
    log('   Check your npm authentication and try again.', 'yellow');
    log('   Run: npm login', 'yellow');
    rl.close();
    process.exit(1);
  }

  // Step 6: Push to GitHub
  const pushToGitHub = await ask('❓ Push changes to GitHub? (y/n): ');
  
  if (pushToGitHub.toLowerCase() === 'y') {
    log('\n📤 Pushing to GitHub...', 'yellow');
    try {
      exec('git push origin main');
      log('✅ Pushed to GitHub!\n', 'green');
    } catch (error) {
      log('⚠️  Failed to push to GitHub', 'yellow');
      log('   You can manually run: git push origin main', 'yellow');
    }
  }

  // Summary
  log('\n╔════════════════════════════════════════╗', 'green');
  log('║         ✅ Update Complete!            ║', 'green');
  log('╚════════════════════════════════════════╝\n', 'green');
  
  log(`📦 Package: ${packageName}`, 'cyan');
  log(`📌 Version: ${newVersion}`, 'cyan');
  log(`🔗 npm: https://www.npmjs.com/package/${packageName}`, 'cyan');
  
  log('\n🧪 Test installation:', 'yellow');
  log(`   npm install -g ${packageName}`, 'cyan');
  log(`   ${packageName.split('/')[1] || packageName} --version\n`, 'cyan');

  rl.close();
}

main().catch((error) => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
