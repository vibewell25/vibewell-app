import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/services/service-form";
import { UserRole } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Create Service | VibeWell",
  description: "Create a new service offering",
};

export default async function NewServicePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  // Redirect if user is not a provider
  if (profile.role !== UserRole.PROVIDER && profile.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create New Service</h1>
            <p className="text-muted-foreground">
              Add a new service to your offerings
            </p>
          </div>
          <Link
            href="/provider/services"
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground shadow hover:bg-secondary/90"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <ServiceForm providerId={profile.id} />
      </div>
    </div>
  );
} 