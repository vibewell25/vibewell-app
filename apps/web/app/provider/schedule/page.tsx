import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { BookingStatus, Profile, UserRole } from "@vibewell/types";
import { ScheduleCalendar } from "@/components/provider/schedule-calendar";

// Define the expected booking type for the calendar
interface CalendarBooking {
  id: string;
  status: BookingStatus;
  startTime: Date;
  endTime: Date;
  price: number;
  service: {
    id: string;
    title: string;
    duration: number;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
  };
}

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

  // Create a profile with required fields and optional fields with defaults
  const profile: Profile = {
    id: profileData.id,
    userId: profileData.userId,
    email: profileData.email,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    role: profileData.role as UserRole,
    createdAt: new Date(profileData.createdAt),
    updatedAt: new Date(profileData.updatedAt),
  };
  
  // Add optional fields if they exist in profileData
  if ('displayName' in profileData) profile.displayName = profileData.displayName || undefined;
  if ('bio' in profileData) profile.bio = profileData.bio || undefined;
  if ('avatarUrl' in profileData) profile.avatarUrl = profileData.avatarUrl || undefined;
  if ('phone' in profileData) profile.phone = profileData.phone || undefined;
  if ('address' in profileData) profile.address = profileData.address || undefined;
  if ('city' in profileData) profile.city = profileData.city || undefined;
  if ('state' in profileData) profile.state = profileData.state || undefined;
  if ('zipCode' in profileData) profile.zipCode = profileData.zipCode || undefined;
  if ('country' in profileData) profile.country = profileData.country || undefined;

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

  // Convert to proper types with dates and ensure the data matches the expected format
  const formattedBookings: CalendarBooking[] = bookings?.map(booking => {
    // Create a properly typed CalendarBooking object
    const calendarBooking: CalendarBooking = {
      id: booking.id,
      status: booking.status as BookingStatus,
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
      price: booking.price,
      service: {
        id: booking.service.id,
        title: booking.service.title,
        duration: booking.service.duration
      },
      customer: {
        id: booking.customer.id,
        firstName: booking.customer.firstName,
        lastName: booking.customer.lastName,
        // Handle null displayName by converting to undefined
        displayName: booking.customer.displayName || undefined
      }
    };
    
    return calendarBooking;
  }) || [];

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