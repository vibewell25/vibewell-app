"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { showBookingNotification } from "./booking-notification";
import { BookingStatus } from "@vibewell/types";

interface BookingReminderProps {
  userId: string;
}

export function BookingReminder({ userId }: BookingReminderProps) {
  const [checkedToday, setCheckedToday] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    // Function to check for upcoming bookings that need reminders
    const checkUpcomingBookings = async () => {
      // Current date
      const today = new Date();
      
      // Tomorrow's date (24 hours from now)
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      // Format dates for the database query
      const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();
      const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString();
      
      // Fetch bookings for tomorrow
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`
          id,
          startTime,
          service:services(title),
          provider:profiles(firstName, lastName, displayName)
        `)
        .eq("customerId", userId)
        .eq("status", BookingStatus.CONFIRMED)
        .gte("startTime", tomorrowStart)
        .lte("startTime", tomorrowEnd);
      
      if (bookings && bookings.length > 0) {
        // Send reminders for each booking
        bookings.forEach(booking => {
          const startTime = new Date(booking.startTime);
          const time = startTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });
          
          showBookingNotification({
            type: "reminder",
            bookingId: booking.id,
            serviceName: booking.service.title,
            date: booking.startTime,
            time: time,
          });
        });
      }
      
      // Mark as checked for today
      setCheckedToday(true);
      
      // Store the last checked date in local storage
      localStorage.setItem('lastReminderCheck', today.toDateString());
    };
    
    // Check if we've already checked today
    const lastCheck = localStorage.getItem('lastReminderCheck');
    const today = new Date().toDateString();
    
    if (!checkedToday && lastCheck !== today) {
      checkUpcomingBookings();
    }
    
    // Check again every 12 hours (in milliseconds)
    const checkInterval = 12 * 60 * 60 * 1000;
    const intervalId = setInterval(() => {
      const lastCheck = localStorage.getItem('lastReminderCheck');
      const today = new Date().toDateString();
      
      if (lastCheck !== today) {
        checkUpcomingBookings();
      }
    }, checkInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [userId, checkedToday]);
  
  return null;
} 