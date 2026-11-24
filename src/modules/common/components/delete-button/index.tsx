import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
  label = "Remove item from cart",
  "data-testid": dataTestId,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  label?: string
  "data-testid"?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (isDeleting) return
    setIsDeleting(true)
    setError(null)
    try {
      await deleteLineItem(id)
    } catch {
      setError("Unable to remove this item. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        type="button"
        aria-label={label}
        aria-busy={isDeleting}
        disabled={isDeleting}
        data-testid={dataTestId}
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
      {error && <p role="alert" className="text-sm text-semantic-text-error">{error}</p>}
    </div>
  )
}

export default DeleteButton
