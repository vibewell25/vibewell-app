"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ProfileSidebarProps = {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string | null;
  };
};

export function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const pathname = usePathname();
  
  // Check if current path is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="card-modern p-6">
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
            className="card-modern-button w-full"
          >
            Edit Profile
          </Link>
        </div>
      </div>
      
      <div className="border-t mt-6 pt-6">
        <nav className="space-y-2">
          <Link
            href="/profile"
            className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
              isActive("/profile") ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile Information
          </Link>
          <Link
            href="/bookings"
            className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
              isActive("/bookings") ? "bg-accent text-accent-foreground" : ""
            }`}
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
            className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
              isActive("/profile/reviews") ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Your Reviews
          </Link>
          <Link
            href="/profile/notifications"
            className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
              isActive("/profile/notifications") ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            Notifications
          </Link>
          <Link
            href="/profile/settings"
            className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
              isActive("/profile/settings") ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Account Settings
          </Link>
        </nav>
      </div>
    </div>
  );
} 