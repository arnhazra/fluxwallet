import * as Icons from "lucide-react"
import { App } from "@/shared/constants/types"
import IconContainer from "../icon-container"
import { useRouter } from "nextjs-toploader/app"
import { platformName } from "@/shared/constants/global-constants"
import { Card, CardContent, CardHeader } from "../ui/card"

interface AppCardProps {
  app: App
}

export function AppCard({ app }: AppCardProps) {
  const AppIcon = (Icons as any)[app.icon] || Icons.HelpCircle
  const router = useRouter()

  return (
    <Card
      className="bg-background border border-border p-2 rounded-3xl hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
      onClick={() => router.push(app.url)}
    >
      <CardHeader className="flex justify-between mt-6 items-center">
        <div>
          <p className="text-xs">{platformName}</p>
          <h2 className="text-xl">{app.displayName}</h2>
        </div>
        <IconContainer>
          <AppIcon className="h-5 w-5" />
        </IconContainer>
      </CardHeader>
      <CardContent className="mb-6">
        <p className="text-sm leading-relaxed justify">{app.description}</p>
      </CardContent>
    </Card>
  )
}
