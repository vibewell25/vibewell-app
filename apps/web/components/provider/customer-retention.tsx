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

interface CustomerRetentionProps {
  providerId: string;
}

export function CustomerRetention({ providerId }: CustomerRetentionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [retentionData, setRetentionData] = useState<{
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
    retentionRate: number;
    frequentCustomers: number;
  }>({
    newCustomers: 0,
    returningCustomers: 0,
    totalCustomers: 0,
    retentionRate: 0,
    frequentCustomers: 0
  });
  
  useEffect(() => {
    async function fetchRetentionData() {
      setIsLoading(true);
      
      try {
        const supabase = createClient();
        const now = new Date();
        
        // Get first day of current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Get date 6 months ago
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        // Get date 1 month ago
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        // Fetch all customer bookings
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("customerId, startTime")
          .eq("providerId", providerId)
          .in("status", [BookingStatus.COMPLETED, BookingStatus.CONFIRMED])
          .gte("startTime", sixMonthsAgo.toISOString())
          .order("startTime", { ascending: true });
        
        if (!bookingsData || bookingsData.length === 0) {
          setRetentionData({
            newCustomers: 0,
            returningCustomers: 0,
            totalCustomers: 0,
            retentionRate: 0,
            frequentCustomers: 0
          });
          return;
        }
        
        // Group bookings by customer
        const customerBookings: Record<string, Date[]> = {};
        
        bookingsData.forEach(booking => {
          if (!customerBookings[booking.customerId]) {
            customerBookings[booking.customerId] = [];
          }
          customerBookings[booking.customerId].push(new Date(booking.startTime));
        });
        
        // Count unique customers
        const totalCustomers = Object.keys(customerBookings).length;
        
        // Count new customers (first booking in the last month)
        let newCustomers = 0;
        
        // Count returning customers (more than one booking)
        let returningCustomers = 0;
        
        // Count frequent customers (3+ bookings in 6 months)
        let frequentCustomers = 0;
        
        Object.entries(customerBookings).forEach(([_, bookings]) => {
          // Sort bookings by date
          bookings.sort((a, b) => a.getTime() - b.getTime());
          
          // Check if first booking was in the last month
          if (bookings[0] >= oneMonthAgo) {
            newCustomers++;
          }
          
          // Check if customer has more than one booking
          if (bookings.length > 1) {
            returningCustomers++;
          }
          
          // Check if customer has 3+ bookings
          if (bookings.length >= 3) {
            frequentCustomers++;
          }
        });
        
        // Calculate retention rate
        const retentionRate = totalCustomers > 0 
          ? Math.round((returningCustomers / totalCustomers) * 100) 
          : 0;
        
        setRetentionData({
          newCustomers,
          returningCustomers,
          totalCustomers,
          retentionRate,
          frequentCustomers
        });
      } catch (error) {
        console.error("Error fetching customer retention data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRetentionData();
  }, [providerId]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Customer Retention</CardTitle>
        <CardDescription>
          Understanding your client loyalty and retention
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">New Clients</div>
                <div className="mt-1 text-2xl font-bold">{retentionData.newCustomers}</div>
                <div className="text-xs text-muted-foreground">Last 30 days</div>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">Returning Clients</div>
                <div className="mt-1 text-2xl font-bold">{retentionData.returningCustomers}</div>
                <div className="text-xs text-muted-foreground">Multiple bookings</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Retention Rate</span>
                <span className="text-sm font-medium">{retentionData.retentionRate}%</span>
              </div>
              
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${retentionData.retentionRate}%` }}
                />
              </div>
              
              <div className="text-xs text-muted-foreground">
                {retentionData.retentionRate < 30 ? (
                  "Consider implementing a client loyalty program to improve retention."
                ) : retentionData.retentionRate < 60 ? (
                  "Good retention. Regular follow-ups can help increase this further."
                ) : (
                  "Excellent client loyalty! Keep up the good work."
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Frequent Clients</span>
                <span className="text-sm font-medium">
                  {retentionData.frequentCustomers} 
                  <span className="text-muted-foreground text-xs ml-1">
                    ({retentionData.totalCustomers > 0 
                      ? Math.round((retentionData.frequentCustomers / retentionData.totalCustomers) * 100)
                      : 0}%)
                  </span>
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Clients with 3+ bookings in the last 6 months
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 