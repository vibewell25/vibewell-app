import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';

// Monitoring service interface
export interface MonitoringService {
  initialize(): Promise<void>;
  captureException(error: Error, context?: Record<string, any>): void;
  captureMessage(message: string, level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug', context?: Record<string, any>): void;
  addBreadcrumb(message: string, category?: string, data?: Record<string, any>): void;
  setUser(user: { id: string; email?: string; username?: string } | null): void;
  setTag(key: string, value: string): void;
  setTags(tags: Record<string, string>): void;
}

// Mock implementation for development/testing
class MockMonitoringService implements MonitoringService {
  async initialize(): Promise<void> {
    console.log('[MockMonitoring] Initialized');
  }

  captureException(error: Error, context?: Record<string, any>): void {
    console.error('[MockMonitoring] Exception captured:', error, context);
  }

  captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info', context?: Record<string, any>): void {
    console.log(`[MockMonitoring] Message captured (${level}):`, message, context);
  }

  addBreadcrumb(message: string, category: string = 'default', data?: Record<string, any>): void {
    console.log(`[MockMonitoring] Breadcrumb added (${category}):`, message, data);
  }

  setUser(user: { id: string; email?: string; username?: string } | null): void {
    if (user) {
      console.log('[MockMonitoring] User set:', user);
    } else {
      console.log('[MockMonitoring] User cleared');
    }
  }

  setTag(key: string, value: string): void {
    console.log(`[MockMonitoring] Tag set: ${key}=${value}`);
  }

  setTags(tags: Record<string, string>): void {
    console.log('[MockMonitoring] Tags set:', tags);
  }
}

// Sentry implementation using the actual SDK
class SentryMonitoringService implements MonitoringService {
  private isInitialized = false;
  private readonly dsn: string;
  
  constructor(dsn: string) {
    this.dsn = dsn;
  }
  
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Initialize Sentry
      Sentry.init({
        dsn: this.dsn,
        enableInExpoDevelopment: true,
        debug: process.env.NODE_ENV === 'development',
        // Performance monitoring
        tracesSampleRate: 1.0,
        // Session tracking
        enableAutoSessionTracking: true,
        // Set default tags
        defaultIntegrations: true,
      });

      // Set default tags
      this.setTags({
        platform: Platform.OS,
        version: Constants.expoConfig?.version || 'unknown',
        appName: Constants.expoConfig?.name || 'VibeWell',
      });
      
      this.isInitialized = true;
      console.log('[Sentry] Successfully initialized');
    } catch (error) {
      console.error('[Sentry] Initialization failed:', error);
    }
  }

  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.warn('[Sentry] Not initialized. Exception not captured.');
      return;
    }
    
    try {
      if (context) {
        Sentry.Native.withScope(scope => {
          Object.entries(context).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });
          Sentry.Native.captureException(error);
        });
      } else {
        Sentry.Native.captureException(error);
      }
    } catch (err) {
      console.error('[Sentry] Failed to capture exception:', err);
    }
  }

  captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info', context?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.warn('[Sentry] Not initialized. Message not captured.');
      return;
    }
    
    try {
      if (context) {
        Sentry.Native.withScope(scope => {
          Object.entries(context).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });
          Sentry.Native.captureMessage(message, level);
        });
      } else {
        Sentry.Native.captureMessage(message, level);
      }
    } catch (error) {
      console.error('[Sentry] Failed to capture message:', error);
    }
  }

  addBreadcrumb(message: string, category: string = 'default', data?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.warn('[Sentry] Not initialized. Breadcrumb not added.');
      return;
    }
    
    try {
      Sentry.Native.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
      });
    } catch (error) {
      console.error('[Sentry] Failed to add breadcrumb:', error);
    }
  }

  setUser(user: { id: string; email?: string; username?: string } | null): void {
    if (!this.isInitialized) {
      console.warn('[Sentry] Not initialized. User not set.');
      return;
    }
    
    try {
      Sentry.Native.setUser(user);
    } catch (error) {
      console.error('[Sentry] Failed to set user:', error);
    }
  }

  setTag(key: string, value: string): void {
    if (!this.isInitialized) {
      console.warn('[Sentry] Not initialized. Tag not set.');
      return;
    }
    
    try {
      Sentry.Native.setTag(key, value);
    } catch (error) {
      console.error('[Sentry] Failed to set tag:', error);
    }
  }

  setTags(tags: Record<string, string>): void {
    if (!this.isInitialized) {
      console.warn('[Sentry] Not initialized. Tags not set.');
      return;
    }
    
    try {
      Object.entries(tags).forEach(([key, value]) => {
        Sentry.Native.setTag(key, value);
      });
    } catch (error) {
      console.error('[Sentry] Failed to set tags:', error);
    }
  }
}

// Create and export the monitoring service
// We'll use the mock implementation for development or when no DSN is provided
const sentryDsn = Constants.expoConfig?.extra?.sentryDsn || '';
const isDevelopment = process.env.NODE_ENV === 'development';

export const monitoringService: MonitoringService = isDevelopment || !sentryDsn
  ? new MockMonitoringService()
  : new SentryMonitoringService(sentryDsn); 