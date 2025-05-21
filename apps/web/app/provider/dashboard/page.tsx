import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ProviderDashboard } from "@/components/provider/provider-dashboard";
import { UserRole } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Provider Dashboard | VibeWell",
  description: "Manage your services, bookings, and business metrics",
};

export default async function ProviderDashboardPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  // Redirect if user is not a provider
  if (profile.role !== UserRole.PROVIDER && profile.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return <ProviderDashboard profile={profile} />;
} 