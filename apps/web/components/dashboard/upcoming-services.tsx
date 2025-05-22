"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@vibewell/types";
import { formatDate } from "@vibewell/utils";

interface UpcomingServicesProps {
  profile: Profile;
}

export function UpcomingServices({ profile }: UpcomingServicesProps) {
  const [upcomingServices, setUpcomingServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingServices = async () => {
      try {
        // In a real app, this would fetch from the API
        // For now, let's create mock data
        const mockUpcomingServices = [
          {
            id: "b1",
            serviceName: "Deep Tissue Massage",
            providerName: "Sarah Johnson",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            time: "10:00 AM",
            status: "confirmed",
          },
          {
            id: "b2",
            serviceName: "Haircut & Style",
            providerName: "Michael Wong",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            time: "2:30 PM",
            status: "confirmed",
          },
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUpcomingServices(mockUpcomingServices);
      } catch (error) {
        console.error("Error fetching upcoming services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingServices();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Services</CardTitle>
        <CardDescription>Your scheduled appointments</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : upcomingServices.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">You don't have any upcoming appointments</p>
            <Link href="/services" className="text-sm text-primary hover:underline mt-2 inline-block">
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingServices.map((service) => (
              <div key={service.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-medium">{service.serviceName}</h4>
                  <div className="text-sm text-muted-foreground">
                    with {service.providerName}
                  </div>
                  <div className="text-sm mt-1">
                    {formatDate(service.date)} at {service.time}
                  </div>
                </div>
                <div className="text-right">
                  <Link href={`/bookings/${service.id}`} className="text-sm text-primary hover:underline">
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