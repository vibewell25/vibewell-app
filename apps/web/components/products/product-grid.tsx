"use client";

import { useState } from "react";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: any[];
  title?: string;
  showFilters?: boolean;
}

export function ProductGrid({ products, title, showFilters = false }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("default");
  
  // Extract unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(category);
    
    if (category === null) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === category));
    }
  };
  
  const handleSort = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProducts];
    
    switch (option) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (could be by popularity or featured)
        break;
    }
    
    setFilteredProducts(sorted);
  };
  
  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      
      {showFilters && (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`px-3 py-1 text-sm rounded-full ${
                activeCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
              className="py-1 px-2 rounded border text-sm"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      )}
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  );
} 