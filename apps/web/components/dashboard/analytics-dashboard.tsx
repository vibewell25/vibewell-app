"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Service Bookings</CardTitle>
          <CardDescription>Past 30 days booking distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Massage</div>
                <div className="text-sm text-muted-foreground">45%</div>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Haircut & Styling</div>
                <div className="text-sm text-muted-foreground">30%</div>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Facial Treatments</div>
                <div className="text-sm text-muted-foreground">15%</div>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Nail Services</div>
                <div className="text-sm text-muted-foreground">10%</div>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Booking Trend</CardTitle>
          <CardDescription>Weekly booking count</CardDescription>
        </CardHeader>
        <CardContent className="h-[220px] flex items-end justify-between gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            const height = [30, 45, 60, 90, 75, 85, 50][i];
            return (
              <div key={day} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-primary/80 w-full rounded-t-sm" 
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-muted-foreground mt-2">{day}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Reviews Summary</CardTitle>
          <CardDescription>Average ratings by service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Massage", rating: 4.8 },
              { name: "Haircut & Styling", rating: 4.5 },
              { name: "Facial Treatments", rating: 4.9 },
              { name: "Nail Services", rating: 4.6 }
            ].map((service) => (
              <div key={service.name}>
                <div className="flex justify-between items-center">
                  <div className="text-sm">{service.name}</div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{service.rating}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-4 h-4 text-yellow-500 ml-1"
                    >
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <Progress value={service.rating * 20} className="h-1 mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Popular Times</CardTitle>
          <CardDescription>Most booked appointment times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "Morning (8am-12pm)", percentage: 35 },
              { time: "Afternoon (12pm-4pm)", percentage: 25 },
              { time: "Evening (4pm-8pm)", percentage: 40 },
              { time: "Late Night (8pm+)", percentage: 5 }
            ].map((timeSlot) => (
              <div key={timeSlot.time}>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm">{timeSlot.time}</div>
                  <div className="text-sm text-muted-foreground">{timeSlot.percentage}%</div>
                </div>
                <Progress value={timeSlot.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 