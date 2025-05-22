"use client";

import Link from "next/link";
import { formatDate, formatTime } from "@vibewell/utils";
import { BookingStatus } from "@vibewell/types";

interface BookingConfirmationProps {
  booking: {
    id: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    price: number;
    notes?: string | null;
    service: {
      id: string;
      title: string;
      description: string;
      duration: number;
    };
    provider: {
      id: string;
      firstName: string;
      lastName: string;
      displayName?: string | null;
      avatarUrl?: string | null;
    };
  };
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="bg-primary/10 p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Booking Confirmed</h2>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
            {booking.status}
          </span>
        </div>
        <p className="text-muted-foreground mt-1">
          Thank you for booking with VibeWell
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Service Details</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium">{booking.service.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>{booking.service.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${booking.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium">Date & Time</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{formatDate(startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium">Provider</h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {booking.provider.avatarUrl ? (
                    <img
                      src={booking.provider.avatarUrl}
                      alt={booking.provider.displayName || `${booking.provider.firstName} ${booking.provider.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-primary">
                      {booking.provider.firstName.charAt(0)}
                      {booking.provider.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                <span>
                  {booking.provider.displayName || `${booking.provider.firstName} ${booking.provider.lastName}`}
                </span>
              </div>
            </div>
          </div>
          
          {booking.notes && (
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium">Notes</h3>
              <p className="mt-2 text-muted-foreground">{booking.notes}</p>
            </div>
          )}
        </div>
        
        <div className="pt-6 border-t flex flex-col sm:flex-row gap-4">
          <Link
            href="/bookings"
            className="inline-flex justify-center items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
          >
            View All Bookings
          </Link>
          
          <Link
            href={`/bookings/${booking.id}/cancel`}
            className="inline-flex justify-center items-center rounded-md border border-red-200 text-red-700 px-4 py-2 text-sm font-medium shadow-sm hover:bg-red-50"
          >
            Cancel Booking
          </Link>
          
          <Link
            href="/"
            className="inline-flex justify-center items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 