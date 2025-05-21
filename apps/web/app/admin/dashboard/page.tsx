import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { UserRole } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Admin Dashboard | VibeWell",
  description: "Manage the VibeWell platform and operations",
};

export default async function AdminDashboardPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  // Redirect if user is not an admin
  if (profile.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return <AdminDashboard profile={profile} />;
} 