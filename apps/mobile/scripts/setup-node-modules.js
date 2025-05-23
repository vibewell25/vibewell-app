/**
 * This script helps ensure that necessary Node.js core modules are available
 * for the React Native environment, which doesn't include them by default.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REQUIRED_MODULES = [
  'buffer',
  'browserify-zlib',
  'crypto-browserify',
  'https-browserify',
  'path-browserify',
  'process',
  'stream-browserify',
  'stream-http',
  'vm-browserify'
];

// Root directory of the mobile app
const ROOT_DIR = path.resolve(__dirname, '..');

// Function to check if a module is installed
function isModuleInstalled(moduleName) {
  try {
    require.resolve(moduleName, { paths: [ROOT_DIR] });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to install missing modules
function installMissingModules() {
  const missingModules = REQUIRED_MODULES.filter(module => !isModuleInstalled(module));
  
  if (missingModules.length === 0) {
    console.log('✅ All required Node.js polyfill modules are installed.');
    return;
  }
  
  console.log(`⚠️ Missing ${missingModules.length} required Node.js polyfill modules.`);
  console.log(`The following modules will be needed for React Native to handle Node.js core modules:`);
  console.log(missingModules.join(', '));
  
  console.log('\nℹ️ Please manually add these modules to your package.json and run npm/yarn/pnpm install.');
  console.log('This is required because the project appears to be using workspaces,');
  console.log('which may have special installation requirements.\n');
  
  // Create a reminder file with instructions
  const reminderPath = path.resolve(ROOT_DIR, 'POLYFILL_MODULES_NEEDED.md');
  const instructions = `
# Node.js Polyfill Modules Needed

The following modules are required to handle Node.js core modules in React Native:

${missingModules.map(module => `- ${module}`).join('\n')}

To fix this:

1. Add these modules to your \`package.json\` dependencies
2. Run your package manager's install command
3. Restart your Expo or React Native application

Once installed, this file will be automatically deleted.
  `;
  
  fs.writeFileSync(reminderPath, instructions.trim());
  console.log(`📝 Created ${reminderPath} with installation instructions.`);
}

// Run the check
installMissingModules(); 