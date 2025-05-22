export default {
  name: 'VibeWell',
  slug: 'vibewell',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#4CAF50'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.vibewell.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#4CAF50'
    },
    package: 'com.vibewell.app'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    // These values should be replaced with actual values in a production environment
    // using environment variables or a secure secret management system
    supabaseUrl: process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'YOUR_STRIPE_PUBLISHABLE_KEY',
    // Analytics and monitoring
    amplitudeApiKey: process.env.AMPLITUDE_API_KEY || '',
    sentryDsn: process.env.SENTRY_DSN || '',
    // EAS configuration
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'YOUR_EAS_PROJECT_ID'
    }
  },
  plugins: [
    'expo-font'
  ],
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: process.env.SENTRY_ORG || 'vibewell',
          project: process.env.SENTRY_PROJECT || 'vibewell-mobile',
          authToken: process.env.SENTRY_AUTH_TOKEN || '',
        }
      }
    ]
  }
}; 