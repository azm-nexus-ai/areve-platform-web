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
- **LAWDE Shield monitoring**: server-side rendering, route-handler and server-action errors are reported via `src/instrumentation.ts` when `LAWDE_API_KEY` is set (browser capture to follow)
- CI: unit tests, lint, typecheck and production build; missing staging build configuration fails explicitly.

## Run locally

Start the API first (see areve-platform-api), then:

```bash
cp .env.template .env.local   # set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY from the admin
npm install
npm run dev                   # http://localhost:8000
```

## Deploy on Vercel

1. Vercel → Add New Project → import `azm-nexus-ai/areve-platform-web` (framework: Next.js, defaults are fine).
2. Environment variables: `MEDUSA_BACKEND_URL` (the Railway API URL), `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL` (the Vercel URL), `NEXT_PUBLIC_DEFAULT_REGION=ng`, `AREVE_ENVIRONMENT=staging` until an approved live release, `LAWDE_API_KEY`, `LAWDE_APP_ID`, `LAWDE_ENVIRONMENT=production` (or `staging`), and `NEXT_PUBLIC_R2_PUBLIC_URL` for the public image origin.
3. Add the Vercel URL to the API's `STORE_CORS`, and set the Paystack callback URL to `<vercel-url>/ng/checkout/paystack/callback`.
4. The API must be live before the first Vercel build, because pages are pre-rendered from it.

Shop settings such as the WhatsApp number come from the API (`GET /store/areve/config`); `NEXT_PUBLIC_WHATSAPP_NUMBER` is only a fallback.

## MVP release gates

Browse/search uses complete server pagination. Global price-range filtering and price sorting are deferred until supported by the backend. See [storefront quality evidence](docs-storefront-quality.md).

Open gates: approved policies, delivery areas/rates, real catalogue/images, hosted Paystack/email/R2/Redis validation, dependency security review and representative mobile performance. Typecheck, lint, tests and builds currently pass locally.

## Checkout regression tests

Run the API with an isolated local PostgreSQL database and the sample seed, then start this storefront with its local publishable key. `npm run test:e2e` exercises product/cart/gift/address/delivery and payment-return recovery at desktop and 375px widths. Install Chromium once with `npx playwright install chromium`. Tests reject a non-local `E2E_BASE_URL` and create synthetic carts only.

The API tests cover Paystack transaction integrity with mocked provider transport. Real Paystack test-mode redirects/webhooks, approved shipping rates and hosted services remain release gates. Manual/system checkout is hidden in production builds and rejected by the hardened API.
