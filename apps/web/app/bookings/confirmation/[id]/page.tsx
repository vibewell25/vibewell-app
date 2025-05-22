import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { formatDate, formatTime } from "@vibewell/utils";
import { BookingConfirmation } from "@/components/bookings/booking-confirmation";
import { BookingStatus } from "@vibewell/types";

interface BookingConfirmationPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BookingConfirmationPageProps): Promise<Metadata> {
  return {
    title: "Booking Confirmation | VibeWell",
    description: "Your booking has been confirmed.",
  };
}

export default async function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/login");
  }
  
  // Fetch booking data
  const supabase = await createServerClient();
  
  // Get the booking with service and provider details
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      service:serviceId(id, title, description, duration, price),
      provider:providerId(id, firstName, lastName, displayName, avatarUrl)
    `)
    .eq("id", params.id)
    .single();
  
  if (error || !booking) {
    console.error("Error fetching booking:", error);
    notFound();
  }
  
  // Check if user is authorized to view this booking
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("userId", user.id)
    .single();
  
  const isOwner = booking.customerId === profile?.id;
  const isProvider = booking.providerId === profile?.id;
  const isAdmin = profile?.role === "ADMIN";
  
  if (!isOwner && !isProvider && !isAdmin) {
    redirect("/dashboard");
  }
  
  return (
    <div className="container max-w-3xl py-12">
      <BookingConfirmation booking={booking} />
    </div>
  );
} 