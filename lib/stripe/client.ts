import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: process.env.STRIPE_PRICE_ID_FREE || '',
    features: [
      '5 AI analyses per month',
      '10 product searches',
      '5 keyword analyses',
      'Basic analytics',
      'Email support',
    ],
    limits: {
      aiAnalyses: 5,
      productSearches: 10,
      keywordAnalyses: 5,
      competitors: 2,
    },
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRICE_ID_PRO || '',
    features: [
      '100 AI analyses per month',
      'Unlimited product searches',
      '50 keyword analyses',
      'Advanced analytics',
      'Competitor tracking (10)',
      'Trend predictions',
      'Priority support',
      'API access',
    ],
    limits: {
      aiAnalyses: 100,
      productSearches: -1, // unlimited
      keywordAnalyses: 50,
      competitors: 10,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
    features: [
      'Unlimited AI analyses',
      'Unlimited everything',
      'Team collaboration',
      'White-label options',
      'Custom integrations',
      'Dedicated support',
      'Advanced API access',
      'Custom reports',
    ],
    limits: {
      aiAnalyses: -1, // unlimited
      productSearches: -1,
      keywordAnalyses: -1,
      competitors: -1,
    },
  },
} as const;

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        userId,
      },
    },
  });
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}
