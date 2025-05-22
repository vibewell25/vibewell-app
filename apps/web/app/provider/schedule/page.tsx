import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { BookingStatus, Profile, UserRole } from "@vibewell/types";
import { ScheduleCalendar } from "@/components/provider/schedule-calendar";

export const metadata: Metadata = {
  title: "Schedule | Provider Dashboard | VibeWell",
  description: "Manage your booking schedule and availability",
};

export default async function ProviderSchedulePage() {
  const supabase = await createServerClient();
  const profileData = await getCurrentProfile();

  if (!profileData || profileData.role !== UserRole.PROVIDER) {
    notFound();
  }

  // Convert profileData to Profile type
  const profile: Profile = {
    ...profileData,
    role: profileData.role as UserRole,
    createdAt: new Date(profileData.createdAt),
    updatedAt: new Date(profileData.updatedAt),
    displayName: profileData.displayName || undefined,
    bio: profileData.bio || undefined,
    avatarUrl: profileData.avatarUrl || undefined,
    phone: profileData.phone || undefined,
    address: profileData.address || undefined,
    city: profileData.city || undefined,
    state: profileData.state || undefined,
    zipCode: profileData.zipCode || undefined,
    country: profileData.country || undefined,
  };

  // Fetch all provider's active bookings (not cancelled or no-show)
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(id, title, duration),
      customer:profiles!bookings_customerId_fkey(id, firstName, lastName, displayName)
    `)
    .eq("providerId", profile.id)
    .not("status", "in", `(${BookingStatus.CANCELLED},${BookingStatus.NO_SHOW})`)
    .order("startTime", { ascending: true });

  // Convert to proper types with dates
  const formattedBookings = bookings?.map(booking => ({
    ...booking,
    status: booking.status as BookingStatus,
    createdAt: new Date(booking.createdAt),
    updatedAt: new Date(booking.updatedAt),
    startTime: new Date(booking.startTime),
    endTime: new Date(booking.endTime),
  })) || [];

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">
            Manage your booking calendar and availability
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <ScheduleCalendar bookings={formattedBookings} />
      </div>
    </div>
  );
} 