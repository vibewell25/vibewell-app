import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ProviderDashboard } from "@/components/provider/provider-dashboard";
import { UserRole, Profile } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Provider Dashboard | VibeWell",
  description: "Manage your services, bookings, and business metrics",
};

export default async function ProviderDashboardPage() {
  const profileData = await getCurrentProfile();

  if (!profileData) {
    notFound();
  }

  // Redirect if user is not a provider
  if (profileData.role !== UserRole.PROVIDER && profileData.role !== UserRole.ADMIN) {
    redirect("/dashboard");
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

  return <ProviderDashboard profile={profile} />;
} 