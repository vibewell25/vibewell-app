import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Beauty Products | VibeWell",
  description: "Discover premium beauty and wellness products from top providers on VibeWell",
};

"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { products } from "@/lib/mock-data";
import { Search, Filter, Tag, Calendar, ChevronRight, Sliders, Grid, Map } from "lucide-react";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock categories extracted from products
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  // Simulate loading time for data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter products
  const filteredProducts = products.filter(product => {
    // Search query filter
    if (searchQuery && 
        !product.name?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }
    
    // Price range filter
    if (product.price < priceRange.min || product.price > priceRange.max) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0; // featured - no specific sorting
    }
  });
  
  // Handle price change
  const handlePriceChange = (type: "min" | "max", value: string) => {
    setPriceRange({
      ...priceRange,
      [type]: Number(value) || 0
    });
  };
  
  // Toggle filter sidebar on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange({ min: 0, max: 1000 });
    setSortOption("featured");
  };
  
  return (
    <div className="container max-w-7xl mx-auto py-8 md:py-10 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Beauty & Wellness Products</h1>
        <p className="text-muted-foreground">
          Discover and purchase premium products from our community of beauty and wellness providers.
        </p>
      </div>
      
      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div 
          className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow border cursor-pointer"
          onClick={() => window.location.href = '/services'}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Services</h2>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground mb-4">Find and book beauty and wellness services from top providers in your area.</p>
          <div className="text-primary font-medium flex items-center">
            <span>View Services</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
        
        <div className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Shop Products</h2>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Tag className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground mb-4">Browse and purchase premium beauty and wellness products.</p>
          <div className="text-primary font-medium">You are here</div>
        </div>
        
        <div 
          className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow border cursor-pointer"
          onClick={() => window.location.href = '/learning'}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Learning</h2>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">Access courses and tutorials from industry experts.</p>
          <div className="text-primary font-medium flex items-center">
            <span>Browse Courses</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>
      
      {/* Featured Banner */}
      <div className="my-8">
        <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Beauty Products" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
            <div className="px-8 py-6 max-w-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Premium Quality Products
              </h2>
              <p className="text-white/90 mb-4 hidden sm:block">
                Professionally selected beauty and wellness products for your self-care routine.
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Shop New Arrivals
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
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
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm whitespace-nowrap hidden md:inline">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white/70 shadow-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
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
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Reset
                </button>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 flex items-center text-foreground">
                  <Tag className="h-4 w-4 mr-1 text-primary" /> Categories
                </h3>
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
                  
                    {categories.map((category) => (
                      <div 
                        key={category} 
                        className="flex items-center p-2 cursor-pointer" 
                        onClick={() => setSelectedCategory(category)}
                      >
                        <input
                          type="radio"
                          id={`category-${category}`}
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="sr-only"
                        />
                        <div className={`h-4 w-4 rounded-full border ${selectedCategory === category ? 'bg-primary border-primary' : 'border-gray-300'} mr-2`}></div>
                        <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Price Range */}
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
              
              <button
                onClick={toggleFilters}
                className="card-modern-button w-full md:hidden flex items-center justify-center gap-2 mt-4"
              >
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </aside>
        
        <div className="lg:col-span-3">
          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {sortedProducts.length} of {products.length} products
              </p>
              
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map(product => (
                    <div key={product.id} className="group relative bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all">
                      <div className="relative aspect-[4/3] bg-muted">
                        {product.category && (
                          <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs py-1 px-2 rounded">
                            {product.category}
                          </div>
                        )}
                        
                        <a href={`/products/${product.id}`} className="block">
                          <div className="relative h-full w-full overflow-hidden">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover transition-all group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="40"
                                  height="40"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground"
                                >
                                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                  <circle cx="9" cy="9" r="2" />
                                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </a>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        <div className="font-bold text-primary">${product.price.toFixed(2)}</div>
                        
                        {product.description && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        
                        <div className="mt-3 flex items-center justify-between">
                          {product.inventory > 0 ? (
                            <span className="text-xs text-green-600">{product.inventory} in stock</span>
                          ) : (
                            <span className="text-xs text-red-600">Out of stock</span>
                          )}
                          
                          <a 
                            href={`/products/${product.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            View details
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 card-modern">
                  <p className="text-muted-foreground mb-3">No products found matching your criteria.</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-primary hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 