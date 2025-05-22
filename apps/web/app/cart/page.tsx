"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { products, cartItems as mockCartItems } from "@/lib/mock-data";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // This would be an API call in a real application
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Merge cart items with product details
        const items = mockCartItems.map(item => ({
          ...item,
          product: products.find(p => p.id === item.productId) || {}
        }));
        
        setCartItems(items);
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(current =>
      current.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(current => current.filter(item => item.id !== id));
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : cartItems.length > 0 ? (
        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>
              
              <div className="divide-y">
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Link
                href="/products"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Continue Shopping
              </Link>
              
              <button
                onClick={() => setCartItems([])}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          <CartSummary items={cartItems} />
        </div>
      ) : (
        <div className="text-center py-16 space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
} 