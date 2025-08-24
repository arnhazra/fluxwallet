import * as Icons from "lucide-react"
import { Product, Solution } from "@/shared/types"
import IconContainer from "../icon-container"
import { useRouter } from "nextjs-toploader/app"
import {
  ControlVector,
  IntelligenceVector,
  OverviewVector,
} from "@/shared/assets/svg"

const VisualComponents: Record<string, React.FC> = {
  overview: OverviewVector,
  intelligence: IntelligenceVector,
  control: ControlVector,
}

export function ProductCard({ product }: { product: Product }) {
  const LucideIcon = (Icons as any)[product.icon] || Icons.HelpCircle
  const router = useRouter()

  return (
    <div
      className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
      onClick={() => router.push(product.url)}
    >
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-2xl">{product.displayName}</h2>
        <IconContainer>
          <LucideIcon className="h-4 w-4 text-black" />
        </IconContainer>
      </div>
      <p className="text-sm leading-relaxed justify">{product.description}</p>
    </div>
  )
}

export function SolutionCard({ solution }: { solution: Solution }) {
  const LucideIcon = (Icons as any)[solution.icon] || Icons.HelpCircle
  const Visual = VisualComponents[solution.vector]

  return (
    <div className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl">{solution.displayName}</h2>
        <IconContainer>
          <LucideIcon className="h-4 w-4 text-black" />
        </IconContainer>
      </div>
      <Visual />
      <p className="text-md leading-relaxed mt-auto">{solution.description}</p>
    </div>
  )
}
