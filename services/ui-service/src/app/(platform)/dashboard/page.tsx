"use client"
import { AppCard } from "@/shared/components/app-card"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { AppsConfig } from "@/shared/constants/types"
import WidgetStack from "@/shared/components/widget/widget-stack"
import { useUserContext } from "@/context/user.provider"

export default function Page() {
  const [{ searchKeyword }] = useUserContext()

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
