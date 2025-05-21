"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { showBookingStatusNotification } from "./booking-notification";
import { BookingStatus } from "@vibewell/types";

interface BookingListenerProps {
  userId: string;
}

export function BookingListener({ userId }: BookingListenerProps) {
  useEffect(() => {
    const supabase = createClient();
    
    // Subscribe to changes on the bookings table for this user
    const channel = supabase
      .channel(`bookings_for_user_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `customerId=eq.${userId}`,
        },
        (payload) => {
          const { new: newBooking, old: oldBooking } = payload;
          
          // Only show notifications when status changes
          if (newBooking.status !== oldBooking.status) {
            // Fetch the service details to get the name
            supabase
              .from('services')
              .select('title')
              .eq('id', newBooking.serviceId)
              .single()
              .then(({ data: service }) => {
                if (service) {
                  const startTime = new Date(newBooking.startTime);
                  const date = startTime.toISOString();
                  const time = startTime.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  });
                  
                  showBookingStatusNotification(
                    newBooking.status as BookingStatus,
                    newBooking.id,
                    service.title,
                    date,
                    time
                  );
                }
              });
          }
        }
      )
      .subscribe();

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // This component doesn't render anything
  return null;
} 