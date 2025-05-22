"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Profile } from "@vibewell/types";

interface QuickStatsProps {
  profile: Profile;
}

export function QuickStats({ profile }: QuickStatsProps) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    loyaltyPoints: 0,
  });

  useEffect(() => {
    // In a real app, this would fetch actual stats from the API
    // For now, let's use some mock data
    const mockStats = {
      totalBookings: 14,
      upcomingBookings: 2,
      completedBookings: 12,
      loyaltyPoints: 230,
    };
    
    // Simulate an API call
    setTimeout(() => {
      setStats(mockStats);
    }, 300);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Bookings" value={stats.totalBookings} />
      <StatCard label="Upcoming" value={stats.upcomingBookings} />
      <StatCard label="Completed" value={stats.completedBookings} />
      <StatCard label="Loyalty Points" value={stats.loyaltyPoints} />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-3xl font-bold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
} 