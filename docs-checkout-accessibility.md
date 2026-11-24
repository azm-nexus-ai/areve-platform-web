# Checkout accessibility and cart recovery

Verified locally on 24 November 2026 using the production Next build, a real Medusa/PostgreSQL backend and synthetic catalogue data.

- Product accordion triggers expose their visible titles and keyboard focus. Cart quantity and country selects have accessible names; the quantity select is no longer nested inside a button. Checkout edit/promo controls meet the tested contrast requirements.
- Quantity controls remain usable when Medusa omits inventory quantities. The server enforces stock limits; an overstock request leaves persisted quantity unchanged and the customer can retry.
- Cart removal announces failure, re-enables its control and updates the rendered cart after success. Explicit cart/checkout path invalidation fixes the stale row left by tag-only invalidation.
- Removed the duplicate global free-delivery popup, which made a broader eligibility promise than the approved shipping rules support. The cart's explicitly qualified delivery progress remains. Layout customer/cart reads now run concurrently and avoid a shipping-options request on every page.

Validation: 28 unit tests, TypeScript, lint and production build pass. All 22 production-mode desktop/mobile browser cases pass. Two targeted browser cases additionally verify rejected overstock updates, unchanged persisted quantity, valid retry and failed/successful cart removal. Automated axe checks find zero WCAG 2 A/AA and 2.1 AA violations on the tested product, cart, address and payment views; catalogue/profile/recovery checks remain covered. This is not certification of all content, assistive technologies, real payment pages or approved shipping rates.
