"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Bitcoin } from "lucide-react";

interface CoinbasePaymentButtonProps {
  amount: number;
  bookingId?: string;
  orderId?: string;
  productName: string;
  description: string;
  onSuccess?: (chargeId: string) => void;
  onError?: (error: any) => void;
  className?: string;
}

export function CoinbasePaymentButton({
  amount,
  bookingId,
  orderId,
  productName,
  description,
  onSuccess,
  onError,
  className,
}: CoinbasePaymentButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      // Create a Coinbase Commerce charge on the server
      const response = await fetch("/api/payments/create-crypto-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          bookingId,
          orderId,
          name: productName,
          description,
          redirectUrl: `${window.location.origin}/payments/crypto/success`,
          cancelUrl: `${window.location.origin}/payments/crypto/cancel`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create crypto payment");
      }

      const data = await response.json();
      
      // If successful, call the success callback if provided
      if (onSuccess) {
        onSuccess(data.chargeId);
      }
      
      // Redirect to the Coinbase Commerce hosted checkout page
      window.location.href = data.hostedUrl;
    } catch (error: any) {
      console.error("Error creating crypto payment:", error);
      toast.error(error.message || "Failed to initialize crypto payment");
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 ${className}`}
      variant="outline"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Bitcoin className="h-4 w-4" />
          <span>Pay with Crypto</span>
        </>
      )}
    </Button>
  );
} 