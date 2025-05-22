import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { formatDate, formatTime } from "@vibewell/utils";
import { BookingCancellationForm } from "@/components/bookings/booking-cancellation-form";
import { BookingStatus, Profile, UserRole, Booking } from "@vibewell/types";

type ParamsType = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: ParamsType }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Cancel Booking | VibeWell",
    description: "Cancel your booking",
  };
}

export default async function BookingCancellationPage({ params }: { params: ParamsType }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const profileData = await getCurrentProfile();

  if (!profileData) {
    redirect(`/auth/login?redirectTo=/bookings/${id}/cancel`);
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
      provider:profiles!bookings_providerId_fkey(id, firstName, lastName, displayName, avatarUrl)
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

  // If booking is already cancelled, redirect to bookings
  if (booking.status === BookingStatus.CANCELLED) {
    redirect("/bookings");
  }

  const startTime = booking.startTime;
  const currentTime = new Date();
  
  // Check if cancellation is allowed (more than 24 hours before appointment)
  const timeDiff = startTime.getTime() - currentTime.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  const cancellationFee = hoursDiff < 24 ? booking.price * 0.5 : 0;

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/bookings"
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
            Back to Bookings
          </Link>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="bg-primary/10 p-6">
            <h1 className="text-2xl font-bold">Cancel Booking</h1>
            <p className="text-muted-foreground mt-1">
              Review the booking details and cancellation policy before proceeding.
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="rounded-md bg-muted p-4">
              <h2 className="text-lg font-medium mb-3">Booking Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{booking.service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{formatDate(startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{formatTime(startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="font-medium">
                    {booking.provider.displayName || 
                      `${booking.provider.firstName} ${booking.provider.lastName}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">${booking.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-lg font-medium text-amber-800 mb-2">Cancellation Policy</h3>
              <p className="text-sm text-amber-800">
                {hoursDiff < 24 ? (
                  <>
                    Your appointment is less than 24 hours away. Cancelling now will incur a cancellation
                    fee of ${cancellationFee.toFixed(2)} (50% of the service price).
                  </>
                ) : (
                  <>
                    You can cancel this appointment without any charges as it's more than 24 hours away.
                  </>
                )}
              </p>
            </div>

            <BookingCancellationForm 
              bookingId={booking.id} 
              cancellationFee={cancellationFee}
              serviceName={booking.service.title}
              bookingDate={booking.startTime.toISOString()}
              bookingTime={formatTime(startTime)}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 