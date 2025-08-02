"use client"
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Input } from "@/shared/components/ui/input"

export default function usePrompt() {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [defaultValueState, setDefaultValue] = useState<
    number | undefined | null
  >(undefined)
  const [value, setValue] = useState<number>(0)
  const [resolveCallback, setResolveCallback] = useState<
    (choice: { hasConfirmed: boolean; value: number }) => void
  >(() => {})

  const handleClose = () => setShow(false)

  const prompt = (
    message: string,
    defaultValue?: number | null
  ): Promise<{ hasConfirmed: boolean; value: number }> => {
    setMessage(message)
    setDefaultValue(defaultValue)
    if (defaultValue) {
      setValue(defaultValue)
    }

    setShow(true)

    return new Promise((resolve) => {
      setResolveCallback(
        () =>
          ({
            hasConfirmed,
            value,
          }: {
            hasConfirmed: boolean
            value: number
          }) => {
            handleClose()
            resolve({ hasConfirmed, value })
          }
      )
    })
  }

  const handleConfirm = (choice: boolean) => {
    if (resolveCallback) {
      resolveCallback({ hasConfirmed: choice, value })
      setResolveCallback(() => {})
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value))
  }

  const promptDialog = () => (
    <AlertDialog open={show}>
      <AlertDialogContent className="bg-background text-white border-border">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="mb-2">{message}</AlertDialogTitle>
          <Input
            min={0}
            defaultValue={defaultValueState ? defaultValueState : ""}
            className="h-12 bg-background border-border"
            required
            type="number"
            placeholder={`Enter ${message}`}
            autoComplete={"off"}
            onChange={handleChange}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={() => handleConfirm(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary"
            variant="default"
            onClick={() => handleConfirm(true)}
          >
            Proceed
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return { promptDialog, prompt }
}

export type PromptProps = {
  promptDialog: () => React.ReactNode
  prompt: (
    message: string,
    defaultValue?: number | null | undefined
  ) => Promise<{ hasConfirmed: boolean; value: number }>
}
