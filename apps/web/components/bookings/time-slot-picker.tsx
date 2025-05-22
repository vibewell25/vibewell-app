"use client";

import { useState, useEffect } from "react";
import { addDays, format, isSameDay, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
}

interface TimeSlotPickerProps {
  serviceId: string;
  providerId: string;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
}

export function TimeSlotPicker({ serviceId, providerId, onTimeSlotSelect }: TimeSlotPickerProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  
  // Handle previous month navigation
  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  // Handle next month navigation
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(day);
        day = addDays(day, 1);
      }
      rows.push(days);
      days = [];
    }

    return rows;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "EEE, MMM d");
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    onTimeSlotSelect(timeSlot);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === "calendar" ? "list" : "calendar");
  };

  // Generate time slots for the selected date
  useEffect(() => {
    setIsLoading(true);

    // This would be an API call in a real application
    const fetchTimeSlots = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate time slots from 9 AM to 5 PM with 1-hour intervals
        const generatedTimeSlots: TimeSlot[] = [];
        const startHour = 9; // 9 AM
        const endHour = 17; // 5 PM

        for (let hour = startHour; hour < endHour; hour++) {
          const startTime = new Date(selectedDate);
          startTime.setHours(hour, 0, 0, 0);

          const endTime = new Date(selectedDate);
          endTime.setHours(hour + 1, 0, 0, 0);

          // Randomly determine if the slot is available (70% chance of being available)
          const available = Math.random() > 0.3;

          generatedTimeSlots.push({
            id: `${providerId}-${serviceId}-${format(startTime, "yyyy-MM-dd-HH-mm")}`,
            startTime,
            endTime,
            available,
          });
        }

        setTimeSlots(generatedTimeSlots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, providerId, serviceId]);

  // Render calendar view
  const renderCalendar = () => {
    const days = generateCalendarDays();
    
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Select a Date</h3>
          <Button variant="outline" size="sm" onClick={toggleViewMode}>
            View as List
          </Button>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={prevMonth}
            variant="outline"
            size="sm"
            className="p-0 w-9 h-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          
          <Button
            onClick={nextMonth}
            variant="outline"
            size="sm"
            className="p-0 w-9 h-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-sm text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.flat().map((day, i) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isPast = day < new Date(new Date().setHours(0,0,0,0));
            
            return (
              <button
                key={i}
                onClick={() => !isPast && isCurrentMonth && handleDateSelect(day)}
                disabled={isPast || !isCurrentMonth}
                className={cn(
                  "h-10 w-full rounded-md flex items-center justify-center text-sm",
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground opacity-50",
                  isSelected ? "bg-primary text-primary-foreground" : "",
                  isToday(day) && !isSelected ? "border border-primary text-primary" : "",
                  isPast ? "text-muted-foreground opacity-50 cursor-not-allowed" : "",
                  !isPast && isCurrentMonth && !isSelected ? "hover:bg-accent" : "",
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render date list view
  const renderDateList = () => {
    // Generate dates for the next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
    
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Select a Date</h3>
          <Button variant="outline" size="sm" onClick={toggleViewMode}>
            View Calendar
          </Button>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {dates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={`px-4 py-2 rounded-md text-sm whitespace-nowrap ${
                isSameDay(date, selectedDate)
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {viewMode === "calendar" ? renderCalendar() : renderDateList()}

      <div>
        <h3 className="text-lg font-medium mb-3">Available Time Slots</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : timeSlots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.available && handleTimeSlotSelect(slot)}
                disabled={!slot.available}
                className={`px-4 py-3 rounded-md text-center ${
                  selectedTimeSlot && slot.id === selectedTimeSlot.id
                    ? "bg-primary text-primary-foreground"
                    : slot.available
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {format(slot.startTime, "h:mm a")} - {format(slot.endTime, "h:mm a")}
                {!slot.available && <div className="text-xs mt-1">(Unavailable)</div>}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No available time slots for the selected date.
          </div>
        )}
      </div>
    </div>
  );
} 