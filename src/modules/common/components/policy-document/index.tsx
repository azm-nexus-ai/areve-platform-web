import { getAreveConfig } from "@lib/data/areve"
import { getPolicy, type PolicyKind } from "@lib/data/policies"
import { whatsAppLink } from "@lib/util/whatsapp"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const titles: Record<PolicyKind, string> = { delivery: "Delivery", returns: "Returns", privacy: "Privacy", terms: "Terms" }
export default async function PolicyDocument({ kind }: { kind: PolicyKind }) {
  const [{ policy, unavailable }, config] = await Promise.all([getPolicy(kind), getAreveConfig()])
  const contact = whatsAppLink(config.whatsapp_number, `Hello AREVÉ, I have a question about ${kind}.`)
  return <main id="main-content" className="content-container py-12 small:py-20">
    <div className="grid gap-10 medium:grid-cols-[220px_minmax(0,720px)] medium:gap-16">
      <nav aria-label="Customer information" className="border-b border-semantic-border-subtle pb-6 medium:border-b-0 medium:border-r medium:pb-0 medium:pr-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-accent">Customer care</p>
        <ul className="flex flex-wrap gap-x-6 medium:block">{(Object.keys(titles) as PolicyKind[]).map(item => <li key={item}><LocalizedClientLink href={`/${item}`} aria-current={item === kind ? "page" : undefined} className={`inline-flex min-h-11 items-center text-sm underline-offset-4 ${item === kind ? "font-semibold underline" : "text-semantic-text-muted hover:underline"}`}>{titles[item]}</LocalizedClientLink></li>)}</ul>
      </nav>
      <article className="min-w-0">
        <p className="text-xs uppercase tracking-[0.18em] text-semantic-text-accent">AREVÉ · Considered care</p>
        <h1 className="mt-3 font-serif text-4xl text-semantic-text-primary small:text-5xl">{titles[kind]}</h1>
        {policy ? <>
          <p className="mt-4 text-xs text-semantic-text-muted">Published <time dateTime={policy.published_at}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" }).format(new Date(policy.published_at))}</time> · Version {policy.revision}</p>
          {policy.review_only && <p className="mt-6 border border-semantic-border-subtle bg-semantic-surface-muted p-4 text-sm leading-6">Review copy for testing. This policy is not approved for live orders.</p>}
          <div className="mt-8 space-y-5 break-words text-base leading-8 text-semantic-text-primary" data-testid="policy-body">{policy.body.split(/\n\s*\n/).map((paragraph, index) => <p key={index} className="whitespace-pre-wrap">{paragraph}</p>)}</div>
        </> : <div className="mt-8 border-y border-semantic-border-subtle py-8" role="status"><h2 className="font-serif text-2xl">{unavailable ? "We couldn’t load this information" : "Policy unavailable"}</h2><p className="mt-3 max-w-xl text-base leading-7 text-semantic-text-muted">{unavailable ? "Please refresh this page to try again, or contact our team for help." : "An approved policy has not been published. Please check back before placing a live order."}</p></div>}
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-semantic-border-subtle pt-6">
          {contact && <a href={contact} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">WhatsApp customer care</a>}
          {config.support_email && <a href={`mailto:${config.support_email}`} className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">Email customer care</a>}
          <LocalizedClientLink href="/store" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">Explore the collection</LocalizedClientLink>
        </div>
      </article>
    </div>
  </main>
}
