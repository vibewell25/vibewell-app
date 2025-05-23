# Certificate Feature Documentation

This document provides an overview of the certificate feature in VibeWell, which allows users to receive and verify certificates upon completion of courses.

## Overview

The certificate feature enables users to receive official certificates upon completing courses on the VibeWell platform. These certificates can be viewed, downloaded, printed, and verified by third parties through a unique verification URL.

## Database Schema

The certificate functionality relies on the following database tables:

### `certificates` Table

| Column            | Type      | Description                                      |
|-------------------|-----------|--------------------------------------------------|
| id                | UUID      | Primary key                                      |
| userId            | UUID      | Foreign key to profiles table                    |
| courseId          | UUID      | Foreign key to courses table                     |
| enrollmentId      | UUID      | Foreign key to enrollments table                 |
| certificateNumber | String    | Unique identifier for certificate verification   |
| certificateUrl    | String    | URL to the generated certificate PDF             |
| issuedAt          | Timestamp | When the certificate was issued                  |
| createdAt         | Timestamp | When the record was created                      |
| updatedAt         | Timestamp | When the record was last updated                 |

### `enrollments` Table (Updated)

The `enrollments` table has been updated with the following new columns:

| Column            | Type      | Description                                      |
|-------------------|-----------|--------------------------------------------------|
| certificateIssued | Boolean   | Whether a certificate has been issued            |
| certificateUrl    | String    | URL to the certificate (redundant for quick access) |

## Components

### Certificate Component

The `Certificate` component (`apps/web/components/certificate.tsx`) is a React component that renders a certificate with the following features:

- Displays the user's name
- Shows the course title
- Includes the certificate number
- Displays the issue date
- Includes a QR code for verification
- Has a printable version

### Verification Components

- `VerifiedBadge` (`apps/web/components/verify/verified-badge.tsx`): Displays a badge indicating the certificate is verified
- `VerificationDetails` (`apps/web/components/verify/verification-details.tsx`): Shows detailed information about the certificate

## Pages

### Certificate Verification Page

The verification page (`apps/web/app/verify/[certificateId]/page.tsx`) allows anyone to verify the authenticity of a certificate by:

1. Entering the certificate ID or scanning the QR code
2. Viewing the certificate details
3. Confirming the certificate is authentic
4. Optionally printing the certificate

### Course Completion Page

The course completion page (`apps/web/app/courses/[id]/completion/page.tsx`) is shown to users when they complete a course, allowing them to:

1. View their achievement
2. Download their certificate
3. Share their achievement on social media

## API Endpoints

### Certificate Generation

- `POST /api/certificates`: Creates a new certificate
  - Required fields: `userId`, `courseId`, `enrollmentId`
  - Returns: Certificate details including `certificateNumber` and `certificateUrl`

### Certificate Verification

- `GET /api/certificates/verify/[certificateId]`: Verifies a certificate
  - Returns: Certificate details with course and user information

## Security Considerations

- Certificates use a unique, randomly generated ID to prevent forgery
- Row-Level Security (RLS) policies ensure users can only access their own certificates
- Certificate verification is public but only reveals minimal necessary information

## Testing

Tests for the certificate functionality can be found in:

- `packages/database/test/certificate.test.js`: Database-level tests
- `apps/web/test/certificate.test.tsx`: Component tests

## Implementation Guide

### Generating a Certificate

To generate a certificate when a user completes a course:

```typescript
// 1. Check if the user has completed the course
const enrollment = await supabase
  .from('enrollments')
  .select('*')
  .eq('userId', userId)
  .eq('courseId', courseId)
  .single();

if (enrollment.progress < 100) {
  throw new Error('Course not completed');
}

// 2. Generate a unique certificate number
const certificateNumber = `CERT-${Date.now()}-${userId.substring(0, 8)}`;

// 3. Create the certificate record
const { data: certificate, error } = await supabase
  .from('certificates')
  .insert({
    userId,
    courseId,
    enrollmentId: enrollment.id,
    certificateNumber,
    certificateUrl: `/certificates/${certificateNumber}.pdf`,
    issuedAt: new Date().toISOString()
  })
  .select()
  .single();

// 4. Update the enrollment record
await supabase
  .from('enrollments')
  .update({
    certificateIssued: true,
    certificateUrl: certificate.certificateUrl
  })
  .eq('id', enrollment.id);
```

### Verifying a Certificate

To verify a certificate:

```typescript
const { certificateId } = params;

// Fetch certificate data
const { data: certificate, error } = await supabase
  .from('certificates')
  .select(`
    *,
    courses:courseId (
      title,
      description
    ),
    users:userId (
      firstName,
      lastName
    )
  `)
  .eq('certificateNumber', certificateId)
  .single();

if (error || !certificate) {
  // Certificate not found or invalid
  return notFound();
}

// Certificate is valid
return certificate;
```

## Future Enhancements

Planned enhancements for the certificate feature include:

1. PDF generation with server-side rendering
2. Blockchain verification for added security
3. Integration with LinkedIn and other professional networks
4. Custom certificate templates for different course types
5. Expiration and renewal functionality for certifications that require periodic renewal 