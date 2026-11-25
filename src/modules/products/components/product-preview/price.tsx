import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) return null
  return (
    <>
      {price.price_type === "sale" && (
        <Text className="line-through text-semantic-text-muted" data-testid="original-price">
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("text-semantic-text-primary", { "text-areve-botanical": price.price_type === "sale" })}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
