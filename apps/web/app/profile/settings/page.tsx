import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { PasswordForm } from "@/components/profile/password-form";
import { customers } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Account Settings | VibeWell",
  description: "Manage your VibeWell account settings",
};

export default async function AccountSettingsPage() {
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
    <>
      <div className="rounded-lg border bg-card shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        <PasswordForm />
      </div>
      
      <div className="rounded-lg border bg-card shadow-sm p-6 mt-6">
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
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing Communications</h3>
              <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="marketing-communications" className="sr-only" defaultChecked />
              <label htmlFor="marketing-communications" className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-pointer">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </label>
            </div>
          </div>
          
          <button className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Save Preferences
          </button>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold mb-6">Account Actions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="inline-flex h-10 items-center rounded-md border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 