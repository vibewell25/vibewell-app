import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ServiceCard } from "@/components/services/service-card";
import { UserRole } from "@vibewell/types";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Services | VibeWell",
  description: "Manage your service offerings",
};

export default async function ProviderServicesPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  // Redirect if user is not a provider
  if (profile.role !== UserRole.PROVIDER && profile.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  // Fetch services
  const supabase = createServerClient();
  const { data: services } = await supabase
    .from("services")
    .select("*, category:categories(*)")
    .eq("providerId", profile.id)
    .order("createdAt", { ascending: false });

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Services</h1>
          <p className="text-muted-foreground">
            Manage your service offerings
          </p>
        </div>
        <Link
          href="/provider/services/new"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90"
        >
          Add New Service
        </Link>
      </div>

      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} showActions />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No services yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any services yet. Get started by creating your first service.
          </p>
          <Link
            href="/provider/services/new"
            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Create Service
          </Link>
        </div>
      )}
    </div>
  );
} 