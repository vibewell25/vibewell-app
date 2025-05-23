/**
 * Analytics service for tracking user events and interactions
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Analytics service interface
export interface AnalyticsService {
  initialize(): Promise<void>;
  trackEvent(eventName: string, properties?: Record<string, any>): void;
  setUserProperties(properties: Record<string, any>): void;
  identifyUser(userId: string, traits?: Record<string, any>): void;
  reset(): void;
}

// Mock implementation for development/testing
class MockAnalyticsService implements AnalyticsService {
  async initialize(): Promise<void> {
    console.log('[MockAnalytics] Initialized');
  }

  trackEvent(eventName: string, properties?: Record<string, any>): void {
    console.log(`[MockAnalytics] Event tracked: ${eventName}`, properties);
  }

  setUserProperties(properties: Record<string, any>): void {
    console.log('[MockAnalytics] User properties set:', properties);
  }

  identifyUser(userId: string, traits?: Record<string, any>): void {
    console.log(`[MockAnalytics] User identified: ${userId}`, traits);
  }

  reset(): void {
    console.log('[MockAnalytics] Analytics reset');
  }
}

// Create and export the analytics service
export const analyticsService: AnalyticsService = new MockAnalyticsService();

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