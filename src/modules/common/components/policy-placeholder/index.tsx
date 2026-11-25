import { getAreveConfig } from "@lib/data/areve"
import { whatsAppLink } from "@lib/util/whatsapp"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = { title: string; subject: string }

export default async function PolicyPlaceholder({ title, subject }: Props) {
  const config = await getAreveConfig()
  const href = whatsAppLink(config.whatsapp_number, `Hello AREVÉ, I have a question about ${subject}.`)
  return (
    <main id="main-content" className="content-container min-h-[55vh] py-16 small:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-accent">Customer information</p>
      <h1 className="mt-3 font-serif text-4xl text-semantic-text-primary">{title}</h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-semantic-text-muted">
        Our {subject} policy is coming soon. Please contact AREVÉ if you have questions before placing an order.
      </p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-semantic-text-accent underline underline-offset-4">
          Chat with us on WhatsApp
        </a>
      ) : config.support_email ? (
        <a href={`mailto:${config.support_email}`} className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-semantic-text-accent underline underline-offset-4">
          Contact support
        </a>
      ) : null}
      <div className="mt-10">
        <LocalizedClientLink href="/store" className="inline-flex min-h-11 items-center text-sm text-semantic-text-primary underline underline-offset-4">Back to the shop</LocalizedClientLink>
      </div>
    </main>
  )
}
