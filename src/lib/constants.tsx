import React from "react"
import { CreditCard } from "@medusajs/icons"

/** Supported AREVÉ checkout providers. */
export const paymentInfoMap: Record<string, { title: string; icon: React.JSX.Element }> = {
  pp_paystack_paystack: {
    title: "Card, bank transfer or USSD (Paystack)",
    icon: <CreditCard />,
  },
  pp_system_default: {
    title: "Simulated payment — review only",
    icon: <CreditCard />,
  },
}

export const isPaystack = (providerId?: string) => providerId === "pp_paystack_paystack"
export const isManual = (providerId?: string) => providerId === "pp_system_default"

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]
