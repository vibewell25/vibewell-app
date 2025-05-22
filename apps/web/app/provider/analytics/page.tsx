import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { UserRole } from "@vibewell/types";
import { AnalyticsOverview } from "@/components/provider/analytics-overview";
import { BookingsChart } from "@/components/provider/bookings-chart";
import { RevenueChart } from "@/components/provider/revenue-chart";
import { TopServices } from "@/components/provider/top-services";
import { CustomerRetention } from "@/components/provider/customer-retention";

export const metadata: Metadata = {
  title: "Analytics | Provider Dashboard | VibeWell",
  description: "Track your business performance and growth",
};

export default async function ProviderAnalyticsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login?redirect=/provider/analytics");
  }
  
  const profile = await getCurrentProfile();
  
  if (!profile || profile.role !== UserRole.PROVIDER) {
    redirect("/dashboard");
  }

  // Fetch analytics data
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Get first day of current month
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  
  // Get first day of next month
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
  
  // Get date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Get date 60 days ago (for comparison with previous period)
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  
  // Fetch total bookings for current month
  const { count: currentMonthBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id)
    .gte("startTime", startOfMonth.toISOString())
    .lte("startTime", endOfMonth.toISOString());
  
  // Fetch total bookings for previous month
  const prevStartOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const prevEndOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
  
  const { count: prevMonthBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id)
    .gte("startTime", prevStartOfMonth.toISOString())
    .lte("startTime", prevEndOfMonth.toISOString());
  
  // Calculate booking growth percentage
  const bookingGrowth = prevMonthBookings 
    ? Math.round(((currentMonthBookings || 0) - prevMonthBookings) / prevMonthBookings * 100) 
    : 100;
  
  // Fetch total revenue for current month (completed bookings)
  const { data: currentMonthRevenueData } = await supabase
    .from("bookings")
    .select("price")
    .eq("providerId", profile.id)
    .in("status", ["COMPLETED", "CONFIRMED"])
    .gte("startTime", startOfMonth.toISOString())
    .lte("startTime", endOfMonth.toISOString());
  
  const currentMonthRevenue = currentMonthRevenueData?.reduce(
    (total, booking) => total + parseFloat(booking.price as any), 
    0
  ) || 0;
  
  // Fetch total revenue for previous month
  const { data: prevMonthRevenueData } = await supabase
    .from("bookings")
    .select("price")
    .eq("providerId", profile.id)
    .in("status", ["COMPLETED", "CONFIRMED"])
    .gte("startTime", prevStartOfMonth.toISOString())
    .lte("startTime", prevEndOfMonth.toISOString());
  
  const prevMonthRevenue = prevMonthRevenueData?.reduce(
    (total, booking) => total + parseFloat(booking.price as any), 
    0
  ) || 0;
  
  // Calculate revenue growth percentage
  const revenueGrowth = prevMonthRevenue 
    ? Math.round((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue * 100) 
    : 100;
  
  // Fetch unique customers count for last 30 days
  const { data: recentCustomersData } = await supabase
    .from("bookings")
    .select("customerId")
    .eq("providerId", profile.id)
    .gte("startTime", thirtyDaysAgo.toISOString());
  
  const uniqueCustomersCount = recentCustomersData 
    ? new Set(recentCustomersData.map(booking => booking.customerId)).size 
    : 0;
  
  // Fetch booking completion rate
  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id)
    .lte("startTime", now.toISOString());
  
  const { count: completedBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id)
    .eq("status", "COMPLETED")
    .lte("startTime", now.toISOString());
  
  const completionRate = totalBookings 
    ? Math.round((completedBookings || 0) / totalBookings * 100) 
    : 0;
  
  // Calculate average rating
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("rating")
    .eq("subjectId", profile.id);
  
  const totalRating = reviewsData?.reduce(
    (sum, review) => sum + review.rating, 
    0
  ) || 0;
  
  const averageRating = reviewsData?.length 
    ? (totalRating / reviewsData.length).toFixed(1) 
    : 0;

  // Prepare overview metrics
  const overviewMetrics = {
    bookings: {
      value: currentMonthBookings || 0,
      change: bookingGrowth,
      label: "This Month",
      trend: bookingGrowth >= 0 ? "up" : "down"
    },
    revenue: {
      value: currentMonthRevenue,
      change: revenueGrowth,
      label: "This Month",
      trend: revenueGrowth >= 0 ? "up" : "down",
      formatter: "currency"
    },
    customers: {
      value: uniqueCustomersCount,
      label: "Last 30 Days",
      trend: "neutral"
    },
    completionRate: {
      value: completionRate,
      label: "Completion Rate",
      trend: "neutral",
      formatter: "percentage"
    },
    rating: {
      value: averageRating,
      label: `From ${reviewsData?.length || 0} reviews`,
      trend: "neutral"
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your business performance and growth
        </p>
      </div>
      
      <div className="space-y-8">
        <AnalyticsOverview metrics={overviewMetrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BookingsChart providerId={profile.id} />
          <RevenueChart providerId={profile.id} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopServices providerId={profile.id} />
          <CustomerRetention providerId={profile.id} />
        </div>
      </div>
    </div>
  );
} 