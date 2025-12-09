import * as Icons from "lucide-react"
import { App } from "@/shared/constants/types"
import IconContainer from "../icon-container"
import { useRouter } from "nextjs-toploader/app"
import { platformName } from "@/shared/constants/global-constants"

export function AppCard({ app }: { app: App }) {
  const AppIcon = (Icons as any)[app.icon] || Icons.HelpCircle
  const router = useRouter()

  return (
    <div
      className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
      onClick={() => router.push(app.url)}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs">{platformName}</p>
          <h2 className="text-xl">{app.displayName}</h2>
        </div>
        <IconContainer>
          <AppIcon className="h-5 w-5" />
        </IconContainer>
      </div>
      <p className="text-sm leading-relaxed justify">{app.description}</p>
    </div>
  )
}
