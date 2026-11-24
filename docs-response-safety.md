# Response and search-index safeguards

Every storefront response sends `nosniff`, framing restrictions, a no-referrer policy and disabled unused camera/microphone/location permissions. The CSP is deliberately limited to frame ancestors, object embedding and base URLs; it is not a full script/style source policy. A nonce-based script CSP requires separate provider/runtime integration testing.

Set `AREVE_ENVIRONMENT=staging` for all current deployments. Missing identity also defaults to non-indexable. Search indexing is enabled only by an explicitly approved `AREVE_ENVIRONMENT=production` release; `VERCEL_ENV=preview` always retains exclusion even if a production variable is copied. Cart, checkout, account, order and recovery routes retain `X-Robots-Tag: noindex` in live production. Root `/robots.txt` bypasses country/region lookup and is served without redirecting to a regional shop route. These directives control cooperative crawlers; staging access protection remains a separate hosting requirement.

Validation on 24 November 2026: unit tests, typecheck, lint and production build pass; response headers and root robots are checked through actual HTTP responses in the desktop/mobile browser suite. A six-case deployment matrix checks that missing/staging/preview identities cannot enable indexing.

References: [Next.js 15 response headers](https://nextjs.org/docs/15/app/api-reference/config/next-config-js/headers), [Next.js metadata conventions](https://nextjs.org/docs/15/app/api-reference/file-conventions/metadata).
