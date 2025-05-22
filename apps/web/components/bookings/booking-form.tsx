"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TimeSlotPicker } from "./time-slot-picker";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BookingFormProps {
  service: any;
  provider: any;
}

export function BookingForm({ service, provider }: BookingFormProps) {
  const router = useRouter();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("time");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [depositOption, setDepositOption] = useState<"none" | "partial" | "full">("partial");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const depositAmount = depositOption === "full" 
    ? service.price 
    : depositOption === "partial" 
      ? Math.round(service.price * 0.2 * 100) / 100 // 20% deposit
      : 0;

  const handleTimeSlotSelect = (timeSlot: any) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleNext = () => {
    if (!selectedTimeSlot) {
      setError("Please select a time slot");
      return;
    }
    
    setError(null);
    setActiveTab("review");
  };

  const handleReviewSubmit = () => {
    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }
    
    setError(null);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    setError(null);
    
    try {
      // This would be an API call in a real application
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Successful booking
      setBookingComplete(true);
      
      // In a real app, redirect to payment page
      setTimeout(() => {
        router.push(`/checkout/booking?deposit=${depositAmount}&bookingId=mock-booking-id`);
      }, 1500);
    } catch (err) {
      setError("Failed to complete booking. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingComplete) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="text-center py-6 space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Booking Request Submitted!</h2>
          <p className="text-muted-foreground">
            Redirecting to payment page to secure your booking...
          </p>
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Book Your Appointment</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="time">Select Time</TabsTrigger>
          <TabsTrigger value="review" disabled={!selectedTimeSlot}>Review & Confirm</TabsTrigger>
        </TabsList>
        
        <TabsContent value="time" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Service Details</h3>
            <div className="p-4 bg-muted rounded-md">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-medium">Service:</span>
                  <span>{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{service.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>${service.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Provider:</span>
                  <span>{provider.firstName} {provider.lastName}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <TimeSlotPicker 
              serviceId={service.id} 
              providerId={provider.id} 
              onTimeSlotSelect={handleTimeSlotSelect} 
            />
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handleNext} 
              disabled={!selectedTimeSlot}
              className="w-full"
            >
              Continue to Review
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="review" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Booking Summary</h3>
            <div className="p-4 bg-muted rounded-md">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-medium">Service:</span>
                  <span>{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Provider:</span>
                  <span>{provider.firstName} {provider.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{selectedTimeSlot && new Date(selectedTimeSlot.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>
                    {selectedTimeSlot && 
                      `${new Date(selectedTimeSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                       ${new Date(selectedTimeSlot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{service.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Price:</span>
                  <span>${service.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-3">Deposit Options</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We require a deposit to secure your booking. Choose your preferred option:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input 
                  type="radio" 
                  id="deposit-partial" 
                  name="deposit" 
                  value="partial" 
                  checked={depositOption === "partial"}
                  onChange={() => setDepositOption("partial")}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="deposit-partial" className="font-medium">
                    Pay 20% Deposit Now (${(service.price * 0.2).toFixed(2)})
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Secure your booking with a 20% deposit, pay the rest on the day of service.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <input 
                  type="radio" 
                  id="deposit-full" 
                  name="deposit" 
                  value="full" 
                  checked={depositOption === "full"}
                  onChange={() => setDepositOption("full")}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="deposit-full" className="font-medium">
                    Pay Full Amount Now (${service.price.toFixed(2)})
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Pay the full amount now and enjoy a hassle-free experience on the day.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-3">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border rounded-md h-24 resize-none"
              placeholder="Add any special requests or notes for your appointment..."
            />
          </div>
          
          <div className="border-t pt-6">
            <div className="flex items-start space-x-3 mb-6">
              <Checkbox 
                id="terms" 
                checked={acceptTerms} 
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <div>
                <Label htmlFor="terms" className="font-medium">
                  I agree to the booking terms and conditions
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Including the cancellation policy (48 hours notice required) and deposit terms.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("time")}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleReviewSubmit} 
                disabled={isSubmitting || !acceptTerms}
                className="flex-1"
              >
                Confirm & Pay Deposit
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              You're about to book {service.name} with {provider.firstName} {provider.lastName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="font-medium mb-2">Booking Details:</p>
            <ul className="space-y-1 text-sm">
              <li><span className="text-muted-foreground">Date:</span> {selectedTimeSlot && new Date(selectedTimeSlot.startTime).toLocaleDateString()}</li>
              <li><span className="text-muted-foreground">Time:</span> {selectedTimeSlot && new Date(selectedTimeSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
              <li><span className="text-muted-foreground">Deposit Amount:</span> ${depositAmount.toFixed(2)}</li>
              <li><span className="text-muted-foreground">Remaining Balance:</span> ${(service.price - depositAmount).toFixed(2)}</li>
            </ul>
            
            <p className="mt-4 text-sm text-muted-foreground">
              By confirming, you agree to pay the deposit amount to secure your booking.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm & Continue to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 