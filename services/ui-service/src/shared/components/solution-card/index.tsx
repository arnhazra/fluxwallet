import * as Icons from "lucide-react"
import { Solution } from "@/shared/constants/types"
import IconContainer from "../icon-container"
import { platformName } from "@/shared/constants/global-constants"
import Show from "../show"

export function SolutionCard({
  solution,
  ai,
}: {
  solution: Solution
  ai?: boolean
}) {
  const SolutionIcon = (Icons as any)[solution.icon] || Icons.HelpCircle

  return (
    <div className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20">
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
