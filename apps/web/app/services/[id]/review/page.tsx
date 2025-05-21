import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/reviews/review-form";
import { BookingStatus } from "@vibewell/types";

interface ReviewPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const supabase = createServerClient();
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
    title: `Review ${service.title} | VibeWell`,
    description: `Leave a review for ${service.title} on VibeWell.`,
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const supabase = createServerClient();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(`/auth/login?redirectTo=/services/${params.id}/review`);
  }

  // Fetch service details
  const { data: service } = await supabase
    .from("services")
    .select("*, provider:profiles(*)")
    .eq("id", params.id)
    .single();

  if (!service) {
    notFound();
  }

  // Verify the user has a completed booking for this service
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("customerId", profile.id)
    .eq("serviceId", params.id)
    .eq("status", BookingStatus.COMPLETED)
    .not("hasReview", "eq", true)
    .order("endTime", { ascending: false })
    .limit(1)
    .single();

  // If no completed booking found, redirect to service page
  if (!booking) {
    redirect(`/services/${params.id}?error=no_completed_booking`);
  }

  // Check if the user has already left a review for this booking
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("*")
    .eq("bookingId", booking.id)
    .eq("customerId", profile.id)
    .single();

  // If a review already exists, redirect to the service page
  if (existingReview) {
    redirect(`/services/${params.id}?info=already_reviewed`);
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
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

        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="bg-primary/10 p-6">
            <h1 className="text-2xl font-bold">Review {service.title}</h1>
            <p className="text-muted-foreground mt-1">
              Share your experience and help others make informed decisions.
            </p>
          </div>

          <div className="p-6">
            <div className="mb-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-primary">✨</span>
              </div>
              <div>
                <h2 className="font-medium text-lg">{service.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {service.provider.displayName || 
                    `${service.provider.firstName} ${service.provider.lastName}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Appointment date: {new Date(booking.startTime).toLocaleDateString()}
                </p>
              </div>
            </div>

            <ReviewForm booking={booking} service={service} profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
} 