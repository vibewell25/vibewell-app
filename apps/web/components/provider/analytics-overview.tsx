"use client";

import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  DollarSignIcon, 
  UsersIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  StarIcon 
} from "lucide-react";

interface Metric {
  value: number | string;
  change?: number;
  label: string;
  trend: "up" | "down" | "neutral";
  formatter?: "currency" | "percentage";
}

interface AnalyticsOverviewProps {
  metrics: {
    bookings: Metric;
    revenue: Metric;
    customers: Metric;
    completionRate: Metric;
    rating: Metric;
  };
}

export function AnalyticsOverview({ metrics }: AnalyticsOverviewProps) {
  const formatValue = (value: number | string, formatter?: string) => {
    if (formatter === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value));
    }
    
    if (formatter === "percentage") {
      return `${value}%`;
    }
    
    return value;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Bookings"
        value={formatValue(metrics.bookings.value)}
        change={metrics.bookings.change}
        label={metrics.bookings.label}
        trend={metrics.bookings.trend}
        icon={<CalendarIcon className="h-5 w-5" />}
      />
      
      <MetricCard
        title="Revenue"
        value={formatValue(metrics.revenue.value, "currency")}
        change={metrics.revenue.change}
        label={metrics.revenue.label}
        trend={metrics.revenue.trend}
        icon={<DollarSignIcon className="h-5 w-5" />}
      />
      
      <MetricCard
        title="Unique Customers"
        value={formatValue(metrics.customers.value)}
        label={metrics.customers.label}
        trend={metrics.customers.trend}
        icon={<UsersIcon className="h-5 w-5" />}
      />
      
      <MetricCard
        title="Completion Rate"
        value={formatValue(metrics.completionRate.value, "percentage")}
        label={metrics.completionRate.label}
        trend={metrics.completionRate.trend}
        icon={<CheckCircleIcon className="h-5 w-5" />}
      />
      
      <MetricCard
        title="Average Rating"
        value={metrics.rating.value}
        label={metrics.rating.label}
        trend={metrics.rating.trend}
        icon={<StarIcon className="h-5 w-5" />}
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  label: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, label, trend, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-primary">{icon}</div>
      </div>
      
      <div className="mt-3">
        <div className="text-2xl font-bold">{value}</div>
        
        <div className="mt-1 flex items-center text-xs">
          {trend === "up" && change !== undefined && (
            <>
              <ArrowUpIcon className="h-3 w-3 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">{change}%</span>
            </>
          )}
          
          {trend === "down" && change !== undefined && (
            <>
              <ArrowDownIcon className="h-3 w-3 text-rose-500 mr-1" />
              <span className="text-rose-500 font-medium">{Math.abs(change)}%</span>
            </>
          )}
          
          <span className="ml-1 text-muted-foreground">{label}</span>
        </div>
      </div>
    </div>
  );
} 