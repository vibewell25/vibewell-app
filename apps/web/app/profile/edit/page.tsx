import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";
import { customers } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Edit Profile | VibeWell",
  description: "Edit your VibeWell profile",
};

export default async function EditProfilePage() {
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
    <div className="container max-w-4xl py-12">
      <div className="mb-6 flex items-center">
        <Link 
          href="/profile"
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
          Back to Profile
        </Link>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>
      
      <div className="card-modern p-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
} 