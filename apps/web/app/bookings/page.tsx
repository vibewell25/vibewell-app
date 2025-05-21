import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { BookingsList } from "@/components/bookings/bookings-list";
import { redirect } from "next/navigation";
import { BookingStatus } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Your Bookings | VibeWell",
  description: "Manage your beauty and wellness appointments",
};

export default async function BookingsPage() {
  const supabase = createServerClient();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/auth/login?redirectTo=/bookings");
  }

  // Fetch all bookings for the current user with related service and provider details
  const { data: rawBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(*),
      provider:profiles!bookings_providerId_fkey(id, firstName, lastName, displayName, avatarUrl)
    `)
    .eq("customerId", profile.id)
    .order("startTime", { ascending: true });
    
  // Convert the raw database types to match the expected types
  const bookings = rawBookings?.map(booking => ({
    ...booking,
    status: booking.status as BookingStatus,
  })) || [];

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Bookings</h1>
          <p className="text-muted-foreground">
            Manage your beauty and wellness appointments
          </p>
        </div>
        <Link
          href="/services"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90"
        >
          Book New Service
        </Link>
      </div>

      <BookingsList initialBookings={bookings} />
    </div>
  );
} 