import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import localFont from "next/font/local"
import "styles/globals.css"
import Link from "next/link"
import { localReviewEnabled } from "../../local-review"

const serif = localFont({ src: "../styles/fonts/playfair-display.woff2", variable: "--font-serif", weight: "400 600", display: "swap" })
const sans = localFont({ src: [
  { path: "../styles/fonts/poppins-regular.woff2", weight: "400" },
  { path: "../styles/fonts/poppins-medium.woff2", weight: "500" },
  { path: "../styles/fonts/poppins-light.woff2", weight: "300" },
], variable: "--font-sans", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "AREVÉ — Heritage, Refined for Modern Living",
    template: "%s | AREVÉ",
  },
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">
        {localReviewEnabled() && <aside aria-label="Private review environment" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 bg-areve-botanical px-4 py-2 text-center text-xs leading-6 text-areve-ivory"><span>Review only · Sample catalogue · Simulated orders</span><Link href="/ng/review/inbox" className="inline-flex min-h-8 items-center underline underline-offset-4">Review inbox</Link></aside>}
        <div className="relative">{props.children}</div>
      </body>
    </html>
  )
}
