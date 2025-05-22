import { Metadata } from "next";
import Link from "next/link";
import { customers } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Your Profile | VibeWell",
  description: "View and edit your VibeWell profile",
};

export default function ProfilePage() {
  // For mock purposes, just use the first customer
  const profile = customers[0];

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account information
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="rounded-lg border bg-card shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 mb-4 overflow-hidden">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary text-xl font-medium">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              
              <div className="mt-6 w-full">
                <Link
                  href="/profile/edit"
                  className="inline-flex w-full h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
            
            <div className="border-t mt-6 pt-6">
              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-md px-3 py-2 bg-accent text-accent-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile Information
                </Link>
                <Link
                  href="/bookings"
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                  Your Bookings
                </Link>
                <Link
                  href="/profile/reviews"
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Your Reviews
                </Link>
                <Link
                  href="/profile/notifications"
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  Notifications
                </Link>
                <Link
                  href="/profile/password"
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Change Password
                </Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card shadow-sm p-6">
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
          
          <div className="rounded-lg border bg-card shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
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
              
              <div className="pt-4 border-t">
                <button className="inline-flex h-9 items-center justify-center rounded-md border border-destructive bg-destructive/10 px-4 text-sm font-medium text-destructive shadow-sm hover:bg-destructive/20">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 