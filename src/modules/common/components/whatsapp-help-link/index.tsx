import { whatsAppLink } from "@lib/util/whatsapp"
import { clx } from "@medusajs/ui"
import { AnchorHTMLAttributes, ReactNode } from "react"

type WhatsAppHelpLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children"
> & {
  phoneNumber?: string | null
  message?: string
  children?: ReactNode
}

export default function WhatsAppHelpLink({
  phoneNumber,
  message,
  children = "Chat with us on WhatsApp",
  className,
  ...props
}: WhatsAppHelpLinkProps) {
  const href = whatsAppLink(phoneNumber, message)

  if (!href) {
    return null
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={clx(
        "inline-flex min-h-11 items-center text-sm font-semibold text-semantic-text-primary underline decoration-semantic-text-accent underline-offset-4 hover:text-semantic-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-focus",
        className
      )}
      {...props}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
