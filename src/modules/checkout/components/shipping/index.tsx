"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOptionWithServiceZone[] | null
}

export default function Shipping({ cart, availableShippingMethods }: ShippingProps) {
  const [busy, setBusy] = useState(false)
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [loadingPrices, setLoadingPrices] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const open = searchParams.get("step") === "delivery"
  const selected = cart.shipping_methods?.length === 1 ? cart.shipping_methods[0] : null
  const eligible = availableShippingMethods?.find(option => option.id === selected?.shipping_option_id)
  const currentPrice = eligible?.price_type === "flat" ? eligible.amount : prices[eligible?.id ?? ""]
  const confirmed = !!eligible && currentPrice != null && Number(currentPrice) === Number(selected?.amount)

  useEffect(() => {
    let active = true
    const calculated = availableShippingMethods?.filter(option => option.price_type === "calculated") ?? []
    setPrices({})
    setLoadingPrices(calculated.length > 0)
    if (calculated.length) {
      Promise.allSettled(calculated.map(option => calculatePriceForShippingOption(option.id, cart.id))).then(results => {
        if (!active) return
        const next: Record<string, number> = {}
        for (const result of results) {
          if (result.status === "fulfilled" && result.value?.id && typeof result.value.amount === "number" && Number.isFinite(result.value.amount)) next[result.value.id] = result.value.amount
        }
        setPrices(next)
        setLoadingPrices(false)
      })
    }
    return () => { active = false }
  }, [availableShippingMethods, cart.id])

  useEffect(() => { setError(null) }, [open])

  async function select(id: string) {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Delivery could not be saved. Please try again.")
    } finally { setBusy(false) }
  }

  return <section aria-labelledby="delivery-heading" className="bg-white">
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2 id="delivery-heading" className="flex items-center gap-3 font-serif text-3xl text-areve-ink">Delivery{!open && confirmed && <CheckCircleSolid aria-label="Complete" />}</h2>
      {!open && cart.shipping_address && <button type="button" onClick={() => router.push(`${pathname}?step=delivery`, { scroll: false })} className="min-h-11 text-sm text-areve-walnut underline underline-offset-4" data-testid="edit-delivery-button">Edit</button>}
    </div>
    {open ? <>
      <p className="mb-5 text-sm leading-6 text-areve-walnut">Available delivery for your selected state and area. Your final charge appears below.</p>
      {!availableShippingMethods?.length ? <div role="status" className="mb-6 border border-areve-sand bg-areve-ivory/50 p-5 text-sm leading-6">
        <p>{availableShippingMethods === null ? "Delivery quotes are temporarily unavailable." : "No delivery option is available for this address and basket."}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          <button type="button" onClick={() => router.push(`${pathname}?step=address`, { scroll: false })} className="min-h-11 text-areve-walnut underline underline-offset-4">Review address</button>
          <button type="button" onClick={() => router.refresh()} className="min-h-11 text-areve-walnut underline underline-offset-4">Refresh delivery</button>
        </div>
      </div> : <RadioGroup aria-label="Delivery method" value={confirmed ? selected?.shipping_option_id ?? undefined : undefined} onChange={select} disabled={busy} data-testid="delivery-options-container" className="mb-6 space-y-3">
        {availableShippingMethods.map(option => {
          const amount = option.price_type === "flat" ? option.amount : prices[option.id]
          const unavailable = amount == null || option.insufficient_inventory
          return <Radio key={option.id} value={option.id} disabled={unavailable} data-testid="delivery-option-radio" className={clx("flex min-h-20 cursor-pointer items-center justify-between gap-4 border px-4 py-5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-areve-walnut small:px-6", confirmed && option.id === selected?.shipping_option_id ? "border-areve-walnut bg-areve-ivory/50" : "border-areve-sand", unavailable && "cursor-not-allowed opacity-60")}>
            <span className="flex items-center gap-3"><MedusaRadio checked={confirmed && option.id === selected?.shipping_option_id} /><span>{option.name}</span></span>
            <span className="shrink-0 font-medium">{amount != null ? Number(amount) === 0 ? "Complimentary" : convertToLocale({ amount, currency_code: cart.currency_code }) : loadingPrices ? "Quoting…" : "Unavailable"}</span>
          </Radio>
        })}
      </RadioGroup>}
      {selected && !confirmed && <p role="status" className="mb-4 text-sm leading-6 text-areve-walnut">Your previous delivery selection needs confirmation. Choose an available option to continue.</p>}
      <ErrorMessage error={error} data-testid="delivery-option-error-message" />
      <Button size="large" className="w-full small:w-auto" onClick={() => router.push(`${pathname}?step=payment`, { scroll: false })} isLoading={busy} disabled={!confirmed || busy || loadingPrices} data-testid="submit-delivery-option-button">Continue to payment</Button>
    </> : confirmed && <p className="text-sm leading-6 text-areve-walnut">{selected?.name} · {Number(selected?.amount) === 0 ? "Complimentary" : convertToLocale({ amount: selected!.amount!, currency_code: cart.currency_code })}</p>}
    <Divider className="mt-8" />
  </section>
}
