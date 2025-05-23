/**
 * This file sets up Node.js polyfills for React Native
 * It should be imported at the entry point of the application
 */

// Import core Node.js polyfills
import { Buffer } from 'buffer';
import process from 'process';
import { URL, URLSearchParams } from 'whatwg-url';

// Make polyfills available globally
global.Buffer = Buffer;
global.process = process;
global.URL = URL;
global.URLSearchParams = URLSearchParams;

// Add mock location if not present (for various Node.js libraries)
if (typeof global.location === 'undefined') {
  global.location = {
    protocol: 'https:',
    host: 'localhost:8081',
    hostname: 'localhost',
    port: '8081',
    pathname: '/',
    href: 'https://localhost:8081/',
    search: '',
    hash: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
}

// Import WebSocket polyfill
import WebSocket from '../shims/ws';
global.WebSocket = WebSocket;

// Create empty shims for Node.js modules that might be required
// but aren't actually used in the browser context
global.fs = {};
global.net = {};
global.tls = {};
global.child_process = {};
global.dgram = {};
global.dns = {};

// Fix for missing TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = function TextEncoder() {};
  global.TextEncoder.prototype.encode = function encode(str) {
    const buf = Buffer.from(str, 'utf-8');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  };
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = function TextDecoder() {};
  global.TextDecoder.prototype.decode = function decode(uint8Array) {
    return Buffer.from(uint8Array).toString('utf-8');
  };
}

// Make any additional global assignments here 