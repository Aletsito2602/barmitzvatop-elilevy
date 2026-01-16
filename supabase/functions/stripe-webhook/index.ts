// Supabase Edge Function: Stripe Webhook Handler
// This function handles Stripe webhook events to:
// 1. Create user account on successful payment with user's chosen password
// 2. Record purchase in database

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { corsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    let event: Stripe.Event;

    try {
        // Verify webhook signature
        event = await stripe.webhooks.constructEventAsync(
            body,
            signature!,
            webhookSecret
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return new Response(
            JSON.stringify({ error: `Webhook Error: ${err.message}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Initialize Supabase Admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    console.log('Received event:', event.type);

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;

            console.log('Processing checkout.session.completed:', session.id);

            const email = session.customer_email;
            const metadata = session.metadata || {};
            const firstName = metadata.firstName || '';
            const lastName = metadata.lastName || '';
            const fullName = `${firstName} ${lastName}`.trim() || 'Usuario';
            const phone = metadata.phone || '';
            const country = metadata.country || '';
            const planName = metadata.planName || 'Alef (א)';
            const encodedPassword = metadata.userPassword || '';

            if (!email) {
                console.error('No email found in session');
                break;
            }

            // Decode the password (it was base64 encoded in frontend)
            let userPassword = '';
            try {
                userPassword = atob(encodedPassword);
            } catch (e) {
                console.error('Error decoding password, using default');
                userPassword = 'Barmitzva2024!'; // Fallback password
            }

            if (!userPassword || userPassword.length < 6) {
                userPassword = 'Barmitzva2024!'; // Fallback password
            }

            try {
                // 1. Check if user already exists
                const { data: existingUsers } = await supabase.auth.admin.listUsers();
                const existingUser = existingUsers?.users?.find((u: any) => u.email === email);

                let userId: string;

                if (existingUser) {
                    // User exists - just record the purchase
                    userId = existingUser.id;
                    console.log('User already exists:', userId);
                } else {
                    // 2. Create new user in Supabase Auth with the user's chosen password
                    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                        email: email,
                        password: userPassword,
                        email_confirm: true, // Auto-confirm email so they can login immediately
                        user_metadata: {
                            full_name: fullName,
                            first_name: firstName,
                            last_name: lastName,
                            phone: phone,
                            country: country,
                        },
                    });

                    if (authError) {
                        console.error('Error creating user:', authError);
                        throw authError;
                    }

                    userId = authData.user.id;
                    console.log('Created new user:', userId);

                    // 3. Update/create profile with additional info
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: userId,
                            email: email,
                            full_name: fullName,
                            study_plan: 'alef',
                            preferences: {
                                language: 'es',
                                notifications: true,
                                timezone: 'America/Panama',
                            },
                        });

                    if (profileError) {
                        console.log('Note: Profile may already exist from trigger:', profileError.message);
                    }
                }

                // 4. Record the purchase
                const { error: purchaseError } = await supabase
                    .from('purchases')
                    .insert({
                        user_id: userId,
                        stripe_session_id: session.id,
                        stripe_subscription_id: session.subscription as string,
                        stripe_customer_id: session.customer as string,
                        plan_name: planName,
                        amount_cents: session.amount_total || 35000,
                        currency: session.currency || 'usd',
                        status: 'completed',
                        email: email,
                    });

                if (purchaseError) {
                    console.error('Error recording purchase:', purchaseError);
                    // Don't throw - user is created, purchase recording is secondary
                }

                console.log('Successfully processed payment for:', email);

            } catch (error) {
                console.error('Error processing checkout session:', error);
            }
            break;
        }

        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            console.log('Subscription updated:', subscription.id, 'Status:', subscription.status);

            // Update purchase status if needed
            await supabase
                .from('purchases')
                .update({
                    status: subscription.status,
                    updated_at: new Date().toISOString(),
                })
                .eq('stripe_subscription_id', subscription.id);
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            console.log('Subscription cancelled:', subscription.id);

            // Mark subscription as cancelled
            await supabase
                .from('purchases')
                .update({
                    status: 'cancelled',
                    updated_at: new Date().toISOString(),
                })
                .eq('stripe_subscription_id', subscription.id);
            break;
        }

        case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice;
            console.log('Invoice paid:', invoice.id);
            break;
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice;
            console.log('Invoice payment failed:', invoice.id);
            break;
        }

        default:
            console.log('Unhandled event type:', event.type);
    }

    return new Response(
        JSON.stringify({ received: true }),
        {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
    );
});
