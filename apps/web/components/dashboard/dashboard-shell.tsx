"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "../ui/avatar";
import { Profile, UserRole } from "@vibewell/types";

interface DashboardShellProps {
  profile: Profile;
}

export function DashboardShell({ profile }: DashboardShellProps) {
  const router = useRouter();

  const navigateToRoleDashboard = () => {
    if (profile.role === UserRole.PROVIDER) {
      router.push("/provider/dashboard");
    } else if (profile.role === UserRole.ADMIN) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {profile.firstName}</h1>
          <p className="text-muted-foreground">
            Manage your beauty and wellness experience in one place.
          </p>
        </div>
        <div className="hidden md:block">
          {profile.role !== UserRole.CUSTOMER && (
            <button
              onClick={navigateToRoleDashboard}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90"
            >
              {profile.role === UserRole.PROVIDER
                ? "Provider Dashboard"
                : "Admin Dashboard"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <Avatar 
                src={profile.avatarUrl} 
                initials={`${profile.firstName[0]}${profile.lastName[0]}`}
                size="lg"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {profile.displayName || `${profile.firstName} ${profile.lastName}`}
                </h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {profile.role}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Link
                href="/profile"
                className="block w-full rounded-md border text-center py-2 text-sm transition-colors hover:bg-accent"
              >
                Edit Profile
              </Link>
              <Link
                href="/profile/settings"
                className="block w-full rounded-md border text-center py-2 text-sm transition-colors hover:bg-accent"
              >
                Account Settings
              </Link>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/bookings"
                  className="flex items-center space-x-2 text-sm text-primary hover:underline"
                >
                  <span>📅</span>
                  <span>Your Appointments</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="flex items-center space-x-2 text-sm text-primary hover:underline"
                >
                  <span>✨</span>
                  <span>Explore Services</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="flex items-center space-x-2 text-sm text-primary hover:underline"
                >
                  <span>❤️</span>
                  <span>Saved Services</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Upcoming Appointments</h3>
              <div className="py-8 text-center text-muted-foreground">
                <p>You don't have any upcoming appointments.</p>
                <Link
                  href="/services"
                  className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Browse Services
                </Link>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
              <div className="py-8 text-center text-muted-foreground">
                <p>You don't have any recent activity.</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-medium mb-2">Recommended For You</h3>
              <div className="py-8 text-center text-muted-foreground">
                <p>Personalized recommendations coming soon!</p>
                <Link
                  href="/services"
                  className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Browse All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 