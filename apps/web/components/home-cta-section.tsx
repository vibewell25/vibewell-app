"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { locations } from "@/lib/mock-data";

export function HomeCTASection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  // Group locations by country
  const locationsByCountry = locations.reduce((acc, location) => {
    if (!acc[location.country]) {
      acc[location.country] = [];
    }
    acc[location.country].push(location);
    return acc;
  }, {} as Record<string, typeof locations>);
  
  // Get top countries with most locations
  const topCountries = Object.entries(locationsByCountry)
    .map(([country, locs]) => ({
      name: country,
      count: locs.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/services?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative flex max-w-md items-center">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <input
          type="search"
          placeholder="Search for services..."
          className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-8 pr-12 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          Search
        </button>
      </div>
      
      <div className="relative">
        <button
          className="flex w-full max-w-md items-center justify-between rounded-md border bg-background p-2 text-sm text-muted-foreground hover:bg-accent/50"
          onClick={() => setShowLocationDropdown(!showLocationDropdown)}
        >
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Browse by location</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${showLocationDropdown ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        
        {showLocationDropdown && (
          <div className="absolute z-10 mt-1 w-full max-w-md rounded-md border bg-background p-2 shadow-md">
            <div className="mb-2 pb-2 border-b">
              <p className="px-2 py-1 text-sm font-medium">Popular Countries</p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {topCountries.map(country => (
                  <Link
                    key={country.name}
                    href={`/services?country=${encodeURIComponent(country.name)}`}
                    className="flex items-center px-2 py-1 text-sm rounded-md hover:bg-accent"
                    onClick={() => setShowLocationDropdown(false)}
                  >
                    <MapPin className="mr-1 h-3 w-3 text-primary" />
                    <span>{country.name}</span>
                    <span className="ml-1 text-xs text-muted-foreground">({country.count})</span>
                  </Link>
                ))}
              </div>
            </div>
            
            <p className="px-2 py-1 text-sm font-medium">Featured Locations</p>
            <div className="grid grid-cols-2 gap-1 mt-1 max-h-60 overflow-y-auto">
              {locations.slice(0, 12).map(location => (
                <Link
                  key={location.id}
                  href={`/services?location=${encodeURIComponent(location.id)}`}
                  className="flex items-center px-2 py-1 text-sm rounded-md hover:bg-accent"
                  onClick={() => setShowLocationDropdown(false)}
                >
                  <MapPin className="mr-1 h-3 w-3 text-primary" />
                  <span>{location.name}, {location.country}</span>
                </Link>
              ))}
            </div>
            
            <div className="mt-2 pt-2 border-t">
              <Link
                href="/services?view=map"
                className="flex items-center justify-center w-full px-2 py-1.5 text-sm font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20"
                onClick={() => setShowLocationDropdown(false)}
              >
                View all on map
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Link
          href="/services"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Browse All Services
        </Link>
        <Link
          href="/services?category=1"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Hair Care
        </Link>
        <Link
          href="/services?category=3"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Massage
        </Link>
        <Link
          href="/services?category=6"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Wellness
        </Link>
      </div>
    </div>
  );
} 