"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatTime, formatCurrency } from "@vibewell/utils";
import { BookingStatus } from "@vibewell/types";
import { Avatar } from "@vibewell/ui";
import { sendBookingConfirmedNotifications, sendBookingCancelledNotifications } from "@/lib/notifications/booking-notifications";

interface Booking {
  id: string;
  status: BookingStatus;
  startTime: Date;
  endTime: Date;
  price: number;
  providerId: string;
  service: {
    id: string;
    title: string;
    price: number;
    duration: number;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    avatarUrl?: string;
    email: string;
    phone?: string;
  };
  cancellationReason?: string;
}

interface BookingsTabsProps {
  pendingBookings: Booking[];
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  cancelledBookings: Booking[];
}

export function BookingsTabs({
  pendingBookings,
  upcomingBookings,
  pastBookings,
  cancelledBookings,
}: BookingsTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pending" | "upcoming" | "past" | "cancelled">("pending");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleTabChange = (tab: "pending" | "upcoming" | "past" | "cancelled") => {
    setActiveTab(tab);
  };

  const handleApproveBooking = async (bookingId: string) => {
    setIsProcessing(bookingId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookings")
        .update({ status: BookingStatus.CONFIRMED })
        .eq("id", bookingId);

      if (error) {
        throw new Error(error.message);
      }

      // Find the booking that was just approved
      const booking = pendingBookings.find(b => b.id === bookingId);
      
      if (booking) {
        // Get provider profile
        const { data: providerProfile } = await supabase
          .from("profiles")
          .select("id, firstName, lastName, displayName, email")
          .eq("id", booking.providerId)
          .single();
          
        if (providerProfile) {
          // Send notifications
          await sendBookingConfirmedNotifications(supabase, {
            bookingId: booking.id,
            status: BookingStatus.CONFIRMED,
            serviceName: booking.service.title,
            startTime: booking.startTime,
            endTime: booking.endTime,
            price: booking.price,
            customerName: booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`,
            customerEmail: booking.customer.email,
            customerFirstName: booking.customer.firstName,
            providerName: providerProfile.displayName || `${providerProfile.firstName} ${providerProfile.lastName}`,
            providerEmail: providerProfile.email,
            providerFirstName: providerProfile.firstName,
            customerId: booking.customer.id,
            providerId: booking.providerId,
          });
        }
      }

      toast.success("Booking approved successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to approve booking. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    setIsProcessing(bookingId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookings")
        .update({ 
          status: BookingStatus.CANCELLED,
          cancellationReason: "Declined by provider"
        })
        .eq("id", bookingId);

      if (error) {
        throw new Error(error.message);
      }
      
      // Find the booking that was just declined
      const booking = pendingBookings.find(b => b.id === bookingId);
      
      if (booking) {
        // Get provider profile
        const { data: providerProfile } = await supabase
          .from("profiles")
          .select("id, firstName, lastName, displayName, email")
          .eq("id", booking.providerId)
          .single();
          
        if (providerProfile) {
          // Send notifications
          await sendBookingCancelledNotifications(supabase, {
            bookingId: booking.id,
            status: BookingStatus.CANCELLED,
            serviceName: booking.service.title,
            startTime: booking.startTime,
            endTime: booking.endTime,
            price: booking.price,
            customerName: booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`,
            customerEmail: booking.customer.email,
            customerFirstName: booking.customer.firstName,
            providerName: providerProfile.displayName || `${providerProfile.firstName} ${providerProfile.lastName}`,
            providerEmail: providerProfile.email,
            providerFirstName: providerProfile.firstName,
            customerId: booking.customer.id,
            providerId: booking.providerId,
            cancellationReason: "Declined by provider"
          }, true);
        }
      }

      toast.success("Booking declined successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to decline booking. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    setIsProcessing(bookingId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookings")
        .update({ status: BookingStatus.COMPLETED })
        .eq("id", bookingId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Booking marked as completed!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update booking. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleNoShow = async (bookingId: string) => {
    setIsProcessing(bookingId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookings")
        .update({ 
          status: BookingStatus.NO_SHOW,
          cancellationReason: "Customer did not show up"
        })
        .eq("id", bookingId);

      if (error) {
        throw new Error(error.message);
      }
      
      // Find the booking
      const booking = pastBookings.find(b => b.id === bookingId);
      
      if (booking) {
        // Get provider profile
        const { data: providerProfile } = await supabase
          .from("profiles")
          .select("id, firstName, lastName, displayName, email")
          .eq("id", booking.providerId)
          .single();
          
        if (providerProfile) {
          // Send notifications
          await sendBookingCancelledNotifications(supabase, {
            bookingId: booking.id,
            status: BookingStatus.NO_SHOW,
            serviceName: booking.service.title,
            startTime: booking.startTime,
            endTime: booking.endTime,
            price: booking.price,
            customerName: booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`,
            customerEmail: booking.customer.email,
            customerFirstName: booking.customer.firstName,
            providerName: providerProfile.displayName || `${providerProfile.firstName} ${providerProfile.lastName}`,
            providerEmail: providerProfile.email,
            providerFirstName: providerProfile.firstName,
            customerId: booking.customer.id,
            providerId: booking.providerId,
            cancellationReason: "Customer did not show up"
          }, true);
        }
      }

      toast.success("Booking marked as no-show!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update booking. Please try again.");
    } finally {
      setIsProcessing(null);
    }
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
    <div>
      <div className="border-b mb-6">
        <div className="flex -mb-px">
          <button
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === "pending"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleTabChange("pending")}
          >
            Pending ({pendingBookings.length})
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === "upcoming"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleTabChange("upcoming")}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === "past"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleTabChange("past")}
          >
            Past ({pastBookings.length})
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === "cancelled"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleTabChange("cancelled")}
          >
            Cancelled ({cancelledBookings.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === "pending" && (
          <>
            {pendingBookings.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">No pending bookings.</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium">{booking.service.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                        <div className="mt-3 flex items-center">
                          <Avatar 
                            src={booking.customer.avatarUrl} 
                            initials={`${booking.customer.firstName[0]}${booking.customer.lastName[0]}`}
                            size="sm"
                          />
                          <div className="ml-2">
                            <p className="text-sm font-medium">
                              {booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.customer.phone ? booking.customer.phone : booking.customer.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="text-right mb-2">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium">{formatCurrency(booking.price)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveBooking(booking.id)}
                            disabled={isProcessing === booking.id}
                            className="flex-1 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                          >
                            {isProcessing === booking.id ? "Processing..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleDeclineBooking(booking.id)}
                            disabled={isProcessing === booking.id}
                            className="flex-1 inline-flex h-9 items-center justify-center rounded-md border border-destructive bg-destructive/10 px-4 text-sm font-medium text-destructive shadow-sm transition-colors hover:bg-destructive/20 disabled:opacity-50"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "upcoming" && (
          <>
            {upcomingBookings.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">No upcoming bookings.</p>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium">{booking.service.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                        <div className="mt-3 flex items-center">
                          <Avatar 
                            src={booking.customer.avatarUrl} 
                            initials={`${booking.customer.firstName[0]}${booking.customer.lastName[0]}`}
                            size="sm"
                          />
                          <div className="ml-2">
                            <p className="text-sm font-medium">
                              {booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.customer.phone ? booking.customer.phone : booking.customer.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="text-right mb-2">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium">{formatCurrency(booking.price)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/provider/bookings/${booking.id}`}
                            className="flex-1 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "past" && (
          <>
            {pastBookings.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">No past bookings.</p>
              </div>
            ) : (
              pastBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium">{booking.service.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                        <div className="mt-3 flex items-center">
                          <Avatar 
                            src={booking.customer.avatarUrl} 
                            initials={`${booking.customer.firstName[0]}${booking.customer.lastName[0]}`}
                            size="sm"
                          />
                          <div className="ml-2">
                            <p className="text-sm font-medium">
                              {booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.customer.phone ? booking.customer.phone : booking.customer.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="text-right mb-2">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium">{formatCurrency(booking.price)}</p>
                        </div>
                        <div className="flex gap-2">
                          {booking.status !== BookingStatus.COMPLETED && (
                            <button
                              onClick={() => handleCompleteBooking(booking.id)}
                              disabled={isProcessing === booking.id}
                              className="flex-1 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                            >
                              {isProcessing === booking.id ? "Processing..." : "Mark Completed"}
                            </button>
                          )}
                          {booking.status !== BookingStatus.NO_SHOW && booking.status !== BookingStatus.COMPLETED && (
                            <button
                              onClick={() => handleNoShow(booking.id)}
                              disabled={isProcessing === booking.id}
                              className="flex-1 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                            >
                              No Show
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "cancelled" && (
          <>
            {cancelledBookings.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">No cancelled bookings.</p>
              </div>
            ) : (
              cancelledBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium">{booking.service.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                        <div className="mt-3 flex items-center">
                          <Avatar 
                            src={booking.customer.avatarUrl} 
                            initials={`${booking.customer.firstName[0]}${booking.customer.lastName[0]}`}
                            size="sm"
                          />
                          <div className="ml-2">
                            <p className="text-sm font-medium">
                              {booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.customer.phone ? booking.customer.phone : booking.customer.email}
                            </p>
                          </div>
                        </div>
                        {booking.cancellationReason && (
                          <div className="mt-4">
                            <p className="text-sm font-medium">Cancellation Reason:</p>
                            <p className="text-sm text-muted-foreground">{booking.cancellationReason}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="text-right mb-2">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium">{formatCurrency(booking.price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
} 