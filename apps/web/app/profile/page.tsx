import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";
import { Profile, UserRole } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Profile | VibeWell",
  description: "Manage your VibeWell profile",
};

export default async function ProfilePage() {
  const profileData = await getCurrentProfile();

  if (!profileData) {
    notFound();
  }

  // Convert API response to match the Profile type
  const profile: Profile = {
    ...profileData,
    role: profileData.role as UserRole,
    createdAt: new Date(profileData.createdAt),
    updatedAt: new Date(profileData.updatedAt),
    displayName: profileData.displayName || undefined,
    bio: profileData.bio || undefined,
    avatarUrl: profileData.avatarUrl || undefined,
    phone: profileData.phone || undefined,
    address: profileData.address || undefined,
    city: profileData.city || undefined,
    state: profileData.state || undefined,
    zipCode: profileData.zipCode || undefined,
    country: profileData.country || undefined,
  };

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