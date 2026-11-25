import Link from "next/link"
import BrandMark from "@modules/common/components/brand-mark"

export default function NotFoundPage() {
  return <main id="main-content" className="content-container flex min-h-[65vh] flex-col items-start justify-center py-16 small:py-24">
    <BrandMark />
    <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-accent">404 · Page not found</p>
    <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight small:text-5xl">Let’s find your way back.</h1>
    <p className="mt-5 max-w-lg text-base leading-7 text-semantic-text-muted">This page may have moved, or the link may be incomplete. Return to AREVÉ to explore the collection.</p>
    <Link href="/" className="mt-8 inline-flex min-h-12 items-center justify-center bg-semantic-surface-inverse px-7 py-3 text-sm font-medium text-semantic-text-inverse">Return to AREVÉ</Link>
  </main>
}
