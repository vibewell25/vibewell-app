"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { BookingStatus } from "@vibewell/types";
import { sendBookingConfirmedNotifications, sendBookingCancelledNotifications } from "@/lib/notifications/booking-notifications";

interface BookingActionButtonsProps {
  bookingId: string;
  status: BookingStatus;
  startTime: Date;
  bookingDetails?: {
    serviceName: string;
    customerName: string;
    customerEmail: string;
    customerFirstName: string;
    providerName: string;
    providerEmail: string;
    providerFirstName: string;
    price: number;
    endTime: Date;
    customerId: string;
    providerId: string;
  };
}

export function BookingActionButtons({
  bookingId,
  status,
  startTime,
  bookingDetails,
}: BookingActionButtonsProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproveBooking = async () => {
    setIsProcessing(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookings")
        .update({ status: BookingStatus.CONFIRMED })
        .eq("id", bookingId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Booking approved successfully!");
      
      // Send notifications if booking details are available
      if (bookingDetails) {
        await sendBookingConfirmedNotifications(supabase, {
          bookingId,
          status: BookingStatus.CONFIRMED,
          serviceName: bookingDetails.serviceName,
          startTime,
          endTime: bookingDetails.endTime,
          price: bookingDetails.price,
          customerName: bookingDetails.customerName,
          customerEmail: bookingDetails.customerEmail,
          customerFirstName: bookingDetails.customerFirstName,
          providerName: bookingDetails.providerName,
          providerEmail: bookingDetails.providerEmail,
          providerFirstName: bookingDetails.providerFirstName,
          customerId: bookingDetails.customerId,
          providerId: bookingDetails.providerId,
        });
      }
      
      router.refresh();
    } catch (error) {
      toast.error("Failed to approve booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineBooking = async () => {
    setIsProcessing(true);
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

      toast.success("Booking declined successfully!");
      
      // Send notifications if booking details are available
      if (bookingDetails) {
        await sendBookingCancelledNotifications(supabase, {
          bookingId,
          status: BookingStatus.CANCELLED,
          serviceName: bookingDetails.serviceName,
          startTime,
          endTime: bookingDetails.endTime,
          price: bookingDetails.price,
          customerName: bookingDetails.customerName,
          customerEmail: bookingDetails.customerEmail,
          customerFirstName: bookingDetails.customerFirstName,
          providerName: bookingDetails.providerName,
          providerEmail: bookingDetails.providerEmail,
          providerFirstName: bookingDetails.providerFirstName,
          customerId: bookingDetails.customerId,
          providerId: bookingDetails.providerId,
          cancellationReason: "Declined by provider"
        }, true);
      }
      
      router.refresh();
    } catch (error) {
      toast.error("Failed to decline booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteBooking = async () => {
    setIsProcessing(true);
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
      setIsProcessing(false);
    }
  };

  const handleNoShow = async () => {
    setIsProcessing(true);
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

      toast.success("Booking marked as no-show!");
      
      // Send notifications if booking details are available
      if (bookingDetails) {
        await sendBookingCancelledNotifications(supabase, {
          bookingId,
          status: BookingStatus.NO_SHOW,
          serviceName: bookingDetails.serviceName,
          startTime,
          endTime: bookingDetails.endTime,
          price: bookingDetails.price,
          customerName: bookingDetails.customerName,
          customerEmail: bookingDetails.customerEmail,
          customerFirstName: bookingDetails.customerFirstName,
          providerName: bookingDetails.providerName,
          providerEmail: bookingDetails.providerEmail,
          providerFirstName: bookingDetails.providerFirstName,
          customerId: bookingDetails.customerId,
          providerId: bookingDetails.providerId,
          cancellationReason: "Customer did not show up"
        }, true);
      }
      
      router.refresh();
    } catch (error) {
      toast.error("Failed to update booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Check if booking can be managed
  const isPastBooking = new Date() > startTime;
  const isPending = status === BookingStatus.PENDING;
  const isConfirmed = status === BookingStatus.CONFIRMED;
  const isCompleted = status === BookingStatus.COMPLETED;
  const isCancelled = status === BookingStatus.CANCELLED || status === BookingStatus.NO_SHOW;

  // Return null if there are no actions available
  if ((isPastBooking && isCompleted) || isCancelled) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Booking Actions</h2>
      
      <div className="space-y-4">
        {isPending && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleApproveBooking}
              disabled={isProcessing}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Approve Booking"}
            </button>
            <button
              onClick={handleDeclineBooking}
              disabled={isProcessing}
              className="inline-flex h-10 items-center justify-center rounded-md border border-destructive bg-destructive/10 px-4 text-sm font-medium text-destructive shadow-sm transition-colors hover:bg-destructive/20 disabled:opacity-50"
            >
              Decline Booking
            </button>
          </div>
        )}
        
        {isConfirmed && isPastBooking && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCompleteBooking}
              disabled={isProcessing}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Mark as Completed"}
            </button>
            <button
              onClick={handleNoShow}
              disabled={isProcessing}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              Mark as No-Show
            </button>
          </div>
        )}
        
        {isConfirmed && !isPastBooking && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              This booking is confirmed. You can mark it as completed after the appointment time.
            </p>
            <button
              onClick={handleDeclineBooking}
              disabled={isProcessing}
              className="inline-flex h-10 items-center justify-center rounded-md border border-destructive bg-destructive/10 px-4 text-sm font-medium text-destructive shadow-sm transition-colors hover:bg-destructive/20 disabled:opacity-50"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 