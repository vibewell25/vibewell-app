# VibeWell

A comprehensive beauty and wellness platform integrating service booking, e-commerce, social networking, training, and AI-powered personalization. VibeWell empowers consumers and professionals to connect, transact, and grow within a single unified experience.

## Vision

VibeWell is transforming the beauty and wellness landscape by offering a full-featured ecosystem where:

* **Service Providers** (Businesses & Freelancers) can showcase services, sell products, host training, and manage their brand.
* **Customers** can discover tailored beauty and wellness services, book with ease, shop curated products, and access exclusive content.
* **Community** grows through personalised feeds, feedback, AI recommendations, and engaging social features.

The platform prioritises simplicity, performance, and scalability using modern development principles and a robust modular architecture.

## Platform Strategy

VibeWell operates with a **mobile-first approach** through a dual-platform strategy:

- **Mobile App**: Primary interface for end-users/consumers to discover, book, and interact with service providers. All consumer-facing features are optimized for the mobile experience.
- **Web App**: Focused on provider management features, administrative functions, and marketing content. The web version offers comprehensive business tools for service providers rather than duplicating the consumer experience.

This approach ensures the best user experience for each audience while maintaining development efficiency.

## Development Principles

* **KISS**: Keep the experience simple and intuitive
* **YAGNI**: Build what's needed, avoid premature features
* **DRY**: Centralised, reusable code and logic
* **SOLID**: Scalable and maintainable system architecture
* **Fail Fast**: Surface and handle errors early and clearly

## Project Structure

Monorepo managed with Turborepo + PNPM Workspaces:

* `apps/web`: Admin dashboard and desktop-only interface (Next.js)
* `apps/mobile`: Cross-platform mobile app (React Native)
* `packages/database`: Supabase schema, Prisma ORM
* `packages/ui`: Reusable design system and component library
* `packages/config`: Shared linting, tsconfig, and environment settings
* `packages/utils`: Utility functions
* `packages/types`: Global TypeScript type definitions

## Platform Interfaces

### Mobile App (`/apps/mobile/`)

Primary user interface for customers/clients. Includes all consumer-facing features:

* User authentication
* Service provider discovery
* Booking appointments
* Payments
* Messaging with providers
* Profile management
* Reviews and ratings
* AI recommendations
* Social features

### Web App (`/apps/web/`)

Provider and admin interface:

* Business dashboard for service providers
* Appointment management
* Revenue tracking
* Service listing management
* Customer management
* Analytics and reporting

Marketing and acquisition:

* Landing pages
* Marketing content
* Provider sign-up
* Blog/content

Limited consumer features:

* Basic account management
* Viewing booking history
* Not a full-featured client experience

## Technical Architecture

### Web (Admin Panel)

* **Framework**: Next.js 15 with App Router and Server Components
* **UI**: Tailwind CSS + ShadCN
* **State**: React Context + SWR
* **Auth**: Supabase Auth
* **Hosting**: Vercel (SSR + API routes)

### Mobile App

* **Framework**: Expo + React Native
* **UI/UX**: Custom component library with Tailwind-style utility classes
* **Navigation**: React Navigation
* **State**: Zustand for lightweight store
* **Forms**: React Hook Form + Zod/Yup
* **API**: Supabase client + Axios

### Backend (Supabase)

* **Auth**: Supabase email, social, and optional Web3
* **DB**: PostgreSQL with RLS (via Supabase)
* **ORM**: Prisma
* **Realtime**: Supabase Realtime
* **Storage**: Supabase Storage
* **Functions**: Supabase Edge Functions

### APIs & Services

* **Payments**: Stripe + Coinbase Commerce
* **AI**: GPT-4 (OpenAI) or Claude (Anthropic) for suggestions, personalization, and chat
* **Chat/Messaging**: Stream or Sendbird
* **Video**: Vimeo/Mux SDKs
* **Notifications**: Firebase Cloud Messaging
* **Search**: Algolia
* **Email**: Resend
* **SMS**: Twilio
* **Analytics**: Mixpanel
* **Referrals**: FirstPromoter

### DevOps

* **CI/CD**: GitHub Actions + Expo EAS + Vercel
* **Monitoring**: Sentry + LogRocket
* **Testing**: Jest, React Native Testing Library, and Cypress (for web)

### Security

* JWT auth with refresh tokens
* Role-based access (RLS policies)
* CORS, rate-limiting, input validation
* Secure environment segregation

## Mobile App Layouts

### Onboarding

* Splash
* Intro Carousel
* Login / Signup / MFA
* Email Verification / Forgot Password
* Role Select: Consumer / Provider
* Preferences: Skin, Goals, Style

### Core Navigation

* Home (Consumer)
  * Recommended Services
  * Quick Book / Browse
* Home (Pro)
  * Dashboard, Calendar, Earnings, Inbox

### Booking

* Search / Filter
* Service Provider Profile
* Packages / Pricing
* Book & Pay (Stripe/Crypto)
* Confirmation + Follow-up

### E-Commerce

* Browse Products
* Product Detail
* Cart
* Checkout
* Track Orders

### Profiles

* My Profile / Edit
* My Bookings / Orders / Subscriptions
* Settings / Support / Referrals

### Training

* Library
* Course Detail
* Enroll + Video Player
* Upload (Pro only)

### Subscriptions

* Premium Content Feed
* Article / Video View
* Subscribe / Unlock

### Pro Tools

* Dashboard + Calendar
* Manage Bookings, Products, Services
* Withdraw Earnings
* Client Messaging
* Upload Courses / Content
* Feedback & Reviews

### Admin

* Admin Portal
* User/Provider Management
* Reports / Commissions
* Content Moderation
* Feature Flags

## Design System

### Colors

* Primary: #4CAF50 (Green)
* Secondary: #F5F5DC (Beige)
* Accent: #FF5722 (Orange)
* Neutral: #F5F5F5 to #212121 (Gray scale)
* Semantic:
  * Success: #4CAF50
  * Warning: #FFC107
  * Error: #F44336
  * Info: #2196F3

### Typography

* Headings: Raleway
  * H1: 32px/36px
  * H2: 24px/28px
  * H3: 20px/24px
* Body: Inter
  * Regular: 16px/24px
  * Small: 14px/20px

### Spacing

* Base unit: 4px
* Scale: 4px to 64px in standard increments

## Feature Roadmap

### Phase 1–3: Core

* Signup/Login/Auth
* Provider Onboarding
* Booking & Scheduling
* Payments (Stripe + Crypto)
* Ratings & Reviews

### Phase 4–6: Expansion

* E-Commerce Storefront
* Online Training
* Messaging
* Loyalty & Rewards
* Social Feed
* Virtual Try-On (Planned)

### Phase 7–8: Optimization

* Admin Dashboard
* Analytics + Reports
* Accessibility + i18n
* Performance Optimization

## Getting Started

### Prerequisites

* Node.js >= 18
* PNPM >= 8.6
* Supabase Project

### Installation

```bash
git clone https://github.com/yourusername/vibewell.git
cd vibewell
pnpm install
cp .env.example .env.local
pnpm dev
```

### Database Setup

```bash
pnpm --filter @vibewell/database generate
pnpm --filter @vibewell/database migrate:dev
```

## Integrations

* Supabase
* Vercel
* Stripe + Coinbase Commerce
* OpenAI / Anthropic
* Sendbird / Stream
* Cloudinary
* Twilio
* Resend
* Algolia
* Sentry / LogRocket
* Mixpanel
* FirstPromoter

## Common Commands

```bash
pnpm dev       # Start dev mode
pnpm build     # Full build
pnpm lint      # Run linter
pnpm format    # Prettier format
pnpm test      # Unit tests
pnpm clean     # Cleanup node_modules/builds
```

## Domain Setup

* Primary: getvibewell.com
* Subdomains:
  * app.getvibewell.com (PWA / Mobile App)
  * admin.getvibewell.com (Admin Dashboard)
  * api.getvibewell.com (APIs)
  * docs.getvibewell.com (Documentation)
  * blog.getvibewell.com (Blog/SEO)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for collaboration guidelines.