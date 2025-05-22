"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { bookings } from "@/lib/mock-data";
import { BookingStatus } from "@vibewell/types";
import { BookingCard } from "@/components/bookings/booking-card";

export function RecentBookings() {
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  
  useEffect(() => {
    // In a real app, you would fetch this from an API
    // For now, we'll use mock data and limit to 3 most recent
    const sortedBookings = [...bookings]
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 3);
    
    setRecentBookings(sortedBookings);
  }, []);

  if (recentBookings.length === 0) {
    return (
      <div className="card-modern p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <Link 
            href="/bookings"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            You don't have any bookings yet.
          </p>
          <Link
            href="/services"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Bookings</h2>
        <Link 
          href="/bookings"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {recentBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
} 