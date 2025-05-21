import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/navigation';
import { Providers } from '@/components/providers';
import { SupabaseListener } from '@/components/supabase-listener';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <SupabaseListener />
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 