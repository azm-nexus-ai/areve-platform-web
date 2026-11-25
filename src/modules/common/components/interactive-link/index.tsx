import { ArrowUpRightMini } from "@medusajs/icons"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className="group inline-flex min-h-11 items-center gap-x-2 text-sm font-medium text-semantic-text-accent underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-semantic-focus"
      href={href}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-150"
        aria-hidden="true"
      />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
