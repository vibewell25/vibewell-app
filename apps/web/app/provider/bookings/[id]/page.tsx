import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { formatDate, formatTime, formatCurrency } from "@vibewell/utils";
import { BookingStatus, Profile, UserRole } from "@vibewell/types";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { BookingActionButtons } from "@/components/provider/booking-action-buttons";
import { Avatar } from "@vibewell/ui";

type ParamsType = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: ParamsType }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Booking Details | Provider Dashboard | VibeWell",
    description: "View details of a customer booking",
  };
}

export default async function ProviderBookingDetailsPage({ params }: { params: ParamsType }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const profileData = await getCurrentProfile();

  if (!profileData || profileData.role !== UserRole.PROVIDER) {
    notFound();
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

  // Fetch booking with related service and customer details
  const { data: bookingData } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(*),
      customer:profiles!bookings_customerId_fkey(id, firstName, lastName, displayName, avatarUrl, email, phone, address, city, state, zipCode, country)
    `)
    .eq("id", id)
    .eq("providerId", profile.id)
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
  
  // Prepare booking details to pass to action buttons for notifications
  const bookingDetails = {
    serviceName: booking.service.title,
    customerName: booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`,
    customerEmail: booking.customer.email,
    customerFirstName: booking.customer.firstName,
    providerName: profile.displayName || `${profile.firstName} ${profile.lastName}`,
    providerEmail: profile.email,
    providerFirstName: profile.firstName,
    price: booking.price,
    endTime: booking.endTime,
    customerId: booking.customer.id,
    providerId: profile.id,
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Booking Details</h1>
        
        <div className="flex gap-2">
          <Link
            href="/provider/bookings"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            Back to Bookings
          </Link>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left column: Booking info */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Booking Information</h2>
              <BookingStatusBadge status={booking.status} />
            </div>
            
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
                  <p className="font-medium">{formatCurrency(booking.price)}</p>
                </div>
              </div>
              
              {booking.cancellationReason && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Cancellation Reason</p>
                  <p className="text-sm">{booking.cancellationReason}</p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                <p className="text-sm">
                  {booking.notes || "No special requests provided."}
                </p>
              </div>
            </div>
          </div>

          <BookingActionButtons 
            bookingId={booking.id} 
            status={booking.status} 
            startTime={booking.startTime}
            bookingDetails={bookingDetails}
          />
        </div>
        
        {/* Right column: Customer info */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            
            <div className="flex items-center mb-4">
              <Avatar
                src={booking.customer.avatarUrl}
                initials={`${booking.customer.firstName[0]}${booking.customer.lastName[0]}`}
                size="md"
              />
              <div className="ml-3">
                <p className="font-medium">
                  {booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Customer
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.customer.email}</p>
              </div>
              
              {booking.customer.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.customer.phone}</p>
                </div>
              )}
              
              {booking.customer.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {booking.customer.address}
                    {booking.customer.city && `, ${booking.customer.city}`}
                    {booking.customer.state && `, ${booking.customer.state}`} 
                    {booking.customer.zipCode && booking.customer.zipCode}
                  </p>
                  {booking.customer.country && (
                    <p className="text-sm">{booking.customer.country}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Booking Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0"></div>
                <div>
                  <p className="font-medium">Booking Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.createdAt)} at {booking.createdAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {booking.status !== BookingStatus.PENDING && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0"></div>
                  <div>
                    <p className="font-medium">
                      {booking.status === BookingStatus.CONFIRMED 
                        ? "Booking Confirmed" 
                        : booking.status === BookingStatus.COMPLETED
                        ? "Service Completed"
                        : booking.status === BookingStatus.CANCELLED
                        ? "Booking Cancelled"
                        : "Customer No-Show"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.updatedAt)} at {booking.updatedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 