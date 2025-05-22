"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface CheckoutFormProps {
  cartItems: any[];
  cartTotal: number;
}

export function CheckoutForm({ cartItems, cartTotal }: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    paymentMethod: "credit-card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    savePaymentInfo: false,
    applyLoyaltyPoints: false
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
        throw new Error("Please fill out all required fields");
      }
      
      if (formData.paymentMethod === "credit-card" && 
          (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc)) {
        throw new Error("Please complete payment information");
      }
      
      // This would be an API call in a real application
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Successful checkout
      setCheckoutComplete(true);
      
      // In a real app, you would redirect to the order confirmation page
      // with the new order ID
      // router.push(`/orders/confirmation/${orderId}`);
    } catch (err) {
      setError((err as Error).message || "Failed to process payment. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle card expiry formatting
  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      cardExpiry: value
    }));
  };

  if (checkoutComplete) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="text-center py-6 space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Order Confirmed!</h2>
          <p className="text-muted-foreground">
            Your order has been successfully placed.
          </p>
          <div className="text-left bg-muted/50 p-4 rounded-lg my-4">
            <p className="text-sm font-medium">Order Summary</p>
            <p className="text-sm text-muted-foreground mt-1">Order #{Math.floor(Math.random() * 10000)}</p>
            <p className="text-sm text-muted-foreground">Date: {format(new Date(), "MMM d, yyyy")}</p>
            <p className="text-sm font-medium mt-2">Items: {cartItems.length}</p>
            <p className="text-sm font-medium">Total: ${cartTotal.toFixed(2)}</p>
          </div>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => router.push('/orders')}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              View My Orders
            </button>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Checkout</h2>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Payment Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === "credit-card"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Credit Card
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    PayPal
                  </label>
                </div>
              </div>
              
              {formData.paymentMethod === "credit-card" && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-2 border rounded-md"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardExpiry" className="block text-sm font-medium mb-1">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleExpiryInput}
                        placeholder="MM/YY"
                        className="w-full p-2 border rounded-md"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cardCvc" className="block text-sm font-medium mb-1">
                        CVC <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cardCvc"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full p-2 border rounded-md"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="savePaymentInfo"
                        checked={formData.savePaymentInfo}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Save payment information for future purchases</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="applyLoyaltyPoints"
                    checked={formData.applyLoyaltyPoints}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Apply loyalty points to this purchase (250 points available)</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({cartItems.length}):</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax:</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              {formData.applyLoyaltyPoints && (
                <div className="flex justify-between text-green-600">
                  <span>Loyalty Discount:</span>
                  <span>-$5.00</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total:</span>
                <span>
                  ${(
                    cartTotal + 
                    (cartTotal * 0.08) - 
                    (formData.applyLoyaltyPoints ? 5 : 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : "Complete Purchase"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 