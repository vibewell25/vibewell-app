import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { SupabaseListener } from '@/components/supabase-listener';
import { Suspense } from 'react';
import { MobileAppRedirectWrapper } from '@/components/mobile-app-redirect-wrapper';
import Link from 'next/link';
import { Header } from '@/components/layout/header';

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
    icon: '/favicon.svg',
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
          <Header />
          <main className="flex-grow pt-20 pb-10">
            <Suspense fallback={<div className="container py-10">Loading...</div>}>
              <MobileAppRedirectWrapper>
                {children}
              </MobileAppRedirectWrapper>
            </Suspense>
          </main>
          <footer className="w-full border-t bg-background py-6">
            <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} VibeWell. All rights reserved.
              </p>
              <nav className="flex gap-4 sm:gap-6">
                <Link href="/terms" className="text-sm font-medium hover:underline">
                  Terms
                </Link>
                <Link href="/privacy" className="text-sm font-medium hover:underline">
                  Privacy
                </Link>
                <Link href="/about" className="text-sm font-medium hover:underline">
                  About
                </Link>
              </nav>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
} 