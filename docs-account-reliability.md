# Customer account reliability

The storefront supports registration, email/password sign-in, profile name/phone updates, saved addresses, logout and email-based password recovery. Customer reads are not persistently cached. The shared SDK explicitly uses `nostore`, matching its installed server default; only request-specific HttpOnly cookies supply authorization. SDK request debugging is disabled.

Recovery links use a fragment credential, remove it from browser history on first load, and post it only in the form body. The reset page sends a no-referrer policy. Invalid, expired or used links produce a recoverable message; known and unknown email reset requests receive the same success wording. Registration/new passwords require 12–128 characters. Do not enable server-action or authentication request-body logging.

Name/phone and billing changes use stable server-action references. Billing address retry preserves its default-billing intent. Address deletion failures remain visible and re-enable the control. Logout clears local auth/cart cookies even when backend session logout fails. Collapsed profile forms are hidden and disabled, messages use status/alert roles, common inputs have unique programmatic labels, and password visibility controls have names and focus states.

Self-service email changes are deferred until authentication identity migration and ownership verification are designed. The former no-op success editor is replaced with a support route. Native password reset clears this browser's auth cookie but does not revoke existing bearer sessions on other devices; support must not promise otherwise.

Hosted recovery depends on API `REDIS_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and the exact HTTPS `AREVE_STOREFRONT_URL`. Real email delivery, queue restart recovery and hosting-level abuse controls remain launch gates. API integration tests cover token expiry, replay, supersession, actor binding, weak passwords and rate limiting. Browser tests exercise account flows on desktop/mobile, failed address operations, guest isolation and reset-fragment handling; final verification results are recorded in the API MVP plan.

Reference: [Medusa SDK authentication storage](https://docs.medusajs.com/resources/js-sdk/auth/overview).

Verified locally against the production storefront: 25 unit tests, TypeScript, lint and build pass; 20/20 desktop/mobile browser cases pass, including the 105-product fixture. The tested profile and recovery pages have zero axe WCAG 2 A/AA and 2.1 AA violations. Registration, name update, default-billing retry, failed/successful deletion, guest isolation, logout/sign-in and invalid reset recovery all pass. This does not certify hosted email delivery or full-site accessibility.
