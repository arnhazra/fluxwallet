"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import { uiConstants } from "@/shared/constants/global-constants"
import ky from "ky"
import { ReactNode, useState } from "react"
import Show from "@/shared/components/show"
import AuthProvider from "../auth/auth"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import {
  Subscription,
  SubscriptionConfig,
  User,
} from "@/shared/constants/types"
import Loading from "../loading"
import { useQuery as useBaseQuery } from "@tanstack/react-query"
import PlatformHeader from "@/shared/components/platform-header"
import { useUserContext } from "@/context/user.provider"
import OneAgent from "@/shared/components/oneagent"
import { SubscriptionModal } from "@/shared/components/subscription-modal"
import notify from "@/shared/hooks/use-notify"
import useQuery from "@/shared/hooks/use-query"
import HTTPMethods from "@/shared/constants/http-methods"

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [, dispatch] = useUserContext()
  const [isAuthorized, setAuthorized] = useState<boolean>(false)

  const getUserDetails = async () => {
    if (!localStorage.getItem("accessToken")) {
      setAuthorized(false)
      return null
    } else {
      try {
        const response: {
          user: User
          subscription: Subscription | null
        } = await ky
          .get(endPoints.userDetails, { timeout: FETCH_TIMEOUT })
          .json()
        dispatch("setUser", response.user)
        dispatch("setSubscription", response.subscription)
        setAuthorized(true)
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 401) {
            setAuthorized(false)
          } else {
            notify(uiConstants.connectionErrorMessage, "error")
          }
        } else {
          notify(uiConstants.genericError, "error")
        }
      } finally {
        return null
      }
    }
  }

  const { isLoading, isFetching } = useBaseQuery({
    queryKey: ["user-details", isAuthorized],
    queryFn: getUserDetails,
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  const subscriptionPricing = useQuery<SubscriptionConfig>({
    queryKey: ["pricing-settings"],
    queryUrl: endPoints.getSubscriptionConfig,
    method: HTTPMethods.GET,
    suspense: false,
  })

  const appLayout = (
    <div className="min-h-screen w-full text-white hero-landing relative">
      <PlatformHeader />
      <div className="w-full px-4 sm:container sm:max-w-[90rem] mt-4">
        {children}
      </div>
      <OneAgent />
      <SubscriptionModal data={subscriptionPricing.data} />
    </div>
  )

  return (
    <Show
      condition={!isLoading && !isFetching && !subscriptionPricing.isLoading}
      fallback={<Loading />}
    >
      <Show condition={!isAuthorized} fallback={appLayout}>
        <AuthProvider onAuthorized={(auth: boolean) => setAuthorized(auth)} />
      </Show>
    </Show>
  )
}
