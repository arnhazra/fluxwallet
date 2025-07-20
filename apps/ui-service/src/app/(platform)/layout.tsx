"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import { uiConstants } from "@/shared/constants/global-constants"
import ky from "ky"
import { ReactNode, useState } from "react"
import { toast } from "sonner"
import Show from "@/shared/components/show"
import AuthProvider from "./auth"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { Subscription, User } from "@/shared/types"
import Loading from "../loading"
import { useQuery } from "@tanstack/react-query"
import { Atom, Bell } from "lucide-react"
import Sidebar from "@/shared/components/sidebar"
import { Button } from "@/shared/components/ui/button"
import { useAppContext } from "@/context/appstate.provider"

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [, dispatch] = useAppContext()
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
          isSubscriptionActive: boolean
        } = await ky
          .get(endPoints.userDetails, { timeout: FETCH_TIMEOUT })
          .json()
        dispatch("setUser", response.user)
        dispatch("setSubscription", response.subscription)
        dispatch("setSubscriptionActive", response.isSubscriptionActive)
        setAuthorized(true)
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 401) {
            setAuthorized(false)
          } else {
            toast(uiConstants.notification, {
              icon: <Bell className="scale-75" />,
              description: uiConstants.connectionErrorMessage,
            })
          }
        } else {
          toast(uiConstants.notification, {
            icon: <Bell className="scale-75" />,
            description: uiConstants.toastError,
          })
        }
      } finally {
        return null
      }
    }
  }

  const { isLoading, isFetching } = useQuery({
    queryKey: ["user-details", isAuthorized],
    queryFn: getUserDetails,
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  const appLayout = (
    <div className="min-h-screen w-full text-white hero-landing relative">
      <Sidebar />
      <div className="container lg:max-w-[90rem] mt-4">{children}</div>
      <Button
        variant="default"
        size="default"
        className="h-14 w-14 fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary rounded-full"
      >
        <Atom className="scale-75" />
      </Button>
    </div>
  )

  return (
    <Show condition={!isLoading && !isFetching} fallback={<Loading />}>
      <Show condition={!isAuthorized} fallback={appLayout}>
        <AuthProvider onAuthorized={(auth: boolean) => setAuthorized(auth)} />
      </Show>
    </Show>
  )
}
