import * as Icons from "lucide-react"
import { ProductConfig } from "@/shared/types"
import IconContainer from "../icon-container"
import { useRouter } from "nextjs-toploader/app"

export function ProductCard({ product }: { product: ProductConfig }) {
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

export function OverviewCard() {
  return (
    <div className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl">Overview</h2>
        <IconContainer>
          <Icons.Activity className="h-4 w-4 text-black" />
        </IconContainer>
      </div>
      <div className="flex gap-8 mb-8 justify-center">
        <div className="w-16 h-16 bg-white rounded-full" />
        <div className="w-16 h-16 bg-primary rounded-full" />
      </div>
      <div className="flex gap-8 mb-8 justify-center">
        <div className="w-16 h-16 bg-primary rounded-full" />
        <div className="w-16 h-16 bg-white rounded-full" />
      </div>
      <p className="text-md leading-relaxed mt-auto">
        View your entire financial picture in one place. Track assets,
        liabilities, and net worth effortlessly, giving you clarity and
        confidence to plan ahead.
      </p>
    </div>
  )
}

export function IntelligenceCard() {
  return (
    <div className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl">Intelligence</h2>
        <IconContainer>
          <Icons.Brain className="h-4 w-4 text-black" />
        </IconContainer>
      </div>
      <div className="flex justify-center mb-8">
        <div className="w-64 h-32 relative">
          <div className="left-4 w-48 h-4 bg-neutral-500" />
          <div className="mt-2 left-4 w-36 h-4 bg-neutral-700" />
          <div className="mt-2 left-4 w-24 h-4 bg-primary" />
        </div>
      </div>
      <p className="text-md leading-relaxed mt-auto">
        Unlock smarter decisions with AI-powered insights. Discover trends,
        anticipate risks, and receive personalized suggestions designed to grow
        and protect your financial future.
      </p>
    </div>
  )
}

export function ControlCard() {
  return (
    <div className="bg-background border border-border p-8 rounded-3xl flex flex-col hover:shadow-lg hover:shadow-primary/20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl">Control</h2>
        <IconContainer>
          <Icons.Cog className="h-4 w-4 text-black" />
        </IconContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-[200px] mx-auto">
        <div className="space-y-4">
          <div className="w-16 h-16">
            <div className="w-16 h-8 bg-neutral-400 rounded-t-full" />
            <div className="w-16 h-8 bg-neutral-500 rounded-b-full" />
          </div>
          <div className="w-16 h-16">
            <div className="w-16 h-8 bg-neutral-500 rounded-t-full" />
            <div className="w-16 h-8 bg-neutral-400 rounded-b-full" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16">
            <div className="w-16 h-8 bg-neutral-400 rounded-t-full" />
            <div className="w-16 h-8 bg-neutral-500 rounded-b-full" />
          </div>
          <div className="w-16 h-16 relative">
            <div className="w-16 h-8 bg-neutral-500 rounded-t-full" />
            <div className="w-16 h-8 bg-neutral-400 rounded-b-full" />
          </div>
        </div>
      </div>
      <p className="text-md leading-relaxed mt-auto">
        Stay in charge of your portfolio. Add, edit, or remove entries anytime,
        ensuring your financial records remain accurate, flexible, and always up
        to date.
      </p>
    </div>
  )
}
