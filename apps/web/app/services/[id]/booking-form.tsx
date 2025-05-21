"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { BookingStatus } from "@vibewell/types";

interface Service {
  id: string;
  title: string;
  duration: number;
  price: number;
  provider: {
    id: string;
  };
}

interface BookingFormProps {
  service: Service;
}

export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Calculate available times based on service duration
  const availableTimes = [];
  const hourDuration = service.duration / 60;
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM

  for (let hour = startHour; hour <= endHour - hourDuration; hour++) {
    availableTimes.push(`${hour}:00`);
    if (hourDuration < 1 && hour < endHour - hourDuration) {
      availableTimes.push(`${hour}:30`);
    }
  }

  // Disable past dates
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to book a service");
      }

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("userId", user.id)
        .single();

      if (!profile) {
        throw new Error("User profile not found");
      }

      // Calculate start and end times
      const [hours, minutes] = time.split(":").map(Number);
      const startTime = new Date(date);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + service.duration);

      // Create booking
      const { error } = await supabase
        .from("bookings")
        .insert({
          customerId: profile.id,
          providerId: service.provider.id,
          serviceId: service.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: BookingStatus.PENDING,
          price: service.price,
          notes: ""
        });

      if (error) {
        throw error;
      }

      toast.success("Booking created successfully");
      router.push("/bookings");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg">Price</span>
          <span className="text-xl font-bold">${service.price}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Duration</span>
          <span className="text-sm">{service.duration} minutes</span>
        </div>
      </div>

      <div className="border-t border-b py-4 space-y-4">
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
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
          >
            <option value="">Select a time</option>
            {availableTimes.map((timeSlot) => (
              <option key={timeSlot} value={timeSlot}>
                {timeSlot}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? "Processing..." : "Book Appointment"}
      </button>
    </form>
  );
} 