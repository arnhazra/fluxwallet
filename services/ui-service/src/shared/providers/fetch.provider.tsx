"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { FetchInterceptor } from "@mswjs/interceptors/fetch"
import Cookies from "js-cookie"
import { endPoints } from "../constants/api-endpoints"
import api from "../lib/ky-api"

const interceptor = new FetchInterceptor()

interceptor.apply()
interceptor.on("request", ({ request }) => {
  request.headers.set("Authorization", `Bearer ${Cookies.get("accessToken")}`)
})

interceptor.on("response", async ({ response, request }) => {
  if (response.status === 401) {
    try {
      const data = await response.clone().json()
      if (data && data.message && data.message === "Access token expired") {
        try {
          const refreshResponse = await api.post(endPoints.refresh, {
            json: { refreshToken: Cookies.get("refreshToken") },
          })
          type TokenResponse = { accessToken: string; refreshToken: string }
          const tokens = (await refreshResponse.json()) as TokenResponse
          if (tokens && tokens.accessToken && tokens.refreshToken) {
            Cookies.set("accessToken", tokens.accessToken)
            Cookies.set("refreshToken", tokens.refreshToken)
          }
        } catch (error) {
          throw new Error("Refresh token expired")
        }
      } else {
        throw new Error("Unauthorized")
      }
    } catch (e) {
      Cookies.remove("accessToken")
      Cookies.remove("refreshToken")
      window.location.replace("/")
    }
  }
})

export function FetchProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
