"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate, formatTime } from "@vibewell/utils";
import { BookingStatus } from "@vibewell/types";

// Define the booking type with related entities
interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  price: number;
  notes?: string | null;
  cancellationReason?: string | null;
  cancellationFee?: number | null;
  service: {
    id: string;
    title: string;
    duration: number;
    price: number;
    description: string;
    [key: string]: any;
  };
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    [key: string]: any;
  };
}

interface BookingsListProps {
  initialBookings: Booking[];
}

export function BookingsList({ initialBookings }: BookingsListProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");

  // Group bookings by upcoming and past
  const currentDate = new Date();
  
  // Filter bookings
  const filteredBookings = initialBookings.filter(booking => {
    if (statusFilter !== "ALL" && booking.status !== statusFilter) {
      return false;
    }
    
    const bookingDate = new Date(booking.startTime);
    if (activeTab === "upcoming") {
      return bookingDate >= currentDate;
    } else {
      return bookingDate < currentDate;
    }
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.startTime);
    const dateB = new Date(b.startTime);
    
    return activeTab === "upcoming" 
      ? dateA.getTime() - dateB.getTime() // Ascending for upcoming
      : dateB.getTime() - dateA.getTime(); // Descending for past
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b">
        <button
          className={`pb-2 text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`pb-2 text-sm font-medium transition-colors ${
            activeTab === "past"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <label htmlFor="status-filter" className="text-sm font-medium mr-2">
            Filter by status:
          </label>
          <select
            id="status-filter"
            className="rounded-md border text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "ALL")}
          >
            <option value="ALL">All statuses</option>
            <option value={BookingStatus.PENDING}>Pending</option>
            <option value={BookingStatus.CONFIRMED}>Confirmed</option>
            <option value={BookingStatus.COMPLETED}>Completed</option>
            <option value={BookingStatus.CANCELLED}>Cancelled</option>
            <option value={BookingStatus.NO_SHOW}>No-show</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          {sortedBookings.length} booking{sortedBookings.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {sortedBookings.length === 0 ? (
        <div className="card-modern p-8 text-center">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <h3 className="mb-1 text-xl font-semibold">No Bookings Found</h3>
          <p className="text-muted-foreground mb-4">
            {activeTab === "upcoming" 
              ? "You don't have any upcoming appointments scheduled."
              : "You don't have any past bookings."}
          </p>
          {activeTab === "upcoming" && (
            <Link
              href="/services"
              className="card-modern-button"
            >
              Book a Service
            </Link>
          )}
        </div>
      ) : (
        activeTab === "upcoming" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Service</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Date & Time</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Provider</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Price</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">{booking.service.title}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex flex-col">
                        <span>{formatDate(new Date(booking.startTime))}</span>
                        <span className="text-muted-foreground">
                          {formatTime(new Date(booking.startTime))}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
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
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="py-3 px-4 text-sm">${booking.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="text-primary hover:underline"
                        >
                          View
                        </Link>
                        {booking.status === BookingStatus.COMPLETED && (
                          <Link
                            href={`/services/${booking.serviceId}/review`}
                            className="text-primary hover:underline"
                          >
                            Review
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const startTime = new Date(booking.startTime);
  
  return (
    <div className="card-modern card-modern-hover">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={booking.status} />
            <span className="font-bold">${booking.price.toFixed(2)}</span>
          </div>
          <h3 className="font-medium text-xl line-clamp-1">{booking.service.title}</h3>
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>{formatDate(startTime)}</span>
            <span>{formatTime(startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
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
            <span className="text-sm">
              {booking.provider.displayName || `${booking.provider.firstName} ${booking.provider.lastName}`}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Link
            href={`/bookings/${booking.id}`}
            className="card-modern-button w-full"
          >
            View Details
          </Link>
          {(booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED) && (
            <Link
              href={`/bookings/${booking.id}/cancel`}
              className="card-modern-button-secondary w-full"
            >
              Cancel Booking
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  let bgColor = "";
  let textColor = "";
  
  switch (status) {
    case BookingStatus.PENDING:
      bgColor = "bg-yellow-100/70";
      textColor = "text-yellow-800";
      break;
    case BookingStatus.CONFIRMED:
      bgColor = "bg-blue-100/70";
      textColor = "text-blue-800";
      break;
    case BookingStatus.COMPLETED:
      bgColor = "bg-green-100/70";
      textColor = "text-green-800";
      break;
    case BookingStatus.CANCELLED:
      bgColor = "bg-red-100/70";
      textColor = "text-red-800";
      break;
    case BookingStatus.NO_SHOW:
      bgColor = "bg-gray-100/70";
      textColor = "text-gray-800";
      break;
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${bgColor} ${textColor} backdrop-blur-sm shadow-sm`}>
      {status}
    </span>
  );
} 