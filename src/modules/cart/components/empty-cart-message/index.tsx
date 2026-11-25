import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-start justify-center py-16 small:py-24" data-testid="empty-cart-message">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-accent">Considered additions</p>
      <Heading
        level="h2"
        className="font-serif text-4xl small:text-5xl"
      >
        Your basket awaits
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        Discover pieces for everyday rituals and thoughtful gifts. Your selections will appear here.
      </Text>
      <div>
        <InteractiveLink href="/store">Explore products</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
