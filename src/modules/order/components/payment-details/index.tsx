import { isManual, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

export default function PaymentDetails({ order }: { order: HttpTypes.StoreOrder }) {
  const payments = order.payment_collections?.flatMap(collection => collection.payments ?? []) ?? []
  return <section>
    <h2 className="font-serif text-3xl my-6">Payment</h2>
    <div className="space-y-5">{payments.map(payment => <div key={payment.id} className="grid gap-4 small:grid-cols-2 text-sm leading-7">
      <div><p className="font-medium">Payment method</p><p className="text-areve-walnut" data-testid="payment-method">{paymentInfoMap[payment.provider_id]?.title ?? "Payment"}</p></div>
      <div><p className="font-medium">{isManual(payment.provider_id) ? "Review amount" : payment.captured_at ? "Payment received" : "Payment authorised"}</p>
        <p data-testid="payment-amount">{convertToLocale({ amount: payment.amount, currency_code: order.currency_code })}</p>
        <p className="text-areve-walnut">{isManual(payment.provider_id) ? "No money has been charged." : payment.captured_at || payment.created_at ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos" }).format(new Date((payment.captured_at ?? payment.created_at)!)) + " · Lagos" : ""}</p>
      </div>
    </div>)}</div>
    {!payments.length && <p className="text-sm text-areve-walnut">Payment status: {order.payment_status?.replaceAll("_", " ") ?? "awaiting confirmation"}.</p>}
    <Divider className="mt-8" />
  </section>
}
