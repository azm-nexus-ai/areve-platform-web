import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  resetComplete?: boolean
  registrationAvailable: boolean
}

const Login = ({ setCurrentView, resetComplete, registrationAvailable }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="w-full flex flex-col items-start"
      data-testid="login-page"
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-accent">Your AREVÉ account</p>
      <h1 className="mb-5 font-serif text-4xl small:text-5xl">Welcome back</h1>
      {resetComplete && <p role="status" className="mb-6 border-l-2 border-areve-botanical bg-areve-sand/30 p-4 text-sm leading-6">Your password has been updated. Sign in with your new password.</p>}
      <p className="mb-8 text-base leading-7 text-semantic-text-muted">
        Your orders, saved addresses and personal details, all in one place.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          Sign in
        </SubmitButton>
      </form>
      <LocalizedClientLink href="/forgot-password" className="mt-4 inline-flex min-h-11 items-center underline">Forgot your password?</LocalizedClientLink>
      {registrationAvailable ? <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="inline-flex min-h-11 items-center underline underline-offset-4"
          data-testid="register-button"
        >
          Join us
        </button>
        .
      </span> : <p className="mt-6 text-sm leading-6 text-semantic-text-muted">New account registration is temporarily paused. Existing customers can still sign in.</p>}
    </div>
  )
}

export default Login
