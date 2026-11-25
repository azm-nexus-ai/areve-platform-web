import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { redirect } from "next/navigation"
import { listOrderPage } from "@lib/data/orders"
import { Pagination } from "@modules/store/components/pagination"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders({ searchParams, params }: { searchParams: Promise<{ page?: string }>; params: Promise<{ countryCode: string }> }) {
  const [query, { countryCode }] = await Promise.all([searchParams, params])
  const requested = Number(query.page ?? "1")
  const page = Number.isSafeInteger(requested) && requested > 0 && requested <= 1000 ? requested : 1
  const { orders, count } = await listOrderPage(10, (page - 1) * 10)
  const totalPages = Math.max(1, Math.ceil(count / 10))
  if (page > totalPages || (query.page && String(page) !== query.page)) redirect(`/${countryCode}/account/orders?page=${Math.min(page, totalPages)}`)

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="font-serif text-4xl small:text-5xl">Orders</h1>
        <p className="text-base-regular">
          View orders placed while signed in and follow their status. For help with
          a guest order, return or exchange, contact AREVÉ with your order number.
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} label="Order pages" />}
      </div>
    </div>
  )
}
