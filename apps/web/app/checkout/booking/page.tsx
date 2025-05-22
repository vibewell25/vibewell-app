"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { services, providers } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function BookingPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const depositAmount = parseFloat(searchParams.get("deposit") || "0");
  const bookingId = searchParams.get("bookingId");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
    saveCard: false
  });
  
  // Mocked service data
  const [mockBooking, setMockBooking] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, we would fetch the booking details from the API
    // For now, we'll create a mock booking
    const randomServiceId = services[Math.floor(Math.random() * services.length)].id;
    const service = services.find(s => s.id === randomServiceId);
    const provider = service 
      ? providers.find(p => p.id === service.providerId)
      : providers[0];
    
    const mockData = {
      id: bookingId || "mock-booking-id",
      service,
      provider,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: "10:00 AM",
      depositAmount: depositAmount,
      totalAmount: service?.price || 0,
      remainingAmount: (service?.price || 0) - depositAmount
    };
    
    setMockBooking(mockData);
  }, [bookingId, depositAmount]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.cardNumber.trim()) {
      setError("Please enter your card number");
      return;
    }
    
    if (!formData.cardExpiry.trim()) {
      setError("Please enter your card expiry date");
      return;
    }
    
    if (!formData.cardCvc.trim()) {
      setError("Please enter your card security code");
      return;
    }
    
    if (!formData.cardName.trim()) {
      setError("Please enter the name on your card");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Payment successful
      setPaymentSuccess(true);
      
      // Redirect to booking confirmation page after a delay
      setTimeout(() => {
        router.push(`/bookings/confirmation/${bookingId || "mock-booking-id"}`);
      }, 3000);
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (paymentSuccess) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center py-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your booking is now confirmed. We're redirecting you to the confirmation page.
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!mockBooking) {
    return (
      <div className="container py-10">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="mb-10">
        <Link 
          href="/bookings"
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to My Bookings
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground">
          Pay your deposit to secure your appointment.
        </p>
      </div>
      
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-8">
        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium">{mockBooking.service?.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium">
                  {mockBooking.provider?.firstName} {mockBooking.provider?.lastName}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {mockBooking.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{mockBooking.time}</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Service Price:</span>
                  <span className="font-medium">{formatPrice(mockBooking.totalAmount)}</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Deposit Amount:</span>
                  <span className="font-medium">{formatPrice(mockBooking.depositAmount)}</span>
                </div>
                
                <div className="flex justify-between font-medium">
                  <span>Amount Due Today:</span>
                  <span>{formatPrice(mockBooking.depositAmount)}</span>
                </div>
                
                <div className="text-sm text-muted-foreground mt-4">
                  Remaining balance of {formatPrice(mockBooking.remainingAmount)} will be collected at your appointment.
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="John Smith"
                  />
                </div>
                
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="MM/YY"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardCvc" className="block text-sm font-medium mb-1">
                      Security Code (CVC)
                    </label>
                    <input
                      type="text"
                      id="cardCvc"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="123"
                    />
                  </div>
                </div>
                
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="saveCard"
                    name="saveCard"
                    checked={formData.saveCard}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="saveCard" className="text-sm">
                    Save this card for future payments
                  </label>
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">Processing...</span>
                        <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
                      </span>
                    ) : (
                      `Pay ${formatPrice(mockBooking.depositAmount)}`
                    )}
                  </Button>
                </div>
                
                <div className="text-xs text-center text-muted-foreground pt-4">
                  By processing your payment, you agree to our 
                  <Link href="/terms" className="underline ml-1">Terms of Service</Link> and 
                  <Link href="/privacy" className="underline ml-1">Privacy Policy</Link>.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 