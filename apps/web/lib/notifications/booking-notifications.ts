import { SupabaseClient } from "@supabase/supabase-js";
import { BookingStatus } from "@vibewell/types";
import { NotificationService } from "./notification-service";
import { EmailService } from "./email-service";

interface BookingNotificationData {
  bookingId: string;
  customerId: string;
  providerId: string;
  serviceName: string;
  startTime: Date;
  endTime: Date;
  price: number;
  customerName: string;
  providerName: string;
  customerEmail: string;
  providerEmail: string;
  providerFirstName: string;
  customerFirstName: string;
  status: BookingStatus;
  notes?: string;
  cancellationReason?: string;
}

/**
 * Helper module to send booking-related notifications using both
 * the notification service and email service
 */
export async function sendBookingCreatedNotifications(
  supabase: SupabaseClient, 
  data: BookingNotificationData
): Promise<void> {
  try {
    // Create notification service
    const notificationService = new NotificationService(supabase);
    
    // Send in-app notification to provider
    await notificationService.sendBookingCreatedNotification(
      data.providerId,
      data.bookingId,
      data.serviceName,
      data.customerName
    );
    
    // Send email notification to provider
    await EmailService.sendNewBookingNotificationToProvider({
      id: data.bookingId,
      status: data.status,
      serviceName: data.serviceName,
      startTime: data.startTime,
      endTime: data.endTime,
      price: data.price,
      customer: {
        firstName: data.customerFirstName,
        lastName: data.customerName.split(' ')[1] || '',
        email: data.customerEmail,
      },
      provider: {
        firstName: data.providerFirstName,
        lastName: data.providerName.split(' ')[1] || '',
        email: data.providerEmail,
      },
      notes: data.notes,
    });
  } catch (error) {
    console.error("Error sending booking created notifications:", error);
  }
}

export async function sendBookingConfirmedNotifications(
  supabase: SupabaseClient, 
  data: BookingNotificationData
): Promise<void> {
  try {
    // Create notification service
    const notificationService = new NotificationService(supabase);
    
    // Send in-app notification to customer
    await notificationService.sendBookingConfirmedNotification(
      data.customerId,
      data.bookingId,
      data.serviceName,
      data.startTime
    );
    
    // Send email notification to customer
    await EmailService.sendBookingConfirmationEmail({
      id: data.bookingId,
      status: data.status,
      serviceName: data.serviceName,
      startTime: data.startTime,
      endTime: data.endTime,
      price: data.price,
      customer: {
        firstName: data.customerFirstName,
        lastName: data.customerName.split(' ')[1] || '',
        email: data.customerEmail,
      },
      provider: {
        firstName: data.providerFirstName,
        lastName: data.providerName.split(' ')[1] || '',
        email: data.providerEmail,
      },
      notes: data.notes,
    });
  } catch (error) {
    console.error("Error sending booking confirmed notifications:", error);
  }
}

export async function sendBookingCancelledNotifications(
  supabase: SupabaseClient, 
  data: BookingNotificationData,
  cancelledByProvider: boolean
): Promise<void> {
  try {
    // Create notification service
    const notificationService = new NotificationService(supabase);
    
    if (cancelledByProvider) {
      // Send in-app notification to customer
      await notificationService.sendBookingCancelledNotification(
        data.customerId,
        data.bookingId,
        data.serviceName,
        false,
        data.cancellationReason
      );
    } else {
      // Send in-app notification to provider
      await notificationService.sendBookingCancelledNotification(
        data.providerId,
        data.bookingId,
        data.serviceName,
        true,
        data.cancellationReason
      );
    }
    
    // Send email notification to customer
    await EmailService.sendBookingCancellationEmail({
      id: data.bookingId,
      status: data.status,
      serviceName: data.serviceName,
      startTime: data.startTime,
      endTime: data.endTime,
      price: data.price,
      customer: {
        firstName: data.customerFirstName,
        lastName: data.customerName.split(' ')[1] || '',
        email: data.customerEmail,
      },
      provider: {
        firstName: data.providerFirstName,
        lastName: data.providerName.split(' ')[1] || '',
        email: data.providerEmail,
      },
      cancellationReason: data.cancellationReason,
    });
  } catch (error) {
    console.error("Error sending booking cancelled notifications:", error);
  }
}

export async function sendBookingReminderNotifications(
  supabase: SupabaseClient, 
  data: BookingNotificationData
): Promise<void> {
  try {
    // Create notification service
    const notificationService = new NotificationService(supabase);
    
    // Send in-app notification to customer
    await notificationService.sendBookingReminderNotification(
      data.customerId,
      data.bookingId,
      data.serviceName,
      data.startTime
    );
    
    // Send email notification to customer
    await EmailService.sendBookingReminderEmail({
      id: data.bookingId,
      status: data.status,
      serviceName: data.serviceName,
      startTime: data.startTime,
      endTime: data.endTime,
      price: data.price,
      customer: {
        firstName: data.customerFirstName,
        lastName: data.customerName.split(' ')[1] || '',
        email: data.customerEmail,
      },
      provider: {
        firstName: data.providerFirstName,
        lastName: data.providerName.split(' ')[1] || '',
        email: data.providerEmail,
      },
    });
  } catch (error) {
    console.error("Error sending booking reminder notifications:", error);
  }
} 