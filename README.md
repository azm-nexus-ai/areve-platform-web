# areve-platform-web

Storefront for the AREVÉ Online Shop: Next.js 15 (App Router, TypeScript, Tailwind), based on the
official Medusa Next.js starter and rebranded for AREVÉ.

Owner: Fawwaz Sanni Ola Dotun · Backend: [areve-platform-api](../areve-platform-api)

## What's set up

- Home, store, categories, product pages, cart, checkout, customer accounts and order history
- AREVÉ branding: logo (`public/areve-logo.png`), bronze/ivory/ink colour tokens (`areve-*` in
  `tailwind.config.js`), Cormorant Garamond + Inter (self-hosted via @fontsource)
- Default country **Nigeria (`/ng`)**, prices in NGN
- **Paystack checkout (redirect flow)**: "Pay with Paystack" sends the customer to Paystack;
  Paystack returns them to `/ng/checkout/paystack/callback`, which completes the order
- WhatsApp click-to-chat link in the footer (`NEXT_PUBLIC_WHATSAPP_NUMBER`)
- CI: install, plus build once the staging API secrets are added

## Run locally

Start the API first (see areve-platform-api), then:

```bash
cp .env.template .env.local   # set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY from the admin
npm install
npm run dev                   # http://localhost:8000
```

## Next tasks (Phase 1)

- [ ] Design system pass from the AREVÉ brand (typography scale, buttons, product cards)
- [ ] Home page sections: featured collections, gifting, brand story
- [ ] Mobile performance (Lighthouse 85+), image optimisation
- [ ] Delivery, returns, privacy and terms pages
- [ ] Remove Stripe/PayPal code paths once Paystack is confirmed
- [ ] Fix upstream type errors so `tsc --noEmit` passes (build currently ignores them, as in the starter)
