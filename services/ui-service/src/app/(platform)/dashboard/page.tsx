"use client"
import { AppCard } from "@/shared/components/marketing-cards"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { AppsConfig } from "@/shared/constants/types"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import ky from "ky"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { useRouter } from "nextjs-toploader/app"
import { uiConstants } from "@/shared/constants/global-constants"
import notify from "@/shared/hooks/use-notify"
import WidgetStack from "@/shared/components/widget/widget-stack"
import { useUserContext } from "@/context/user.provider"

export default function Page() {
  const searchParams = useSearchParams()
  const [{ searchKeyword }] = useUserContext()
  const subscriptionSessionId = searchParams.get("sub_session_id")
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data } = useQuery<AppsConfig>({
    queryKey: ["app-config"],
    queryUrl: `${endPoints.getConfig}/app-config`,
    method: HTTPMethods.GET,
  })

  const renderApps = () => {
    if (!data?.apps) return null

    const searchPattern = new RegExp(searchKeyword, "i")
    return data.apps
      .filter(
        (app) =>
          searchPattern.test(app.displayName) ||
          searchPattern.test(app.appName) ||
          searchPattern.test(app.description)
      )
      .map((app) => <AppCard key={app.appName} app={app} />)
  }

  const subscribe = async () => {
    try {
      await ky
        .get(`${endPoints.subscribe}?sub_session_id=${subscriptionSessionId}`, {
          timeout: FETCH_TIMEOUT,
        })
        .json()
      queryClient.refetchQueries({ queryKey: ["user-details"] })
      notify(uiConstants.subscriptionSuccess, "success")
    } catch (error: any) {
      const errorMessage = (await error.response.json()).message
      notify(errorMessage, "error")
    }
  }

  useEffect(() => {
    if (!!subscriptionSessionId) {
      subscribe()
      router.replace("/dashboard")
    }
  }, [subscriptionSessionId])

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <WidgetStack />
      <section>
        <p className="text-xl mb-4 -mt-2 ms-1">Apps</p>
        <div className="mx-auto grid justify-center gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4">
          {renderApps()}
        </div>
      </section>
    </div>
  )
}
