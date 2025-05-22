"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@vibewell/types";
import { formatDate } from "@vibewell/utils";
import { BookingStatus } from "@vibewell/types";
import { createClient } from "@/lib/supabase/client";

interface RecentBookingsProps {
  profile: Profile;
}

export function RecentBookings({ profile }: RecentBookingsProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // In a real app, this would fetch from the API
        // For now, let's create mock data
        const mockBookings = [
          {
            id: "b1",
            serviceName: "Deep Tissue Massage",
            providerName: "Sarah Johnson",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            status: BookingStatus.COMPLETED,
            amount: 85.00,
          },
          {
            id: "b2",
            serviceName: "Haircut & Style",
            providerName: "Michael Wong",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            status: BookingStatus.COMPLETED,
            amount: 65.00,
          },
          {
            id: "b3",
            serviceName: "Facial Treatment",
            providerName: "Emily Davis",
            date: new Date(Date.now() - 14 * 24 * 60 *
60 * 1000), // 14 days ago
            status: BookingStatus.COMPLETED,
            amount: 95.00,
          },
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setBookings(mockBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Your recently completed service bookings</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">No recent bookings found</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-medium">{booking.serviceName}</h4>
                  <div className="text-sm text-muted-foreground">
                    {booking.providerName} • {formatDate(booking.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${booking.amount.toFixed(2)}</div>
                  <Link href={`/bookings/${booking.id}`} className="text-sm text-primary hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
            
            <div className="pt-2 text-center">
              <Link href="/bookings" className="text-sm text-primary hover:underline">
                View All Bookings
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 