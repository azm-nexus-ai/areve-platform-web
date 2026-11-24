"use client"

import { saveGiftMessage } from "@lib/data/gift-message"
import { useState, useTransition } from "react"

type Props = { initialValue?: string }

export default function GiftMessage({ initialValue = "" }: Props) {
  const [message, setMessage] = useState(initialValue)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const save = () => {
    setError("")
    setFeedback("")
    startTransition(async () => {
      try {
        await saveGiftMessage(message)
        setFeedback("Gift message saved.")
      } catch {
        setError("Could not save your gift message. Please try again.")
      }
    })
  }

  return (
    <section aria-labelledby="gift-message-heading" className="border border-semantic-border-subtle bg-semantic-surface-canvas p-5">
      <h2 id="gift-message-heading" className="font-serif text-2xl text-semantic-text-primary">Add a gift message</h2>
      <p className="mt-2 text-sm leading-6 text-semantic-text-muted">Optional. We’ll include your message with your order.</p>
      <label htmlFor="gift-message" className="mt-4 block text-sm font-semibold text-semantic-text-primary">Your message</label>
      <textarea
        id="gift-message"
        value={message}
        onChange={(event) => { setMessage(event.target.value); setFeedback("") }}
        maxLength={250}
        rows={4}
        placeholder="Write a note for the recipient"
        className="mt-2 w-full border border-semantic-border-strong bg-transparent p-3 text-base text-semantic-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs text-semantic-text-muted">{message.length}/250</span>
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="inline-flex min-h-11 items-center bg-semantic-action-primary px-5 text-sm font-semibold text-semantic-action-primaryText disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save message"}
        </button>
      </div>
      {feedback && <p role="status" className="mt-2 text-sm text-semantic-text-accent">{feedback}</p>}
      {error && <p role="alert" className="mt-2 text-sm text-semantic-text-error">{error}</p>}
    </section>
  )
}
