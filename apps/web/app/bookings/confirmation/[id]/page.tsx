import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { formatDate, formatTime } from "@vibewell/utils";

interface BookingConfirmationPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BookingConfirmationPageProps): Promise<Metadata> {
  return {
    title: "Booking Confirmation | VibeWell",
    description: "Your booking has been confirmed.",
  };
}

export default async function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
  const supabase = createServerClient();
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  // Fetch booking with related service and provider details
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(*),
      provider:profiles!bookings_providerId_fkey(id, firstName, lastName, displayName, avatarUrl)
    `)
    .eq("id", params.id)
    .eq("customerId", profile.id)
    .single();

  if (!booking) {
    notFound();
  }

  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-green-600"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground mt-2">
            Thank you for your booking. Your confirmation details are below.
          </p>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="bg-primary/10 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Booking #{booking.id.substring(0, 8)}</h2>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Service Details</h3>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl text-primary">✨</span>
                </div>
                <div>
                  <h4 className="font-medium">{booking.service.title}</h4>
                  <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                    <span>${booking.price.toFixed(2)}</span>
                    <span>•</span>
                    <span>{booking.service.duration} minutes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Appointment Time</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
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
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <span>{formatDate(startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
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
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Provider</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
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
                    <div className="font-medium">
                      {booking.provider.displayName || 
                        `${booking.provider.firstName} ${booking.provider.lastName}`}
                    </div>
                    <Link
                      href={`/providers/${booking.providerId}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div>
                <h3 className="text-lg font-medium mb-2">Your Notes</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {booking.notes}
                </p>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
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
                    className="h-4 w-4 text-primary mt-0.5"
                  >
                    <path d="M12 13V2l8 4-8 4" />
                    <path d="M20.55 10.23A9 9 0 1 1 8 4.94" />
                    <path d="M8 10a5 5 0 1 0 8.9 2.02" />
                  </svg>
                  <span>
                    You will receive a confirmation email with these details.
                  </span>
                </li>
                <li className="flex items-start gap-2">
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
                    className="h-4 w-4 text-primary mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  <span>
                    Please arrive 10 minutes before your appointment time.
                  </span>
                </li>
                <li className="flex items-start gap-2">
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
                    className="h-4 w-4 text-primary mt-0.5"
                  >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                  <span>
                    To reschedule or cancel, please visit your bookings page at least 24 hours in advance.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link
              href="/bookings"
              className="text-sm text-primary hover:underline"
            >
              View All Bookings
            </Link>
            <div className="flex gap-3">
              <Link
                href={`/bookings/${booking.id}/cancel`}
                className="rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
              >
                Cancel Booking
              </Link>
              <Link
                href={`/services/${booking.serviceId}`}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                View Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 