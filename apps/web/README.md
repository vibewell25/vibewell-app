# VibeWell Web Platform

The web application for the VibeWell platform, focused on provider management, administration, and marketing. Built with Next.js and Tailwind CSS.

## Role in the VibeWell Platform

The web platform serves two primary purposes in the VibeWell ecosystem:

1. **Provider Dashboard**: Comprehensive management tools for service providers to manage their business, bookings, clients, and analytics.
2. **Marketing Platform**: Public-facing content, provider registration, and company information.

While the [mobile app](../mobile/README.md) serves as the primary consumer interface, this web platform focuses on business management and marketing functions.

## Key Features

### Provider Dashboard
- Business profile management
- Service listings and pricing
- Calendar and availability management
- Booking and appointment tracking
- Client management
- Revenue analytics and reporting
- Marketing tools and insights
- Content management for courses/training

### Marketing Platform
- Company landing pages
- Provider registration and onboarding
- Blog and educational content
- About, Terms, Privacy pages
- Support and FAQ

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with ShadCN components
- **State Management**: React Context and Server Components
- **Backend**: Supabase (Auth, Database, Storage)
- **API**: Server Components and API Routes
- **Authentication**: Supabase Auth with JWT

## Getting Started

### Prerequisites

- Node.js (v18+)
- PNPM
- Supabase account

### Installation

1. Install dependencies:

```bash
cd apps/web
pnpm install
```

2. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

3. Update the `.env.local` file with your Supabase and other credentials.

### Development

Start the development server:

```bash
pnpm dev
```

This will start the Next.js development server at http://localhost:3000.

### Building for Production

```bash
pnpm build
```

## Project Structure

```
web/
├── app/                # Next.js App Router pages
│   ├── provider/       # Provider dashboard routes
│   ├── admin/          # Admin dashboard routes
│   ├── auth/           # Authentication routes
│   └── (marketing)/    # Marketing pages
├── components/         # Reusable React components
├── lib/                # Utility functions and shared logic
├── public/             # Static assets
└── styles/             # Global styles
```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin functions)
- `NEXT_PUBLIC_BASE_URL`: The base URL of your application

## Mobile App Integration

The web platform includes features to promote the mobile app for consumer-facing features:

- Mobile app download page
- Redirection of consumer-focused routes to the mobile app
- Mobile app promotion banners

Refer to the [Platform Strategy](../../docs/PLATFORM_STRATEGY.md) document for more information on how the web and mobile applications work together.

## Contributing

Please follow the project's coding standards and commit message conventions. 