import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { customers } from "@/lib/mock-data";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";

export const metadata: Metadata = {
  title: "Your Profile | VibeWell",
  description: "View and edit your VibeWell profile",
};

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  // Try to get real profile data first
  const profileData = await getCurrentProfile();
  
  // If no real profile (e.g., in development), use mock data
  let profile: any = profileData;
  if (!profile) {
    // For mock purposes, just use the first customer
    profile = customers[0];
  }
  
  if (!profile) {
    notFound();
  }

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
        <h1 className="text-2xl font-bold">Your Profile</h1>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <ProfileSidebar profile={profile} />
        </div>
        
        <div className="md:col-span-2">
          {children}
        </div>
      </div>
    </div>
  );
} 