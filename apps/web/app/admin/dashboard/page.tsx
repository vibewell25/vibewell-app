import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { UserRole, Profile } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Admin Dashboard | VibeWell",
  description: "Manage the VibeWell platform and operations",
};

export default async function AdminDashboardPage() {
  const profileData = await getCurrentProfile();

  if (!profileData) {
    notFound();
  }

  // Redirect if user is not an admin
  if (profileData.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  // Convert API response to match the Profile type
  const profile: Profile = {
    ...profileData,
    role: profileData.role as UserRole, // Ensure role is treated as UserRole enum
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

  return <AdminDashboard profile={profile} />;
} 