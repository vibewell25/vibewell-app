import { SupabaseClient } from "@supabase/supabase-js";
import { BookingStatus } from "@vibewell/types";

export enum NotificationType {
  BOOKING_CREATED = "BOOKING_CREATED",
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  BOOKING_COMPLETED = "BOOKING_COMPLETED",
  BOOKING_REMINDER = "BOOKING_REMINDER",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  REVIEW_RECEIVED = "REVIEW_RECEIVED",
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: Date;
}

export interface NotificationData {
  title: string;
  message: string;
  linkUrl?: string;
}

export class NotificationService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Create a new in-app notification
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    data: NotificationData
  ): Promise<string | null> {
    try {
      const { data: notification, error } = await this.supabase
        .from("notifications")
        .insert({
          userId,
          type,
          title: data.title,
          message: data.message,
          linkUrl: data.linkUrl,
          isRead: false,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Failed to create notification:", error);
        return null;
      }

      return notification.id;
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  }

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      // Don't proceed if userId is not provided
      if (!userId) {
        console.warn("No userId provided to getUnreadNotifications");
        return [];
      }

      const { data, error } = await this.supabase
        .from("notifications")
        .select("*")
        .eq("userId", userId)
        .eq("isRead", false)
        .order("createdAt", { ascending: false });

      if (error) {
        console.error("Failed to get unread notifications:", error);
        return [];
      }

      if (!data) {
        return [];
      }

      return data.map((notification) => ({
        ...notification,
        createdAt: new Date(notification.createdAt),
      }));
    } catch (error) {
      // More detailed error logging
      console.error("Error fetching unread notifications:", 
        error instanceof Error ? error.message : "Unknown error");
      return [];
    }
  }

  /**
   * Get all notifications for a user
   */
  async getAllNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Notification[]> {
    try {
      const { data, error } = await this.supabase
        .from("notifications")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Failed to get notifications:", error);
        return [];
      }

      return data.map((notification) => ({
        ...notification,
        createdAt: new Date(notification.createdAt),
      }));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("notifications")
        .update({ isRead: true })
        .eq("id", notificationId);

      if (error) {
        console.error("Failed to mark notification as read:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("notifications")
        .update({ isRead: true })
        .eq("userId", userId)
        .eq("isRead", false);

      if (error) {
        console.error("Failed to mark all notifications as read:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  }

  /**
   * Send a booking creation notification
   */
  async sendBookingCreatedNotification(
    providerId: string,
    bookingId: string,
    serviceName: string,
    customerName: string
  ): Promise<string | null> {
    const title = "New Booking Request";
    const message = `You have a new booking request for ${serviceName} from ${customerName}.`;
    const linkUrl = `/provider/bookings/${bookingId}`;

    return this.createNotification(providerId, NotificationType.BOOKING_CREATED, {
      title,
      message,
      linkUrl,
    });
  }

  /**
   * Send a booking confirmation notification
   */
  async sendBookingConfirmedNotification(
    customerId: string,
    bookingId: string,
    serviceName: string,
    startTime: Date
  ): Promise<string | null> {
    const title = "Booking Confirmed";
    const formattedDate = startTime.toLocaleDateString();
    const formattedTime = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const message = `Your booking for ${serviceName} on ${formattedDate} at ${formattedTime} has been confirmed.`;
    const linkUrl = `/bookings/${bookingId}`;

    return this.createNotification(customerId, NotificationType.BOOKING_CONFIRMED, {
      title,
      message,
      linkUrl,
    });
  }

  /**
   * Send a booking cancellation notification
   */
  async sendBookingCancelledNotification(
    userId: string,
    bookingId: string,
    serviceName: string,
    isProvider: boolean,
    cancellationReason?: string
  ): Promise<string | null> {
    const title = "Booking Cancelled";
    const message = isProvider
      ? `Your booking for ${serviceName} has been cancelled.${
          cancellationReason ? ` Reason: ${cancellationReason}` : ""
        }`
      : `A booking for ${serviceName} has been cancelled by the customer.${
          cancellationReason ? ` Reason: ${cancellationReason}` : ""
        }`;
    const linkUrl = isProvider
      ? `/provider/bookings/${bookingId}`
      : `/bookings/${bookingId}`;

    return this.createNotification(userId, NotificationType.BOOKING_CANCELLED, {
      title,
      message,
      linkUrl,
    });
  }

  /**
   * Send a booking reminder notification
   */
  async sendBookingReminderNotification(
    customerId: string,
    bookingId: string,
    serviceName: string,
    startTime: Date
  ): Promise<string | null> {
    const title = "Appointment Reminder";
    const formattedDate = startTime.toLocaleDateString();
    const formattedTime = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const message = `Reminder: Your appointment for ${serviceName} is scheduled for ${formattedDate} at ${formattedTime}.`;
    const linkUrl = `/bookings/${bookingId}`;

    return this.createNotification(customerId, NotificationType.BOOKING_REMINDER, {
      title,
      message,
      linkUrl,
    });
  }

  /**
   * Send a payment received notification
   */
  async sendPaymentReceivedNotification(
    providerId: string,
    bookingId: string,
    serviceName: string,
    amount: number,
    customerName: string
  ): Promise<string | null> {
    const title = "Payment Received";
    const message = `You've received a payment of $${amount.toFixed(2)} for ${serviceName} from ${customerName}.`;
    const linkUrl = `/provider/bookings/${bookingId}`;

    return this.createNotification(providerId, NotificationType.PAYMENT_RECEIVED, {
      title,
      message,
      linkUrl,
    });
  }

  /**
   * Send a review received notification
   */
  async sendReviewReceivedNotification(
    providerId: string,
    serviceId: string,
    serviceName: string,
    rating: number,
    customerName: string
  ): Promise<string | null> {
    const title = "New Review";
    const message = `${customerName} left a ${rating}-star review for your service: ${serviceName}.`;
    const linkUrl = `/provider/services/${serviceId}/reviews`;

    return this.createNotification(providerId, NotificationType.REVIEW_RECEIVED, {
      title,
      message,
      linkUrl,
    });
  }
} 