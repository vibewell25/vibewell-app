import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Amplitude, Identify } from '@amplitude/analytics-react-native';

// Analytics service interface
export interface AnalyticsService {
  initialize(): Promise<void>;
  identify(userId: string, userProperties?: Record<string, any>): Promise<void>;
  trackEvent(eventName: string, eventProperties?: Record<string, any>): Promise<void>;
  setUserProperties(properties: Record<string, any>): Promise<void>;
  reset(): Promise<void>;
}

// Mock implementation for development/testing
class MockAnalyticsService implements AnalyticsService {
  async initialize(): Promise<void> {
    console.log('[MockAnalytics] Initialized');
  }

  async identify(userId: string, userProperties?: Record<string, any>): Promise<void> {
    console.log(`[MockAnalytics] Identified user: ${userId}`, userProperties);
  }

  async trackEvent(eventName: string, eventProperties?: Record<string, any>): Promise<void> {
    console.log(`[MockAnalytics] Event tracked: ${eventName}`, eventProperties);
  }

  async setUserProperties(properties: Record<string, any>): Promise<void> {
    console.log('[MockAnalytics] Set user properties:', properties);
  }

  async reset(): Promise<void> {
    console.log('[MockAnalytics] Reset user');
  }
}

// Amplitude implementation using the actual SDK
class AmplitudeAnalyticsService implements AnalyticsService {
  private isInitialized = false;
  private readonly apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Initialize Amplitude with API key
      await Amplitude.init(this.apiKey);
      
      // Set app info
      Amplitude.setUserProperties({
        platform: Platform.OS,
        appVersion: Constants.expoConfig?.version || 'unknown',
        appName: Constants.expoConfig?.name || 'VibeWell',
        deviceId: Constants.deviceId || 'unknown',
      });
      
      // Record app open event
      this.trackEvent('App Opened', {
        platform: Platform.OS,
        version: Constants.expoConfig?.version || 'unknown',
      });
      
      this.isInitialized = true;
      console.log('[Amplitude] Successfully initialized');
    } catch (error) {
      console.error('[Amplitude] Initialization failed:', error);
    }
  }

  async identify(userId: string, userProperties?: Record<string, any>): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      // Set user ID
      Amplitude.setUserId(userId);
      
      // Set user properties if provided
      if (userProperties && Object.keys(userProperties).length > 0) {
        const identify = new Identify();
        
        Object.entries(userProperties).forEach(([key, value]) => {
          identify.set(key, value);
        });
        
        Amplitude.identify(identify);
      }
      
      console.log(`[Amplitude] Identified user: ${userId}`);
    } catch (error) {
      console.error('[Amplitude] Identify failed:', error);
    }
  }

  async trackEvent(eventName: string, eventProperties?: Record<string, any>): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      // Track event with Amplitude
      Amplitude.track(eventName, eventProperties);
      console.log(`[Amplitude] Event tracked: ${eventName}`);
    } catch (error) {
      console.error(`[Amplitude] Failed to track event ${eventName}:`, error);
    }
  }

  async setUserProperties(properties: Record<string, any>): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      // Set user properties
      Amplitude.setUserProperties(properties);
      console.log('[Amplitude] User properties set');
    } catch (error) {
      console.error('[Amplitude] Set user properties failed:', error);
    }
  }

  async reset(): Promise<void> {
    if (!this.isInitialized) return;
    
    try {
      // Reset user
      Amplitude.reset();
      console.log('[Amplitude] User reset');
    } catch (error) {
      console.error('[Amplitude] Reset failed:', error);
    }
  }
}

// Create and export the analytics service
// We'll use the mock implementation for development or when no API key is provided
const amplitudeApiKey = Constants.expoConfig?.extra?.amplitudeApiKey || '';
const isDevelopment = process.env.NODE_ENV === 'development';

export const analyticsService: AnalyticsService = isDevelopment || !amplitudeApiKey
  ? new MockAnalyticsService()
  : new AmplitudeAnalyticsService(amplitudeApiKey);

// Pre-defined events for consistent tracking
export const AnalyticsEvents = {
  // Authentication events
  USER_SIGNED_UP: 'User Signed Up',
  USER_LOGGED_IN: 'User Logged In',
  USER_LOGGED_OUT: 'User Logged Out',
  PASSWORD_RESET_REQUESTED: 'Password Reset Requested',
  
  // Navigation events
  SCREEN_VIEW: 'Screen Viewed',
  
  // Provider events
  PROVIDER_VIEWED: 'Provider Viewed',
  PROVIDER_CONTACTED: 'Provider Contacted',
  
  // Booking events
  BOOKING_STARTED: 'Booking Started',
  BOOKING_COMPLETED: 'Booking Completed',
  BOOKING_CANCELLED: 'Booking Cancelled',
  
  // Payment events
  PAYMENT_INITIATED: 'Payment Initiated',
  PAYMENT_COMPLETED: 'Payment Completed',
  PAYMENT_FAILED: 'Payment Failed',
  
  // Chat events
  CHAT_STARTED: 'Chat Started',
  MESSAGE_SENT: 'Message Sent',
  
  // AI events
  AI_ASSISTANCE_REQUESTED: 'AI Assistance Requested',
  AI_RECOMMENDATION_VIEWED: 'AI Recommendation Viewed',
}; 