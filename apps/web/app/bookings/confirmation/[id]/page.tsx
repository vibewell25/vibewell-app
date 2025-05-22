import { useState, useEffect } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { formatDate, formatTime } from "@vibewell/utils";
import { BookingConfirmation } from "@/components/bookings/booking-confirmation";
import { BookingStatus } from "@vibewell/types";
import { Button } from "@/components/ui/button";
import { services, providers } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

// Use consistent ParamsType across booking pages
type ParamsType = Promise<{ id: string }>;

interface BookingConfirmationPageProps {
  params: ParamsType;
}

export async function generateMetadata({ params }: BookingConfirmationPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Booking Confirmation | VibeWell",
    description: "Your booking has been confirmed.",
  };
}

"use client";

export default function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
  const { id } = params;
  const [mockBooking, setMockBooking] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, we would fetch the booking details from the API
    // For now, we'll create a mock booking
    const randomServiceId = services[Math.floor(Math.random() * services.length)].id;
    const service = services.find(s => s.id === randomServiceId);
    const provider = service 
      ? providers.find(p => p.id === service.providerId)
      : providers[0];
    
    const depositAmount = service ? Math.round(service.price * 0.2 * 100) / 100 : 0; // 20% deposit
    
    const mockData = {
      id: id,
      service,
      provider,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: "10:00 AM",
      depositAmount,
      totalAmount: service?.price || 0,
      remainingAmount: (service?.price || 0) - depositAmount,
      confirmationNumber: `VWBK-${Math.floor(100000 + Math.random() * 900000)}`
    };
    
    setMockBooking(mockData);
  }, [id]);
  
  if (!mockBooking) {
    return (
      <div className="container py-10">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your appointment has been successfully booked and confirmed.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <span className="text-sm text-muted-foreground">
              Confirmation #: <span className="font-medium">{mockBooking.confirmationNumber}</span>
            </span>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Service</h3>
                <p className="font-medium">{mockBooking.service?.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockBooking.service?.duration} minutes • {formatPrice(mockBooking.service?.price)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Provider</h3>
                <p className="font-medium">
                  {mockBooking.provider?.firstName} {mockBooking.provider?.lastName}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockBooking.provider?.specialties?.[0] || "Beauty Professional"}
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Date & Time</h3>
                <p className="font-medium">
                  {mockBooking.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockBooking.time}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                <p className="font-medium">
                  {mockBooking.provider?.businessName || "VibeWell Studio"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  123 Main Street, Suite 101<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
            
            <div className="border-t pt-6 mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Payment Summary</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Service Total:</span>
                  <span className="font-medium">{formatPrice(mockBooking.totalAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Deposit Paid:</span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(mockBooking.depositAmount)}
                  </span>
                </div>
                
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-medium">Balance Due at Appointment:</span>
                  <span className="font-medium">{formatPrice(mockBooking.remainingAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Cancellation Policy</h2>
          <p className="text-sm text-muted-foreground mb-4">
            You may cancel or reschedule your appointment up to 48 hours before your scheduled time. 
            Cancellations made less than 48 hours in advance may result in forfeiture of your deposit.
          </p>
          <p className="text-sm text-muted-foreground">
            Please contact us at support@vibewell.com or call (555) 123-4567 if you need to make any changes to your booking.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/bookings">View My Bookings</Link>
          </Button>
          
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href={`/calendar/add?booking=${mockBooking.id}`}>
              Add to Calendar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 