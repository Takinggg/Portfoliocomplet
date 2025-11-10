/**
 * Stripe Payment Service
 * Handles Stripe Checkout Sessions and payment processing
 */

export interface StripePaymentParams {
  invoiceNumber: string;
  invoiceId: string;
  amount: number; // in euros
  clientName: string;
  clientEmail: string;
  currency?: string;
}

export interface CheckoutSessionResponse {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const STRIPE_API_ENDPOINT = import.meta.env.VITE_STRIPE_API_ENDPOINT || '/api/stripe';

/**
 * Create a Stripe Checkout Session for invoice payment
 */
export async function createCheckoutSession(
  params: StripePaymentParams
): Promise<CheckoutSessionResponse> {
  try {
    if (!STRIPE_PUBLIC_KEY) {
      throw new Error('Stripe public key not configured');
    }

    const response = await fetch(`${STRIPE_API_ENDPOINT}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceNumber: params.invoiceNumber,
        invoiceId: params.invoiceId,
        amount: Math.round(params.amount * 100), // Convert to cents
        currency: params.currency || 'eur',
        clientName: params.clientName,
        clientEmail: params.clientEmail,
        successUrl: `${window.location.origin}/invoice/${params.invoiceId}/success`,
        cancelUrl: `${window.location.origin}/invoice/${params.invoiceId}`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const data = await response.json();
    return {
      success: true,
      sessionId: data.sessionId,
      url: data.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(params: StripePaymentParams): Promise<void> {
  try {
    const result = await createCheckoutSession(params);

    if (!result.success || !result.url) {
      throw new Error(result.error || 'Failed to create checkout session');
    }

    // Redirect to Stripe Checkout
    window.location.href = result.url;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!STRIPE_PUBLIC_KEY;
}

/**
 * Get Stripe public key
 */
export function getStripePublicKey(): string {
  return STRIPE_PUBLIC_KEY;
}
