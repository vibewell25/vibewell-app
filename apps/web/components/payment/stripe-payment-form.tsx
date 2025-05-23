"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { stripePromise } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  bookingId?: string;
  orderId?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: any) => void;
}

const CheckoutForm = ({
  clientSecret,
  amount,
  bookingId,
  orderId,
  onSuccess,
  onError,
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setIsLoading(true);
    setCardError(null);

    try {
      // Get the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // You can add billing details here if needed
          },
        },
      });

      if (error) {
        setCardError(error.message || "An error occurred with your payment");
        if (onError) onError(error);
      } else if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");

        // If we have a booking ID, update the booking status
        if (bookingId) {
          const supabase = createClient();
          await supabase
            .from("bookings")
            .update({ status: "CONFIRMED", paymentIntentId: paymentIntent.id })
            .eq("id", bookingId);
        }

        // If we have an order ID, update the order status
        if (orderId) {
          const supabase = createClient();
          await (supabase as any)
            .from("orders")
            .update({ status: "PAID", paymentIntentId: paymentIntent.id })
            .eq("id", orderId);
        }

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess(paymentIntent.id);
        }

        // Redirect based on what was paid for
        if (bookingId) {
          router.push(`/bookings/confirmation/${bookingId}`);
        } else if (orderId) {
          router.push(`/orders/confirmation/${orderId}`);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setCardError(error.message || "An error occurred with your payment");
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="card-element" className="block text-sm font-medium mb-1">
            Credit or debit card
          </label>
          <div className="border rounded-md p-3 bg-background">
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          {cardError && (
            <div className="text-destructive text-sm mt-2">{cardError}</div>
          )}
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
};

interface StripePaymentFormProps {
  amount: number;
  bookingId?: string;
  orderId?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: any) => void;
}

export function StripePaymentForm({
  amount,
  bookingId,
  orderId,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        // Create a payment intent on the server
        const response = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            bookingId,
            orderId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error("Error creating payment intent:", err);
        setError(err.message || "Failed to initialize payment");
        if (onError) onError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [amount, bookingId, orderId, onError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-md text-destructive">
        <p className="font-medium">Error initializing payment</p>
        <p className="text-sm mt-1">{error || "Please try again later"}</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        clientSecret={clientSecret}
        amount={amount}
        bookingId={bookingId}
        orderId={orderId}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
} 