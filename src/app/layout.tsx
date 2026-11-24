import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
// Fonts are self-hosted via @fontsource (no build-time call to Google Fonts).
import "@fontsource/cormorant-garamond/400.css"
import "@fontsource/cormorant-garamond/500.css"
import "@fontsource/cormorant-garamond/600.css"
import "@fontsource-variable/inter"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "AREVÉ — Luxurious Living & Home Essentials",
    template: "%s | AREVÉ",
  },
  icons: { icon: "/areve-logo.png" },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="font-sans">
        <div className="relative">{props.children}</div>
      </body>
    </html>
  )
}
