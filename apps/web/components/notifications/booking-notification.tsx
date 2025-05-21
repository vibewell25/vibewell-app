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

export function showBookingStatusNotification(
  status: BookingStatus,
  bookingId: string,
  serviceName: string,
  date: string,
  time: string
) {
  switch (status) {
    case BookingStatus.CONFIRMED:
      showBookingNotification({
        type: "confirmed",
        bookingId,
        serviceName,
        date,
        time,
      });
      break;
    case BookingStatus.COMPLETED:
      showBookingNotification({
        type: "completed",
        bookingId,
        serviceName,
        date,
        time,
      });
      break;
    case BookingStatus.CANCELLED:
      showBookingNotification({
        type: "cancelled",
        bookingId,
        serviceName,
        date,
        time,
      });
      break;
    default:
      break;
  }
} 