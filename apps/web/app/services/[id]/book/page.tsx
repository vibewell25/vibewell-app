import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { BookingForm } from "@/components/services/booking-form";
import { UserRole, Profile, Service } from "@vibewell/types";

interface BookingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: BookingPageProps): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createServerClient();
  const { data: service } = await supabase
    .from("services")
    .select("title")
    .eq("id", params.id)
    .single();

  if (!service) {
    return {
      title: "Service Not Found | VibeWell",
      description: "The requested service could not be found.",
    };
  }

  return {
    title: `Book ${service.title} | VibeWell`,
    description: `Book an appointment for ${service.title} on VibeWell.`,
  };
}

export default async function BookingPage(props: BookingPageProps) {
  const params = await props.params;
  const supabase = await createServerClient();
  const profileData = await getCurrentProfile();

  // Redirect to login if not authenticated
  if (!profileData) {
    redirect(`/auth/login?redirectTo=/services/${params.id}/book`);
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

  // Redirect if user is a provider (can't book their own services)
  if (profile.role === UserRole.PROVIDER) {
    redirect(`/services/${params.id}`);
  }

  // Fetch service with its details
  const { data: serviceData } = await supabase
    .from("services")
    .select(`*, provider:profiles(id, firstName, lastName, displayName, avatarUrl)`)
    .eq("id", params.id)
    .single();

  if (!serviceData) {
    notFound();
  }

  // Convert serviceData to Service type with provider
  const service = {
    id: serviceData.id,
    providerId: serviceData.providerId,
    title: serviceData.title,
    description: serviceData.description,
    price: serviceData.price,
    duration: serviceData.duration,
    isActive: serviceData.isActive,
    isPrivate: serviceData.isPrivate,
    categoryId: serviceData.categoryId,
    createdAt: new Date(serviceData.createdAt),
    updatedAt: new Date(serviceData.updatedAt),
    provider: {
      id: serviceData.provider.id,
      firstName: serviceData.provider.firstName,
      lastName: serviceData.provider.lastName,
      displayName: serviceData.provider.displayName,
      avatarUrl: serviceData.provider.avatarUrl,
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Link
          href={`/services/${params.id}`}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Service
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg border bg-card p-6">
            <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
            <div className="mb-6">
              <h2 className="text-lg font-medium">Service Details</h2>
              <div className="flex items-start gap-4 mt-2">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl text-primary">✨</span>
                </div>
                <div>
                  <h3 className="font-medium">{service.title}</h3>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span>${service.price.toFixed(2)}</span>
                    <span>•</span>
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="text-sm mt-1">
                    <span className="text-muted-foreground">Provider: </span>
                    <span>
                      {service.provider.displayName || 
                        `${service.provider.firstName} ${service.provider.lastName}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <BookingForm service={service} profile={profile} />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-bold mb-4">Booking Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Cancellation Policy</h3>
              <p className="text-sm text-muted-foreground">
                You can cancel your appointment up to 24 hours before the scheduled time without any charges. 
                Cancellations within 24 hours may be subject to a cancellation fee.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What to Expect</h3>
              <p className="text-sm text-muted-foreground">
                Upon booking confirmation, you will receive an email with details about your appointment. 
                Please arrive 10 minutes early for your appointment. The service provider may contact you 
                with additional information or instructions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Payment</h3>
              <p className="text-sm text-muted-foreground">
                Payment will be processed at the time of service. We accept credit cards, cash, and major 
                mobile payment methods. Gratuity is not included in the listed price.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 