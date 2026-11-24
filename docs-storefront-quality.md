# Storefront quality verification

The MVP uses Medusa server pagination (12 products per request) with global newest/name ordering and category/collection filtering. Text search has a complete paginated results page; the header shows six previews and links to that page. Invalid page/sort inputs are normalized, and a page beyond the catalogue end displays its last page. Pagination controls allocate at most five page numbers.

Price ordering and price-range filtering are deferred until a server-side implementation can query calculated regional prices across the complete catalogue. The previous first-100-products implementation was incomplete and is removed. This is an explicit scope reduction; those controls are no longer offered.

Mobile product titles and prices stack. The search dialog has an accessible trigger, viewport bounds, Escape dismissal and focus restoration. Region routing defaults to Nigeria, sets the first cache cookie without a self-redirect, bounds region requests and returns a generic 503 during initial backend failure. Transport errors no longer expose upstream bodies, headers or request data. `NEXT_PUBLIC_R2_PUBLIC_URL` allows only the configured HTTPS image host/path.

Verification on the local synthetic API: 25 unit tests; TypeScript; lint; production build; 14 Playwright tests across desktop and 375px mobile. Browser coverage includes gift checkout, cross-site cookie return, callback recovery, checkout prerequisites, all 105 synthetic catalogue results, stale/invalid pages, search dialog keyboard behavior and zero WCAG 2 A/AA + 2.1 AA axe violations on the tested catalogue search page. This is not a claim of full-site accessibility conformance or production payment certification.

For the large-catalogue case, seed the API's guarded `src/scripts/browser-catalogue-fixture.ts` into the isolated `localhost:55432/areve_mvp_browser` database, then run `E2E_LARGE_CATALOGUE=1 npm run test:e2e`. It creates synthetic records only and refuses any other database. Without that optional fixture, the two large-catalogue browser cases skip explicitly.

Remaining gates: real product images/content, complete page accessibility/keyboard review, production-mode performance with representative assets, provider configuration and actual staging checkout. Dependency security findings are tracked separately and block launch until resolved or assessed.
