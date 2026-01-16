-- ===========================================
-- Script para crear tabla de purchases
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- PURCHASES (Stripe payment records)
create table if not exists public.purchases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  stripe_session_id text unique,
  stripe_subscription_id text,
  stripe_customer_id text,
  plan_name text not null default 'Alef (א)',
  amount_cents integer not null default 35000,
  currency text default 'usd',
  status text default 'pending', -- pending, completed, cancelled, refunded
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.purchases enable row level security;

-- Users can view their own purchases
create policy "Users can view own purchases" 
  on public.purchases for select 
  using (auth.uid() = user_id);

-- Service role (webhooks) can do everything
create policy "Service role can manage purchases" 
  on public.purchases for all 
  using (auth.role() = 'service_role');

-- Index for faster lookups
create index if not exists idx_purchases_user_id on public.purchases(user_id);
create index if not exists idx_purchases_email on public.purchases(email);
create index if not exists idx_purchases_stripe_session on public.purchases(stripe_session_id);
