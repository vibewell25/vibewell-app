"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceMap } from "@/components/services/service-map";
import { services, categories, locations } from "@/lib/mock-data";
import { Search, MapPin, ArrowUpDown, Star, Grid, Map } from "lucide-react";

// Define filter types
type DurationFilterKeys = "under30" | "min30to60" | "min60to90" | "over90";
type PriceRangeKeys = "min" | "max";
type ViewMode = "list" | "map";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [durationFilters, setDurationFilters] = useState({
    under30: false,
    min30to60: false,
    min60to90: false,
    over90: false
  });
  const [showPopular, setShowPopular] = useState(false);
  const [sortOption, setSortOption] = useState("recommended");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  
  // Initialize state from URL parameters
  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "map") {
      setViewMode("map");
    }
    
    const country = searchParams.get("country");
    if (country) {
      // Find the first location for the country
      const locationForCountry = locations.find(loc => loc.country === country);
      if (locationForCountry) {
        setSelectedLocation(locationForCountry.id);
      }
    }
    
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
    }
    
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);
  
  // Update URL when view mode changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    
    // Update URL query parameters
    const params = new URLSearchParams(searchParams.toString());
    
    if (mode === "map") {
      params.set("view", "map");
    } else {
      params.delete("view");
    }
    
    router.push(`/services?${params.toString()}`);
  };

  // Filtering logic
  const filteredServices = services
    .filter(service => {
      // Search query filter
      if (searchQuery && 
          !service.name?.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !service.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== "all" && service.categoryId !== selectedCategory) {
        return false;
      }
      
      // Location filter
      if (selectedLocation !== "all" && service.locationId !== selectedLocation) {
        return false;
      }
      
      // Price range filter
      if (service.price < priceRange.min || service.price > priceRange.max) {
        return false;
      }
      
      // Duration filters
      if (durationFilters.under30 && (service.durationMinutes ?? 0) >= 30) {
        return false;
      }
      if (durationFilters.min30to60 && ((service.durationMinutes ?? 0) < 30 || (service.durationMinutes ?? 0) >= 60)) {
        return false;
      }
      if (durationFilters.min60to90 && ((service.durationMinutes ?? 0) < 60 || (service.durationMinutes ?? 0) >= 90)) {
        return false;
      }
      if (durationFilters.over90 && (service.durationMinutes ?? 0) < 90) {
        return false;
      }
      
      // Popular filter
      if (showPopular && (service.rating ?? 0) < 4.5) {
        return false;
      }
      
      return true;
    });
    
  // Sorting logic
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortOption) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "durationAsc":
        return (a.durationMinutes ?? 0) - (b.durationMinutes ?? 0);
      case "durationDesc":
        return (b.durationMinutes ?? 0) - (a.durationMinutes ?? 0);
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      default:
        return 0; // recommended - no specific sorting
    }
  });

  // Handle filters change
  const handleDurationChange = (filter: DurationFilterKeys) => {
    setDurationFilters({
      ...durationFilters,
      [filter]: !durationFilters[filter]
    });
  };
  
  const handlePriceChange = (type: PriceRangeKeys, value: string) => {
    setPriceRange({
      ...priceRange,
      [type]: Number(value) || 0
    });
  };
  
  const handleApplyFilters = () => {
    // Already applied through state changes
  };
  
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setPriceRange({ min: 0, max: 1000 });
    setDurationFilters({
      under30: false,
      min30to60: false,
      min60to90: false,
      over90: false
    });
    setShowPopular(false);
    setSortOption("recommended");
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="text-muted-foreground">
          Browse our beauty and wellness services
        </p>
      </div>
      
      {/* Search and sort bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center ml-auto gap-2">
          {/* View toggle */}
          <div className="mr-4 flex items-center gap-2 border rounded-md p-1">
            <button
              onClick={() => handleViewModeChange("list")}
              className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-primary text-white" : "text-gray-500"}`}
              aria-label="List view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange("map")}
              className={`p-1.5 rounded-md ${viewMode === "map" ? "bg-primary text-white" : "text-gray-500"}`}
              aria-label="Map view"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
          
          <label htmlFor="sort" className="text-sm whitespace-nowrap">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="recommended">Recommended</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="durationAsc">Duration: Shortest</option>
            <option value="durationDesc">Duration: Longest</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <button 
                onClick={clearAllFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
            
            {/* Location filter */}
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> Location
              </h3>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="all">All Locations</option>
                {locations?.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}, {location.state ? `${location.state}, ` : ""}{location.country}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Popular filter */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="popular"
                checked={showPopular}
                onChange={() => setShowPopular(!showPopular)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="popular" className="ml-2 text-sm flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" /> Popular (4.5+ rating)
              </label>
            </div>
            
            <div className="border-t my-4"></div>
            
            {/* Categories */}
            <h3 className="text-md font-medium mb-2">Categories</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all"
                  name="category"
                  checked={selectedCategory === "all"}
                  onChange={() => setSelectedCategory("all")}
                  className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="all" className="ml-2 text-sm">
                  All Categories
                </label>
              </div>

              {categories?.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    id={category.id}
                    name="category"
                    checked={selectedCategory === category.id}
                    onChange={() => setSelectedCategory(category.id)}
                    className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={category.id} className="ml-2 text-sm">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="border-t my-4"></div>

            <h3 className="text-md font-medium mb-2">Price Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Min</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 text-sm focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Max</label>
                <input
                  type="number"
                  min="0"
                  placeholder="1000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 text-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="border-t my-4"></div>

            <h3 className="text-md font-medium mb-2">Duration</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="duration-30"
                  checked={durationFilters.under30}
                  onChange={() => handleDurationChange("under30")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="duration-30" className="ml-2 text-sm">
                  Under 30 minutes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="duration-60"
                  checked={durationFilters.min30to60}
                  onChange={() => handleDurationChange("min30to60")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="duration-60" className="ml-2 text-sm">
                  30 - 60 minutes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="duration-90"
                  checked={durationFilters.min60to90}
                  onChange={() => handleDurationChange("min60to90")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="duration-90" className="ml-2 text-sm">
                  60 - 90 minutes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="duration-120"
                  checked={durationFilters.over90}
                  onChange={() => handleDurationChange("over90")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="duration-120" className="ml-2 text-sm">
                  Over 90 minutes
                </label>
              </div>
            </div>

            <button
              onClick={handleApplyFilters}
              className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {viewMode === "list" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedServices.length > 0 ? (
                  sortedServices.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No services found matching your criteria.</p>
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <ServiceMap 
                services={sortedServices} 
                height="600px"
                zoom={2}
                centerLocation={selectedLocation !== "all" ? selectedLocation : undefined}
              />
              {sortedServices.length === 0 && (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">No services found matching your criteria.</p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}