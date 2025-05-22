"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { BookingStatus } from "@vibewell/types";

interface ServiceStats {
  id: string;
  title: string;
  bookingsCount: number;
  revenue: number;
}

interface TopServicesProps {
  providerId: string;
}

export function TopServices({ providerId }: TopServicesProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [topServices, setTopServices] = useState<ServiceStats[]>([]);
  
  useEffect(() => {
    async function fetchTopServices() {
      setIsLoading(true);
      
      try {
        const supabase = createClient();
        
        // Get all services for the provider
        const { data: services } = await supabase
          .from("services")
          .select("id, title")
          .eq("providerId", providerId)
          .eq("isActive", true);
          
        if (!services || services.length === 0) {
          setTopServices([]);
          return;
        }
        
        // For each service, get booking count and revenue
        const serviceStats: ServiceStats[] = [];
        
        for (const service of services) {
          // Get booking count
          const { count: bookingsCount } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("serviceId", service.id)
            .in("status", [BookingStatus.COMPLETED, BookingStatus.CONFIRMED]);
          
          // Get revenue
          const { data: bookings } = await supabase
            .from("bookings")
            .select("price")
            .eq("serviceId", service.id)
            .in("status", [BookingStatus.COMPLETED, BookingStatus.CONFIRMED]);
          
          const revenue = bookings?.reduce((sum, booking) => 
            sum + parseFloat(booking.price as any), 0) || 0;
          
          serviceStats.push({
            id: service.id,
            title: service.title,
            bookingsCount: bookingsCount || 0,
            revenue,
          });
        }
        
        // Sort by bookings count (descending)
        serviceStats.sort((a, b) => b.bookingsCount - a.bookingsCount);
        
        // Take top 5
        setTopServices(serviceStats.slice(0, 5));
      } catch (error) {
        console.error("Error fetching top services:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTopServices();
  }, [providerId]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Get maximum bookings count for percentage calculation
  const getMaxBookings = () => {
    if (topServices.length === 0) return 1;
    return Math.max(...topServices.map(service => service.bookingsCount));
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Top Services</CardTitle>
        <CardDescription>
          Your most booked services by popularity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : topServices.length === 0 ? (
          <div className="h-60 flex items-center justify-center">
            <p className="text-muted-foreground">No booking data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div key={service.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{service.title}</div>
                    <div className="text-sm text-muted-foreground flex justify-between mt-1">
                      <span>{service.bookingsCount} bookings</span>
                      <span>{formatCurrency(service.revenue)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full"
                    style={{ 
                      width: `${(service.bookingsCount / getMaxBookings()) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && topServices.length > 0 && (
          <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
            <p>
              Tip: Focus on promoting your top performing services to maximize revenue. 
              Consider creating package deals that include these popular options.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 