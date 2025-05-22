"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { BookingStatus } from "@vibewell/types";

interface BookingsChartProps {
  providerId: string;
}

export function BookingsChart({ providerId }: BookingsChartProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  
  useEffect(() => {
    async function fetchChartData() {
      setIsLoading(true);
      
      try {
        const supabase = createClient();
        const now = new Date();
        
        // Fetch weekly data (last 7 days)
        const weeklyResults: number[] = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
          
          const { count } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("providerId", providerId)
            .gte("startTime", startOfDay.toISOString())
            .lte("startTime", endOfDay.toISOString())
            .not("status", "in", `("${BookingStatus.CANCELLED}","${BookingStatus.NO_SHOW}")`);
          
          weeklyResults.push(count || 0);
        }
        
        setWeeklyData(weeklyResults);
        
        // Fetch monthly data (last 12 months)
        const monthlyResults: number[] = [];
        
        for (let i = 11; i >= 0; i--) {
          const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
          
          const { count } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("providerId", providerId)
            .gte("startTime", startDate.toISOString())
            .lte("startTime", endDate.toISOString())
            .not("status", "in", `("${BookingStatus.CANCELLED}","${BookingStatus.NO_SHOW}")`);
          
          monthlyResults.push(count || 0);
        }
        
        setMonthlyData(monthlyResults);
      } catch (error) {
        console.error("Error fetching booking chart data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchChartData();
  }, [providerId]);
  
  // Get day labels for weekly chart (e.g., Mon, Tue, etc.)
  const getDayLabels = () => {
    const now = new Date();
    const dayLabels = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dayLabels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    
    return dayLabels;
  };
  
  // Get month labels for monthly chart (e.g., Jan, Feb, etc.)
  const getMonthLabels = () => {
    const now = new Date();
    const monthLabels = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthLabels.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }
    
    return monthLabels;
  };
  
  // Find max value in data for chart scaling
  const getMaxValue = (data: number[]) => {
    const max = Math.max(...data);
    return max > 0 ? max : 5; // Default to 5 if all values are 0
  };
  
  const renderChart = (data: number[], labels: string[]) => {
    const maxValue = getMaxValue(data);
    
    return (
      <div className="w-full h-[200px] mt-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : (
          <div className="flex h-full items-end gap-2">
            {data.map((value, index) => (
              <div key={index} className="relative flex h-full flex-1 flex-col items-center">
                <div 
                  className="absolute bottom-0 w-full rounded-md bg-primary" 
                  style={{ 
                    height: `${Math.max((value / maxValue) * 100, 4)}%`,
                  }}
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between mt-2">
          {labels.map((label, index) => (
            <div key={index} className="text-xs text-muted-foreground">
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Booking Trends</CardTitle>
        <CardDescription>
          View your booking trends over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="monthly" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "weekly" | "monthly")}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <div className="text-sm font-medium">
              {activeTab === "weekly" ? "Last 7 Days" : "Last 12 Months"}
            </div>
          </div>
          
          <TabsContent value="weekly" className="mt-2">
            {renderChart(weeklyData, getDayLabels())}
            
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                Total: {weeklyData.reduce((sum, val) => sum + val, 0)} bookings
              </div>
              <div className="font-medium">
                Average: {(weeklyData.reduce((sum, val) => sum + val, 0) / 7).toFixed(1)} per day
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-2">
            {renderChart(monthlyData, getMonthLabels())}
            
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                Total: {monthlyData.reduce((sum, val) => sum + val, 0)} bookings
              </div>
              <div className="font-medium">
                Average: {(monthlyData.reduce((sum, val) => sum + val, 0) / 12).toFixed(1)} per month
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 