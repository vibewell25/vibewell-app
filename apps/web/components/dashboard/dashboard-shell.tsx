"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@vibewell/ui";
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
    <div className="container max-w-7xl py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {profile.firstName}</h1>
          <p className="text-muted-foreground mt-2">
            Manage your beauty and wellness experience in one place.
          </p>
        </div>
        <div className="hidden md:block">
          {profile.role !== UserRole.CUSTOMER && (
            <button
              onClick={navigateToRoleDashboard}
              className="card-modern-button"
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
          <div className="card-modern p-6">
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
                <span className="card-modern-badge-primary mt-1">
                  {profile.role}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Link
                href="/profile"
                className="block w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-center py-2 text-sm transition-colors hover:bg-accent"
              >
                Edit Profile
              </Link>
              <Link
                href="/profile/settings"
                className="block w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-center py-2 text-sm transition-colors hover:bg-accent"
              >
                Account Settings
              </Link>
            </div>
          </div>

          <div className="card-modern p-6">
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
              <li>
                <Link
                  href="/messages"
                  className="flex items-center space-x-2 text-sm text-primary hover:underline"
                >
                  <span>💬</span>
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="flex items-center space-x-2 text-sm text-primary hover:underline"
                >
                  <span>📊</span>
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/virtual-tryon"
                  className="flex items-center space-x-2 text-sm text-primary hover:underline"
                >
                  <span>🤖</span>
                  <span>AI Virtual Try-On</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/social"
                  className="flex items-center space-x-2 text-sm text-primary hover:underline"
                >
                  <span>👥</span>
                  <span>Social Feed</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="flex items-center space-x-2 text-sm text-primary hover:underline"
                >
                  <span>📚</span>
                  <span>Learning Courses</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="card-modern p-6">
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

            <div className="card-modern p-6">
              <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
              <div className="py-8 text-center text-muted-foreground">
                <p>You don't have any recent activity.</p>
              </div>
            </div>

            <div className="card-modern p-6 lg:col-span-2">
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