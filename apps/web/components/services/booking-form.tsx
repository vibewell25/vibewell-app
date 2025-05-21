"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@vibewell/ui";
import { bookingSchema } from "@/lib/validations/booking";
import { createClient } from "@/lib/supabase/client";
import { Service, Profile, BookingStatus } from "@vibewell/types";
import { showBookingNotification } from "@/components/notifications";

type BookingFormValues = z.infer<typeof bookingSchema>;

// Define a simplified provider type that doesn't require all Profile fields
interface ProviderInfo {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

// Define a service type that can be used with a simplified provider
type ServiceWithProvider = Omit<Service, 'provider'> & {
  provider?: ProviderInfo;
};

interface BookingFormProps {
  service: ServiceWithProvider;
  profile: Profile;
}

export function BookingForm({ service, profile }: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Get available times for today and next 7 days
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: today.toISOString().split("T")[0],
      time: "10:00",
      notes: "",
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // Convert date and time to Date objects
      const startTime = new Date(`${data.date}T${data.time}`);
      const endTime = new Date(startTime.getTime() + service.duration * 60000);

      // Create the booking
      const { data: bookingData, error } = await supabase.from("bookings").insert({
        customerId: profile.id,
        providerId: service.providerId,
        serviceId: service.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: BookingStatus.PENDING,
        notes: data.notes || null,
        price: service.price,
      }).select().single();

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        text: "Booking created successfully! You will be redirected to the confirmation page.",
      });

      // Show booking created notification
      showBookingNotification({
        type: "created",
        bookingId: bookingData.id,
        serviceName: service.title,
        date: startTime.toISOString(),
        time: data.time,
      });

      // Redirect to booking confirmation page
      setTimeout(() => {
        router.push(`/bookings/confirmation/${bookingData.id}`);
        router.refresh();
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to create booking",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate time slots (9am - 5pm with 30 min intervals)
  const timeSlots = [];
  for (let hour = 9; hour < 17; hour++) {
    const hourFormatted = hour.toString().padStart(2, "0");
    timeSlots.push(`${hourFormatted}:00`);
    timeSlots.push(`${hourFormatted}:30`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <label 
          htmlFor="date" 
          className="text-sm font-medium"
        >
          Select Date
        </label>
        <input
          id="date"
          type="date"
          min={today.toISOString().split("T")[0]}
          max={nextWeek.toISOString().split("T")[0]}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("date")}
        />
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="time" 
          className="text-sm font-medium"
        >
          Select Time
        </label>
        <select
          id="time"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("time")}
        >
          {timeSlots.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        {errors.time && (
          <p className="text-sm text-red-500">{errors.time.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="notes" 
          className="text-sm font-medium"
        >
          Special Requests or Notes (Optional)
        </label>
        <textarea
          id="notes"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Any special requests or information for the service provider..."
          {...register("notes")}
        ></textarea>
        {errors.notes && (
          <p className="text-sm text-red-500">{errors.notes.message}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-4">
          <span className="text-sm">Service Price:</span>
          <span className="font-medium">${service.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-sm">Duration:</span>
          <span className="font-medium">{service.duration} minutes</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${service.price.toFixed(2)}</span>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Confirm Booking"}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        By confirming this booking, you agree to our terms and conditions.
      </p>
    </form>
  );
} 