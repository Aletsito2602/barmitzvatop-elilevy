# 🚀 Guía de Despliegue - Flujo de Compra con Stripe

Este documento detalla los pasos necesarios para configurar el flujo completo de pagos con Stripe.

## 📋 Resumen de Cambios

### Archivos creados:
- `supabase/functions/create-checkout-session/index.ts` - Edge Function para crear sesiones de pago
- `supabase/functions/stripe-webhook/index.ts` - Edge Function para procesar pagos completados
- `supabase/functions/_shared/cors.ts` - Headers CORS compartidos
- `src/components/CheckoutSuccess.jsx` - Página de éxito post-pago
- `src/components/CheckoutCancel.jsx` - Página de cancelación

### Archivos modificados:
- `src/components/Checkout.jsx` - Rediseñado para usar Stripe Checkout
- `src/App.jsx` - Nuevas rutas de checkout
- `.env` - Variables de Stripe
- `supabase_schema.sql` - Nueva tabla `purchases`

---

## 🔧 Paso 1: Crear tabla `purchases` en Supabase

Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
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
  status text default 'pending',
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.purchases enable row level security;

create policy "Users can view own purchases" 
  on public.purchases for select 
  using (auth.uid() = user_id);

create policy "Service role can manage purchases" 
  on public.purchases for all 
  using (auth.role() = 'service_role');
```

---

## 🔧 Paso 2: Desplegar Edge Functions en Supabase

### Instalar Supabase CLI (si no está instalado):
```bash
npm install -g supabase
```

### Login a Supabase:
```bash
supabase login
```

### Vincular el proyecto:
```bash
supabase link --project-ref jqvhcapkofjbapbvyyuy
```

### Configurar secrets (variables de entorno):
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
supabase secrets set STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET # Se obtiene en paso 4
```

### Desplegar las functions:
```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

---

## 🔧 Paso 3: Configurar URL de la Edge Function

Una vez desplegadas, obtendrás URLs como:
```
https://jqvhcapkofjbapbvyyuy.supabase.co/functions/v1/create-checkout-session
https://jqvhcapkofjbapbvyyuy.supabase.co/functions/v1/stripe-webhook
```

---

## 🔧 Paso 4: Configurar Webhook en Stripe

1. Ve a [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Haz clic en **"Add endpoint"**
3. Configura:
   - **Endpoint URL**: `https://jqvhcapkofjbapbvyyuy.supabase.co/functions/v1/stripe-webhook`
   - **Events to listen**:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
4. Copia el **Signing secret** (empieza con `whsec_`)
5. Actualiza el secret en Supabase:
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_TU_SIGNING_SECRET
```

---

## 🔧 Paso 5: Configurar URLs de redirección en producción

Si tu dominio de producción es `https://www.barmitzvatop.com`, las URLs de redirección serán:
- **Success**: `https://www.barmitzvatop.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`
- **Cancel**: `https://www.barmitzvatop.com/checkout/cancel`

La Edge Function detecta automáticamente el origin del request.

---

## 🔧 Paso 6: Deploy del Frontend

```bash
npm run build
# Luego despliega a Vercel/Netlify/Hostinger
```

---

## ✅ Flujo Completo

```
1. Usuario llena formulario en /checkout
2. Clic en "Pagar" → llama a create-checkout-session
3. Redirect a Stripe Checkout (hosted page de Stripe)
4. Usuario paga con tarjeta
5. Stripe envía webhook → stripe-webhook function
6. Function crea usuario en Supabase Auth
7. Function registra purchase en BD
8. Usuario ve /checkout/success
9. Usuario recibe email para establecer contraseña
10. Usuario hace login y accede al dashboard
```

---

## 🧪 Testing

Para probar en desarrollo:
1. Usa las keys de TEST de Stripe (`sk_test_...` y `pk_test_...`)
2. Usa tarjeta de prueba: `4242 4242 4242 4242`
3. Cualquier fecha futura y CVC

---

## ⚠️ Notas Importantes

1. **Keys LIVE**: Estás usando keys de producción, los pagos serán REALES
2. **Webhook Secret**: Es crítico para la seguridad, nunca lo expongas en el frontend
3. **CORS**: Las Edge Functions ya tienen CORS configurado
4. **Email**: Supabase enviará emails automáticos para recovery de contraseña

---

## 📞 Soporte

Si tienes problemas:
1. Revisa logs en Supabase Dashboard > Edge Functions > Logs
2. Revisa eventos en Stripe Dashboard > Developers > Events
3. Verifica que el webhook esté recibiendo eventos correctamente
