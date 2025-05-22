"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    inventory: number;
    category?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success message
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Helper function to safely get category name
  const getCategoryName = (category: any): string => {
    if (!category) return '';
    if (typeof category === 'string') return category;
    if (typeof category === 'object' && 'name' in category) return category.name;
    return '';
  };

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all">
      <div className="relative aspect-[4/3] bg-muted">
        {product.category && (
          <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs py-1 px-2 rounded">
            {getCategoryName(product.category)}
          </div>
        )}
        
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative h-full w-full overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="object-cover transition-all group-hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        </Link>
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
          
          <button
            className="text-xs text-primary hover:underline"
            aria-label={`View ${product.name} details`}
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );
} 