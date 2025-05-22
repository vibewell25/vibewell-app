import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { formatDate, formatTime } from "@vibewell/utils";
import { BookingStatus, Profile, UserRole } from "@vibewell/types";
import { BookingsTabs } from "@/components/provider/bookings-tabs";

export const metadata: Metadata = {
  title: "My Bookings | Provider Dashboard | VibeWell",
  description: "View and manage your customer bookings",
};

export default async function ProviderBookingsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login?redirect=/provider/bookings");
  }
  
  const profile = await getCurrentProfile();
  
  if (!profile || profile.role !== UserRole.PROVIDER) {
    redirect("/dashboard");
  }
  
  // Fetch bookings with service and customer details
  const today = new Date().toISOString();
  
  // Fetch pending bookings
  const { data: pendingBookings } = await supabase
    .from("bookings")
    .select(`
      id, status, startTime, endTime, price, providerId,
      service:services(id, title, price, duration),
      customer:profiles!bookings_customerId_fkey(id, firstName, lastName, displayName, avatarUrl, email, phone)
    `)
    .eq("providerId", profile.id)
    .eq("status", BookingStatus.PENDING)
    .order("startTime", { ascending: true });
  
  // Fetch upcoming bookings (confirmed, not in the past)
  const { data: upcomingBookings } = await supabase
    .from("bookings")
    .select(`
      id, status, startTime, endTime, price, providerId,
      service:services(id, title, price, duration),
      customer:profiles!bookings_customerId_fkey(id, firstName, lastName, displayName, avatarUrl, email, phone)
    `)
    .eq("providerId", profile.id)
    .eq("status", BookingStatus.CONFIRMED)
    .gte("startTime", today)
    .order("startTime", { ascending: true });
  
  // Fetch past bookings (confirmed or completed, in the past)
  const { data: pastBookings } = await supabase
    .from("bookings")
    .select(`
      id, status, startTime, endTime, price, providerId,
      service:services(id, title, price, duration),
      customer:profiles!bookings_customerId_fkey(id, firstName, lastName, displayName, avatarUrl, email, phone)
    `)
    .eq("providerId", profile.id)
    .in("status", [BookingStatus.CONFIRMED, BookingStatus.COMPLETED])
    .lt("startTime", today)
    .order("startTime", { ascending: false });
  
  // Fetch cancelled bookings
  const { data: cancelledBookings } = await supabase
    .from("bookings")
    .select(`
      id, status, startTime, endTime, price, providerId, cancellationReason,
      service:services(id, title, price, duration),
      customer:profiles!bookings_customerId_fkey(id, firstName, lastName, displayName, avatarUrl, email, phone)
    `)
    .eq("providerId", profile.id)
    .in("status", [BookingStatus.CANCELLED, BookingStatus.NO_SHOW])
    .order("startTime", { ascending: false });

  // Convert dates to Date objects
  const formatBookings = (bookings: any[]) => {
    return bookings.map(booking => ({
      ...booking,
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
    }));
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your customer bookings
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href="/provider/calendar"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Link>
        </div>
      </div>
      
      <div className="space-y-6">
        <BookingsTabs
          pendingBookings={formatBookings(pendingBookings || [])}
          upcomingBookings={formatBookings(upcomingBookings || [])}
          pastBookings={formatBookings(pastBookings || [])}
          cancelledBookings={formatBookings(cancelledBookings || [])}
        />
      </div>
    </div>
  );
} 