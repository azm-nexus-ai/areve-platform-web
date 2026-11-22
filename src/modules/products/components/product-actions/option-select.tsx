import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type Props = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

export default function OptionSelect({ option, current, updateOption, title, disabled, "data-testid": dataTestId }: Props) {
  const values = (option.values ?? []).map((v) => v.value)
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-semantic-text-primary">Select {title}</legend>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {values.map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => updateOption(option.id, value)}
            aria-pressed={value === current}
            className={clx(
              "min-h-11 min-w-11 flex-1 border px-3 py-2 text-sm text-semantic-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus",
              value === current ? "border-semantic-border-strong bg-semantic-surface-muted" : "border-semantic-border-subtle bg-semantic-surface-canvas hover:border-semantic-border-strong"
            )}
            disabled={disabled}
            data-testid="option-button"
          >
            {value}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
