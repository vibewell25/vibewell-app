import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = {
  title: "Profile | VibeWell",
  description: "Manage your VibeWell profile",
};

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
} 