module.exports = function(api) {
  api.cache(true);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
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
          'fs': 'react-native-fs',
          'os': 'react-native-os',
          'domain': 'domain-browser',
        },
      }],
    ],
  };
}; 