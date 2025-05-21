"use client";

import Link from "next/link";
import { Profile } from "@vibewell/types";

interface AdminDashboardProps {
  profile: Profile;
}

export function AdminDashboard({ profile }: AdminDashboardProps) {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage the VibeWell platform and operations.
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

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">Users</h3>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/users"
              className="text-sm text-primary hover:underline"
            >
              Manage users →
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">Providers</h3>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
            <span className="text-3xl">🧑‍💼</span>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/providers"
              className="text-sm text-primary hover:underline"
            >
              View providers →
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">Services</h3>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
            <span className="text-3xl">✂️</span>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/services"
              className="text-sm text-primary hover:underline"
            >
              View services →
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
              href="/admin/finances"
              className="text-sm text-primary hover:underline"
            >
              View finances →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">System Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <h4 className="font-semibold text-green-700">API</h4>
                </div>
                <p className="mt-1 text-sm text-green-600">Operational</p>
              </div>
              
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <h4 className="font-semibold text-green-700">Database</h4>
                </div>
                <p className="mt-1 text-sm text-green-600">Operational</p>
              </div>
              
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <h4 className="font-semibold text-green-700">Authentication</h4>
                </div>
                <p className="mt-1 text-sm text-green-600">Operational</p>
              </div>
              
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <h4 className="font-semibold text-green-700">Storage</h4>
                </div>
                <p className="mt-1 text-sm text-green-600">Operational</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/admin/categories/new"
                className="block w-full rounded-md border p-2 text-center text-sm hover:bg-accent"
              >
                Create Category
              </Link>
              <Link
                href="/admin/users/new"
                className="block w-full rounded-md border p-2 text-center text-sm hover:bg-accent"
              >
                Add User
              </Link>
              <Link
                href="/admin/settings"
                className="block w-full rounded-md border p-2 text-center text-sm hover:bg-accent"
              >
                Platform Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 