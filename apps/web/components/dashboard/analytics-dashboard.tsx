"use client";

import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, subWeeks, eachDayOfInterval } from "date-fns";

// Chart components would be imported here in a real implementation
// import { LineChart, BarChart } from "../ui/charts";

interface AnalyticsData {
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
    dailyCounts: { date: string; count: number }[];
  };
  courses: {
    enrollments: number;
    completionRate: number;
    averageProgress: number;
    popularCourses: { id: string; title: string; enrollments: number }[];
  };
  ecommerce: {
    revenue: number;
    orders: number;
    averageOrderValue: number;
    topProducts: { id: string; name: string; sales: number }[];
  };
}

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch(`/api/analytics?period=${period}`);
        // const data = await response.json();
        
        // For demo purposes, we'll generate mock data
        const currentDate = new Date();
        const startDate = startOfWeek(currentDate);
        const endDate = endOfWeek(currentDate);
        const previousWeek = subWeeks(startDate, 1);
        
        const dailyData = eachDayOfInterval({ start: startDate, end: endDate }).map(date => ({
          date: format(date, "yyyy-MM-dd"),
          count: Math.floor(Math.random() * 10) + 1
        }));
        
        const mockData: AnalyticsData = {
          bookings: {
            total: 42,
            completed: 35,
            cancelled: 7,
            dailyCounts: dailyData
          },
          courses: {
            enrollments: 156,
            completionRate: 68,
            averageProgress: 72,
            popularCourses: [
              { id: "c1", title: "Yoga Fundamentals", enrollments: 48 },
              { id: "c2", title: "Meditation Masterclass", enrollments: 42 },
              { id: "c3", title: "Nutrition Basics", enrollments: 36 },
              { id: "c4", title: "Advanced Fitness", enrollments: 30 }
            ]
          },
          ecommerce: {
            revenue: 7865.50,
            orders: 124,
            averageOrderValue: 63.43,
            topProducts: [
              { id: "p1", name: "Yoga Mat Premium", sales: 28 },
              { id: "p2", name: "Meditation Cushion", sales: 24 },
              { id: "p3", name: "Fitness Tracker", sales: 20 },
              { id: "p4", name: "Protein Supplement", sales: 18 }
            ]
          }
        };
        
        setAnalyticsData(mockData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [period]);

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-muted-foreground">Failed to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Platform Analytics</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod("week")}
            className={`px-4 py-2 rounded-md text-sm ${period === "week" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            Week
          </button>
          <button 
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 rounded-md text-sm ${period === "month" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            Month
          </button>
          <button 
            onClick={() => setPeriod("year")}
            className={`px-4 py-2 rounded-md text-sm ${period === "year" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <h3 className="text-xl font-semibold mb-4">Booking Metrics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{analyticsData.bookings.total}</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData.bookings.completed}</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{analyticsData.bookings.cancelled}</p>
              </div>
            </div>
            <div className="h-64 w-full bg-muted/50 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Booking Trend Chart</p>
              {/* <LineChart data={analyticsData.bookings.dailyCounts} /> */}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <h3 className="text-xl font-semibold mb-4">Course Metrics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Enrollments</p>
                <p className="text-2xl font-bold">{analyticsData.courses.enrollments}</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">{analyticsData.courses.completionRate}%</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{analyticsData.courses.averageProgress}%</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Popular Courses</h4>
              <div className="space-y-2">
                {analyticsData.courses.popularCourses.map(course => (
                  <div key={course.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm truncate flex-1">{course.title}</span>
                    <span className="text-sm font-medium">{course.enrollments}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <h3 className="text-xl font-semibold mb-4">E-commerce Metrics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${analyticsData.ecommerce.revenue.toFixed(2)}</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">{analyticsData.ecommerce.orders}</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground">Avg Order</p>
                <p className="text-2xl font-bold">${analyticsData.ecommerce.averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Top Products</h4>
              <div className="space-y-2">
                {analyticsData.ecommerce.topProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm truncate flex-1">{product.name}</span>
                    <span className="text-sm font-medium">{product.sales} sold</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 