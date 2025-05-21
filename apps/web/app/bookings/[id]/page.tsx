import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { formatDate, formatTime, formatCurrency } from "@vibewell/utils";
import { BookingStatus } from "@vibewell/types";

interface BookingDetailsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BookingDetailsPageProps): Promise<Metadata> {
  return {
    title: "Booking Details | VibeWell",
    description: "View details of your booking",
  };
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const supabase = createServerClient();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(`/auth/login?redirectTo=/bookings/${params.id}`);
  }

  // Fetch booking with related service and provider details
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(*),
      provider:profiles!bookings_providerId_fkey(id, firstName, lastName, displayName, avatarUrl, phone, email)
    `)
    .eq("id", params.id)
    .eq("customerId", profile.id)
    .single();

  if (!booking) {
    notFound();
  }

  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  
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

  return (
    <div className="container py-10">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="bg-primary/10 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Booking #{booking.id.substring(0, 8)}</h1>
                  <p className="text-muted-foreground">
                    Created on {formatDate(new Date(booking.createdAt))}
                  </p>
                </div>
                <div>
                  <span className={`
                    inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
                    ${booking.status === BookingStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' : ''}
                    ${booking.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${booking.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-800' : ''}
                    ${booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-800' : ''}
                    ${booking.status === BookingStatus.NO_SHOW ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Service Details</h2>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl text-primary">✨</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{booking.service.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{booking.service.description}</p>
                    <div className="flex gap-3 text-sm mt-2">
                      <span>{formatCurrency(booking.price)}</span>
                      <span>•</span>
                      <span>{booking.service.duration} minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Appointment Time</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-muted-foreground mt-0.5"
                      >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      <div>
                        <div className="font-medium">{formatDate(startTime)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(startTime)} - {formatTime(endTime)}
                        </div>
                      </div>
                    </div>

                    {booking.status === BookingStatus.CANCELLED && booking.cancellationReason && (
                      <div className="rounded-md bg-red-50 p-4 mt-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 text-red-400"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Cancelled</h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>Reason: {booking.cancellationReason}</p>
                              {booking.cancellationFee && (
                                <p className="mt-1">
                                  Cancellation fee: {formatCurrency(booking.cancellationFee)}
                                </p>
                              )}
                              {booking.cancellationNotes && (
                                <p className="mt-1">Notes: {booking.cancellationNotes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-4">Provider Information</h2>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {booking.provider.avatarUrl ? (
                        <img
                          src={booking.provider.avatarUrl}
                          alt={booking.provider.displayName || `${booking.provider.firstName} ${booking.provider.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-primary font-medium">
                          {booking.provider.firstName.charAt(0)}
                          {booking.provider.lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {booking.provider.displayName || 
                          `${booking.provider.firstName} ${booking.provider.lastName}`}
                      </h3>
                      <Link
                        href={`/providers/${booking.providerId}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Profile
                      </Link>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
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
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <span>{booking.provider.phone || "No phone provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
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
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          <span>{booking.provider.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div>
                  <h2 className="text-lg font-medium mb-2">Your Notes</h2>
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-6">
                <h2 className="text-lg font-medium mb-4">Payment Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Price</span>
                    <span>{formatCurrency(booking.service.price)}</span>
                  </div>
                  {booking.cancellationFee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cancellation Fee</span>
                      <span>{formatCurrency(booking.cancellationFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>
                      {booking.status === BookingStatus.CANCELLED && booking.cancellationFee
                        ? formatCurrency(booking.cancellationFee)
                        : formatCurrency(booking.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-6 flex flex-col sm:flex-row gap-4 justify-between items-center border-t">
              <Link
                href="/bookings"
                className="text-sm text-primary hover:underline"
              >
                ← Back to Bookings
              </Link>
              <div className="flex gap-3">
                <Link
                  href={`/services/${booking.serviceId}`}
                  className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
                >
                  View Service
                </Link>
                {getBookingActions()}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-medium mb-4">Booking Help</h2>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
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
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M17 6.1H3" />
                    <path d="M21 12.1H3" />
                    <path d="M15.1 18H3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Need to reschedule?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cancel this appointment and book a new time that works better for you.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
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
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                    <line x1="12" x2="12" y1="2" y2="12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Cancellation Policy</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You can cancel your appointment up to 24 hours in advance with no charge.
                    Cancellations within 24 hours may incur a 50% fee.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
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
                    className="h-4 w-4 text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" x2="12.01" y1="17" y2="17" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you have any questions or need assistance, please contact us at{" "}
                    <a href="mailto:support@vibewell.com" className="text-primary hover:underline">
                      support@vibewell.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 