import { useCallback, useEffect } from 'react';
import { analyticsService, AnalyticsEvents } from '../services/analytics';
import { monitoringService } from '../services/monitoring';

/**
 * Hook for using analytics and monitoring services in components
 */
export const useAnalytics = () => {
  // Initialize services on first mount
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

  // Track screen view
  const trackScreenView = useCallback((screenName: string, properties?: Record<string, any>) => {
    analyticsService.trackEvent(AnalyticsEvents.SCREEN_VIEW, {
      screen_name: screenName,
      ...properties
    });
  }, []);

  // Track event
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    analyticsService.trackEvent(eventName, properties);
  }, []);

  // Set user
  const identifyUser = useCallback((userId: string, userProperties?: Record<string, any>) => {
    analyticsService.identify(userId, userProperties);
    monitoringService.setUser({ id: userId, ...(userProperties as any) });
  }, []);

  // Reset user
  const resetUser = useCallback(() => {
    analyticsService.reset();
    monitoringService.setUser(null);
  }, []);

  // Report error
  const reportError = useCallback((error: Error, context?: Record<string, any>) => {
    monitoringService.captureException(error, context);
  }, []);

  // Log message
  const logMessage = useCallback((message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info', context?: Record<string, any>) => {
    monitoringService.captureMessage(message, level, context);
  }, []);

  return {
    trackScreenView,
    trackEvent,
    identifyUser,
    resetUser,
    reportError,
    logMessage,
    events: AnalyticsEvents
  };
};

export default useAnalytics; 