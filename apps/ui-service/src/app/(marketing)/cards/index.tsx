import { BrainCircuit, Check, Cog } from "lucide-react"
import { Button } from "../../../shared/components/ui/button"
import { appName } from "@/shared/constants/global-constants"

export function OverviewCard() {
  return (
    <div className="bg-background border-white p-8 rounded-lg">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl">Overview</h2>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-white bg-primary hover:bg-primary"
        >
          <Check className="h-4 w-4 text-white" />
          <span className="sr-only">Your finance dashboard</span>
        </Button>
      </div>
      <div className="flex gap-8 mb-8 justify-center">
        <div className="w-16 h-16 bg-white rounded-full" />
        <div className="w-16 h-16 bg-primary rounded-full" />
      </div>
      <div className="flex gap-8 mb-8 justify-center">
        <div className="w-16 h-16 bg-primary rounded-full" />
        <div className="w-16 h-16 bg-white rounded-full" />
      </div>
      <p className="text-md leading-relaxed">
        See your entire financial landscape at a glance — assets, liabilities,
        and net worth all organized in one clean view.
      </p>
    </div>
  )
}

export function IntelligenceCard() {
  return (
    <div className="bg-background border-border p-8 rounded-lg">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl">Intelligence</h2>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-primary hover:bg-primary"
        >
          <BrainCircuit className="h-4 w-4 text-white" />
          <span className="sr-only">{appName} Intelligence</span>
        </Button>
      </div>
      <div className="flex justify-center mb-8">
        <div className="w-64 h-32 relative">
          <div className="absolute top-0 left-0 bg-primary p-2 rounded-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <BrainCircuit />
            </svg>
          </div>
          <div className="absolute top-12 left-4 w-48 h-4 bg-neutral-600 rounded" />
          <div className="absolute top-20 left-4 w-36 h-4 bg-neutral-600 rounded" />
        </div>
      </div>
      <p className="text-md leading-relaxed">
        Leverage AI-powered insights to identify trends, uncover opportunities,
        and get personalized suggestions to grow and protect your wealth.
      </p>
    </div>
  )
}

export function ControlCard() {
  return (
    <div className="bg-background p-8 rounded-lg">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl">Control</h2>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-primary hover:bg-primary"
        >
          <Cog className="h-4 w-4 text-white" />
          <span className="sr-only">Learn more about control</span>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-[200px] mx-auto">
        <div className="space-y-4">
          <div className="w-16 h-16">
            <div className="w-16 h-8 bg-neutral-100 rounded-t-full" />
            <div className="w-16 h-8 bg-neutral-600 rounded-b-full" />
          </div>
          <div className="w-16 h-16">
            <div className="w-16 h-8 bg-neutral-100 rounded-t-full" />
            <div className="w-16 h-8 bg-neutral-600 rounded-b-full" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16">
            <div className="w-16 h-8 bg-neutral-100 rounded-t-full" />
            <div className="w-16 h-8 bg-neutral-600 rounded-b-full" />
          </div>
          <div className="w-16 h-16 relative">
            <div className="w-16 h-8 bg-neutral-100 rounded-t-full" />
            <div className="w-16 h-8 bg-neutral-600 rounded-b-full" />
            <div className="absolute bottom-0 right-0 bg-primary p-1 rounded-lg">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="text-md leading-relaxed">
        Easily manage all your assets — add, edit, or remove entries anytime
        with full flexibility and total peace of mind.
      </p>
    </div>
  )
}
