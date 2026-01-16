---
description: Deploy Stripe payment flow to Supabase
---

# Deploy Stripe Payment Flow

Follow these steps to deploy the complete Stripe payment integration:

## Prerequisites
- Supabase CLI installed (`npm install -g supabase`)
- Logged into Supabase (`supabase login`)

## Steps

1. **Create purchases table in Supabase**
   - Go to Supabase Dashboard > SQL Editor
   - Open and run `create_purchases_table.sql`

2. **Link project to Supabase**
```bash
// turbo
supabase link --project-ref jqvhcapkofjbapbvyyuy
```

3. **Set Stripe secrets**
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
supabase secrets set STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
```

4. **Deploy Edge Functions**
```bash
// turbo
supabase functions deploy create-checkout-session
```

```bash
// turbo
supabase functions deploy stripe-webhook
```

5. **Configure Stripe Webhook**
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://jqvhcapkofjbapbvyyuy.supabase.co/functions/v1/stripe-webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the signing secret

6. **Set webhook secret**
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

7. **Build and deploy frontend**
```bash
// turbo
npm run build
```

## Testing
- Use Stripe test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
