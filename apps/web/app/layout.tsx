import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/navigation';
import { Providers } from '@/components/providers';
import { SupabaseListener } from '@/components/supabase-listener';
import { Suspense } from 'react';
import { MobileAppRedirectWrapper } from '@/components/mobile-app-redirect-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'VibeWell - Beauty & Wellness Services',
    template: '%s | VibeWell',
  },
  description: 'Find, book, and enjoy the best beauty and wellness services in your area with VibeWell.',
  keywords: [
    'beauty',
    'wellness',
    'spa',
    'salon',
    'booking',
    'services',
    'wellbeing',
    'self-care',
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Providers>
          <SupabaseListener />
          <Navigation />
          <main className="flex-grow pt-2">
            <Suspense fallback={<div className="container py-10">Loading...</div>}>
              <MobileAppRedirectWrapper>
                {children}
              </MobileAppRedirectWrapper>
            </Suspense>
          </main>
        </Providers>
      </body>
    </html>
  );
} 