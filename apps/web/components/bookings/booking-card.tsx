import Link from "next/link";
import { BookingStatus } from "@vibewell/types";

interface BookingCardProps {
  booking: {
    id: string;
    status: BookingStatus;
    startTime: Date;
    endTime: Date;
    serviceId: string;
    service?: {
      title: string;
    };
  };
}

export function BookingCard({ booking }: BookingCardProps) {
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

  const renderActionButtons = () => {
    switch (booking.status) {
      case BookingStatus.PENDING:
        return (
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
        );
      case BookingStatus.CONFIRMED:
        return (
          <Link
            href={`/bookings/${booking.id}`}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            View Details
          </Link>
        );
      case BookingStatus.COMPLETED:
        return (
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
        );
      default:
        return (
          <Link
            href={`/bookings/${booking.id}`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            View Details
          </Link>
        );
    }
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center mb-2">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(booking.status)}`}>
                {booking.status}
              </span>
              {booking.status === BookingStatus.PENDING && (
                <span className="ml-2 text-sm text-muted-foreground">
                  Payment Required
                </span>
              )}
            </div>
            <h3 className="text-lg font-medium">{booking.service?.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </p>
          </div>
          <div>
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
} 