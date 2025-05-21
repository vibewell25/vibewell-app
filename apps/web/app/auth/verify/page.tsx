import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify Email | VibeWell",
  description: "Verify your email address to complete registration",
};

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 px-4 py-12 text-center">
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Check Your Email</h1>
          <p className="text-gray-500 dark:text-gray-400">
            We've sent a verification link to your email address. Please check your
            inbox and click the link to verify your account.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you don't see the email, check your spam folder or{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              try signing up again
            </Link>
            .
          </p>
          <div className="pt-4">
            <Link
              href="/auth/login"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 