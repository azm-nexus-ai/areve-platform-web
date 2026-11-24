# Dependency security verification — 24 November 2026

The original production audit reported one critical and two high storefront findings. The release branch now uses Next 15.5.29 with matching lint configuration, Sharp 0.35.5 and PostCSS 8.5.33. `npm audit --omit=dev` reports zero vulnerabilities at this evidence date.

The PostCSS and Sharp overrides are deliberate: the Next 15 dependency ranges retained vulnerable versions after the framework patch. Keep the overrides until the supported framework dependency tree resolves patched versions itself; do not remove them solely to simplify package.json.

Primary references: [Next 15.5.29](https://github.com/vercel/next.js/releases/tag/v15.5.29), [Sharp/librsvg advisory](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w), [PostCSS source-map advisory](https://github.com/postcss/postcss/security/advisories/GHSA-r28c-9q8g-f849).

Validation: typecheck, lint, 25 unit tests and production build pass. All 16 desktop/mobile Playwright tests pass against `next start`, including actual image optimization, cross-site return cookies, error recovery, checkout prerequisites, 105-product pagination, search focus and catalogue-page accessibility. Provider transport still uses the local synthetic API; this is not live payment certification.

Build-only dependency findings remain outside the production audit. Recheck both trees before the release candidate and retain lockfiles in CI. Deploy previews from this branch only after the staging API/configuration gates are satisfied. No production deployment is authorized by these checks.
