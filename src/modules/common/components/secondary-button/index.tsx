"use client"

import { clx } from "@medusajs/ui"
import { ButtonHTMLAttributes } from "react"

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function SecondaryButton({
  className,
  type = "button",
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={clx(
        "inline-flex min-h-11 items-center justify-center border border-semantic-action-secondary bg-transparent px-5 py-3 text-sm font-semibold text-semantic-text-primary transition-colors duration-200 hover:bg-semantic-action-secondary hover:text-semantic-text-inverse disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-focus",
        className
      )}
      {...props}
    />
  )
}
