import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getAreveConfig } from "@lib/data/areve"
import { whatsAppLink } from "@lib/util/whatsapp"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const policyLinks = [
  { label: "Delivery", href: "/delivery" },
  { label: "Returns", href: "/returns" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

const socialLinks = [
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL },
  { label: "X", href: process.env.NEXT_PUBLIC_X_URL },
].filter((link): link is { label: string; href: string } => Boolean(link.href))

export default async function Footer() {
  const [{ collections }, productCategories, config] = await Promise.all([
    listCollections({ fields: "*products" }),
    listCategories(),
    getAreveConfig(),
  ])

  const whatsappHref = whatsAppLink(
    config.whatsapp_number,
    "Hello AREVÉ, I have a question."
  )

  const topLevelCategories = productCategories.filter(
    (category) => !category.parent_category
  )

  return (
    <footer className="border-t border-semantic-border-subtle bg-semantic-surface-canvas text-semantic-text-primary">
      <div className="content-container py-16 small:py-24">
        <div className="grid grid-cols-1 gap-12 small:grid-cols-[1.2fr_2fr]">
          <div>
            <LocalizedClientLink
              href="/"
              className="font-serif text-3xl uppercase tracking-[0.28em] hover:text-semantic-text-accent"
            >
              AREVÉ
            </LocalizedClientLink>
            <p className="mt-4 max-w-sm text-sm leading-6 text-semantic-text-muted">
              Luxurious living and home essentials, delivered across Nigeria.
            </p>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-semantic-text-accent underline underline-offset-4"
              >
                Chat with AREVÉ on WhatsApp
              </a>
            )}
          </div>

          <div className={`grid grid-cols-2 gap-8 ${socialLinks.length > 0 ? "xsmall:grid-cols-4" : "xsmall:grid-cols-3"}`}>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em]">
                Shop
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-semantic-text-muted">
                <li>
                  <LocalizedClientLink href="/store" className="hover:text-semantic-text-accent">
                    All products
                  </LocalizedClientLink>
                </li>
                {topLevelCategories.slice(0, 5).map((category) => (
                  <li key={category.id}>
                    <LocalizedClientLink
                      href={`/categories/${category.handle}`}
                      className="hover:text-semantic-text-accent"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em]">
                Collections
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-semantic-text-muted">
                {collections.slice(0, 6).map((collection) => (
                  <li key={collection.id}>
                    <LocalizedClientLink
                      href={`/collections/${collection.handle}`}
                      className="hover:text-semantic-text-accent"
                    >
                      {collection.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em]">
                Help
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-semantic-text-muted">
                <li>
                  <LocalizedClientLink href="/account" className="hover:text-semantic-text-accent">
                    My account
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="hover:text-semantic-text-accent"
                  >
                    Track an order
                  </LocalizedClientLink>
                </li>
                {policyLinks.map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink
                      href={link.href}
                      className="hover:text-semantic-text-accent"
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {socialLinks.length > 0 && <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em]">Follow</h2>
              {(
                <ul className="mt-4 space-y-3 text-sm text-semantic-text-muted">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-semantic-text-accent"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-semantic-border-subtle pt-6 text-xs text-semantic-text-muted xsmall:flex-row xsmall:items-center xsmall:justify-between">
          <span>© {new Date().getFullYear()} AREVÉ. All rights reserved.</span>
          <span>areve.cc</span>
        </div>
      </div>
    </footer>
  )
}
