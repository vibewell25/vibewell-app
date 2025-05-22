import { Metadata } from "next";
import Link from "next/link";
import { bookings } from "@/lib/mock-data";
import { BookingStatus } from "@vibewell/types";

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusBadgeColor = (status: BookingStatus) => {
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
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">
          View and manage your service appointments
        </p>
      </div>

      <div className="space-y-8">
        {pendingBookings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Bookings</h2>
            <div className="grid gap-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            Payment Required
                          </span>
                        </div>
                        <h3 className="text-lg font-medium">{booking.service?.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/bookings/${booking.id}/payment`}
                          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                        >
                          Complete Payment
                        </Link>
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {confirmedBookings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
            <div className="grid gap-4">
              {confirmedBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium">{booking.service?.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                      </div>
                      <div>
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedBookings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
            <div className="grid gap-4">
              {completedBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium">{booking.service?.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/services/${booking.serviceId}/review?bookingId=${booking.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                        >
                          Leave Review
                        </Link>
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cancelledBookings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Cancelled Bookings</h2>
            <div className="grid gap-4">
              {cancelledBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium">{booking.service?.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                      </div>
                      <div>
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
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
    </div>
  );
} 