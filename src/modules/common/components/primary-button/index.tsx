"use client"

import { clx } from "@medusajs/ui"
import { ButtonHTMLAttributes } from "react"

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function PrimaryButton({
  className,
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={clx(
        "inline-flex min-h-11 items-center justify-center border border-semantic-border-strong bg-semantic-action-primary px-5 py-3 text-sm font-semibold text-semantic-text-inverse transition-colors duration-200 hover:bg-semantic-surface-inverse disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-focus",
        className
      )}
      {...props}
    />
  )
}
