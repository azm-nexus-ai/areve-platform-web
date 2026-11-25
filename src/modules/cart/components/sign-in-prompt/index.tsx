import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-semantic-border-subtle pb-6">
      <div>
        <Heading level="h2" className="txt-xlarge">
          Already have an account?
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          Sign in to use your saved details and keep this order in your account.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account" className="inline-flex min-h-11 items-center border border-semantic-border-strong px-5 text-sm hover:bg-semantic-surface-muted" data-testid="sign-in-button">
            Sign in
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
