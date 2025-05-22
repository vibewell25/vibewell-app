"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon 
} from "lucide-react";
import { BookingStatus } from "@vibewell/types";
import { formatTime } from "@vibewell/utils";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";

interface CalendarBooking {
  id: string;
  status: BookingStatus;
  startTime: Date;
  endTime: Date;
  price: number;
  service: {
    id: string;
    title: string;
    duration: number;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
  };
}

interface ScheduleCalendarProps {
  bookings: CalendarBooking[];
}

export function ScheduleCalendar({ bookings }: ScheduleCalendarProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Get the last day of the current month
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Calculate the number of days to show from the previous month
  const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  // Calculate the first day to show in the calendar (might be from the previous month)
  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(calendarStart.getDate() - daysFromPrevMonth);
  
  // Calculate the number of days to show in the calendar (42 = 6 weeks)
  const totalDays = 42;
  
  // Calculate all the days to show in the calendar
  const calendarDays = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(calendarStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Group bookings by date
  const bookingsByDate = bookings.reduce((acc, booking) => {
    const dateKey = booking.startTime.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(booking);
    return acc;
  }, {} as Record<string, CalendarBooking[]>);

  // Handle navigation
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if a date is in the current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous month</span>
          </button>
          <h2 className="text-lg font-semibold">
            {formatMonthYear(currentDate)}
          </h2>
          <button
            onClick={goToNextMonth}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next month</span>
          </button>
        </div>
        <div>
          <button
            onClick={goToToday}
            className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-xs font-medium text-muted-foreground">
        <div className="py-3 text-center">Mon</div>
        <div className="py-3 text-center">Tue</div>
        <div className="py-3 text-center">Wed</div>
        <div className="py-3 text-center">Thu</div>
        <div className="py-3 text-center">Fri</div>
        <div className="py-3 text-center">Sat</div>
        <div className="py-3 text-center">Sun</div>
      </div>

      <div className="grid grid-cols-7 h-[600px] text-sm">
        {calendarDays.map((date, index) => {
          const dateKey = date.toDateString();
          const dayBookings = bookingsByDate[dateKey] || [];
          
          return (
            <div
              key={index}
              className={`min-h-[100px] border-t border-r p-2 relative ${
                isCurrentMonth(date) ? "bg-background" : "bg-muted/30"
              } ${isToday(date) ? "bg-primary/5" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isToday(date)
                      ? "bg-primary text-primary-foreground"
                      : isCurrentMonth(date)
                      ? ""
                      : "text-muted-foreground"
                  }`}
                >
                  {date.getDate()}
                </span>
                {dayBookings.length > 0 && (
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-1 rounded">
                    {dayBookings.length}
                  </span>
                )}
              </div>
              
              <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto pr-1">
                {dayBookings.slice(0, 3).map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/provider/bookings/${booking.id}`}
                    className="block text-xs rounded p-1 hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate font-medium">
                        {formatTime(booking.startTime)}
                      </span>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    <div className="truncate">{booking.service.title}</div>
                    <div className="truncate text-muted-foreground">
                      {booking.customer.displayName || `${booking.customer.firstName} ${booking.customer.lastName}`}
                    </div>
                  </Link>
                ))}
                
                {dayBookings.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground pt-1">
                    +{dayBookings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 