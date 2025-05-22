"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Service, BookingStatus } from "@vibewell/types";
import { createClient } from "@/lib/supabase/client";
import { BookingCalendar } from "@/components/services/booking-calendar";
import { formatTime } from "@vibewell/utils";
import { sendBookingCreatedNotifications } from "@/lib/notifications/booking-notifications";

interface BookingFormProps {
  service: Service & { 
    provider?: { 
      id: string;
      firstName?: string;
      lastName?: string;
      displayName?: string;
      email?: string;
    };
  };
  userId?: string;
  userProfile?: {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    email: string;
  };
}

export function BookingForm({ service, userId, userProfile }: BookingFormProps) {
  const router = useRouter();
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Handle time slot selection
  const handleTimeSlotSelect = (startTime: Date, endTime: Date) => {
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStartTime || !selectedEndTime) {
      toast.error("Please select a date and time");
      return;
    }

    if (!service.provider?.id) {
      toast.error("Provider information is missing");
      return;
    }

    if (!userId) {
      // If user is not logged in, redirect to login page
      toast.error("Please log in to book this service");
      router.push(`/auth/login?redirect=/services/${service.id}`);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      // Get current user profile ID if not provided
      let profileId = userProfile?.id;
      
      if (!profileId) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, firstName, lastName, displayName, email")
          .eq("userId", userId)
          .single();
          
        if (!profileData) {
          throw new Error("User profile not found");
        }
        
        profileId = profileData.id;
        // Convert null to undefined for displayName to match the type
        userProfile = {
          ...profileData,
          displayName: profileData.displayName || undefined
        };
      }
      
      // Create booking in database
      const { data: booking, error } = await supabase
        .from("bookings")
        .insert({
          serviceId: service.id,
          providerId: service.provider.id,
          customerId: profileId,
          status: BookingStatus.PENDING,
          startTime: selectedStartTime.toISOString(),
          endTime: selectedEndTime.toISOString(),
          price: service.price,
          notes: notes || null,
        })
        .select("id")
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Send notifications to provider
      if (service.provider.email && userProfile) {
        const providerName = service.provider.displayName || 
          `${service.provider.firstName || ''} ${service.provider.lastName || ''}`;
        const customerName = userProfile.displayName || 
          `${userProfile.firstName} ${userProfile.lastName}`;
        
        await sendBookingCreatedNotifications(supabase, {
          bookingId: booking.id,
          providerId: service.provider.id,
          customerId: profileId,
          serviceName: service.title,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          price: service.price,
          customerName,
          providerName,
          customerEmail: userProfile.email,
          providerEmail: service.provider.email,
          customerFirstName: userProfile.firstName,
          providerFirstName: service.provider.firstName || providerName.split(' ')[0],
          status: BookingStatus.PENDING,
          notes: notes || undefined,
        });
      }
      
      toast.success("Booking request submitted successfully");
      
      // Redirect to payment page
      router.push(`/bookings/${booking.id}/payment`);
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
          <label className="text-sm font-medium leading-none">
            Select Date & Time
          </label>
          <BookingCalendar
            serviceId={service.id}
            providerId={service.provider?.id || ""}
            serviceDuration={service.duration}
            onTimeSlotSelect={handleTimeSlotSelect}
            selectedTimeSlot={
              selectedStartTime && selectedEndTime
                ? { startTime: selectedStartTime, endTime: selectedEndTime }
                : undefined
            }
          />
          
          {selectedStartTime && selectedEndTime && (
            <div className="mt-4 p-3 bg-primary/10 rounded-md">
              <p className="text-sm font-medium">Selected Time:</p>
              <p className="text-sm">
                {selectedStartTime.toLocaleDateString()} at {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}
              </p>
            </div>
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
        disabled={loading || !selectedStartTime || !selectedEndTime}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? "Processing..." : "Book Appointment"}
      </button>
    </form>
  );
} 