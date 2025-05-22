import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Bookings | VibeWell",
  description: "View and manage your service bookings",
};

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container max-w-7xl py-12">
      <div className="mb-6 flex items-center">
        <Link 
          href="/"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mr-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">My Bookings</h1>
      </div>
      
      {children}
    </div>
  );
} 