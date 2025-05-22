// This file helps Vercel detect that this is a Next.js project
// The actual Next.js app is in apps/web
// This file simply re-exports the web app's config

// eslint-disable-next-line no-console
console.log('Using root Next.js configuration - redirecting to apps/web');

// Re-export the web app's Next.js config
module.exports = require('./apps/web/next.config.js'); 