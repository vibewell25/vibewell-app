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