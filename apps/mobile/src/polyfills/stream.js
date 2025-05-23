// This is a minimal polyfill for the Node.js stream module
// Used specifically to fix the ws module dependency issue

class Duplex {
  constructor(options) {
    this.options = options || {};
    this.readable = true;
    this.writable = true;
  }

  on() {
    return this;
  }

  removeListener() {
    return this;
  }

  destroy() {}
}

module.exports = {
  Duplex
}; 