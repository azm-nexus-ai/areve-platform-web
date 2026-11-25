"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="w-full flex flex-col items-start"
      data-testid="register-page"
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-accent">A considered connection</p>
      <h1 className="mb-5 font-serif text-4xl small:text-5xl">
        Create your AREVÉ account
      </h1>
      <p className="mb-8 text-base leading-7 text-semantic-text-muted">
        Keep your details close and follow the orders you place while signed in.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            data-testid="password-input"
          />
        </div>
        <p className="mt-2 text-sm">Use a unique password of 12–128 characters.</p>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          Read our{" "}
          <LocalizedClientLink
            href="/privacy"
            className="underline"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/terms"
            className="underline"
          >
            Terms of Use
          </LocalizedClientLink>
          {" "}before creating your account.
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          Join
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="inline-flex min-h-11 items-center underline underline-offset-4"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
