import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Profile, UserRole } from "@vibewell/types";
import { safeProfileData } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard | VibeWell",
  description: "Your VibeWell dashboard",
};

export default async function DashboardPage() {
  const profileData = await getCurrentProfile();

  if (!profileData) {
    notFound();
  }

  // Convert API response to match the Profile type using our utility function
  const profile: Profile = safeProfileData(profileData);

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome to your VibeWell dashboard.</p>
      </div>
    </DashboardShell>
  );
} 