const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

// Define the core Node.js modules that need polyfills
const nodeModules = {
  'stream': 'stream-browserify',
  'crypto': 'crypto-browserify',
  'buffer': 'buffer',
  'http': 'stream-http',
  'https': 'https-browserify',
  'process': 'process',
  'path': 'path-browserify',
  'zlib': 'browserify-zlib',
  'url': 'whatwg-url',
  'querystring': 'querystring-es3',
  'domain': 'domain-browser',
  // Special handling for problematic modules
  'ws': path.resolve(__dirname, './src/shims/ws.js')
};

// Create the default Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Export the config with resolved extensions and node modules
module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: nodeModules,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs', 'mjs']
  }
}; 