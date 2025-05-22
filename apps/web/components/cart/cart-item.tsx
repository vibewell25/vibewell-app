"use client";

import { useState } from "react";
import Link from "next/link";

interface CartItemProps {
  item: {
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      imageUrl?: string;
    };
    quantity: number;
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 300));
      onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 300));
      onRemove(item.id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsRemoving(false);
    }
  };
  
  const subtotal = item.product.price * item.quantity;
  
  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
        {item.product.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <Link href={`/products/${item.product.id}`} className="font-medium hover:text-primary">
            {item.product.name}
          </Link>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="text-sm text-muted-foreground mb-3">
          ${item.product.price.toFixed(2)} each
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center border rounded-l-md disabled:opacity-50"
            >
              -
            </button>
            <span className="w-10 h-8 flex items-center justify-center border-y">
              {isUpdating ? "..." : item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 flex items-center justify-center border rounded-r-md disabled:opacity-50"
            >
              +
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
} 