import { getAreveConfig } from "@lib/data/areve"
import DeliveryPromiseMessage from "@modules/common/components/delivery-promise-message"

type Props = { itemTotal?: number; className?: string }

/** Server wrapper fetches the latest shop config; client callers use DeliveryPromiseMessage. */
export default async function DeliveryPromise({ itemTotal = 0, className }: Props) {
  const config = await getAreveConfig()
  return <DeliveryPromiseMessage config={config} itemTotal={itemTotal} className={className} />
}
