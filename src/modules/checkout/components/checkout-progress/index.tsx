"use client"

import { useSearchParams } from "next/navigation"

const steps = [
  { id: "address", label: "Contact & address" },
  { id: "delivery", label: "Delivery" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
]

export default function CheckoutProgress() {
  const step = useSearchParams().get("step") || "address"
  const active = Math.max(0, steps.findIndex((item) => item.id === step))
  return (
    <nav aria-label="Checkout progress" className="mb-10">
      <ol className="grid grid-cols-4 gap-2">
        {steps.map((item, index) => (
          <li key={item.id} className="min-w-0">
            <div className={`h-1.5 w-full ${index <= active ? "bg-semantic-action-primary" : "bg-semantic-border-subtle"}`} aria-hidden="true" />
            <span
              className={`mt-2 block text-[11px] leading-4 small:text-xs ${index === active ? "font-semibold text-semantic-text-primary" : "text-semantic-text-muted"}`}
              aria-current={index === active ? "step" : undefined}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
