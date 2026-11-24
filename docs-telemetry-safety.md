# Application telemetry privacy and failure isolation

The LAWDE adapter now sends a generic error description, bounded relative code locations and allowlisted operational dimensions (HTTP method/status, known email template/job, framework route type). It drops raw messages, causes, arbitrary error properties, request URLs/query strings, identifiers, headers, bodies and unrecognized metadata. Absolute deployment/user paths and URL-bearing stack frames are removed.

Both API and storefront use the same boundary implementation and regression cases. Global SDK instrumentation is disabled because it bypasses sanitization and installs process exception handlers. The API reports handled server failures and explicit notification failures; Next reports request failures. Configure hosting crash/restart and uptime alerts separately; fatal-process delivery is not promised by this adapter.

At most two monitoring requests run concurrently per process. Each caller waits at most one second; a stalled underlying request retains its slot until it settles, preventing repeated timeouts from creating unbounded concurrency. Provider errors do not escape into application error handling. Monitoring is best-effort, not a financial audit record. The installed SDK bounds its in-memory failed-delivery queue to 50 records.

Validation uses synthetic secrets and customer details. Tests assert sanitized error/metadata delivery at the adapter boundary, disabled global exception hooks, isolation of provider failures and bounded stalled requests. Web tests intercept the actual SDK transport before any network operation. API/storefront builds pass.

This change does not certify all platform logs, Medusa logs or third-party provider dashboards. Keep request-body/debug logging disabled, configure access/retention and verify hosted redaction before launch. Account reset tokens still necessarily pass through the native Medusa recovery workflow/event queue; restrict database/Redis access.
