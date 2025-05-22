# VibeWell Mobile App

The primary consumer-facing application for the VibeWell platform, built with React Native and Expo. This mobile app provides the complete end-user experience for discovering, booking, and enjoying beauty and wellness services.

## VibeWell Platform Vision

VibeWell is transforming the beauty and wellness landscape by offering a full-featured ecosystem where:

* **Service Providers** (Businesses & Freelancers) can showcase services, sell products, host training, and manage their brand
* **Customers** can discover tailored beauty and wellness services, book with ease, shop curated products, and access exclusive content
* **Community** grows through personalised feeds, feedback, AI recommendations, and engaging social features

The platform prioritises simplicity, performance, and scalability using modern development principles and a robust modular architecture.

## Role in the VibeWell Platform

The mobile app serves as the **primary interface for consumers** in the VibeWell ecosystem, with all key customer-facing features optimized for mobile usage. While the web platform focuses on provider management and marketing, this app delivers the core experience for end users.

## Key Features

- User authentication with Supabase
- Service provider discovery and booking
- Secure payments with Stripe and Coinbase Commerce
- Personalized recommendations with AI
- Social networking and messaging
- Training programs and subscription content
- E-commerce storefront and product browsing
- Loyalty and rewards program
- Reviews and ratings
- Analytics and error tracking

## Tech Stack

- **Framework**: React Native with Expo
- **UI Library**: Custom component system with Tailwind-style utility classes
- **Navigation**: React Navigation
- **State Management**: Zustand
- **API Client**: Axios
- **Form Handling**: React Hook Form + Yup/Zod validation
- **Backend**: Supabase (Auth, Database, Storage)
- **Analytics**: Amplitude/Mixpanel
- **Error Tracking**: Sentry
- **Notifications**: Firebase Cloud Messaging
- **Messaging**: Stream or Sendbird
- **Video**: Vimeo/Mux SDKs
- **AI**: OpenAI/Anthropic for recommendations and personalization

## Getting Started

### Prerequisites

- Node.js (v18+)
- PNPM (v8.6+)
- Expo CLI
- iOS Simulator or Android Emulator (optional for local testing)

### Installation

1. Install dependencies from the monorepo root:

```bash
pnpm install
```

2. Or install just the mobile dependencies:

```bash
cd apps/mobile
pnpm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase and other credentials.

### Development

Start the development server:

```bash
pnpm start
```

This will open Expo DevTools in your browser. You can run the app on:

- iOS Simulator (macOS only): Press `i`
- Android Emulator: Press `a`
- Web browser: Press `w`
- Physical device: Scan the QR code with the Expo Go app

### Building for Production

#### Android

```bash
pnpm build:android
```

#### iOS

```bash
pnpm build:ios
```

## Project Structure

```
mobile/
├── assets/             # Images, fonts, and other static assets
├── docs/               # Documentation files
├── src/
│   ├── components/     # Reusable UI components
│   │   └── ui/         # Basic UI elements (buttons, inputs, etc.)
│   ├── constants/      # App constants and theme configuration
│   ├── contexts/       # React contexts (auth, theme, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # Screen components
│   │   ├── auth/       # Authentication screens
│   │   ├── home/       # Home and discovery screens
│   │   ├── bookings/   # Booking-related screens
│   │   ├── ecommerce/  # Shopping and product screens
│   │   ├── training/   # Course and training screens
│   │   └── profile/    # User profile screens
│   ├── services/       # API services and data fetching
│   └── utils/          # Utility functions
├── app.config.js       # Expo configuration
├── App.tsx             # Root component
└── index.ts            # Entry point
```

## App Layouts

### Onboarding
- Splash screen
- Intro carousel
- Login/Signup/MFA
- Email verification/Forgot password
- Preferences: Skin, goals, style

### Core Navigation
- Home with recommended services
- Quick book/Browse
- Inbox/Messaging

### Booking
- Search/Filter services
- Service provider profiles
- Packages/Pricing
- Book & pay (Stripe/Crypto)
- Confirmation + follow-up

### E-Commerce
- Browse products
- Product detail
- Cart
- Checkout
- Track orders

### Profiles
- My profile/Edit
- My bookings/Orders/Subscriptions
- Settings/Support/Referrals

### Training
- Library
- Course detail
- Enroll + video player

## Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `COINBASE_COMMERCE_KEY`: Your Coinbase Commerce API key
- `EAS_PROJECT_ID`: Your Expo Application Services project ID
- `AMPLITUDE_API_KEY`: Your Amplitude API key for analytics
- `MIXPANEL_TOKEN`: Your Mixpanel token (if using)
- `SENTRY_DSN`: Your Sentry DSN for error tracking
- `SENTRY_ORG`: Your Sentry organization name
- `SENTRY_PROJECT`: Your Sentry project name
- `SENTRY_AUTH_TOKEN`: Your Sentry authentication token
- `OPENAI_API_KEY`: Your OpenAI API key for AI features
- `STREAM_API_KEY`: Your Stream API key for messaging
- `FCM_SENDER_ID`: Your Firebase Cloud Messaging sender ID

## Documentation

- [Analytics & Monitoring](./docs/ANALYTICS_MONITORING.md): How to use analytics and error tracking
- [Main Project README](../../README.md): Overview of the complete VibeWell platform

## Development Principles

- **KISS**: Keep the experience simple and intuitive
- **YAGNI**: Build what's needed, avoid premature features
- **DRY**: Centralized, reusable code and logic
- **SOLID**: Scalable and maintainable system architecture
- **Fail Fast**: Surface and handle errors early and clearly

## Contributing

Please follow the project's coding standards and commit message conventions as outlined in the [Contributing Guide](../../CONTRIBUTING.md). 