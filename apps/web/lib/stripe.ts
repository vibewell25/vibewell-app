import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Initialize Stripe with the public key
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Initialize Stripe server-side instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
});

// Create a payment intent
export async function createPaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Retrieve a payment intent
export async function retrievePaymentIntent(id: string) {
  try {
    return await stripe.paymentIntents.retrieve(id);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
}

// Create a customer
export async function createCustomer(email: string, name: string, metadata: any = {}) {
  try {
    return await stripe.customers.create({
      email,
      name,
      metadata,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

// Create a subscription
export async function createSubscription(customerId: string, priceId: string, metadata: any = {}) {
  try {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    return await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

// Create a checkout session
export async function createCheckoutSession(lineItems: any[], successUrl: string, cancelUrl: string, metadata: any = {}) {
  try {
    return await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Create a subscription checkout session
export async function createSubscriptionCheckoutSession(
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  customerId?: string,
  metadata: any = {}
) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      metadata,
    });
    
    return session;
  } catch (error) {
    console.error('Error creating subscription checkout session:', error);
    throw error;
  }
}

// Webhook handler to process Stripe events
export async function handleStripeWebhook(rawBody: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
      case 'customer.subscription.created':
        // Handle subscription creation
        break;
      case 'customer.subscription.updated':
        // Handle subscription update
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return event;
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
} 