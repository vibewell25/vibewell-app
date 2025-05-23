import { Metadata } from "next";
import { services, providers, categories, locations } from "@/lib/mock-data";
import { Search, Sliders, X, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Advanced Search | VibeWell",
  description: "Find the perfect beauty and wellness services with our advanced search and filtering options",
};

export default function AdvancedSearchPage() {
  // Combine provider info with services
  const servicesWithDetails = services.map(service => {
    const provider = providers.find(p => p.id === service.providerId);
    const category = categories.find(c => c.id === service.categoryId);
    const location = locations.find(l => l.id === service.locationId);
    
    return {
      ...service,
      provider,
      category,
      location
    };
  });
  
  // Get unique locations from services
  const locationsSet = new Set(servicesWithDetails
    .filter(s => s.location !== undefined)
    .map(s => `${s.location!.name}, ${s.location!.country}`)
  );
  const serviceLocations = Array.from(locationsSet).sort();
  
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Advanced Search</h1>
        <p className="text-muted-foreground">
          Find the perfect beauty and wellness services with our comprehensive search tools.
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for services, providers, or treatments..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background"
          />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-card rounded-lg shadow p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button className="text-sm text-primary hover:underline flex items-center">
                <X className="h-4 w-4 mr-1" />
                Clear All
              </button>
            </div>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">$0</span>
                  <span className="text-sm">$300</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="300" 
                  defaultValue="150" 
                  className="w-full"
                />
                <div className="flex gap-3 mt-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Min</label>
                    <input 
                      type="number" 
                      placeholder="$0" 
                      className="w-full p-2 text-sm rounded border border-border bg-background"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Max</label>
                    <input 
                      type="number" 
                      placeholder="$300" 
                      className="w-full p-2 text-sm rounded border border-border bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Location</h3>
              <div className="relative mb-3">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter city or country..."
                  className="w-full pl-9 py-2 text-sm rounded border border-border bg-background"
                />
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {serviceLocations.slice(0, 8).map((location, idx) => (
                  <label key={idx} className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <span className="text-sm">{location}</span>
                  </label>
                ))}
              </div>
              {serviceLocations.length > 8 && (
                <button className="text-sm text-primary hover:underline mt-2">
                  Show all {serviceLocations.length} locations
                </button>
              )}
            </div>
            
            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <span className="flex items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm">{`& Up`}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Duration Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Duration</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" />
                  <span>Under 30 minutes</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" />
                  <span>30-60 minutes</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" />
                  <span>1-2 hours</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" />
                  <span>Over 2 hours</span>
                </label>
              </div>
            </div>
            
            {/* Apply Filters Button */}
            <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-md hover:bg-primary/90">
              Apply Filters
            </button>
          </div>
        </div>
        
        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium">
              {servicesWithDetails.length} results
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="p-2 text-sm rounded border border-border bg-background">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Duration</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              Hair Care
              <button className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              $50 - $150
              <button className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              London
              <button className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              4★ & Up
              <button className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          {/* Results Grid */}
          <div className="space-y-4">
            {servicesWithDetails.slice(0, 10).map(service => (
              <div key={service.id} className="bg-card rounded-lg shadow overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-40 md:w-60">
                  <img 
                    src={service.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={service.title} 
                    className="w-full h-48 sm:h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                      <span className="font-bold">${service.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <span className="mr-2">{service.provider?.displayName}</span>
                      •
                      <span className="mx-2">{service.category?.name}</span>
                      •
                      <span className="ml-2 flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {service.rating || 4.5}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                        {service.duration} mins
                      </span>
                      {service.location && (
                        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {service.location.name}, {service.location.country}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-border">
                    <a href={`/provider/${service.providerId}`} className="text-sm text-primary hover:underline">
                      View Provider
                    </a>
                    <div className="flex gap-2">
                      <button className="bg-muted hover:bg-muted/80 px-3 py-1.5 rounded text-sm">
                        More Info
                      </button>
                      <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm hover:bg-primary/90">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <button className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-muted">
                <span className="sr-only">Previous Page</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-9 h-9 rounded-md border border-primary bg-primary text-primary-foreground flex items-center justify-center">
                1
              </button>
              <button className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-muted">
                2
              </button>
              <button className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-muted">
                3
              </button>
              <span className="mx-1">...</span>
              <button className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-muted">
                10
              </button>
              <button className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-muted">
                <span className="sr-only">Next Page</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 