# AREVÉ brand experience — review implementation

Design authority: supplied AREVE Brand Identity Package, Guidelines v7, Option 02 “The Modern Heirloom”. Uses the approved unmodified wordmarks, primary marks, icon and Arch pattern; exact ivory, charcoal, sand, walnut and botanical digital palette. Brass remains a physical finish. Playfair Display and Poppins are served locally with OFL notices and renamed subset font metadata; obsolete font dependencies were removed.

The home and World pages interpret the brand's heritage and gifting story. The packaging study is explicitly a concept, not product photography or an order customization. CSS perspective supplies six box faces and a separate lid. Rotation, colour and opening are explicit keyboard/touch actions; no WebGL dependency, animation loop, model downloads or external service. Reduced motion removes transitions, unsupported transforms have a static fallback, and all controls have accessible names and 44px targets.

Navigation uses a modal drawer with focus containment/restoration and scroll locking. Region/language controls use native keyboard/touch selectors with pending/error states. Brand assets bypass region middleware. Checkout indicators are decorative within the parent radio, avoiding nested interactive controls. Product prices use contrast-safe brand tokens.

Validation (25 November 2026): TypeScript, lint, 28 unit tests, optimized production build. Full desktop/mobile regression: 32/34 initially passed; the two failures found an inherited nested-radio defect. After its fix all 10 checkout regressions passed. All 10 brand/browser/accessibility tests also passed against the production build, including 320px layout, asset content types, keyboard navigation and reduced motion. Automated WCAG A/AA checks on home, World, menu, product, cart, address and payment reported no remaining violations in those checks.

Remaining dependencies: approved SKU images, product content and final legal/operational content. Browser test fixtures are not approved launch merchandise. This batch does not claim hosted provider or live-payment verification.
