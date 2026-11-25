# Payment recovery and review

Uncertain Paystack returns display **Check order status**, not an invitation to start another charge. Verification uses the existing cookie-bound checkout; order completion still independently verifies the provider on the API. The reference is shown for support. Missing-session returns direct the customer to confirmation email/support before paying again.

Authorized/captured sessions remain recognized in the payment step. Lagos checkout cannot skip the required area/state address fields. The API independently validates delivery and protects paid sessions from native replacement/deletion.

The API's **Payment review** console is Owner-write/Finance-read. Browser tests in `tests/e2e/payment-review.spec.ts` intercept all financial requests and verify interruption/reload identity, decimal-to-kobo amounts, read-only controls and responsive layout. Real provider certification requires the consolidated external test credentials.

Owner exception controls also support explicit release of a verified failed refund reservation and import of an existing Paystack refund by ID. Both actions are auditable, are unavailable to Finance, and never create a replacement refund. Desktop/mobile browser fixtures cover interrupted external imports and duplicate-safe retries; backend integration tests verify provider identity and accounting.
