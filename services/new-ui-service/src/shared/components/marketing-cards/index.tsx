import * as Icons from "lucide-react"
import { App, Solution } from "@/shared/constants/types"
import IconContainer from "../icon-container"
import { useRouter } from "nextjs-toploader/app"
import { platformName } from "@/shared/constants/global-constants"
import Show from "../show"

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

export function SolutionCard({
  solution,
  ai,
}: {
  solution: Solution
  ai?: boolean
}) {
  const SolutionIcon = (Icons as any)[solution.icon] || Icons.HelpCircle

  return (
    <div className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20 cursor-pointer">
      <div className="flex justify-between items-center mb-12">
        <div>
          <Show condition={!!ai}>
            <p className="text-xs">{platformName}</p>
          </Show>
          <h2 className={!!ai ? "text-xl" : "text-3xl"}>
            {solution.displayName}
          </h2>
        </div>
        <IconContainer ai={ai}>
          <SolutionIcon className="h-5 w-5" />
        </IconContainer>
      </div>
      <p className="text-sm leading-relaxed mt-auto">{solution.description}</p>
    </div>
  )
}
