import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ServiceReviews } from "@/components/reviews/service-reviews";

interface ServicePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const supabase = createServerClient();
  const { data: service } = await supabase
    .from("services")
    .select("title, description")
    .eq("id", params.id)
    .single();

  if (!service) {
    return {
      title: "Service Not Found | VibeWell",
      description: "The requested service could not be found.",
    };
  }

  return {
    title: `${service.title} | VibeWell`,
    description: service.description.substring(0, 160),
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const supabase = createServerClient();
  const profile = await getCurrentProfile();

  // Fetch service with its category and provider details
  const { data: service } = await supabase
    .from("services")
    .select(`
      *,
      category:categories(*),
      provider:profiles(id, firstName, lastName, displayName, bio, avatarUrl)
    `)
    .eq("id", params.id)
    .single();

  if (!service) {
    notFound();
  }

  // Check if the current user is the provider of this service
  const isProvider = profile?.id === service.provider.id;

  // Fetch reviews for this service (public only)
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      customer:profiles!reviews_customerId_fkey(id, firstName, lastName, displayName, avatarUrl)
    `)
    .eq("serviceId", params.id)
    .eq("isPublic", true)
    .order("createdAt", { ascending: false });

  // Get review summary
  const { data: countData } = await supabase
    .from("reviews")
    .select("rating", { count: "exact" })
    .eq("serviceId", params.id)
    .eq("isPublic", true);

  // Calculate average rating and ratings distribution
  const totalReviews = reviews?.length || 0;
  const averageRating = totalReviews > 0 
    ? reviews!.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  // Count reviews by rating
  const ratingCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  if (reviews && reviews.length > 0) {
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating as keyof typeof ratingCounts]++;
      }
    });
  }

  const reviewSummary = {
    serviceId: params.id,
    providerId: service.providerId,
    averageRating,
    totalReviews,
    ratings: ratingCounts,
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Link
          href="/services"
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
          Back to Services
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="aspect-video relative bg-muted">
              {/* Service image would go here */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              {service.category && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                    {service.category.name}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{service.title}</h1>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="font-medium text-xl text-primary">
                      ${service.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
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
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {service.duration} minutes
                    </div>
                  </div>
                </div>

                {!isProvider && (
                  <Link
                    href={`/services/${service.id}/book`}
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90"
                  >
                    Book Now
                  </Link>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <div className="prose prose-sm max-w-full">
                  <p>{service.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border bg-card p-6">
            <ServiceReviews 
              reviews={reviews || []} 
              summary={reviewSummary}
              serviceId={params.id}
              showReviewForm={!isProvider}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-semibold mb-4">About the Provider</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {service.provider.avatarUrl ? (
                  <img
                    src={service.provider.avatarUrl}
                    alt={service.provider.displayName || `${service.provider.firstName} ${service.provider.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-primary font-medium">
                    {service.provider.firstName.charAt(0)}
                    {service.provider.lastName.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-medium">
                  {service.provider.displayName || `${service.provider.firstName} ${service.provider.lastName}`}
                </h3>
                <Link
                  href={`/providers/${service.provider.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">
                {service.provider.bio || "This provider has not added a bio yet."}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-2">More services from this provider</h3>
              <Link
                href={`/providers/${service.provider.id}`}
                className="text-sm text-primary hover:underline"
              >
                View All Services →
              </Link>
            </div>

            {!isProvider && (
              <div className="mt-6 pt-6 border-t">
                <Link
                  href={`/services/${service.id}/book`}
                  className="w-full flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90"
                >
                  Book This Service
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 