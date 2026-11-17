"use client"

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react"
import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { searchProducts } from "@lib/data/search-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { FormEvent, Fragment, useState, useTransition } from "react"
import { useParams } from "next/navigation"

type SearchResult = Awaited<ReturnType<typeof searchProducts>>[number]

export default function SearchOverlay() {
  const { countryCode } = useParams()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  const close = () => setIsOpen(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedQuery = query.trim()

    if (trimmedQuery.length < 2 || typeof countryCode !== "string") {
      setResults([])
      setHasSearched(true)
      return
    }

    startTransition(async () => {
      const nextResults = await searchProducts(trimmedQuery, countryCode)
      setResults(nextResults)
      setHasSearched(true)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 px-3 text-xs font-medium uppercase tracking-[0.08em] text-semantic-text-primary hover:text-semantic-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-focus"
        aria-haspopup="dialog"
      >
        <MagnifyingGlass />
        <span className="hidden xsmall:inline">Search</span>
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={close} className="relative z-[70]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-semantic-surface-inverse/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-0 small:p-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 -translate-y-3"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-3"
              >
                <DialogPanel className="w-full bg-semantic-surface-canvas shadow-xl small:max-w-3xl">
                  <div className="flex items-center justify-between border-b border-semantic-border-subtle px-5 py-4">
                    <DialogTitle className="font-serif text-2xl text-semantic-text-primary">
                      Search AREVÉ
                    </DialogTitle>
                    <button
                      type="button"
                      onClick={close}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center text-semantic-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus"
                      aria-label="Close search"
                    >
                      <XMark />
                    </button>
                  </div>

                  <form onSubmit={onSubmit} className="border-b border-semantic-border-subtle p-5">
                    <label htmlFor="store-search" className="sr-only">
                      Search products
                    </label>
                    <div className="flex items-center gap-3 border-b border-semantic-border-strong">
                      <MagnifyingGlass className="shrink-0 text-semantic-text-accent" />
                      <input
                        id="store-search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        autoFocus
                        placeholder="Search products"
                        className="min-h-12 w-full bg-transparent text-base text-semantic-text-primary outline-none placeholder:text-semantic-text-muted"
                      />
                      <button
                        type="submit"
                        className="min-h-11 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-semantic-text-accent"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  <div className="min-h-48 p-5">
                    {isPending ? (
                      <p className="text-sm text-semantic-text-muted">Searching products…</p>
                    ) : results.length > 0 ? (
                      <ul className="grid grid-cols-1 gap-3 small:grid-cols-2">
                        {results.map((product) => (
                          <li key={product.id}>
                            <LocalizedClientLink
                              href={`/products/${product.handle}`}
                              onClick={close}
                              className="grid grid-cols-[72px_1fr] gap-4 border border-semantic-border-subtle p-3 transition-colors hover:border-semantic-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus"
                            >
                              <div className="relative aspect-[4/5] bg-semantic-surface-muted">
                                {product.thumbnail ? (
                                  <Image
                                    src={product.thumbnail}
                                    alt=""
                                    fill
                                    sizes="72px"
                                    className="object-cover"
                                  />
                                ) : null}
                              </div>
                              <div className="min-w-0 self-center">
                                <p className="font-serif text-lg leading-5 text-semantic-text-primary">
                                  {product.title}
                                </p>
                                {product.price ? (
                                  <p className="mt-1 text-sm text-semantic-text-muted">
                                    {product.price}
                                  </p>
                                ) : null}
                              </div>
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    ) : hasSearched ? (
                      <p className="text-sm text-semantic-text-muted">
                        No products found for “{query.trim()}”.
                      </p>
                    ) : (
                      <p className="text-sm text-semantic-text-muted">
                        Enter at least two characters to search the live catalogue.
                      </p>
                    )}
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
