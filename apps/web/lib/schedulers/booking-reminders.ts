import { createClient } from "@supabase/supabase-js";
import { BookingStatus } from "@vibewell/types";
import { sendBookingReminderNotifications } from "../notifications/booking-notifications";

interface SchedulerConfig {
  supabaseUrl: string;
  supabaseServiceKey: string;
  reminderHours: number;
}

interface BookingWithRelations {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  notes?: string;
  service: {
    id: string;
    title: string;
  };
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    email: string;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    email: string;
  };
}

/**
 * Scheduled function to send booking reminders to customers
 * This would be called by a scheduler (e.g. Vercel Cron Jobs or AWS Lambda)
 */
export async function sendBookingReminders(config: SchedulerConfig): Promise<{ processed: number }> {
  const { supabaseUrl, supabaseServiceKey, reminderHours = 24 } = config;
  
  // Initialize Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Calculate date range for upcoming bookings
  const now = new Date();
  const reminderStartTime = new Date(now.getTime() + (reminderHours - 1) * 60 * 60 * 1000); // ~23 hours ahead
  const reminderEndTime = new Date(now.getTime() + (reminderHours + 1) * 60 * 60 * 1000);   // ~25 hours ahead
  
  // Format dates for query
  const startTimeStr = reminderStartTime.toISOString();
  const endTimeStr = reminderEndTime.toISOString();
  
  try {
    // Get confirmed bookings that start in the target time window
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        id, startTime, endTime, price, notes,
        service:services(id, title),
        provider:profiles!bookings_providerId_fkey(id, firstName, lastName, displayName, email),
        customer:profiles!bookings_customerId_fkey(id, firstName, lastName, displayName, email)
      `)
      .eq("status", BookingStatus.CONFIRMED)
      .gte("startTime", startTimeStr)
      .lt("startTime", endTimeStr);
    
    if (error) {
      console.error("Error fetching bookings for reminders:", error);
      throw error;
    }
    
    // Process each booking and send reminders
    const processedBookings: string[] = [];
    
    for (const booking of bookings || []) {
      try {
        // Cast booking to any to handle the complex nested structure
        const typedBooking = booking as any;
        
        // Format data for notification
        const customerName = typedBooking.customer.displayName || 
          `${typedBooking.customer.firstName} ${typedBooking.customer.lastName}`;
        const providerName = typedBooking.provider.displayName || 
          `${typedBooking.provider.firstName} ${typedBooking.provider.lastName}`;
          
        // Send notifications
        await sendBookingReminderNotifications(supabase, {
          bookingId: typedBooking.id,
          serviceName: typedBooking.service.title,
          startTime: new Date(typedBooking.startTime),
          endTime: new Date(typedBooking.endTime),
          price: typedBooking.price,
          status: BookingStatus.CONFIRMED,
          providerId: typedBooking.provider.id,
          customerId: typedBooking.customer.id,
          customerName,
          providerName,
          customerEmail: typedBooking.customer.email,
          providerEmail: typedBooking.provider.email,
          customerFirstName: typedBooking.customer.firstName,
          providerFirstName: typedBooking.provider.firstName,
          notes: typedBooking.notes,
        });
        
        processedBookings.push(typedBooking.id);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (bookingError) {
        console.error(`Error processing reminder for booking ${(booking as any).id}:`, bookingError);
        // Continue with next booking
      }
    }
    
    console.log(`Successfully sent ${processedBookings.length} booking reminders`);
    return { processed: processedBookings.length };
    
  } catch (error) {
    console.error("Failed to send booking reminders:", error);
    throw error;
  }
} 