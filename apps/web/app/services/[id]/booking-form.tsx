"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Service } from "@vibewell/types";

interface BookingFormProps {
  service: Service & { 
    provider?: { 
      id: string;
      firstName?: string;
      lastName?: string;
      displayName?: string;
    };
  };
}

export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Format time for display (9:00 to 9:00 AM)
  const formatTimeDisplay = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const interval = 30; // 30-minute intervals

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        // Don't add slots that would end after business hours
        const slotDurationInMinutes = service.duration;
        const slotEndMinute = minute + slotDurationInMinutes;
        const slotEndHour = hour + Math.floor(slotEndMinute / 60);
        const slotEndMinuteNormalized = slotEndMinute % 60;
        
        if (slotEndHour < endHour || (slotEndHour === endHour && slotEndMinuteNormalized === 0)) {
          const formattedHour = hour.toString().padStart(2, '0');
          const formattedMinute = minute.toString().padStart(2, '0');
          slots.push(`${formattedHour}:${formattedMinute}`);
        }
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Disable past dates
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  // Calculate max date (60 days in advance)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }

    setLoading(true);

    try {
      // Simulate booking creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Booking created successfully");
      
      // Redirect to payment page (for demo purposes)
      const mockBookingId = Math.random().toString(36).substring(2, 10);
      router.push(`/bookings/${mockBookingId}/payment`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg">Price</span>
          <span className="text-xl font-bold">${service.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Duration</span>
          <span className="text-sm">{service.duration} minutes</span>
        </div>
      </div>

      <div className="border-t border-b py-6 space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="date"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select Date
          </label>
          <input
            id="date"
            type="date"
            min={minDate}
            max={maxDateString}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">You can book up to 60 days in advance</p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select Time
          </label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
            disabled={!date}
          >
            <option value="">Select a time</option>
            {timeSlots.map((timeSlot) => (
              <option key={timeSlot} value={timeSlot}>
                {formatTimeDisplay(timeSlot)}
              </option>
            ))}
          </select>
          
          {!date && (
            <p className="text-xs text-muted-foreground mt-1">Please select a date first</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label
            htmlFor="notes"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Special Requests or Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Any special requests or information for the provider"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !date || !time}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? "Processing..." : "Book Appointment"}
      </button>
    </form>
  );
} 