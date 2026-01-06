import * as Icons from "lucide-react"
import { Solution } from "@/shared/constants/types"
import IconContainer from "../icon-container"
import { Card, CardContent, CardHeader } from "../ui/card"

interface SolutionCardProps {
  solution: Solution
  ai?: boolean
}

export function SolutionCard({ solution, ai }: SolutionCardProps) {
  const SolutionIcon = (Icons as any)[solution.icon] || Icons.HelpCircle

  return (
    <Card className="bg-background border border-border p-2 rounded-3xl hover:shadow-lg hover:shadow-primary/20 cursor-pointer">
      <CardHeader className="flex justify-between mt-6 items-center">
        <h2 className="text-2xl">{solution.displayName}</h2>
        <IconContainer ai={ai}>
          <SolutionIcon className="h-5 w-5" />
        </IconContainer>
      </CardHeader>
      <CardContent className="mb-6 mt-auto">
        <p className="text-sm leading-relaxed justify ">
          {solution.description}
        </p>
      </CardContent>
    </Card>
  )
}
