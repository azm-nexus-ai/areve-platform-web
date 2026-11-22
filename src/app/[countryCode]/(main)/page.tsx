import { Metadata } from "next"
import { getAreveConfig } from "@lib/data/areve"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { whatsAppLink } from "@lib/util/whatsapp"
import DeliveryPromiseMessage from "@modules/common/components/delivery-promise-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TrustStrip from "@modules/common/components/trust-strip"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import Hero from "@modules/home/components/hero"
import NewIn from "@modules/home/components/new-in"

export const metadata: Metadata = {
  title: "AREVÉ — Luxurious Living & Home Essentials",
  description: "Explore AREVÉ bedding, bath, home fragrance and gifts.",
}

export default async function Home({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  const [region, { collections }, config] = await Promise.all([
    getRegion(countryCode),
    listCollections({ fields: "id,handle,title" }),
    getAreveConfig(),
  ])

  const featuredCollections = collections.slice(0, 3)
  const giftCollection = collections.find((c) => /gift/i.test(`${c.title} ${c.handle}`))
  const helpHref = whatsAppLink(config.whatsapp_number, "Hello AREVÉ, I need help with my order.")

  return (
    <main>
      <Hero content={config.content.hero} />
      <TrustStrip items={[
        { label: "Delivery", detail: <DeliveryPromiseMessage config={config} /> },
        { label: "Need help?", detail: helpHref
          ? <a href={helpHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Chat on WhatsApp</a>
          : "Support details coming soon" },
        { label: "Checkout", detail: "Payment options shown at checkout" },
      ]} />
      {region && <NewIn region={region} />}

      {featuredCollections.length > 0 && (
        <section className="bg-semantic-surface-muted/40 py-14 small:py-20" aria-labelledby="collections-heading">
          <div className="content-container">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-semantic-text-accent">Discover AREVÉ</p>
            <h2 id="collections-heading" className="font-serif text-3xl text-semantic-text-primary small:text-4xl">Shop by collection</h2>
            <ul className="mt-8 grid grid-cols-1 gap-5 xsmall:grid-cols-2 small:grid-cols-3">
              {featuredCollections.map((collection) => (
                <li key={collection.id}>
                  <LocalizedClientLink
                    href={`/collections/${collection.handle}`}
                    className="group flex aspect-square flex-col justify-end border border-semantic-border-subtle bg-areve-sand p-7 transition-colors hover:bg-areve-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-focus"
                  >
                    <span className="font-serif text-2xl text-semantic-text-primary small:text-3xl">{collection.title}</span>
                    <span className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-semantic-text-accent group-hover:underline">Explore collection</span>
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {region && featuredCollections.slice(0, 2).map((collection) => (
        <ProductRail key={collection.id} collection={collection} region={region} />
      ))}

      {giftCollection && (
        <section className="border-y border-semantic-border-subtle bg-areve-ink py-16 text-areve-ivory small:py-24" aria-labelledby="gifts-heading">
          <div className="content-container flex flex-col items-start gap-5 small:flex-row small:items-center small:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em]">The gifting edit</p>
              <h2 id="gifts-heading" className="font-serif text-3xl small:text-4xl">Thoughtful gifts, considered details.</h2>
            </div>
            <LocalizedClientLink href={`/collections/${giftCollection.handle}`} className="inline-flex min-h-11 items-center border border-areve-ivory px-6 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-areve-ivory hover:text-areve-ink">
              Explore gifts
            </LocalizedClientLink>
          </div>
        </section>
      )}

      <section className="content-container grid gap-8 py-16 small:grid-cols-2 small:items-center small:gap-20 small:py-24" aria-labelledby="story-heading">
        <div className="aspect-square bg-gradient-to-br from-areve-sand to-areve-ivory" aria-hidden="true" />
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-semantic-text-accent">Considered living</p>
          <h2 id="story-heading" className="font-serif text-3xl leading-tight text-semantic-text-primary small:text-4xl">The little details make a space your own.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-semantic-text-muted">
            Explore bedding, fragrance and home essentials for everyday rituals, special occasions and everything in between.
          </p>
          <LocalizedClientLink href="/store" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-semantic-text-accent underline underline-offset-4">
            Discover the shop
          </LocalizedClientLink>
        </div>
      </section>
    </main>
  )
}
