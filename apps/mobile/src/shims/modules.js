/**
 * Special module shims for problematic imports
 * This file exports common modules that might be required by third-party libraries
 */

// WebSocket implementation
import WebSocket from './ws';
export { WebSocket };

// URL implementation
import { URL, URLSearchParams } from 'whatwg-url';
export { URL, URLSearchParams };

// Stream implementation
import { Readable, Writable, Duplex, Transform } from 'stream-browserify';
export { Readable, Writable, Duplex, Transform };

// Buffer implementation
import { Buffer } from 'buffer';
export { Buffer };

// Crypto implementation
import * as crypto from 'crypto-browserify';
export { crypto };

// Process implementation
import process from 'process';
export { process };

// Default exports for direct imports
export default {
  WebSocket,
  URL,
  URLSearchParams,
  Readable,
  Writable,
  Duplex,
  Transform,
  Buffer,
  crypto,
  process
}; 