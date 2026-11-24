"use client"

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type Props = { cart?: HttpTypes.StoreCart | null }

export default function CartDropdown({ cart }: Props) {
  const [open, setOpen] = useState(false)
  const totalItems = cart?.items?.reduce((count, item) => count + item.quantity, 0) ?? 0
  const subtotal = cart?.subtotal ?? 0

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Open cart with ${totalItems} items`}
        className="inline-flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.08em] text-semantic-text-primary hover:text-semantic-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus"
        data-testid="nav-cart-link"
      >
        Cart ({totalItems})
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-[80]">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel className="flex h-full w-full max-w-[440px] flex-col overflow-y-auto bg-semantic-surface-canvas p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-semantic-border-subtle pb-4">
              <DialogTitle className="font-serif text-2xl text-semantic-text-primary">Your cart ({totalItems})</DialogTitle>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close cart" className="inline-flex min-h-11 min-w-11 items-center justify-center text-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus">×</button>
            </div>
            {cart?.items?.length ? (
              <>
                <ul className="flex-1 divide-y divide-semantic-border-subtle">
                  {cart.items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-5" data-testid="cart-item">
                      <LocalizedClientLink href={`/products/${item.product_handle}`} onClick={() => setOpen(false)} className="w-20 shrink-0">
                        <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" alt={item.product_title || "Product"} />
                      </LocalizedClientLink>
                      <div className="min-w-0 flex-1">
                        <LocalizedClientLink href={`/products/${item.product_handle}`} onClick={() => setOpen(false)} className="font-serif text-lg text-semantic-text-primary">
                          {item.product_title}
                        </LocalizedClientLink>
                        <LineItemOptions variant={item.variant} />
                        <p className="mt-2 text-xs text-semantic-text-muted">Quantity: {item.quantity}</p>
                        <LineItemPrice item={item} style="tight" currencyCode={cart.currency_code} />
                        <DeleteButton id={item.id} className="mt-2" data-testid="cart-item-remove-button">Remove</DeleteButton>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="sticky bottom-0 border-t border-semantic-border-subtle bg-semantic-surface-canvas pt-5">
                  <div className="flex justify-between gap-3 text-sm text-semantic-text-primary">
                    <span>Subtotal (before shipping and taxes)</span>
                    <strong>{convertToLocale({ amount: subtotal, currency_code: cart.currency_code })}</strong>
                  </div>
                  <LocalizedClientLink
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center bg-semantic-action-primary text-sm font-semibold text-semantic-action-primaryText"
                    data-testid="go-to-cart-button"
                  >
                    View cart and checkout
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
                <p className="text-sm text-semantic-text-muted">Your cart is empty.</p>
                <LocalizedClientLink href="/store" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center bg-semantic-action-primary px-6 text-sm font-semibold text-semantic-action-primaryText">
                  Explore products
                </LocalizedClientLink>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
