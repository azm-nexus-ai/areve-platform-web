import { Button } from "@medusajs/ui"
import { useEffect, useId } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  'data-testid'?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  'data-testid': dataTestid
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()
  const panelId = useId()

  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    toggle()
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className="text-small-regular" data-testid={dataTestid}>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="uppercase text-ui-fg-base">{label}</span>
          <div className="flex items-center flex-1 basis-0 justify-end gap-x-4">
            {typeof currentInfo === "string" ? (
              <span className="font-semibold" data-testid="current-info">{currentInfo}</span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            className="w-[100px] min-h-[25px] py-1"
            onClick={handleToggle}
            type={state ? "reset" : "button"}
            data-testid="edit-button"
            data-active={state}
            aria-expanded={state}
            aria-controls={panelId}
            aria-label={`${state ? "Cancel editing" : "Edit"} ${label.toLowerCase()}`}
          >
            {state ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {isSuccess && <div role="status" data-testid="success-message">
          <p className="p-2 my-4 text-green-900 bg-green-50 rounded">{label} updated successfully</p>
      </div>}

      {/* Error state  */}
      {state && isError && <div role="alert" data-testid="error-message">
          <p className="p-2 my-4 text-red-900 bg-red-50 rounded">{errorMessage}</p>
      </div>}

      <div id={panelId} hidden={!state}>
        <fieldset disabled={!state || pending}>
          <div className="flex flex-col gap-y-2 py-4">
            <div>{children}</div>
            <div className="flex items-center justify-end mt-2">
              <Button
                isLoading={pending}
                className="w-full small:max-w-[140px]"
                type="submit"
                data-testid="save-button"
              >
                Save changes
              </Button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  )
}

export default AccountInfo
