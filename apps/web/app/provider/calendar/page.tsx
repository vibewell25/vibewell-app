import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { UserRole } from "@vibewell/types";
import { CalendarView } from "@/components/provider/calendar-view";

export const metadata: Metadata = {
  title: "Booking Calendar | Provider Dashboard | VibeWell",
  description: "View and manage your bookings in a calendar view",
};

export default async function ProviderCalendarPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login?redirect=/provider/calendar");
  }
  
  const profile = await getCurrentProfile();
  
  if (!profile || profile.role !== UserRole.PROVIDER) {
    redirect("/dashboard");
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Booking Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your upcoming bookings in a calendar format
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href="/provider/bookings"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            List View
          </Link>
        </div>
      </div>
      
      <div className="space-y-6">
        <CalendarView providerId={profile.id} />
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Calendar Legend</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm border-l-2 border-yellow-400 bg-yellow-100"></div>
              <span className="text-sm">Pending Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm border-l-2 border-blue-400 bg-blue-100"></div>
              <span className="text-sm">Confirmed Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm border-l-2 border-green-400 bg-green-100"></div>
              <span className="text-sm">Completed Bookings</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click on a booking to view details</li>
              <li>• Use the navigation arrows to move between months</li>
              <li>• Bookings are color-coded by status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 