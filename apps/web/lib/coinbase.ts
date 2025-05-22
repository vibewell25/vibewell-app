import axios from 'axios';
import crypto from 'crypto';

// Coinbase Commerce API base URL
const COINBASE_API_URL = 'https://api.commerce.coinbase.com';

// Initialize Coinbase Commerce API client
const coinbaseClient = axios.create({
  baseURL: COINBASE_API_URL,
  headers: {
    'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY,
    'X-CC-Version': '2018-03-22',
    'Content-Type': 'application/json',
  },
});

// Create a charge
export async function createCharge({
  name,
  description,
  pricingType = 'fixed_price',
  localPrice,
  currency = 'USD',
  metadata = {},
  redirectUrl,
  cancelUrl,
}: {
  name: string;
  description: string;
  pricingType?: 'fixed_price' | 'no_price';
  localPrice: number;
  currency?: string;
  metadata?: Record<string, string>;
  redirectUrl?: string;
  cancelUrl?: string;
}) {
  try {
    const response = await coinbaseClient.post('/charges', {
      name,
      description,
      pricing_type: pricingType,
      local_price: {
        amount: localPrice,
        currency,
      },
      metadata,
      redirect_url: redirectUrl,
      cancel_url: cancelUrl,
    });

    return response.data.data;
  } catch (error) {
    console.error('Error creating Coinbase Commerce charge:', error);
    throw error;
  }
}

// Retrieve a charge
export async function getCharge(chargeId: string) {
  try {
    const response = await coinbaseClient.get(`/charges/${chargeId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error retrieving Coinbase Commerce charge:', error);
    throw error;
  }
}

// List charges
export async function listCharges(limit = 25, startingAfter?: string) {
  try {
    const params: Record<string, string | number> = { limit };
    if (startingAfter) {
      params.starting_after = startingAfter;
    }

    const response = await coinbaseClient.get('/charges', { params });
    return response.data;
  } catch (error) {
    console.error('Error listing Coinbase Commerce charges:', error);
    throw error;
  }
}

// Cancel a charge
export async function cancelCharge(chargeId: string) {
  try {
    const response = await coinbaseClient.post(`/charges/${chargeId}/cancel`);
    return response.data.data;
  } catch (error) {
    console.error('Error canceling Coinbase Commerce charge:', error);
    throw error;
  }
}

// Resolve a charge
export async function resolveCharge(chargeId: string) {
  try {
    const response = await coinbaseClient.post(`/charges/${chargeId}/resolve`);
    return response.data.data;
  } catch (error) {
    console.error('Error resolving Coinbase Commerce charge:', error);
    throw error;
  }
}

// Verify a webhook signature
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
) {
  try {
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const computedSignature = hmac.update(rawBody).digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(computedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Error verifying Coinbase Commerce webhook signature:', error);
    return false;
  }
}

// Process a webhook event
export function processWebhookEvent(event: any) {
  const eventType = event.type;
  const eventData = event.data;

  switch (eventType) {
    case 'charge:created':
      // Handle charge creation
      console.log('Charge created:', eventData.id);
      break;
    case 'charge:confirmed':
      // Handle charge confirmation
      console.log('Charge confirmed:', eventData.id);
      break;
    case 'charge:failed':
      // Handle charge failure
      console.log('Charge failed:', eventData.id);
      break;
    case 'charge:delayed':
      // Handle charge delay
      console.log('Charge delayed:', eventData.id);
      break;
    case 'charge:pending':
      // Handle charge pending
      console.log('Charge pending:', eventData.id);
      break;
    case 'charge:resolved':
      // Handle charge resolution
      console.log('Charge resolved:', eventData.id);
      break;
    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  return eventData;
} 