import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { formatDate, formatTime, formatCurrency } from "@vibewell/utils";
import { BookingStatus, Profile, UserRole, Service } from "@vibewell/types";
import BookingMap from "@/components/bookings/booking-map";
import { safeProfileData } from "@/lib/utils";

type ParamsType = Promise<{ id: string }>;

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

  // Convert profileData to Profile type using our utility function
  const profile: Profile = safeProfileData(profileData);

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
                    <p className="text-sm text-muted-foreground">{booking.provider.email}</p>
                    {booking.provider.phone && (
                      <p className="text-sm">{booking.provider.phone}</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Customer</h2>
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
                    <p className="text-sm text-muted-foreground">{booking.customer.email}</p>
                    {booking.customer.phone && (
                      <p className="text-sm">{booking.customer.phone}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-4">
            {getBookingActions()}
            
            {booking.status === BookingStatus.CANCELLED && booking.cancellationReason && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <h3 className="font-medium text-destructive mb-1">Cancellation Reason</h3>
                <p className="text-sm">{booking.cancellationReason}</p>
                {booking.cancellationNotes && (
                  <p className="text-sm mt-2">{booking.cancellationNotes}</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <BookingMap service={prepareServiceForMap(booking.service, booking.provider)} />
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">What to Expect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Before Your Appointment</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Arrive 5-10 minutes early
                  </li>
                  <li className="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Bring any relevant medical information
                  </li>
                  <li className="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Wear comfortable clothing
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Cancellation Policy</h3>
                <p className="mt-2 text-sm">
                  Free cancellation up to 24 hours before your appointment. Cancellations within 24 hours may be subject to a cancellation fee.
                </p>
              </div>
            </div>
          </div>
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