"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@vibewell/utils";
import { BookingStatus } from "@vibewell/types";

interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  service: {
    title: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    displayName?: string;
  };
  status: BookingStatus;
}

interface CalendarViewProps {
  providerId: string;
}

export function CalendarView({ providerId }: CalendarViewProps) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay() || 7; // Convert Sunday from 0 to 7
    
    // Calculate the offset to start the calendar from Monday
    const offset = firstDayOfWeek === 1 ? 0 : firstDayOfWeek - 1;
    
    // Days from previous month
    const daysFromPrevMonth = [];
    if (offset > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthDays = prevMonth.getDate();
      
      for (let i = prevMonthDays - offset + 1; i <= prevMonthDays; i++) {
        daysFromPrevMonth.push(new Date(year, month - 1, i));
      }
    }
    
    // Days from current month
    const daysInMonth = lastDay.getDate();
    const daysFromCurrentMonth = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      daysFromCurrentMonth.push(new Date(year, month, i));
    }
    
    // Days from next month
    const totalDaysDisplayed = 42; // 6 rows of 7 days
    const daysNeededFromNextMonth = totalDaysDisplayed - daysFromPrevMonth.length - daysFromCurrentMonth.length;
    const daysFromNextMonth = [];
    
    for (let i = 1; i <= daysNeededFromNextMonth; i++) {
      daysFromNextMonth.push(new Date(year, month + 1, i));
    }
    
    return [...daysFromPrevMonth, ...daysFromCurrentMonth, ...daysFromNextMonth];
  };
  
  const calendarDays = generateCalendarDays();

  // Fetch bookings for the current month
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      
      try {
        const supabase = createClient();
        
        // Calculate the first and last day of the displayed calendar
        const firstDay = calendarDays[0];
        const lastDay = calendarDays[calendarDays.length - 1];
        
        // Add a day to lastDay to include the entire day
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + 1);
        
        // Format dates for query
        const startDateString = firstDay.toISOString();
        const endDateString = endDate.toISOString();
        
        // Fetch bookings for the date range
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id, startTime, endTime, status,
            service:services(title),
            customer:profiles!bookings_customerId_fkey(firstName, lastName, displayName)
          `)
          .eq("providerId", providerId)
          .gte("startTime", startDateString)
          .lt("startTime", endDateString)
          .not("status", "in", '("CANCELLED","NO_SHOW")');
          
        if (error) {
          throw error;
        }
        
        // Convert data to Booking type with proper date objects
        const formattedBookings = (data || []).map((booking: any) => ({
          ...booking,
          startTime: new Date(booking.startTime),
          endTime: new Date(booking.endTime),
          status: booking.status as BookingStatus,
        }));
        
        setBookings(formattedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [providerId, currentMonth]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  // Format month name
  const formatMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Handle booking click
  const handleBookingClick = (bookingId: string) => {
    router.push(`/provider/bookings/${bookingId}`);
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-md hover:bg-accent"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <h2 className="text-lg font-semibold">
          {formatMonthName(currentMonth)}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-md hover:bg-accent"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 text-center border-b">
        <div className="py-2 text-xs font-medium text-muted-foreground">Mon</div>
        <div className="py-2 text-xs font-medium text-muted-foreground">Tue</div>
        <div className="py-2 text-xs font-medium text-muted-foreground">Wed</div>
        <div className="py-2 text-xs font-medium text-muted-foreground">Thu</div>
        <div className="py-2 text-xs font-medium text-muted-foreground">Fri</div>
        <div className="py-2 text-xs font-medium text-muted-foreground">Sat</div>
        <div className="py-2 text-xs font-medium text-muted-foreground">Sun</div>
      </div>
      
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayBookings = getBookingsForDate(day);
          const hasBookings = dayBookings.length > 0;
          
          return (
            <div
              key={index}
              className={`min-h-24 p-2 border-b border-r ${
                !isCurrentMonth(day) ? "bg-muted/20" : ""
              } ${isToday(day) ? "bg-primary/5" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`inline-block rounded-full h-6 w-6 text-center leading-6 text-xs ${
                    isToday(day)
                      ? "bg-primary text-primary-foreground"
                      : !isCurrentMonth(day)
                      ? "text-muted-foreground"
                      : ""
                  }`}
                >
                  {day.getDate()}
                </span>
                
                {loading && isCurrentMonth(day) && (
                  <div className="h-2 w-2 rounded-full bg-muted animate-pulse"></div>
                )}
              </div>
              
              <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                {hasBookings &&
                  dayBookings.map((booking) => {
                    // Determine status color
                    let statusColor = "";
                    switch (booking.status) {
                      case BookingStatus.PENDING:
                        statusColor = "bg-yellow-100 border-yellow-400 text-yellow-800";
                        break;
                      case BookingStatus.CONFIRMED:
                        statusColor = "bg-blue-100 border-blue-400 text-blue-800";
                        break;
                      case BookingStatus.COMPLETED:
                        statusColor = "bg-green-100 border-green-400 text-green-800";
                        break;
                      default:
                        statusColor = "bg-gray-100 border-gray-400 text-gray-800";
                    }
                    
                    return (
                      <button
                        key={booking.id}
                        onClick={() => handleBookingClick(booking.id)}
                        className={`w-full text-left px-1 py-0.5 rounded-sm border-l-2 text-xs truncate ${statusColor}`}
                      >
                        <span className="font-medium">
                          {booking.startTime.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>{" "}
                        <span className="truncate">
                          {booking.service.title} -{" "}
                          {booking.customer.displayName ||
                            `${booking.customer.firstName} ${booking.customer.lastName}`}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 