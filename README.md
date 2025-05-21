# VibeWell

A cutting-edge beauty and wellness platform combining service booking capabilities with social networking features. VibeWell empowers users to discover, book, and manage beauty and wellness services while connecting with providers and other users through a modern social media experience.

## Vision

VibeWell aims to revolutionize the beauty and wellness industry by creating a comprehensive ecosystem where:

- **Service Providers** can showcase their expertise, build a client base, sell products, and offer online training
- **Customers** can discover top-rated services, book appointments seamlessly, connect with like-minded individuals, and access personalized recommendations
- **Community** thrives through social interactions, reviews, and knowledge sharing

The platform is designed with a focus on user experience, performance, and scalability, adhering to modern development practices and architectural patterns.

## Development Principles

- **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Implement features only when explicitly required
- **DRY (Don't Repeat Yourself)**: Create reusable components and centralize business logic
- **SOLID Principles**: Maintain single responsibility, extensibility, and proper abstractions
- **Fail Fast**: Implement robust validation and meaningful error handling

## Project Structure

This is a monorepo managed with Turborepo and PNPM workspaces:

- `apps/web`: Next.js web application
- `packages/database`: Database setup and access layer with Prisma and Supabase
- `packages/ui`: Shared UI components
- `packages/config`: Shared configuration files
- `packages/utils`: Shared utility functions
- `packages/types`: Shared TypeScript types

## Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS with ShadCN components
- **State Management**: 
  - React Context for global state (auth, theme)
  - Server Components for data fetching
  - SWR/React Query for client-side data management

### Backend
- **Database**: PostgreSQL via Supabase with Row-Level Security
- **Authentication**: Supabase Auth with JWT
- **ORM**: Prisma for type-safe database access
- **Realtime**: Supabase Realtime for chat and notifications
- **Storage**: Supabase Storage for media files
- **Serverless**: Vercel Edge Functions for API endpoints

### Security Features
- **Authentication**: JWT-based auth with proper refresh mechanisms
- **Authorization**: Role-based access control
- **Data Protection**: Row-Level Security policies for all tables
- **API Security**: Rate limiting, CORS protection, input validation

## Design System

### Color System
- **Primary**: #4CAF50 (Green)
- **Secondary**: #F5F5DC (Beige)
- **Accent**: #FF5722 (Orange)
- **Neutral**: #F5F5F5 to #212121 (Gray scale)
- **Semantic**:
  - Success: #4CAF50
  - Warning: #FFC107
  - Error: #F44336
  - Info: #2196F3

### Typography
- **Headings**: Raleway (Bold)
  - H1: 32px/36px
  - H2: 24px/28px
  - H3: 20px/24px
- **Body**: Inter
  - Regular: 16px/24px
  - Small: 14px/20px

### Spacing
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## Key Features

### Phase 1-3 (Core Platform)
- User authentication and profile management
- Service provider onboarding and listing management
- Booking system with calendar integration
- Secure payment processing
- Review and rating system

### Phase 4-6 (Enhanced Capabilities)
- E-commerce storefront for physical products
- Online training modules and courses
- Social feed with posts, likes, and comments
- Messaging between users and providers
- Loyalty and rewards system
- Virtual try-on features

### Phase 7-8 (Optimization & Growth)
- Analytics and insights dashboard
- Multi-language support
- Advanced search and filtering
- Mobile-first optimizations
- Accessibility enhancements

## Getting Started

### Prerequisites

- Node.js >= 18
- PNPM 8.6.0 or higher
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vibewell.git
cd vibewell

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### Database Setup

```bash
# Generate Prisma client
pnpm --filter @vibewell/database generate

# Run migrations
pnpm --filter @vibewell/database migrate:dev
```

## Third-Party Integrations

- **Supabase**: Database, auth, storage, and realtime
- **Vercel**: Hosting and serverless functions
- **Stripe**: Payment processing
- **SendGrid/Resend**: Email delivery
- **Sentry**: Error tracking
- **Cloudinary**: Image processing
- **Twilio**: SMS notifications
- **Algolia**: Search functionality
- **OpenAI API**: AI recommendations

## Commands

- `pnpm dev` - Start the development server
- `pnpm build` - Build all packages and applications
- `pnpm lint` - Run linting for all packages
- `pnpm format` - Format all files with Prettier
- `pnpm test` - Run tests
- `pnpm clean` - Clean all build artifacts and node_modules

## Domain Information

- **Primary Domain**: getvibewell.com
- **Subdomains**:
  - app.getvibewell.com (main application)
  - api.getvibewell.com (API endpoints)
  - admin.getvibewell.com (admin portal)
  - docs.getvibewell.com (documentation)
  - blog.getvibewell.com (content marketing)

## Contributing

Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.