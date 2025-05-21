import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Profile, UserRole } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Dashboard | VibeWell",
  description: "Your VibeWell dashboard",
};

export default async function DashboardPage() {
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

  return <DashboardShell profile={profile} />;
} 