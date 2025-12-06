"use client"
import { ReactNode } from "react"
import { FetchProvider } from "./fetch.provider"
import { UserStateProvider } from "../../context/user.provider"
import { ConfirmProvider } from "./confirm.provider"
import { PromptProvider } from "./prompt.provider"
import { TooltipProvider } from "../components/ui/tooltip"
import { Toaster } from "sonner"
import { GoogleOAuthProvider } from "@react-oauth/google"

export default function Providers({ children }: { children: ReactNode }) {
  const oAuthClientId = process.env.NEXT_PUBLIC_CLIENT_ID
  return (
    <GoogleOAuthProvider clientId={oAuthClientId ?? ""}>
      <TooltipProvider>
        <FetchProvider>
          <UserStateProvider>
            <ConfirmProvider>
              <PromptProvider>{children}</PromptProvider>
            </ConfirmProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#151616",
                  borderColor: "#27272a",
                },
              }}
            />
          </UserStateProvider>
        </FetchProvider>
      </TooltipProvider>
    </GoogleOAuthProvider>
  )
}
