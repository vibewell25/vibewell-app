"use client";

import Link from "next/link";
import { Avatar } from "@vibewell/ui";
import { Profile } from "@vibewell/types";

interface ProviderDashboardProps {
  profile: Profile;
}

export function ProviderDashboard({ profile }: ProviderDashboardProps) {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Provider Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your services, bookings, and business metrics.
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              href="/dashboard"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90"
            >
              Customer Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">Services</h3>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
            <span className="text-3xl">🛠️</span>
          </div>
          <div className="mt-4">
            <Link
              href="/provider/services"
              className="text-sm text-primary hover:underline"
            >
              Manage services →
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">Bookings</h3>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
          <div className="mt-4">
            <Link
              href="/provider/bookings"
              className="text-sm text-primary hover:underline"
            >
              View bookings →
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">Revenue</h3>
              <p className="text-3xl font-bold mt-2">$0</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
          <div className="mt-4">
            <Link
              href="/provider/earnings"
              className="text-sm text-primary hover:underline"
            >
              View earnings →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
            <div className="py-8 text-center text-muted-foreground">
              <p>You don't have any recent bookings.</p>
              <p className="mt-2 text-sm">
                Start by creating services to offer to customers.
              </p>
              <Link
                href="/provider/services/new"
                className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Create Service
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Profile Preview</h3>
            <div className="flex items-center gap-4 mb-4">
              <Avatar
                src={profile.avatarUrl}
                initials={`${profile.firstName[0]}${profile.lastName[0]}`}
                size="lg"
              />
              <div>
                <h4 className="font-medium">
                  {profile.displayName || `${profile.firstName} ${profile.lastName}`}
                </h4>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">
                {profile.bio || "No bio available. Add a bio to tell customers about yourself and your services."}
              </p>
              <Link
                href="/profile"
                className="mt-4 block text-center text-sm text-primary hover:underline"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 