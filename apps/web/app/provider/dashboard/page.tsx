import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { BookingStatus } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Provider Dashboard | VibeWell",
  description: "Manage your beauty and wellness services",
};

export default async function ProviderDashboardPage() {
  const supabase = await createServerClient();
  
  // Get current user profile
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("userId", user.id)
    .single();
  
  if (!profile) return null;
  
  // Fetch provider stats
  const { count: totalServices } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id);
  
  const { count: activeServices } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id)
    .eq("isActive", true);
  
  // Fetch upcoming bookings
  const now = new Date();
  const { count: upcomingBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id)
    .gte("startTime", now.toISOString())
    .in("status", [BookingStatus.PENDING, BookingStatus.CONFIRMED]);
  
  // Fetch pending bookings
  const { count: pendingBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id)
    .eq("status", BookingStatus.PENDING);
  
  // Fetch today's bookings
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { count: todayBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id)
    .gte("startTime", startOfDay.toISOString())
    .lte("startTime", endOfDay.toISOString())
    .in("status", [BookingStatus.PENDING, BookingStatus.CONFIRMED]);
  
  // Fetch recent reviews count
  const { count: reviewsCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("providerId", profile.id);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your services and bookings
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <OverviewCard 
          title="Your Services" 
          value={totalServices || 0}
          description={activeServices !== undefined ? `${activeServices} active services` : undefined}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
              <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
              <path d="M15 2v5h5" />
            </svg>
          }
        />
        
        <OverviewCard 
          title="Upcoming Bookings" 
          value={upcomingBookings || 0}
          description={pendingBookings !== undefined ? `${pendingBookings} pending approval` : undefined}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          }
        />
        
        <OverviewCard 
          title="Today's Bookings" 
          value={todayBookings || 0}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
          }
        />
        
        <OverviewCard 
          title="Reviews" 
          value={reviewsCount || 0}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-12">
        <div className="md:col-span-4 lg:col-span-8 space-y-6">
          <div className="rounded-lg border bg-card shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/provider/services"
                className="flex items-center gap-2 rounded-md border p-4 hover:bg-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                  <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
                  <path d="M15 2v5h5" />
                </svg>
                <span>Manage Services</span>
              </Link>
              
              <Link
                href="/provider/bookings"
                className="flex items-center gap-2 rounded-md border p-4 hover:bg-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
                <span>Manage Bookings</span>
              </Link>
              
              <Link
                href="/provider/services/new"
                className="flex items-center gap-2 rounded-md border p-4 hover:bg-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                <span>Add New Service</span>
              </Link>
              
              <Link
                href="/provider/schedule"
                className="flex items-center gap-2 rounded-md border p-4 hover:bg-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <path d="M8 14h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 18h.01" />
                  <path d="M12 18h.01" />
                  <path d="M16 18h.01" />
                </svg>
                <span>Manage Schedule</span>
              </Link>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Today's Schedule</h2>
              <Link href="/provider/bookings" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            
            {todayBookings ? (
              <div className="space-y-4">
                <Link href="/provider/bookings" className="block">
                  <div className="rounded-md border p-4 hover:bg-accent transition-colors">
                    <p className="text-sm font-medium">
                      You have {todayBookings} booking{todayBookings !== 1 ? 's' : ''} scheduled for today
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to view details
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings scheduled for today</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 lg:col-span-4 space-y-6">
          <div className="rounded-lg border bg-card shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Provider Profile</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  {profile.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                
                <h3 className="font-medium text-center">
                  {profile.displayName || `${profile.firstName} ${profile.lastName}`}
                </h3>
                
                <p className="text-sm text-muted-foreground text-center">
                  {profile.bio || 'No bio provided'}
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <Link
                  href="/profile"
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Business Tools</h2>
            <div className="space-y-3">
              <Link
                href="/provider/analytics"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
                Business Analytics
              </Link>
              
              <Link
                href="/provider/reviews"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Manage Reviews
              </Link>
              
              <Link
                href="/provider/customers"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Customer Management
              </Link>
              
              <Link
                href="/provider/settings"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Business Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 