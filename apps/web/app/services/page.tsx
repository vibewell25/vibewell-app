"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceMap } from "@/components/services/service-map";
import { services, categories, locations, providers } from "@/lib/mock-data";
import { Search, MapPin, ArrowUpDown, Star, Grid, Map, ChevronRight, ChevronLeft, Filter, Sliders, X, Award, Clock, Calendar, Tag } from "lucide-react";
import { ServiceSkeleton, ServiceSkeletonGrid } from "@/components/services/service-skeleton";
import { ProviderCard } from "@/components/services/provider-card";

// Define filter types
type DurationFilterKeys = "under30" | "min30to60" | "min60to90" | "over90";
type PriceRangeKeys = "min" | "max";
type ViewMode = "list" | "map";
type ExperienceLevelKeys = "beginner" | "intermediate" | "advanced" | "all-levels";
type ServiceTypeKeys = "in-person" | "virtual" | "group" | "private";
type AppliedFilter = {
  type: string;
  value: string;
  displayValue?: string;
};
type DistanceFilterKeys = "5km" | "10km" | "25km" | "50km" | "100km";

// Number of items per page for pagination
const ITEMS_PER_PAGE = 9;

// Create a reusable toggle switch component with improved functionality
const ToggleSwitch = ({ 
  id, 
  label, 
  checked, 
  onChange 
}: { 
  id: string; 
  label: React.ReactNode; 
  checked: boolean; 
  onChange: () => void 
}) => {
  // Add debug logging to help trace the issue
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Stop event propagation to prevent double firing
    e.stopPropagation();
    e.preventDefault();
    console.log(`Toggle clicked: ${id}, current state: ${checked}, changing to: ${!checked}`);
    onChange();
  };

  return (
    <div 
      className="flex items-center justify-between group hover:bg-white/70 p-2 rounded-md transition-colors cursor-pointer"
      onClick={(e) => handleClick(e)}
    >
      <label 
        htmlFor={id} 
        className="text-sm cursor-pointer flex items-center flex-1 mr-2"
      >
        {label}
      </label>
      <div 
        className="relative inline-block w-12 align-middle select-none cursor-pointer"
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e);
          }
        }}
      >
        <input 
          type="checkbox"
          id={id}
          checked={checked}
          onChange={() => {}}
          className="sr-only"
        />
        <div 
          className={`block h-6 w-12 rounded-full ${checked ? 'bg-primary' : 'bg-gray-300'} transition-colors duration-200`}
        ></div>
        <div 
          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`}
        ></div>
      </div>
    </div>
  );
};

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [durationFilters, setDurationFilters] = useState({
    under30: false,
    min30to60: false,
    min60to90: false,
    over90: false
  });
  const [experienceLevelFilters, setExperienceLevelFilters] = useState({
    beginner: false,
    intermediate: false,
    advanced: false,
    "all-levels": false
  });
  const [serviceTypeFilters, setServiceTypeFilters] = useState({
    "in-person": false,
    virtual: false,
    group: false,
    private: false
  });
  const [showNew, setShowNew] = useState(false);
  const [sortOption, setSortOption] = useState("recommended");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<DistanceFilterKeys | "all">("all");
  const [availabilityFilters, setAvailabilityFilters] = useState({
    "available-today": false,
    "available-weekend": false,
    "available-evening": false
  });
  const [amenityFilters, setAmenityFilters] = useState({
    "parking": false,
    "wheelchair": false,
    "wifi": false,
    "childcare": false
  });
  
  // Add a search type toggle for services/providers
  const [searchType, setSearchType] = useState<"services" | "providers">("services");
  
  // Log state changes for debugging
  useEffect(() => {
    console.log("Service type filters updated:", serviceTypeFilters);
  }, [serviceTypeFilters]);
  
  useEffect(() => {
    console.log("Duration filters updated:", durationFilters);
  }, [durationFilters]);
  
  useEffect(() => {
    console.log("Experience level filters updated:", experienceLevelFilters);
  }, [experienceLevelFilters]);
  
  useEffect(() => {
    console.log("Amenity filters updated:", amenityFilters);
  }, [amenityFilters]);
  
  useEffect(() => {
    console.log("Availability filters updated:", availabilityFilters);
  }, [availabilityFilters]);
  
  // Reset scroll position when filters change
  useEffect(() => {
    if (showFilters) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showFilters]);
  
  // Force re-render when filters change
  const forceUpdate = useState({})[1];
  
  const refreshUI = useCallback(() => {
    // Force component to re-render
    forceUpdate({});
  }, [forceUpdate]);
  
  // Ensure UI updates when filters change
  useEffect(() => {
    refreshUI();
  }, [
    serviceTypeFilters, 
    durationFilters, 
    experienceLevelFilters, 
    amenityFilters, 
    availabilityFilters,
    showNew,
    selectedCategory,
    selectedLocation,
    selectedDistance,
    priceRange,
    refreshUI
  ]);
  
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
    
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    } else {
      setCurrentPage(1);
    }
    
    // Simulate loading time for data
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [searchParams]);
  
  // Update URL when view mode changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    
    // Update the URL with the view parameter
    const params = new URLSearchParams(searchParams.toString());
    if (mode === "map") {
      params.set("view", "map");
    } else {
      params.delete("view");
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL query parameters
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
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
      
      // Experience level filters - simulate with service ID to distribute services
      const activeExperienceLevelFilters = Object.entries(experienceLevelFilters)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key);
      
      if (activeExperienceLevelFilters.length > 0) {
        // Deterministically assign each service to an experience level based on ID
        const serviceIdNum = parseInt(service.id.replace(/\D/g, '') || '0', 10);
        const experienceLevels: ExperienceLevelKeys[] = ['beginner', 'intermediate', 'advanced', 'all-levels'];
        const simulatedLevel = experienceLevels[serviceIdNum % experienceLevels.length];
        
        // If none of the active filters match this service's simulated level, filter it out
        if (!activeExperienceLevelFilters.includes(simulatedLevel)) {
          return false;
        }
      }
      
      // Service type filters - simulate with service name
      const activeServiceTypeFilters = Object.entries(serviceTypeFilters)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key);
      
      if (activeServiceTypeFilters.length > 0) {
        // Simulate service type based on name or description content
        const serviceTypeMap: Record<ServiceTypeKeys, string[]> = {
          'in-person': ['massage', 'facial', 'salon', 'spa'],
          'virtual': ['online', 'virtual', 'digital', 'remote'],
          'group': ['class', 'workshop', 'group', 'together'],
          'private': ['private', 'individual', 'personal', 'one-on-one']
        };
        
        // Check if any active filter keywords match the service name or description
        const serviceMatches = activeServiceTypeFilters.some(filterType => {
          const keywords = serviceTypeMap[filterType as ServiceTypeKeys];
          return keywords.some(keyword => 
            service.name?.toLowerCase().includes(keyword) || 
            service.description?.toLowerCase().includes(keyword)
          );
        });
        
        if (!serviceMatches) {
          return false;
        }
      }
      
      // New services filter - simulate with service ID (lower IDs are newer)
      if (showNew) {
        // Treat services with IDs divisible by 3 as "new"
        const serviceIdNum = parseInt(service.id.replace(/\D/g, '') || '0', 10);
        if (serviceIdNum % 3 !== 0) {
          return false;
        }
      }
      
      // Distance filter - simulate using serviceId to filter some services
      if (selectedDistance !== "all") {
        // Simulate distance filtering by removing some services
        const serviceIdNum = parseInt(service.id.replace(/\D/g, '') || '0', 10);
        
        switch(selectedDistance) {
          case "5km":
            if (serviceIdNum % 5 !== 0) return false;
            break;
          case "10km":
            if (serviceIdNum % 4 !== 0) return false;
            break;
          case "25km":
            if (serviceIdNum % 3 !== 0) return false;
            break;
          case "50km":
            if (serviceIdNum % 2 !== 0) return false;
            break;
          // 100km includes all services
        }
      }
      
      // Amenity filters - simulate with service ID
      const activeAmenityFilters = Object.entries(amenityFilters)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key);
      
      if (activeAmenityFilters.length > 0) {
        // Simple simulation based on service ID
        const serviceIdNum = parseInt(service.id.replace(/\D/g, '') || '0', 10);
        const hasAmenities = activeAmenityFilters.every(filter => {
          switch(filter) {
            case "parking": return serviceIdNum % 2 === 0;
            case "wheelchair": return serviceIdNum % 3 === 0;
            case "wifi": return serviceIdNum % 5 === 0;
            case "childcare": return serviceIdNum % 7 === 0;
            default: return true;
          }
        });
        
        if (!hasAmenities) return false;
      }
      
      // Availability filters - simulate with service ID
      const activeAvailabilityFilters = Object.entries(availabilityFilters)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key);
      
      if (activeAvailabilityFilters.length > 0) {
        // Simple simulation based on service ID
        const serviceIdNum = parseInt(service.id.replace(/\D/g, '') || '0', 10);
        const isAvailable = activeAvailabilityFilters.every(filter => {
          switch(filter) {
            case "available-today": return serviceIdNum % 2 === 0;
            case "available-weekend": return serviceIdNum % 3 === 0;
            case "available-evening": return serviceIdNum % 4 === 0;
            default: return true;
          }
        });
        
        if (!isAvailable) return false;
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
      case "mostReviewed":
        // Simulate review count using service ID for demo purposes
        const getReviewCount = (service: typeof services[0]) => {
          const serviceId = parseInt(service.id.replace(/\D/g, '') || '0', 10);
          return serviceId * 3 + 5; // Simple formula to generate a review count
        };
        return getReviewCount(b) - getReviewCount(a);
      case "newest":
        // Sort by creation date, newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "trending":
        // Simulate trending score using a combination of rating and ID
        const getTrendingScore = (service: typeof services[0]) => {
          const serviceId = parseInt(service.id.replace(/\D/g, '') || '0', 10);
          const rating = service.rating ?? 3.0;
          // Simple formula: rating * factor + recency factor
          return rating * 10 + (serviceId % 5) * 2;
        };
        return getTrendingScore(b) - getTrendingScore(a);
      default:
        return 0; // recommended - no specific sorting
    }
  });

  // Handle filters change
  const handleDurationChange = (filter: DurationFilterKeys) => {
    // Directly set new state value
    const newValue = !durationFilters[filter];
    
    // Create a new object to ensure state update
    setDurationFilters(prevState => ({
      ...prevState,
      [filter]: newValue
    }));
    
    // Update applied filters
    if (newValue) {
      let displayValue = "";
      switch(filter) {
        case "under30":
          displayValue = "Under 30 minutes";
          break;
        case "min30to60":
          displayValue = "30-60 minutes";
          break;
        case "min60to90":
          displayValue = "60-90 minutes";
          break;
        case "over90":
          displayValue = "Over 90 minutes";
          break;
      }
      setAppliedFilters(prev => [...prev, {type: "Duration", value: filter, displayValue}]);
    } else {
      setAppliedFilters(prev => prev.filter(f => !(f.type === "Duration" && f.value === filter)));
    }
  };
  
  const handleExperienceLevelChange = (filter: ExperienceLevelKeys) => {
    // Directly set new state value
    const newValue = !experienceLevelFilters[filter];
    
    // Create a new object to ensure state update
    setExperienceLevelFilters(prevState => ({
      ...prevState,
      [filter]: newValue
    }));
    
    // Update applied filters
    if (newValue) {
      let displayValue = "";
      switch(filter) {
        case "beginner":
          displayValue = "Beginner";
          break;
        case "intermediate":
          displayValue = "Intermediate";
          break;
        case "advanced":
          displayValue = "Advanced";
          break;
        case "all-levels":
          displayValue = "All Levels";
          break;
      }
      setAppliedFilters(prev => [...prev, {type: "Experience Level", value: filter, displayValue}]);
    } else {
      setAppliedFilters(prev => prev.filter(f => !(f.type === "Experience Level" && f.value === filter)));
    }
  };
  
  const handleServiceTypeChange = (filter: ServiceTypeKeys) => {
    // Directly set new state value
    const newValue = !serviceTypeFilters[filter];
    
    // Create a new object to ensure state update
    setServiceTypeFilters(prevState => ({
      ...prevState,
      [filter]: newValue
    }));
    
    // Update applied filters
    if (newValue) {
      let displayValue = "";
      switch(filter) {
        case "in-person":
          displayValue = "In-Person";
          break;
        case "virtual":
          displayValue = "Virtual";
          break;
        case "group":
          displayValue = "Group Sessions";
          break;
        case "private":
          displayValue = "Private Sessions";
          break;
      }
      setAppliedFilters(prev => [...prev, {type: "Service Type", value: filter, displayValue}]);
    } else {
      setAppliedFilters(prev => prev.filter(f => !(f.type === "Service Type" && f.value === filter)));
    }
  };
  
  const handlePriceChange = (type: PriceRangeKeys, value: string) => {
    setPriceRange({
      ...priceRange,
      [type]: Number(value) || 0
    });
  };
  
  const handleApplyFilters = () => {
    // Already applied through state changes
    if (showFilters) {
      setShowFilters(false);
    }
  };
  
  // Handle amenity filter change
  const handleAmenityChange = (filter: string) => {
    // Directly set new state value
    const newValue = !amenityFilters[filter as keyof typeof amenityFilters];
    
    // Create a new object to ensure state update
    setAmenityFilters(prevState => ({
      ...prevState,
      [filter]: newValue
    }));
    
    // Update applied filters
    if (newValue) {
      let displayValue = "";
      switch(filter) {
        case "parking":
          displayValue = "Free Parking";
          break;
        case "wheelchair":
          displayValue = "Wheelchair Accessible";
          break;
        case "wifi":
          displayValue = "Free Wi-Fi";
          break;
        case "childcare":
          displayValue = "Childcare Available";
          break;
      }
      setAppliedFilters(prev => [...prev, {type: "Amenity", value: filter, displayValue}]);
    } else {
      setAppliedFilters(prev => prev.filter(f => !(f.type === "Amenity" && f.value === filter)));
    }
  };
  
  // Handle availability filter change
  const handleAvailabilityChange = (filter: string) => {
    // Directly set new state value
    const newValue = !availabilityFilters[filter as keyof typeof availabilityFilters];
    
    // Create a new object to ensure state update
    setAvailabilityFilters(prevState => ({
      ...prevState,
      [filter]: newValue
    }));
    
    // Update applied filters
    if (newValue) {
      let displayValue = "";
      switch(filter) {
        case "available-today":
          displayValue = "Available Today";
          break;
        case "available-weekend":
          displayValue = "Available This Weekend";
          break;
        case "available-evening":
          displayValue = "Evening Appointments";
          break;
      }
      setAppliedFilters(prev => [...prev, {type: "Availability", value: filter, displayValue}]);
    } else {
      setAppliedFilters(prev => prev.filter(f => !(f.type === "Availability" && f.value === filter)));
    }
  };
  
  // Handle distance filter change
  const handleDistanceChange = (distance: DistanceFilterKeys | "all") => {
    setSelectedDistance(distance);
    
    // Update applied filters
    if (distance !== "all") {
      const distanceValue = distance;
      const displayValue = `Within ${distance}`;
      
      // Remove any existing distance filters
      const filteredFilters = appliedFilters.filter(f => f.type !== "Distance");
      
      // Add the new distance filter
      setAppliedFilters([...filteredFilters, {type: "Distance", value: distanceValue, displayValue}]);
    } else {
      // Remove distance filter if "all" is selected
      setAppliedFilters(appliedFilters.filter(f => f.type !== "Distance"));
    }
  };
  
  // Clear all filters and reset pagination
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
    setExperienceLevelFilters({
      beginner: false,
      intermediate: false,
      advanced: false,
      "all-levels": false
    });
    setServiceTypeFilters({
      "in-person": false,
      virtual: false,
      group: false,
      private: false
    });
    setShowNew(false);
    setSortOption("recommended");
    setCurrentPage(1);
    setAppliedFilters([]);
    setSelectedDistance("all");
    setAvailabilityFilters({
      "available-today": false,
      "available-weekend": false,
      "available-evening": false
    });
    setAmenityFilters({
      "parking": false,
      "wheelchair": false,
      "wifi": false,
      "childcare": false
    });
    
    // Update URL to remove all filter parameters
    router.push('/services');
  };
  
  // Calculate pagination details
  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedServices = sortedServices.slice(startIndex, endIndex);
  
  // Toggle filter sidebar on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Add provider filtering logic
  const filteredProviders = providers.filter(provider => {
    // Search query filter for provider name or specialty
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const fullName = `${provider.firstName} ${provider.lastName}`.toLowerCase();
      // Safely access specialties with type checking
      const specialties = Array.isArray((provider as any).specialties) 
        ? (provider as any).specialties.map((s: string) => s.toLowerCase()) 
        : [];
      const bio = (provider.bio || "").toLowerCase();
      
      const matchesQuery = 
        fullName.includes(query) || 
        specialties.some((s: string) => s.includes(query)) ||
        bio.includes(query);
      
      if (!matchesQuery) return false;
    }
    
    // Category filter for provider specialties
    if (selectedCategory !== "all") {
      // Safely access specialties with type checking
      const specialties = Array.isArray((provider as any).specialties) 
        ? (provider as any).specialties.map((s: string) => s.toLowerCase()) 
        : [];
      if (!specialties.includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }
    
    // Location filter
    if (selectedLocation !== "all") {
      if ((provider as any).locationId !== selectedLocation) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort providers
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortOption) {
      case "rating":
        return ((b as any).rating || 0) - ((a as any).rating || 0);
      case "mostReviewed":
        return ((b as any).reviewCount || 0) - ((a as any).reviewCount || 0);
      case "newest":
        return new Date((b as any).joinedAt || b.createdAt).getTime() - 
               new Date((a as any).joinedAt || a.createdAt).getTime();
      default:
        return 0; // recommended - no specific sorting
    }
  });
  
  // Pagination for providers
  const totalProviderItems = filteredProviders.length;
  const totalProviderPages = Math.ceil(totalProviderItems / ITEMS_PER_PAGE);
  const startProviderIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endProviderIndex = Math.min(startProviderIndex + ITEMS_PER_PAGE, totalProviderItems);
  const paginatedProviders = sortedProviders.slice(startProviderIndex, endProviderIndex);
  
  return (
    <div className="container max-w-7xl mx-auto py-8 md:py-10 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Find Your Perfect Service</h1>
        <p className="text-muted-foreground">
          Browse our curated collection of beauty and wellness services
        </p>
      </div>
      
      {/* Search type toggle */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg border bg-background p-1">
          <button
            onClick={() => {
              setSearchType("services");
              setCurrentPage(1); // Reset pagination when switching
            }}
            className={`rounded-md px-6 py-2 text-sm font-medium ${
              searchType === "services" 
                ? "bg-primary text-primary-foreground" 
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Services
          </button>
          <button
            onClick={() => {
              setSearchType("providers");
              setCurrentPage(1); // Reset pagination when switching
            }}
            className={`rounded-md px-6 py-2 text-sm font-medium ${
              searchType === "providers" 
                ? "bg-primary text-primary-foreground" 
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Providers
          </button>
        </div>
      </div>
      
      {/* Additional Feature Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Services</h2>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground mb-4">Find and book beauty and wellness services from top providers in your area.</p>
          <div className="text-primary font-medium">You are here</div>
        </div>
        
        <div 
          className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow border cursor-pointer"
          onClick={() => router.push('/products')}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Shop Products</h2>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Tag className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground mb-4">Browse and purchase premium beauty and wellness products.</p>
          <div className="text-primary font-medium flex items-center">
            <span>View Products</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        
        <div 
          className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow border cursor-pointer"
          onClick={() => router.push('/learning')}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Learning</h2>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground mb-4">Access courses and tutorials from industry experts.</p>
          <div className="text-primary font-medium flex items-center">
            <span>Browse Courses</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        {/* Mobile filter toggle */}
        <button 
          onClick={toggleFilters}
          className="md:hidden flex items-center gap-2 bg-white/70 px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
        
        <div className="flex items-center ml-auto gap-2">
          {/* View toggle */}
          <div className="hidden md:flex items-center gap-2 border rounded-lg p-1 shadow-sm bg-white/70">
            <button
              onClick={() => handleViewModeChange("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}
              aria-label="List view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange("map")}
              className={`p-2 rounded-md transition-colors ${viewMode === ("map" as ViewMode) ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}
              aria-label="Map view"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm whitespace-nowrap hidden md:inline">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white/70 shadow-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="durationAsc">Duration: Shortest</option>
              <option value="durationDesc">Duration: Longest</option>
              <option value="rating">Highest Rated</option>
              <option value="mostReviewed">Most Reviewed</option>
              <option value="newest">Newest</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter sidebar - desktop always visible, mobile conditional */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/30 backdrop-blur-sm' : 'hidden'} lg:relative lg:block lg:z-auto lg:bg-transparent transition-all duration-300`}>
          <div className={`${showFilters ? 'absolute right-0 h-full w-3/4 max-w-xs' : ''} lg:relative lg:w-full lg:max-w-none transition-transform duration-300 ease-in-out bg-background`}>
            <div className="card-modern p-6 h-full lg:h-auto overflow-y-auto max-h-[calc(100vh-2rem)] lg:sticky lg:top-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <Sliders className="h-5 w-5 mr-2 text-primary" />
                  Filters
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Reset
                  </button>
                  <button
                    onClick={toggleFilters}
                    className="lg:hidden text-gray-500 bg-white/70 rounded-full h-6 w-6 flex items-center justify-center shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Applied filters section */}
              {appliedFilters.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3 flex items-center text-foreground">
                    Applied Filters ({appliedFilters.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {appliedFilters.map((filter, index) => (
                      <div 
                        key={index} 
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {filter.displayValue || filter.value.replace(/-/g, ' ')}
                        <button 
                          className="ml-1 text-primary hover:text-primary/70"
                          onClick={() => {
                            if (filter.type === "Duration") {
                              handleDurationChange(filter.value as DurationFilterKeys);
                            } else if (filter.type === "Experience Level") {
                              handleExperienceLevelChange(filter.value as ExperienceLevelKeys);
                            } else if (filter.type === "Service Type") {
                              handleServiceTypeChange(filter.value as ServiceTypeKeys);
                            } else if (filter.type === "New") {
                              setShowNew(false);
                              setAppliedFilters(appliedFilters.filter(f => f.type !== "New"));
                            } else if (filter.type === "Amenity") {
                              handleAmenityChange(filter.value as string);
                            } else if (filter.type === "Availability") {
                              handleAvailabilityChange(filter.value as string);
                            } else if (filter.type === "Distance") {
                              handleDistanceChange(filter.value as DistanceFilterKeys | "all");
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={clearAllFilters}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
              
              {/* Promoted filters - best seller categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 flex items-center text-foreground">
                  <Tag className="h-4 w-4 mr-1 text-primary" /> Popular Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 4).map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-2 text-xs rounded-lg text-center ${
                        selectedCategory === category.id 
                          ? 'bg-primary text-white' 
                          : 'bg-white/50 hover:bg-white/80 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Distance filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 flex items-center text-foreground">
                  <MapPin className="h-4 w-4 mr-1 text-primary" /> Distance
                </h3>
                <select
                  value={selectedDistance}
                  onChange={(e) => handleDistanceChange(e.target.value as DistanceFilterKeys | "all")}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white/50"
                >
                  <option value="all">Any Distance</option>
                  <option value="5km">Within 5 km</option>
                  <option value="10km">Within 10 km</option>
                  <option value="25km">Within 25 km</option>
                  <option value="50km">Within 50 km</option>
                  <option value="100km">Within 100 km</option>
                </select>
              </div>
              
              {/* Location filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 flex items-center text-foreground">
                  <MapPin className="h-4 w-4 mr-1 text-primary" /> Location
                </h3>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white/50"
                >
                  <option value="all">All Locations</option>
                  {locations?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}, {location.state ? `${location.state}, ` : ""}{location.country}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Categories */}
              <div className="border-t my-4 border-white/20"></div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 text-foreground">Categories</h3>
                <div className="space-y-2">
                  <div className="bg-white/50 rounded-lg p-1">
                    <div className="flex items-center p-2 cursor-pointer" onClick={() => setSelectedCategory("all")}>
                      <input
                        type="radio"
                        id="category-all"
                        name="category"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                        className="sr-only"
                      />
                      <div className={`h-4 w-4 rounded-full border ${selectedCategory === "all" ? 'bg-primary border-primary' : 'border-gray-300'} mr-2`}></div>
                      <label htmlFor="category-all" className="text-sm cursor-pointer">
                        All Categories
                      </label>
                    </div>
                  
                    {categories?.map((category) => (
                      <div 
                        key={category.id} 
                        className="flex items-center p-2 cursor-pointer" 
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <input
                          type="radio"
                          id={`category-${category.id}`}
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="sr-only"
                        />
                        <div className={`h-4 w-4 rounded-full border ${selectedCategory === category.id ? 'bg-primary border-primary' : 'border-gray-300'} mr-2`}></div>
                        <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Quick filters section */}
              <div className="space-y-2 mb-6">
                {/* New services filter with fixed toggle */}
                <div className="bg-white/50 p-3 rounded-lg">
                  <ToggleSwitch
                    id="new-services"
                    label={<>
                      <Calendar className="h-4 w-4 mr-1 text-green-500" /> 
                      <span>New Services (Last 30 days)</span>
                    </>}
                    checked={showNew}
                    onChange={() => {
                      const newValue = !showNew;
                      setShowNew(newValue);
                      if (newValue) {
                        setAppliedFilters([...appliedFilters, {
                          type: "New", 
                          value: "new", 
                          displayValue: "New Services"
                        }]);
                      } else {
                        setAppliedFilters(appliedFilters.filter(f => f.type !== "New"));
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="border-t my-4 border-white/20"></div>
              
              {/* Service Type filters */}
              <h3 className="text-sm font-medium mb-3 text-foreground">Service Type</h3>
              <div className="space-y-2 mb-6 bg-white/50 rounded-lg p-3">
                <ToggleSwitch
                  id="in-person"
                  label="In-Person"
                  checked={serviceTypeFilters["in-person"]}
                  onChange={() => handleServiceTypeChange("in-person")}
                />
                
                <ToggleSwitch
                  id="virtual"
                  label="Virtual"
                  checked={serviceTypeFilters.virtual}
                  onChange={() => handleServiceTypeChange("virtual")}
                />
                
                <ToggleSwitch
                  id="group"
                  label="Group Sessions"
                  checked={serviceTypeFilters.group}
                  onChange={() => handleServiceTypeChange("group")}
                />
                
                <ToggleSwitch
                  id="private"
                  label="Private Sessions"
                  checked={serviceTypeFilters.private}
                  onChange={() => handleServiceTypeChange("private")}
                />
              </div>
              
              <div className="border-t my-4 border-white/20"></div>
              
              {/* Availability filters */}
              <h3 className="text-sm font-medium mb-3 text-foreground">Availability</h3>
              <div className="space-y-2 mb-6 bg-white/50 rounded-lg p-3">
                <ToggleSwitch
                  id="available-today"
                  label="Available Today"
                  checked={availabilityFilters["available-today"]}
                  onChange={() => handleAvailabilityChange("available-today")}
                />
                
                <ToggleSwitch
                  id="available-weekend"
                  label="Available This Weekend"
                  checked={availabilityFilters["available-weekend"]}
                  onChange={() => handleAvailabilityChange("available-weekend")}
                />
                
                <ToggleSwitch
                  id="available-evening"
                  label="Evening Appointments"
                  checked={availabilityFilters["available-evening"]}
                  onChange={() => handleAvailabilityChange("available-evening")}
                />
              </div>
              
              <div className="border-t my-4 border-white/20"></div>
              
              {/* Experience Level filters */}
              <h3 className="text-sm font-medium mb-3 flex items-center text-foreground">
                <Award className="h-4 w-4 mr-1 text-primary" /> Experience Level
              </h3>
              <div className="space-y-2 mb-6 bg-white/50 rounded-lg p-3">
                <ToggleSwitch
                  id="beginner"
                  label="Beginner"
                  checked={experienceLevelFilters.beginner}
                  onChange={() => handleExperienceLevelChange("beginner")}
                />
                
                <ToggleSwitch
                  id="intermediate"
                  label="Intermediate"
                  checked={experienceLevelFilters.intermediate}
                  onChange={() => handleExperienceLevelChange("intermediate")}
                />
                
                <ToggleSwitch
                  id="advanced"
                  label="Advanced"
                  checked={experienceLevelFilters.advanced}
                  onChange={() => handleExperienceLevelChange("advanced")}
                />
                
                <ToggleSwitch
                  id="all-levels"
                  label="All Levels Welcome"
                  checked={experienceLevelFilters["all-levels"]}
                  onChange={() => handleExperienceLevelChange("all-levels")}
                />
              </div>
              
              <div className="border-t my-4 border-white/20"></div>
              
              {/* Amenities filters */}
              <h3 className="text-sm font-medium mb-3 text-foreground">Amenities</h3>
              <div className="space-y-2 mb-6 bg-white/50 rounded-lg p-3">
                <ToggleSwitch
                  id="parking"
                  label="Free Parking"
                  checked={amenityFilters.parking}
                  onChange={() => handleAmenityChange("parking")}
                />
                
                <ToggleSwitch
                  id="wheelchair"
                  label="Wheelchair Accessible"
                  checked={amenityFilters.wheelchair}
                  onChange={() => handleAmenityChange("wheelchair")}
                />
                
                <ToggleSwitch
                  id="wifi"
                  label="Free Wi-Fi"
                  checked={amenityFilters.wifi}
                  onChange={() => handleAmenityChange("wifi")}
                />
                
                <ToggleSwitch
                  id="childcare"
                  label="Childcare Available"
                  checked={amenityFilters.childcare}
                  onChange={() => handleAmenityChange("childcare")}
                />
              </div>
              
              <div className="border-t my-4 border-white/20"></div>
              
              <h3 className="text-sm font-medium mb-3 text-foreground">Price Range</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs text-muted-foreground">Min</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="mt-1 w-full rounded-lg border p-2 text-sm focus:border-primary focus:ring-primary bg-white/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Max</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="mt-1 w-full rounded-lg border p-2 text-sm focus:border-primary focus:ring-primary bg-white/50"
                  />
                </div>
              </div>
              
              <div className="border-t my-4 border-white/20"></div>
              
              <h3 className="text-sm font-medium mb-3 flex items-center text-foreground">
                <Clock className="h-4 w-4 mr-1 text-primary" /> Duration
              </h3>
              <div className="space-y-2 mb-6 bg-white/50 rounded-lg p-3">
                <ToggleSwitch
                  id="duration-30"
                  label="Under 30 minutes"
                  checked={durationFilters.under30}
                  onChange={() => handleDurationChange("under30")}
                />
                
                <ToggleSwitch
                  id="duration-60"
                  label="30 - 60 minutes"
                  checked={durationFilters.min30to60}
                  onChange={() => handleDurationChange("min30to60")}
                />
                
                <ToggleSwitch
                  id="duration-90"
                  label="60 - 90 minutes"
                  checked={durationFilters.min60to90}
                  onChange={() => handleDurationChange("min60to90")}
                />
                
                <ToggleSwitch
                  id="duration-120"
                  label="Over 90 minutes"
                  checked={durationFilters.over90}
                  onChange={() => handleDurationChange("over90")}
                />
              </div>
              
              <button
                onClick={handleApplyFilters}
                className="card-modern-button w-full flex items-center justify-center gap-2"
              >
                <span>Apply Filters</span>
                {!isLoading && <span className="text-sm opacity-90">({totalItems} results)</span>}
              </button>
            </div>
          </div>
        </aside>
        
        <div className="lg:col-span-3">
          {/* Applied filters - horizontal display above product list */}
          {appliedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 items-center bg-white/50 p-3 rounded-lg">
              <span className="text-xs font-medium text-gray-500">Active filters:</span>
              {appliedFilters.map((filter, index) => (
                <div 
                  key={index} 
                  className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full flex items-center"
                >
                  {filter.displayValue || filter.value.replace(/-/g, ' ')}
                  <button 
                    className="ml-1.5 text-primary hover:text-primary/70"
                    onClick={() => {
                      if (filter.type === "Duration") {
                        handleDurationChange(filter.value as DurationFilterKeys);
                      } else if (filter.type === "Experience Level") {
                        handleExperienceLevelChange(filter.value as ExperienceLevelKeys);
                      } else if (filter.type === "Service Type") {
                        handleServiceTypeChange(filter.value as ServiceTypeKeys);
                      } else if (filter.type === "New") {
                        setShowNew(false);
                        setAppliedFilters(appliedFilters.filter(f => f.type !== "New"));
                      } else if (filter.type === "Amenity") {
                        handleAmenityChange(filter.value as string);
                      } else if (filter.type === "Availability") {
                        handleAvailabilityChange(filter.value as string);
                      } else if (filter.type === "Distance") {
                        handleDistanceChange(filter.value as DistanceFilterKeys | "all");
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button 
                onClick={clearAllFilters}
                className="text-xs text-primary hover:underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
          
          {/* Services/Providers Grid */}
          {isLoading ? (
            <ServiceSkeletonGrid />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {startIndex + 1}-{endIndex} of {totalItems} {searchType}
              </p>
              
              {viewMode === "list" ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {searchType === "services" ? (
                    paginatedServices.length > 0 ? (
                      paginatedServices.map(service => (
                        <ServiceCard key={service.id} service={service} />
                      ))
                    ) : (
                      <div className="col-span-full py-16 text-center card-modern">
                        <p className="text-muted-foreground mb-3">No services found matching your criteria.</p>
                        <button
                          onClick={clearAllFilters}
                          className="text-primary hover:underline font-medium"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )
                  ) : (
                    paginatedProviders.length > 0 ? (
                      paginatedProviders.map(provider => (
                        <ProviderCard key={provider.id} provider={provider} />
                      ))
                    ) : (
                      <div className="col-span-full py-16 text-center card-modern">
                        <p className="text-muted-foreground mb-3">No providers found matching your criteria.</p>
                        <button
                          onClick={clearAllFilters}
                          className="text-primary hover:underline font-medium"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden shadow-md border">
                  <ServiceMap 
                    services={searchType === "services" ? paginatedServices : []} 
                    providers={searchType === "providers" ? paginatedProviders : []}
                    height="600px"
                    centerLocation={selectedLocation !== "all" ? selectedLocation : undefined}
                    zoom={selectedLocation !== "all" ? 9 : 3}
                  />
                </div>
              )}
            </>
          )}
          
          {/* Pagination - only show when not loading */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border card-modern-button-secondary ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-10 w-10 rounded-lg ${currentPage === page 
                        ? 'bg-primary text-white shadow-md' 
                        : 'border bg-white/50 backdrop-blur-sm hover:bg-accent transition-colors'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border card-modern-button-secondary ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}