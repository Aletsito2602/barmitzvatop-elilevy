// Supabase Edge Function: Create Stripe Checkout Session
// This function creates a Stripe Checkout session for subscription payments

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const PRICE_ID = Deno.env.get('STRIPE_PRICE_ID') ?? 'price_1Sq4LoJuUsszzmLNi6vRM2EM';

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { email, firstName, lastName, phone, country, planName, userPassword } = await req.json();

        if (!email) {
            return new Response(
                JSON.stringify({ error: 'Email is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        if (!userPassword) {
            return new Response(
                JSON.stringify({ error: 'Password is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Determine URLs based on environment
        const origin = req.headers.get('origin') || 'https://www.barmitzvatop.com';
        const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${origin}/checkout/cancel`;

        // Create Stripe Checkout Session
        // Note: We store the encoded password in metadata - it's base64 encoded from frontend
        const session = await stripe.checkout.sessions.create({
            mode: 'payment', // Changed from 'subscription' to 'payment' for one-time payments
            payment_method_types: ['card'],
            line_items: [
                {
                    price: PRICE_ID,
                    quantity: 1,
                },
            ],
            customer_email: email,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                firstName: firstName || '',
                lastName: lastName || '',
                phone: phone || '',
                country: country || '',
                planName: planName || 'Alef (א)',
                userPassword: userPassword, // Encoded password from frontend
            },
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
            locale: 'es',
        });

        return new Response(
            JSON.stringify({
                sessionId: session.id,
                url: session.url
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});
