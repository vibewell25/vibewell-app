import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import { analyticsService } from './src/services/analytics';
import { monitoringService } from './src/services/monitoring';

// Initialize error handling with Sentry
const sentryDsn = Constants.expoConfig?.extra?.sentryDsn;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    enableInExpoDevelopment: true,
    debug: __DEV__,
    tracesSampleRate: 1.0,
  });
}

export default function App() {
  // Initialize analytics and monitoring services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        await analyticsService.initialize();
        await monitoringService.initialize();
      } catch (error) {
        console.error('Failed to initialize analytics/monitoring:', error);
      }
    };

    initializeServices();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
