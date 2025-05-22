"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState<string>("");
  
  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber = `VW-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(randomOrderNumber);
  }, []);
  
  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="font-medium">Order Number:</span>
              <span>{orderNumber}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b">
              <span className="font-medium">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b">
              <span className="font-medium">Payment Method:</span>
              <span>Credit Card</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b">
              <span className="font-medium">Shipping Method:</span>
              <span>Standard Shipping</span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="font-medium">Estimated Delivery:</span>
              <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                1
              </div>
              <div>
                <h3 className="font-medium">Order Confirmation Email</h3>
                <p className="text-sm text-muted-foreground">
                  You will receive an email confirmation with your order details.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                2
              </div>
              <div>
                <h3 className="font-medium">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  We'll begin processing your order and prepare it for shipping.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                3
              </div>
              <div>
                <h3 className="font-medium">Shipping Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  Once your order ships, we'll send you a shipping confirmation with tracking information.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                4
              </div>
              <div>
                <h3 className="font-medium">Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Your order will be delivered to your shipping address within the estimated timeframe.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/bookings"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            View My Orders
          </Link>
          
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-md border px-6 py-2 text-sm font-medium shadow-sm hover:bg-accent"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 