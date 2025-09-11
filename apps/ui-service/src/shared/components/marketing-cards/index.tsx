import * as Icons from "lucide-react"
import { Product, Solution } from "@/shared/constants/types"
import IconContainer from "../icon-container"
import { useRouter } from "nextjs-toploader/app"
import {
  ControlVector,
  IntelligenceVector,
  OverviewVector,
} from "@/shared/assets/svg"
import { appName } from "@/shared/constants/global-constants"

const VisualComponents: Record<string, React.FC> = {
  overview: OverviewVector,
  intelligence: IntelligenceVector,
  control: ControlVector,
}

export function ProductCard({ product }: { product: Product }) {
  const ProductIcon = (Icons as any)[product.icon] || Icons.HelpCircle
  const router = useRouter()

  return (
    <div
      className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
      onClick={() => router.push(product.url)}
    >
      <div className="flex justify-between items-center mb-12">
        <div>
          <p className="text-xs">{appName}</p>
          <h2 className="text-xl">{product.displayName}</h2>
        </div>
        <IconContainer>
          <ProductIcon className="h-4 w-4" />
        </IconContainer>
      </div>
      <p className="text-sm leading-relaxed justify">{product.description}</p>
    </div>
  )
}

export function SolutionCard({ solution }: { solution: Solution }) {
  const SolutionIcon = (Icons as any)[solution.icon] || Icons.HelpCircle
  const Visual = VisualComponents[solution.vector]

  return (
    <div className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl">{solution.displayName}</h2>
        <IconContainer>
          <SolutionIcon className="h-4 w-4" />
        </IconContainer>
      </div>
      <Visual />
      <p className="text-md leading-relaxed mt-auto">{solution.description}</p>
    </div>
  )
}
