"use client"
import { ReactNode } from "react"
import { FetchProvider } from "./fetch.provider"
import { AppStateProvider } from "../../context/appstate.provider"
import { ConfirmProvider } from "./confirm.provider"
import { PromptProvider } from "./prompt.provider"
import { TooltipProvider } from "../components/ui/tooltip"
import { Toaster } from "sonner"
import { GoogleOAuthProvider } from "@react-oauth/google"

export default function Providers({ children }: { children: ReactNode }) {
  const oAuthClientId = process.env.NEXT_PUBLIC_CLIENT_ID
  console.log(process.env.NEXT_PUBLIC_CLIENT_ID)
  console.log(oAuthClientId)
  return (
    <GoogleOAuthProvider clientId={oAuthClientId ?? ""}>
      <TooltipProvider>
        <FetchProvider>
          <AppStateProvider>
            <ConfirmProvider>
              <PromptProvider>{children}</PromptProvider>
            </ConfirmProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#18181b",
                  borderColor: "#27272a",
                  color: "#ffffff",
                },
              }}
              style={{
                background: "#18181b",
                borderColor: "#27272a",
                color: "#ffffff",
              }}
            />
          </AppStateProvider>
        </FetchProvider>
      </TooltipProvider>
    </GoogleOAuthProvider>
  )
}
