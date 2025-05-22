"use client";

import { toast } from "sonner";
import { BookingStatus } from "@vibewell/types";

interface BookingNotificationProps {
  type: "created" | "confirmed" | "cancelled" | "completed" | "reminder" | "updated";
  bookingId: string;
  serviceName: string;
  date: string;
  time: string;
}

export function showBookingNotification({
  type,
  bookingId,
  serviceName,
  date,
  time,
}: BookingNotificationProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const formattedTime = time;
  
  switch (type) {
    case "created":
      toast.success("Booking Created", {
        description: `Your booking for ${serviceName} on ${formattedDate} at ${formattedTime} has been created.`,
        action: {
          label: "View",
          onClick: () => window.location.href = `/bookings/${bookingId}`,
        },
        duration: 5000,
      });
      break;
      
    case "confirmed":
      toast.success("Booking Confirmed", {
        description: `Your booking for ${serviceName} on ${formattedDate} at ${formattedTime} has been confirmed.`,
        action: {
          label: "View",
          onClick: () => window.location.href = `/bookings/${bookingId}`,
        },
        duration: 5000,
      });
      break;
      
    case "cancelled":
      toast.error("Booking Cancelled", {
        description: `Your booking for ${serviceName} on ${formattedDate} at ${formattedTime} has been cancelled.`,
        action: {
          label: "Book Again",
          onClick: () => window.location.href = `/services`,
        },
        duration: 5000,
      });
      break;
      
    case "completed":
      toast.success("Booking Completed", {
        description: `Your booking for ${serviceName} has been completed. We'd love to hear your feedback!`,
        action: {
          label: "Leave Review",
          onClick: () => window.location.href = `/bookings/${bookingId}/review`,
        },
        duration: 8000,
      });
      break;
      
    case "reminder":
      toast.info("Booking Reminder", {
        description: `Reminder: Your booking for ${serviceName} is scheduled for ${formattedDate} at ${formattedTime}.`,
        action: {
          label: "View",
          onClick: () => window.location.href = `/bookings/${bookingId}`,
        },
        duration: 10000,
      });
      break;
      
    case "updated":
      toast.info("Booking Updated", {
        description: `Your booking for ${serviceName} has been updated to ${formattedDate} at ${formattedTime}.`,
        action: {
          label: "View",
          onClick: () => window.location.href = `/bookings/${bookingId}`,
        },
        duration: 5000,
      });
      break;
      
    default:
      break;
  }
}

/**
 * Shows a toast notification based on the booking status change
 */
export function showBookingStatusNotification(
  status: BookingStatus,
  bookingId: string,
  serviceName: string,
  date: string,
  time: string
) {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  switch (status) {
    case BookingStatus.CONFIRMED:
      toast.success(
        `Your booking for ${serviceName} on ${formattedDate} at ${time} has been confirmed.`,
        {
          description: "Check your email for details.",
          action: {
            label: "View",
            onClick: () => window.location.href = `/bookings/${bookingId}`,
          },
        }
      );
      break;

    case BookingStatus.CANCELLED:
      toast.error(
        `Your booking for ${serviceName} on ${formattedDate} has been cancelled.`,
        {
          description: "You may book another time slot if needed.",
          action: {
            label: "Book Again",
            onClick: () => window.location.href = `/services`,
          },
        }
      );
      break;

    case BookingStatus.COMPLETED:
      toast.success(
        `Your booking for ${serviceName} has been marked as completed.`,
        {
          description: "We hope you enjoyed your session!",
          action: {
            label: "Leave Review",
            onClick: () => window.location.href = `/services/${bookingId}/review`,
          },
        }
      );
      break;

    case BookingStatus.PENDING:
      toast.info(
        `Your booking for ${serviceName} is pending confirmation.`,
        {
          description: "The provider will confirm your booking soon.",
          action: {
            label: "View",
            onClick: () => window.location.href = `/bookings/${bookingId}`,
          },
        }
      );
      break;

    case BookingStatus.NO_SHOW:
      toast.error(
        `You were marked as no-show for ${serviceName} on ${formattedDate}.`,
        {
          description: "Please contact customer support if this was a mistake.",
          action: {
            label: "Support",
            onClick: () => window.location.href = `/help`,
          },
        }
      );
      break;

    default:
      toast.info(
        `Your booking status for ${serviceName} has been updated.`,
        {
          description: "Check your bookings for more details.",
          action: {
            label: "View",
            onClick: () => window.location.href = `/bookings/${bookingId}`,
          },
        }
      );
  }
} 