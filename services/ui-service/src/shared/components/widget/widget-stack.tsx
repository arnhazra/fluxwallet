import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { Widget } from "@/shared/constants/types"
import useQuery from "@/shared/hooks/use-query"
import WidgetCard from "./widget-card"
import * as Icons from "lucide-react"

export default function WidgetStack() {
  const { data: widgetData } = useQuery<Widget[]>({
    queryKey: ["get-widgets"],
    queryUrl: endPoints.widgets,
    method: HTTPMethods.GET,
  })

  const widgets = widgetData?.map((widget) => {
    const AppIcon = (Icons as any)[widget.icon] || Icons.HelpCircle
    return (
      <WidgetCard
        key={widget.icon}
        icon={<AppIcon className="h-5 w-5" />}
        statTitle={widget.title}
        statValue={widget.value}
        additionalInfo={widget.additionalInfo}
      />
    )
  })

  return (
    <section>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {widgets}
        </div>
      </div>
    </section>
  )
}
