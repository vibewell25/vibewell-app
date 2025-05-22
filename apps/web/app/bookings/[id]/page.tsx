import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { formatDate, formatTime, formatCurrency } from "@vibewell/utils";
import { BookingStatus, Profile, UserRole, Service } from "@vibewell/types";
import dynamic from "next/dynamic";

type ParamsType = Promise<{ id: string }>;

// Dynamically import the map component with SSR disabled
const ServiceMapNoSSR = dynamic(
  () => import("@/components/services/service-map").then(mod => ({ default: mod.ServiceMap })),
  { ssr: false }
);

// Helper function to prepare service for map display
function prepareServiceForMap(service: Service, provider: any) {
  // Default to London (id: 4) if no city is provided
  const locationId = provider.city && provider.city.includes("Los Angeles") 
    ? "1" // Los Angeles
    : provider.city && provider.city.includes("New York")
    ? "3" // New York
    : "4"; // Default to London
  
  return {
    ...service,
    locationId,
    category: undefined,
    rating: 5
  };
}

export async function generateMetadata({ params }: { params: ParamsType }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Booking Details | VibeWell",
    description: "View details of your booking",
  };
}

export default async function BookingDetailsPage({ params }: { params: ParamsType }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const profileData = await getCurrentProfile();

  if (!profileData) {
    redirect(`/auth/login?redirectTo=/bookings/${id}`);
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

  // Fetch booking with related service and provider details
  const { data: bookingData } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(*),
      provider:profiles!bookings_providerId_fkey(id, firstName, lastName, displayName, avatarUrl, phone, email),
      customer:profiles!bookings_customerId_fkey(id, firstName, lastName, displayName, avatarUrl, phone, email)
    `)
    .eq("id", id)
    .eq("customerId", profile.id)
    .single();

  if (!bookingData) {
    notFound();
  }

  // Convert to proper Booking type with status as enum
  const booking = {
    ...bookingData,
    status: bookingData.status as BookingStatus,
    createdAt: new Date(bookingData.createdAt),
    updatedAt: new Date(bookingData.updatedAt),
    startTime: new Date(bookingData.startTime),
    endTime: new Date(bookingData.endTime),
    service: {
      ...bookingData.service,
      createdAt: new Date(bookingData.service.createdAt),
      updatedAt: new Date(bookingData.service.updatedAt),
    }
  };

  const startTime = booking.startTime;
  const endTime = booking.endTime;
  
  // Check if booking can be cancelled (not past, not already cancelled)
  const canCancel = 
    booking.status !== BookingStatus.CANCELLED && 
    booking.status !== BookingStatus.COMPLETED &&
    booking.status !== BookingStatus.NO_SHOW &&
    new Date() < startTime;

  // Actions based on booking status
  const getBookingActions = () => {
    if (booking.status === BookingStatus.COMPLETED) {
      return (
        <Link
          href={`/services/${booking.serviceId}/review`}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Leave a Review
        </Link>
      );
    }
    
    if (canCancel) {
      return (
        <Link
          href={`/bookings/${booking.id}/cancel`}
          className="inline-flex items-center justify-center rounded-md border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive shadow-sm transition-colors hover:bg-destructive/20"
        >
          Cancel Booking
        </Link>
      );
    }
    
    return null;
  };

  // Verify that the user is either the customer or provider for this booking
  const isCustomer = booking.customer.id === profile.id;
  const isProvider = booking.provider.id === profile.id;
  
  if (!isCustomer && !isProvider) {
    redirect("/bookings");
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Booking Details</h1>
        
        <div className="flex gap-2">
          <Link
            href="/bookings"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            Back to Bookings
          </Link>
          
          {/* Show payment button if customer and booking is pending */}
          {isCustomer && booking.status === BookingStatus.PENDING && (
            <Link
              href={`/bookings/${booking.id}/payment`}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Complete Payment
            </Link>
          )}
          
          {/* Show action buttons for provider */}
          {isProvider && booking.status === BookingStatus.PENDING && (
            <Link
              href={`/provider/bookings/${booking.id}/manage`}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Manage Booking
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{booking.service.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {booking.service.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(startTime)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {formatTime(startTime)} - {formatTime(endTime)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{booking.service.duration} minutes</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${booking.service.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset mt-1 ${getStatusBadgeColor(booking.status as BookingStatus)}`}>
                  {booking.status}
                </span>
              </div>
              
              {booking.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {isCustomer ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Service Provider</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {booking.provider.avatarUrl ? (
                      <img 
                        src={booking.provider.avatarUrl} 
                        alt={booking.provider.displayName || `${booking.provider.firstName} ${booking.provider.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {booking.provider.displayName || `${booking.provider.firstName} ${booking.provider.lastName}`}
                    </h3>
                    <Link
                      href={`/providers/${booking.provider.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {booking.customer.avatarUrl ? (
                      <img 
                        src={booking.customer.avatarUrl} 
                        alt={booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="rounded-md overflow-hidden">
              <ServiceMapNoSSR 
                services={[prepareServiceForMap(booking.service, booking.provider)]} 
                height="300px"
                zoom={12}
                centerLocation={prepareServiceForMap(booking.service, booking.provider).locationId}
              />
            </div>
            <p className="text-sm mt-4">
              Service location details will be provided after booking confirmation.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Need Assistance?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              If you need to make changes to your booking or have any questions, please contact us.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:support@vibewell.com"
                className="text-sm text-primary hover:underline block"
              >
                support@vibewell.com
              </a>
              <p className="text-sm">
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          
          {isCustomer && booking.status === BookingStatus.CONFIRMED && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">After Your Appointment</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Don't forget to leave a review after your service is completed.
              </p>
              <Link
                href={`/services/${booking.service.id}/review?bookingId=${booking.id}`}
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Write a Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusBadgeColor(status: BookingStatus) {
  switch (status) {
    case BookingStatus.PENDING:
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
    case BookingStatus.CONFIRMED:
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case BookingStatus.COMPLETED:
      return "bg-green-50 text-green-700 ring-green-600/20";
    case BookingStatus.CANCELLED:
      return "bg-red-50 text-red-700 ring-red-600/20";
    case BookingStatus.NO_SHOW:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
  }
} 