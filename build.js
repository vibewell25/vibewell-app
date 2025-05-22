// This is a simple build script to help Vercel understand our project structure
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting build process for VibeWell monorepo...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log(`Running in Vercel environment: ${isVercel}`);

try {
  // Install dependencies if not already installed
  console.log('Ensuring dependencies are installed...');
  execSync('pnpm install', { stdio: 'inherit' });

  // Build the web app
  console.log('Building web app...');
  const webAppDir = path.join(__dirname, 'apps', 'web');
  
  // Ensure the directory exists
  if (!fs.existsSync(webAppDir)) {
    console.error(`Web app directory not found: ${webAppDir}`);
    process.exit(1);
  }

  process.chdir(webAppDir);
  execSync('pnpm build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 