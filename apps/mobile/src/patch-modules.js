/**
 * This script patches problematic modules by creating aliases or mocks
 * It runs before the app starts to ensure all Node.js dependencies are properly resolved
 */

const fs = require('fs');
const path = require('path');

console.log('Patching Node.js modules for React Native compatibility...');

// Find all potential node_modules directories
const findAllNodeModulesDirs = (baseDir) => {
  const result = [];
  
  // Add the direct node_modules directory
  const directNodeModules = path.resolve(baseDir, 'node_modules');
  if (fs.existsSync(directNodeModules)) {
    result.push(directNodeModules);
  }
  
  // Add workspace node_modules if using pnpm
  const workspaceNodeModules = path.resolve(baseDir, '../../node_modules');
  if (fs.existsSync(workspaceNodeModules)) {
    result.push(workspaceNodeModules);
    
    // Check for pnpm structure
    const pnpmNodeModules = path.resolve(workspaceNodeModules, '.pnpm');
    if (fs.existsSync(pnpmNodeModules)) {
      result.push(pnpmNodeModules);
    }
  }
  
  return result;
};

const baseDir = path.resolve(__dirname, '..');
const nodeModulesDirs = findAllNodeModulesDirs(baseDir);

console.log('Found node_modules directories:', nodeModulesDirs);

// Function to create a mock for a module
function createMockModule(modulePath, content) {
  try {
    const dirPath = path.dirname(modulePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Create the mock file
    if (!fs.existsSync(modulePath)) {
      fs.writeFileSync(modulePath, content);
      console.log(`Created mock for: ${modulePath}`);
    }
  } catch (error) {
    console.error(`Failed to create mock for ${modulePath}:`, error);
  }
}

// Function to create all necessary shims
function createAllShims() {
  // Create the src/shims directory if it doesn't exist
  const shimsDir = path.resolve(__dirname, 'shims');
  if (!fs.existsSync(shimsDir)) {
    fs.mkdirSync(shimsDir, { recursive: true });
  }
  
  // Create or update the ws shim
  const wsShimPath = path.resolve(shimsDir, 'ws.js');
  const wsShimContent = `
/**
 * WebSocket shim for React Native
 * This provides a minimal implementation that works with React Native
 */

import { NativeModules, Platform } from 'react-native';

// Use React Native's WebSocket implementation instead of Node's ws
class WebSocket {
  constructor(url, protocols) {
    // In React Native, we can use the built-in WebSocket
    this.socket = new global.WebSocket(url, protocols);
    
    // Forward all events
    this.socket.onopen = (event) => {
      if (this.onopen) this.onopen(event);
    };
    
    this.socket.onclose = (event) => {
      if (this.onclose) this.onclose(event);
    };
    
    this.socket.onerror = (event) => {
      if (this.onerror) this.onerror(event);
    };
    
    this.socket.onmessage = (event) => {
      if (this.onmessage) this.onmessage(event);
    };
  }
  
  // Implement the ws interface
  send(data) {
    this.socket.send(data);
  }
  
  close(code, reason) {
    this.socket.close(code, reason);
  }
  
  // Event handlers
  onopen = null;
  onclose = null;
  onerror = null;
  onmessage = null;
}

// Export the WebSocket class as the default export
export default WebSocket;

// Also export it as a named export for compatibility
export { WebSocket };
  `;
  
  createMockModule(wsShimPath, wsShimContent);
  
  // Create a simple empty module shim
  const emptyModulePath = path.resolve(shimsDir, 'empty.js');
  const emptyModuleContent = `
/**
 * Empty module shim
 */
export default {};
  `;
  
  createMockModule(emptyModulePath, emptyModuleContent);
  
  // Create a stream shim for ws
  const streamShimPath = path.resolve(shimsDir, 'stream.js');
  const streamShimContent = `
/**
 * Stream shim for React Native
 * This file exports a simple implementation of Duplex for ws
 */
import { Duplex } from 'stream-browserify';

// Export Duplex from stream-browserify
export { Duplex };
  `;
  
  createMockModule(streamShimPath, streamShimContent);
}

// Create all necessary shims
createAllShims();

// Patch problematic modules 
nodeModulesDirs.forEach(nodeModulesDir => {
  // Mock for 'ws' module if problematic
  const wsDir = path.join(nodeModulesDir, 'ws');
  if (fs.existsSync(wsDir)) {
    // Patch the main index.js file
    const wsIndexPath = path.join(wsDir, 'index.js');
    const wsShimContent = `
// This is a shim for the 'ws' module in React Native
const WebSocket = global.WebSocket || require('${path.relative(path.dirname(wsIndexPath), path.resolve(__dirname, 'shims/ws.js'))}').default;
module.exports = WebSocket;
module.exports.WebSocket = WebSocket;
`;
    createMockModule(wsIndexPath, wsShimContent);
    
    // Also patch the lib/stream.js file which often causes problems
    const wsStreamPath = path.join(wsDir, 'lib', 'stream.js');
    if (fs.existsSync(path.dirname(wsStreamPath))) {
      const wsStreamContent = `
// This is a shim for the ws/lib/stream.js module
const { Duplex } = require('${path.relative(path.dirname(wsStreamPath), path.resolve(__dirname, 'shims/stream.js'))}');
module.exports = { Duplex };
`;
      createMockModule(wsStreamPath, wsStreamContent);
    }
  }
  
  // Look for ws in pnpm structure
  if (nodeModulesDir.includes('.pnpm')) {
    try {
      const wsDirs = fs.readdirSync(nodeModulesDir)
        .filter(dir => dir.startsWith('ws@'))
        .map(dir => path.join(nodeModulesDir, dir, 'node_modules', 'ws'));
      
      wsDirs.forEach(wsDir => {
        if (fs.existsSync(wsDir)) {
          // Patch the main index.js file
          const wsIndexPath = path.join(wsDir, 'index.js');
          const wsShimContent = `
// This is a shim for the 'ws' module in React Native
const WebSocket = global.WebSocket || require('${path.relative(path.dirname(wsIndexPath), path.resolve(__dirname, 'shims/ws.js'))}').default;
module.exports = WebSocket;
module.exports.WebSocket = WebSocket;
`;
          createMockModule(wsIndexPath, wsShimContent);
          
          // Also patch the lib/stream.js file
          const wsStreamPath = path.join(wsDir, 'lib', 'stream.js');
          if (fs.existsSync(path.dirname(wsStreamPath))) {
            const wsStreamContent = `
// This is a shim for the ws/lib/stream.js module
const { Duplex } = require('${path.relative(path.dirname(wsStreamPath), path.resolve(__dirname, 'shims/stream.js'))}');
module.exports = { Duplex };
`;
            createMockModule(wsStreamPath, wsStreamContent);
          }
        }
      });
    } catch (error) {
      console.error('Error processing pnpm directory:', error);
    }
  }
});

console.log('Node.js module patching complete!'); 