import { Metadata } from "next";
import Link from "next/link";
import { bookings } from "@/lib/mock-data";
import { BookingStatus } from "@vibewell/types";
import { BookingCard } from "@/components/bookings/booking-card";

export const metadata: Metadata = {
  title: "My Bookings | VibeWell",
  description: "View and manage your service bookings",
};

export default function BookingsPage() {
  const pendingBookings = bookings.filter(booking => booking.status === BookingStatus.PENDING);
  const confirmedBookings = bookings.filter(booking => booking.status === BookingStatus.CONFIRMED);
  const completedBookings = bookings.filter(booking => booking.status === BookingStatus.COMPLETED);
  const cancelledBookings = bookings.filter(booking => 
    booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.NO_SHOW
  );

  return (
    <div className="space-y-8">
      {pendingBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Bookings</h2>
          <div className="grid gap-4">
            {pendingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {confirmedBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          <div className="grid gap-4">
            {confirmedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {completedBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
          <div className="grid gap-4">
            {completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {cancelledBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Cancelled Bookings</h2>
          <div className="grid gap-4">
            {cancelledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {pendingBookings.length === 0 && 
        confirmedBookings.length === 0 && 
        completedBookings.length === 0 && 
        cancelledBookings.length === 0 && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-6">
            You haven't made any bookings yet.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Browse Services
          </Link>
        </div>
      )}
    </div>
  );
} 