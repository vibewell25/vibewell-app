import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/services/service-form";
import { UserRole, Profile, Service } from "@vibewell/types";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit Service | VibeWell",
  description: "Edit your service offering",
};

interface EditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage(props: EditServicePageProps) {
  const params = await props.params;
  const profileData = await getCurrentProfile();

  if (!profileData) {
    notFound();
  }

  // Redirect if user is not a provider
  if (profileData.role !== UserRole.PROVIDER && profileData.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  // Convert profileData to Profile type
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

  // Fetch service
  const supabase = await createServerClient();
  const { data: serviceData } = await supabase
    .from("services")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!serviceData) {
    notFound();
  }

  // Check if user owns the service
  if (serviceData.providerId !== profile.id && profile.role !== UserRole.ADMIN) {
    redirect("/provider/services");
  }

  // Convert serviceData to Service type
  const service: Service = {
    ...serviceData,
    createdAt: new Date(serviceData.createdAt),
    updatedAt: new Date(serviceData.updatedAt),
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Service</h1>
            <p className="text-muted-foreground">
              Update your service details
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
        <ServiceForm initialData={service} providerId={profile.id} />
      </div>
    </div>
  );
} 