"use client";

import { useState } from "react";
import { CreditCard, Bitcoin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StripePaymentForm } from "@/components/payment/stripe-payment-form";
import { CoinbasePaymentButton } from "@/components/payment/coinbase-payment-button";

interface PaymentMethodSelectorProps {
  amount: number;
  bookingId?: string;
  orderId?: string;
  productName: string;
  description: string;
  onSuccess?: (paymentId: string, method: "card" | "crypto") => void;
  onError?: (error: any) => void;
}

export function PaymentMethodSelector({
  amount,
  bookingId,
  orderId,
  productName,
  description,
  onSuccess,
  onError,
}: PaymentMethodSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");

  const handleStripeSuccess = (paymentIntentId: string) => {
    if (onSuccess) {
      onSuccess(paymentIntentId, "card");
    }
  };

  const handleCoinbaseSuccess = (chargeId: string) => {
    if (onSuccess) {
      onSuccess(chargeId, "crypto");
    }
  };

  return (
    <div className="w-full">
      <Tabs
        defaultValue="card"
        onValueChange={(value) => setPaymentMethod(value as "card" | "crypto")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Credit Card</span>
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center gap-2">
            <Bitcoin className="h-4 w-4" />
            <span>Cryptocurrency</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="card">
          <Card>
            <CardContent className="pt-6">
              <StripePaymentForm
                amount={amount * 100} // Convert to cents for Stripe
                bookingId={bookingId}
                orderId={orderId}
                onSuccess={handleStripeSuccess}
                onError={onError}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="crypto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Pay with Cryptocurrency</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You'll be redirected to Coinbase Commerce to complete your payment securely.
                </p>
                <p className="text-sm font-medium">
                  Amount: ${amount.toFixed(2)} USD
                </p>
              </div>
              
              <CoinbasePaymentButton
                amount={amount}
                bookingId={bookingId}
                orderId={orderId}
                productName={productName}
                description={description}
                onSuccess={handleCoinbaseSuccess}
                onError={onError}
                className="mx-auto"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 