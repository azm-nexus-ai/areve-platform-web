import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { sdk } from "@lib/config"
import { localReviewEnabled } from "../../../../../../local-review"
import { getBaseURL } from "@lib/util/env"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Review inbox", robots: { index: false, follow: false } }
type Message = { id: string; to: string; template: string; subject: string; html: string; text: string; created_at: string }

function recoveryLink(message: Message): string | null {
  if (message.template !== "customer-password-reset" || Date.now() - new Date(message.created_at).getTime() >= 15 * 60_000) return null
  const match = message.text.match(/https?:\/\/\S+/)
  if (!match) return null
  try {
    const url = new URL(match[0])
    if (url.origin !== new URL(getBaseURL()).origin || url.pathname !== "/ng/reset-password" || !url.hash.startsWith("#token=")) return null
    return url.href
  } catch { return null }
}

export default async function ReviewInbox() {
  if (!localReviewEnabled()) notFound()
  const { messages } = await sdk.client.fetch<{ messages: Message[] }>("/store/review/inbox", { cache: "no-store" })
  return <main id="main-content" className="content-container py-12 small:py-20">
    <p className="eyebrow mb-4 text-areve-walnut">Private review</p>
    <h1 className="font-serif text-4xl small:text-5xl">The review inbox</h1>
    <p className="mt-5 max-w-2xl text-sm leading-7 text-areve-walnut">Order and account emails arrive here for @areve.test addresses. Nothing is sent to an external mailbox. Use fictional details throughout your review.</p>
    <Link href="/ng/review/inbox" prefetch={false} className="brand-link mt-5">Refresh inbox</Link>
    {!messages.length && <p role="status" className="mt-12 border-y border-areve-sand py-10 text-sm text-areve-walnut">No messages yet. Place a review order or request a password reset to see its email here.</p>}
    <div className="mt-10 space-y-6">{messages.map(message => {
      const reset = recoveryLink(message)
      return <article key={message.id} className="border border-areve-sand bg-areve-ivory p-5 small:p-8" data-testid="review-email">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="mb-2 break-all text-xs text-areve-walnut">To {message.to}</p><h2 className="font-serif text-2xl">{message.subject}</h2><time dateTime={message.created_at} className="mt-2 block text-xs text-areve-walnut">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos" }).format(new Date(message.created_at))} · Lagos</time></div>
          {reset && <a href={reset} referrerPolicy="no-referrer" className="brand-button" data-testid="review-reset-link">Open reset form</a>}
        </div>
        <details className="mt-6 border-t border-areve-sand pt-4"><summary className="flex min-h-11 cursor-pointer items-center text-sm underline underline-offset-4">Preview email</summary><iframe title={`${message.subject} for ${message.to}`} srcDoc={message.html} sandbox="" referrerPolicy="no-referrer" className="mt-4 h-[520px] w-full border border-areve-sand bg-white" /></details>
      </article>
    })}</div>
  </main>
}
