"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatDate } from "@vibewell/utils";
import { createClient } from "@/lib/supabase/client";

interface TimeSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

interface BookingCalendarProps {
  serviceId: string;
  providerId: string;
  serviceDuration: number; // in minutes
  onTimeSlotSelect: (startTime: Date, endTime: Date) => void;
  selectedDate?: Date;
  selectedTimeSlot?: { startTime: Date; endTime: Date };
}

export function BookingCalendar({
  serviceId,
  providerId,
  serviceDuration,
  onTimeSlotSelect,
  selectedDate: initialSelectedDate,
  selectedTimeSlot,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialSelectedDate || new Date()
  );
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [providerAvailability, setProviderAvailability] = useState<{
    workingHours: { [day: string]: { start: string; end: string } };
  } | null>(null);

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

  // Check if date is selectable (not in the past)
  const isSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  // Check if date is selected
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Check if date has available slots
  const hasAvailableSlots = (date: Date) => {
    // This would typically be implemented with a backend query
    // For now, we'll assume all future dates might have availability
    return isSelectable(date);
  };

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

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (!isSelectable(date)) return;
    
    // Clone the date to avoid reference issues
    const selectedDay = new Date(date);
    setSelectedDate(selectedDay);
    
    // Reset time slots when date changes
    fetchAvailableTimeSlots(selectedDay);
  };

  // Format month name
  const formatMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Generate time slots for the selected date
  const generateTimeSlots = (
    date: Date,
    workingHours: { start: string; end: string },
    existingBookings: { startTime: string; endTime: string }[]
  ) => {
    const slots: TimeSlot[] = [];
    
    // Get day's working hours
    const [startHour, startMinute] = workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end.split(':').map(Number);
    
    // Start time
    const startTime = new Date(date);
    startTime.setHours(startHour, startMinute, 0, 0);
    
    // End time
    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0, 0);
    
    // If the date is today, start from the current time (rounded up to next slot)
    const now = new Date();
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Round up to nearest 30 minutes
      if (currentMinute > 30) {
        startTime.setHours(currentHour + 1, 0, 0, 0);
      } else if (currentMinute > 0) {
        startTime.setHours(currentHour, 30, 0, 0);
      }
      
      // If we've rounded past the end time, no slots are available
      if (startTime >= endTime) {
        return [];
      }
    }
    
    // Generate 30-minute slots
    const slotDurationInMinutes = 30;
    const serviceSlots = Math.ceil(serviceDuration / slotDurationInMinutes);
    
    let currentSlotStart = new Date(startTime);
    
    while (currentSlotStart < endTime) {
      // Calculate end time for this slot based on service duration
      const slotEnd = new Date(currentSlotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + serviceDuration);
      
      // Skip this slot if it would extend beyond working hours
      if (slotEnd > endTime) break;
      
      // Check if the slot overlaps with any existing booking
      const isOverlapping = existingBookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        
        // Check if there is an overlap
        return (
          (currentSlotStart >= bookingStart && currentSlotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (currentSlotStart <= bookingStart && slotEnd >= bookingEnd)
        );
      });
      
      // Add the slot if it doesn't overlap
      slots.push({
        startTime: new Date(currentSlotStart),
        endTime: new Date(slotEnd),
        available: !isOverlapping,
      });
      
      // Move to the next slot
      currentSlotStart.setMinutes(currentSlotStart.getMinutes() + slotDurationInMinutes);
    }
    
    return slots;
  };

  // Fetch provider's working hours
  useEffect(() => {
    const fetchProviderWorkingHours = async () => {
      try {
        const supabase = createClient();
        
        // In a real app, this would fetch from a working_hours table
        // For now, we'll use mock data
        
        // Mock working hours (9 AM to 5 PM weekdays, 10 AM to 3 PM weekends)
        const mockWorkingHours = {
          workingHours: {
            '1': { start: '09:00', end: '17:00' }, // Monday
            '2': { start: '09:00', end: '17:00' }, // Tuesday
            '3': { start: '09:00', end: '17:00' }, // Wednesday
            '4': { start: '09:00', end: '17:00' }, // Thursday
            '5': { start: '09:00', end: '17:00' }, // Friday
            '6': { start: '10:00', end: '15:00' }, // Saturday
            '7': { start: '10:00', end: '15:00' }, // Sunday
          },
        };
        
        setProviderAvailability(mockWorkingHours);
      } catch (error) {
        console.error('Error fetching provider working hours:', error);
      }
    };
    
    fetchProviderWorkingHours();
  }, [providerId]);

  // Fetch available time slots for the selected date
  const fetchAvailableTimeSlots = async (date: Date) => {
    if (!date || !providerAvailability) return;
    
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      
      // Get day of week (1-7, where 1 is Monday)
      const dayOfWeek = date.getDay() || 7;
      
      // Get working hours for this day
      const workingHours = providerAvailability.workingHours[dayOfWeek.toString()];
      
      if (!workingHours) {
        // Provider doesn't work on this day
        setAvailableTimeSlots([]);
        setIsLoading(false);
        return;
      }
      
      // Format date for query
      const formattedDate = date.toISOString().split('T')[0];
      
      // Fetch bookings for this provider on the selected date
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('startTime, endTime')
        .eq('providerId', providerId)
        .gte('startTime', `${formattedDate}T00:00:00`)
        .lt('startTime', `${formattedDate}T23:59:59`)
        .not('status', 'in', '("CANCELLED","NO_SHOW")');
      
      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }
      
      // Generate available time slots
      const timeSlots = generateTimeSlots(date, workingHours, bookings || []);
      setAvailableTimeSlots(timeSlots);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch time slots when selected date changes
  useEffect(() => {
    if (selectedDate && providerAvailability) {
      fetchAvailableTimeSlots(selectedDate);
    }
  }, [selectedDate, providerAvailability]);

  // Format time display
  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Check if a time slot is selected
  const isTimeSlotSelected = (slot: TimeSlot) => {
    if (!selectedTimeSlot) return false;
    
    return (
      slot.startTime.getTime() === selectedTimeSlot.startTime.getTime() &&
      slot.endTime.getTime() === selectedTimeSlot.endTime.getTime()
    );
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    onTimeSlotSelect(slot.startTime, slot.endTime);
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <div className="bg-card p-4 border-b flex items-center justify-between">
          <button
            type="button"
            onClick={goToPreviousMonth}
            disabled={
              currentMonth.getFullYear() === new Date().getFullYear() &&
              currentMonth.getMonth() <= new Date().getMonth()
            }
            className="p-2 rounded-md hover:bg-accent disabled:opacity-50"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-lg font-semibold">
            {formatMonthName(currentMonth)}
          </h2>
          
          <button
            type="button"
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-accent"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="bg-card">
          <div className="grid grid-cols-7 text-center border-b">
            <div className="py-2 text-xs font-medium text-muted-foreground">Mon</div>
            <div className="py-2 text-xs font-medium text-muted-foreground">Tue</div>
            <div className="py-2 text-xs font-medium text-muted-foreground">Wed</div>
            <div className="py-2 text-xs font-medium text-muted-foreground">Thu</div>
            <div className="py-2 text-xs font-medium text-muted-foreground">Fri</div>
            <div className="py-2 text-xs font-medium text-muted-foreground">Sat</div>
            <div className="py-2 text-xs font-medium text-muted-foreground">Sun</div>
          </div>
          
          <div className="grid grid-cols-7 text-sm">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day)}
                disabled={!isSelectable(day)}
                className={`aspect-square flex items-center justify-center p-2 ${
                  !isCurrentMonth(day)
                    ? "text-muted-foreground opacity-50"
                    : isSelectable(day)
                    ? "hover:bg-accent"
                    : "text-muted-foreground opacity-50"
                } ${isToday(day) ? "bg-accent/50" : ""} ${
                  isDateSelected(day) ? "bg-primary text-primary-foreground" : ""
                } ${
                  hasAvailableSlots(day) && isCurrentMonth(day) && isSelectable(day) && !isDateSelected(day)
                    ? "font-medium"
                    : ""
                }`}
                aria-label={day.toLocaleDateString()}
              >
                {day.getDate()}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Time slots */}
      {selectedDate && (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <div className="bg-card p-4 border-b">
            <h3 className="font-semibold">
              Available Times for {formatDate(selectedDate)}
            </h3>
          </div>
          
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {availableTimeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSlotSelect(slot)}
                    disabled={!slot.available}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      !slot.available
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : isTimeSlotSelected(slot)
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent hover:bg-accent/80"
                    }`}
                  >
                    {formatTimeDisplay(slot.startTime)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>
                  {providerAvailability?.workingHours[
                    (selectedDate.getDay() || 7).toString()
                  ]
                    ? "No available time slots for this date."
                    : "Provider is not available on this day."}
                </p>
                <p className="text-sm mt-2">Please select another date.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 