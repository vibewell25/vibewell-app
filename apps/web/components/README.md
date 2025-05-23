# VibeWell Components

This directory contains reusable React components for the VibeWell web application.

## Component Structure

Components are organized by feature and functionality:

- `ui/`: Foundational UI components (buttons, inputs, etc.)
- `dashboard/`: Components for the user dashboard
- `booking/`: Components for the booking system
- `learning/`: Components for the learning platform
- `verify/`: Components for certificate verification
- `profile/`: User profile components
- `layout/`: Layout components (headers, footers, etc.)

## Key Components

### Certificate Components

- `certificate.tsx`: Renders a course completion certificate
  - Props:
    - `certificate`: Certificate data object
    - `className`: Optional CSS class name
    - `printable`: Boolean to enable print-optimized styling

- `verify/verified-badge.tsx`: Animated badge showing certificate verification status

- `verify/verification-details.tsx`: Displays detailed certificate information
  - Props:
    - `certificate`: Certificate data with course and user info
    - `enrollment`: Associated enrollment data

### Dashboard Components

- `dashboard/certificates-section.tsx`: Displays a user's earned certificates
  - Props:
    - `userId`: The user's ID
    - `limit`: Optional limit on number of certificates to display

## Usage Examples

### Certificate Component

```tsx
import { Certificate } from '@/components/certificate';

// In your component:
return (
  <Certificate 
    certificate={{
      id: 'cert-123',
      certificateNumber: 'CERT-123456',
      issuedAt: '2023-05-15T10:30:00Z',
      course: {
        title: 'Advanced Skincare Techniques',
        description: 'Learn advanced skincare techniques and treatments'
      },
      user: {
        firstName: 'Jane',
        lastName: 'Doe'
      }
    }}
    printable={true}
  />
);
```

### Certificate Verification Components

```tsx
import { VerifiedBadge } from '@/components/verify/verified-badge';
import { VerificationDetails } from '@/components/verify/verification-details';

// In your component:
return (
  <div>
    <VerifiedBadge />
    <VerificationDetails 
      certificate={certificateData}
      enrollment={enrollmentData}
    />
  </div>
);
```

## Component Guidelines

When creating or modifying components:

1. Use TypeScript for type safety
2. Implement responsive design using Tailwind CSS
3. Follow the component naming convention: `feature-name.tsx`
4. Create test files alongside components: `component-name.test.tsx`
5. Use the `'use client'` directive only when necessary
6. Prefer composition over inheritance
7. Keep components focused on a single responsibility 