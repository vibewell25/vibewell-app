"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { services, providers } from "@/lib/mock-data";

interface TipPageClientProps {
  id: string;
}

export default function TipPageClient({ id }: TipPageClientProps) {
  const router = useRouter();
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  
  // In a real app, fetch the booking from the API
  // For now, let's create a mock booking
  const mockServiceId = services[0]?.id;
  const mockService = services.find(s => s.id === mockServiceId);
  const mockProvider = providers.find(p => p.id === mockService?.providerId);
  
  const serviceAmount = mockService?.price || 50;
  const tipOptions = [10, 15, 20, 25];
  
  const tipAmount = isCustom
    ? parseFloat(customTip) || 0
    : (serviceAmount * tipPercentage) / 100;
  
  const totalAmount = serviceAmount + tipAmount;
  
  const handleTipSelect = (percentage: number) => {
    setTipPercentage(percentage);
    setIsCustom(false);
  };
  
  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setCustomTip(value);
    setIsCustom(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, submit the tip to the API
    
    // Navigate to a thank you page or back to bookings
    router.push(`/bookings/confirmation/${id}`);
  };
  
  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto">
        <Link 
          href={`/bookings/${id}`} 
          className="text-sm text-muted-foreground hover:text-primary mb-6 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Booking
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle>Add a Tip</CardTitle>
            <CardDescription>
              Show your appreciation to {mockProvider?.firstName || "your provider"} for their excellent service
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Service Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">{mockService?.name || "Beauty Service"}</span>
                  <span>{formatPrice(serviceAmount)}</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-medium">Select a Tip Amount</h3>
                
                <div className="grid grid-cols-4 gap-2">
                  {tipOptions.map((percentage) => (
                    <button
                      key={percentage}
                      type="button"
                      className={`py-2 px-3 rounded-md border text-center transition-colors ${
                        tipPercentage === percentage && !isCustom
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted"
                      }`}
                      onClick={() => handleTipSelect(percentage)}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-3 mt-3">
                  <div className={`flex-1 relative ${isCustom ? "border-primary" : ""}`}>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <input
                      type="text"
                      value={customTip}
                      onChange={handleCustomTipChange}
                      placeholder="Custom amount"
                      className="w-full py-2 pl-8 pr-3 rounded-md border"
                    />
                  </div>
                  
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-md border transition-colors ${
                      isCustom 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background hover:bg-muted"
                    }`}
                    onClick={() => setIsCustom(true)}
                  >
                    Custom
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-medium">
                  <span>Total amount</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Tip amount</span>
                  <span>{formatPrice(tipAmount)}</span>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                Submit Tip
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 