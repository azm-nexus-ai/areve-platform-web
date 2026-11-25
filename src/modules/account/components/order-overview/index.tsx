"use client"


import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-semantic-border-subtle pb-6 last:pb-0 last:border-none"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="flex w-full flex-col items-start gap-y-4 bg-semantic-surface-muted p-6 small:p-8"
      data-testid="no-orders-container"
    >
      <h2 className="font-serif text-2xl">Your next chapter starts here</h2>
      <p className="text-base-regular">
        Orders placed while signed in will appear here, ready to revisit whenever you need them.
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/store" data-testid="continue-shopping-button" className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">
          Explore the collection
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
