import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Dashboard | VibeWell",
  description: "Your VibeWell dashboard",
};

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  return <DashboardShell profile={profile} />;
} 