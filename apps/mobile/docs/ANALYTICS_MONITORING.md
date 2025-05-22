# Analytics and Monitoring Documentation

This document provides information on how to use the analytics and monitoring services implemented in the VibeWell mobile app.

## Setup

The app uses the following services:
- **Amplitude** for user analytics tracking
- **Sentry** for error monitoring and crash reporting

## Environment Variables

To configure these services, you need to set the following environment variables:

```bash
# Analytics
AMPLITUDE_API_KEY=your_amplitude_api_key

# Error monitoring
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_organization
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

You can set these variables in your `.env` file for local development or in your CI/CD pipeline for production builds.

## Usage

### Using the Analytics Hook

The easiest way to track events and report errors is to use the `useAnalytics` hook:

```tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import useAnalytics from '../hooks/useAnalytics';

export const ProfileScreen = () => {
  const { trackScreenView, trackEvent, events } = useAnalytics();
  
  // Track screen view when component mounts
  useEffect(() => {
    trackScreenView('Profile');
  }, [trackScreenView]);
  
  const handleButtonPress = () => {
    // Track custom event
    trackEvent(events.USER_LOGGED_OUT);
    // ... handle logout
  };
  
  return (
    <View>
      <Text>Profile Screen</Text>
      {/* ... other components */}
    </View>
  );
};
```

### Available Hook Methods

The `useAnalytics` hook provides the following methods:

```tsx
const {
  trackScreenView,    // Track when a screen is viewed
  trackEvent,         // Track a custom event
  identifyUser,       // Identify a user with their ID and properties
  resetUser,          // Reset the current user (on logout)
  reportError,        // Report an error to Sentry
  logMessage,         // Log a message to Sentry
  events              // Pre-defined event names
} = useAnalytics();
```

### Using Analytics Directly

You can also use the analytics service directly:

```tsx
import { analyticsService, AnalyticsEvents } from '../services/analytics';

// Initialize the service
await analyticsService.initialize();

// Identify a user
analyticsService.identify('user-123', {
  email: 'user@example.com',
  plan: 'premium'
});

// Track an event
analyticsService.trackEvent(AnalyticsEvents.BOOKING_COMPLETED, {
  provider_id: 'provider-456',
  service_id: 'service-789',
  amount: 99.99
});
```

### Using Monitoring Directly

For error monitoring, you can use the monitoring service directly:

```tsx
import { monitoringService } from '../services/monitoring';

// Initialize the service
await monitoringService.initialize();

// Capture an exception
try {
  // ... code that might throw an error
} catch (error) {
  monitoringService.captureException(error, {
    userId: 'user-123',
    context: 'booking-flow'
  });
}

// Log a message
monitoringService.captureMessage('Payment processing started', 'info', {
  paymentId: 'payment-123',
  amount: 99.99
});

// Add a breadcrumb (for tracing user actions)
monitoringService.addBreadcrumb('User clicked Book Now button', 'user-action', {
  providerId: 'provider-123',
  serviceId: 'service-456'
});
```

## Pre-defined Event Names

To ensure consistent event tracking, use the pre-defined event names from `AnalyticsEvents`:

```tsx
import { AnalyticsEvents } from '../services/analytics';

// Authentication events
AnalyticsEvents.USER_SIGNED_UP
AnalyticsEvents.USER_LOGGED_IN
AnalyticsEvents.USER_LOGGED_OUT
AnalyticsEvents.PASSWORD_RESET_REQUESTED

// Navigation events
AnalyticsEvents.SCREEN_VIEW

// Provider events
AnalyticsEvents.PROVIDER_VIEWED
AnalyticsEvents.PROVIDER_CONTACTED

// Booking events
AnalyticsEvents.BOOKING_STARTED
AnalyticsEvents.BOOKING_COMPLETED
AnalyticsEvents.BOOKING_CANCELLED

// Payment events
AnalyticsEvents.PAYMENT_INITIATED
AnalyticsEvents.PAYMENT_COMPLETED
AnalyticsEvents.PAYMENT_FAILED

// Chat events
AnalyticsEvents.CHAT_STARTED
AnalyticsEvents.MESSAGE_SENT

// AI events
AnalyticsEvents.AI_ASSISTANCE_REQUESTED
AnalyticsEvents.AI_RECOMMENDATION_VIEWED
```

## Best Practices

1. **Track meaningful events**: Focus on tracking events that provide business value and insights into user behavior.
2. **Be consistent with event naming**: Use the pre-defined event names whenever possible.
3. **Include relevant properties**: Add context to events with properties that help understand the event better.
4. **Respect user privacy**: Don't track personally identifiable information (PII) unless necessary and permitted.
5. **Track screen views**: Always track when a user views a screen to understand navigation patterns.
6. **Report errors with context**: When reporting errors, include relevant context to help with debugging.
7. **Don't over-track**: Too many events can be as unhelpful as too few. Focus on quality over quantity.

## Development vs. Production

During development, mock implementations are used to avoid sending data to the actual services:

- In development or when API keys are not provided, events are logged to the console instead of being sent to Amplitude.
- Similarly, errors are logged to the console instead of being sent to Sentry.

This behavior is controlled by the `isDevelopment` flag and the presence of API keys in the environment variables. 