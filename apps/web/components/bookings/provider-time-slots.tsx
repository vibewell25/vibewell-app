"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { TimeSlotPicker } from "./time-slot-picker";

interface ProviderTimeSlotsProps {
  provider: any;
  services: any[];
}

export function ProviderTimeSlots({ provider, services }: ProviderTimeSlotsProps) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<any>(services[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot: any) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTimeSlot) {
      setError("Please select a time slot");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // This would be an API call in a real application
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Successful booking
      setBookingComplete(true);
      
      // In a real app, you would redirect to the booking confirmation page
      // router.push(`/bookings/confirmation/${bookingId}`);
    } catch (err) {
      setError("Failed to complete booking. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingComplete) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="text-center py-6 space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Booking Confirmed!</h2>
          <p className="text-muted-foreground">
            Your appointment with {provider.firstName} {provider.lastName} has been successfully booked.
          </p>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => router.push('/bookings')}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              View My Bookings
            </button>
            <button
              onClick={() => router.push('/')}
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Book Your Appointment</h2>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Select a Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceSelect(service)}
                  className={`p-4 rounded-md text-left transition ${
                    selectedService && service.id === selectedService.id
                      ? "bg-primary/10 border-primary border"
                      : "bg-muted border border-transparent hover:border-primary/30"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{service.name}</h4>
                    <span className="font-bold text-primary">${service.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{service.duration} minutes</p>
                </button>
              ))}
            </div>
          </div>
          
          {selectedService && (
            <div className="border-t pt-6">
              <TimeSlotPicker 
                serviceId={selectedService.id} 
                providerId={provider.id} 
                onTimeSlotSelect={handleTimeSlotSelect} 
              />
            </div>
          )}
          
          {selectedTimeSlot && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-3">Additional Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border rounded-md h-24 resize-none"
                placeholder="Add any special requests or notes for your appointment..."
              />
            </div>
          )}
          
          {selectedTimeSlot && (
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-70"
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
} 