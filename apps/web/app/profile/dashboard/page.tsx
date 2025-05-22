import { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RecentBookings } from "@/components/dashboard/recent-bookings";
import { UpcomingServices } from "@/components/dashboard/upcoming-services";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { safeProfileData } from "@/lib/utils";
import { Profile } from "@vibewell/types";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";

export const metadata: Metadata = {
  title: "Dashboard | VibeWell",
  description: "Manage your VibeWell account and services",
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
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <QuickStats profile={profile} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UpcomingServices profile={profile} />
          <RecentBookings profile={profile} />
        </div>
        
        {/* Add Analytics Dashboard */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <AnalyticsDashboard />
        </div>
      </div>
    </DashboardShell>
  );
} 