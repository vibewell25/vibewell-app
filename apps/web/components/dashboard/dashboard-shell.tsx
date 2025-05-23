"use client";

import React from "react";
import Link from "next/link";
import { Profile, UserRole } from "@vibewell/types";

interface DashboardShellProps {
  profile: Profile;
  children: React.ReactNode;
}

export function DashboardShell({ profile, children }: DashboardShellProps) {
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="md:w-64 shrink-0">
          <div className="sticky top-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-primary/10">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={`${profile.firstName} ${profile.lastName}` || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-primary text-xl font-semibold">
                    {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{`${profile.firstName} ${profile.lastName}` || "User"}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <NavLink href="/profile/dashboard" label="Dashboard" />
              <NavLink href="/bookings" label="My Bookings" />
              <NavLink href="/profile/favorites" label="Favorites" />
              <NavLink href="/profile/reviews" label="My Reviews" />
              <NavLink href="/profile/settings" label="Account Settings" />
              <NavLink href="/rewards" label="Rewards & Credits" />
              
              {profile.role === UserRole.PROVIDER && (
                <>
                  <div className="border-t my-4" />
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Provider Tools</h3>
                  <NavLink href="/provider/dashboard" label="Provider Dashboard" />
                  <NavLink href="/provider/services" label="Manage Services" />
                  <NavLink href="/provider/calendar" label="Availability" />
                  <NavLink href="/provider/reviews" label="Customer Reviews" />
                  <NavLink href="/provider/profile" label="Edit Provider Profile" />
                </>
              )}
              
              <div className="border-t my-4" />
              <NavLink href="/help" label="Help & Support" />
              <button className="w-full text-left px-3 py-2 text-sm rounded-md text-red-500 hover:bg-muted">
                Sign Out
              </button>
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
}

function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm rounded-md hover:bg-muted"
    >
      {label}
    </Link>
  );
} 