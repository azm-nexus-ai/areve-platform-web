import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import localFont from "next/font/local"
import "styles/globals.css"

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
        <div className="relative">{props.children}</div>
      </body>
    </html>
  )
}
