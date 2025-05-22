"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
  items: any[];
  isCheckout?: boolean;
}

export function CartSummary({ items, isCheckout = false }: CartSummaryProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0; // Free shipping over certain amount could be implemented
  const tax = subtotal * 0.07; // 7% tax rate
  const total = subtotal + shipping + tax;
  
  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    if (isCheckout) {
      // Process payment
      setIsProcessing(true);
      try {
        // This would be an API call in a real application
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirect to confirmation page
        router.push("/checkout/confirmation");
      } catch (error) {
        console.error("Error processing payment:", error);
        setIsProcessing(false);
      }
    } else {
      // Navigate to checkout page
      router.push("/checkout");
    }
  };
  
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={items.length === 0 || isProcessing}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : isCheckout ? "Complete Purchase" : "Proceed to Checkout"}
      </button>
      
      {!isCheckout && (
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Taxes and shipping calculated at checkout
        </div>
      )}
    </div>
  );
} 