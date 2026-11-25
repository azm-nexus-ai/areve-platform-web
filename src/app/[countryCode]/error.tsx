"use client"

import BrandMark from "@modules/common/components/brand-mark"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function StorefrontError({ reset }: { reset: () => void }) {
  return <main id="main-content" className="content-container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
    <BrandMark className="mb-12" />
    <p className="eyebrow mb-5 text-areve-walnut">A moment, please</p>
    <h1 className="max-w-xl font-serif text-4xl leading-tight small:text-5xl">We couldn’t load this page.</h1>
    <p className="mt-6 max-w-md text-sm leading-7 text-areve-walnut">Your visit was interrupted. Please try again. If you were completing a payment, check your order confirmation before paying again.</p>
    <button type="button" onClick={reset} className="brand-button mt-8">Try again</button>
    <LocalizedClientLink href="/account/orders" className="brand-link mt-5">Check my orders</LocalizedClientLink>
  </main>
}
