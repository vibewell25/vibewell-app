import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { customers } from "@/lib/mock-data";
import { UserRole } from "@vibewell/types";
import { RecentBookings } from "@/components/profile/recent-bookings";
import { ProfileActions } from "@/components/profile/profile-actions";

export const metadata: Metadata = {
  title: "Your Profile | VibeWell",
  description: "View and edit your VibeWell profile",
};

export default async function ProfilePage() {
  // Try to get real profile data first
  const profileData = await getCurrentProfile();
  
  // If no real profile (e.g., in development), use mock data
  let profile: any = profileData;
  if (!profile) {
    // For mock purposes, just use the first customer
    profile = customers[0];
  }
  
  if (!profile) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <ProfileActions profile={profile} />
      </div>
      
      <div className="card-modern p-6">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">First Name</h3>
              <p className="font-medium">{profile.firstName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Name</h3>
              <p className="font-medium">{profile.lastName}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
            <p className="font-medium">{profile.email}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
            <p className="font-medium">{profile.phone || "Not provided"}</p>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Address</h3>
            
            {profile.address ? (
              <div>
                <p>{profile.address}</p>
                {profile.city && profile.state && profile.zipCode && (
                  <p>{profile.city}, {profile.state} {profile.zipCode}</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No address provided</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <RecentBookings />
      </div>
      
      <div className="card-modern p-6 mt-6">
        <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive email updates about your bookings</p>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="email-notifications" className="sr-only" defaultChecked />
              <label htmlFor="email-notifications" className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-pointer">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive text messages for booking reminders</p>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="sms-notifications" className="sr-only" defaultChecked />
              <label htmlFor="sms-notifications" className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-pointer">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 