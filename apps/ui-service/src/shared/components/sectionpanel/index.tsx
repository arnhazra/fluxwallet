"use client"
import { ReactNode } from "react"
import Show from "@/shared/components/show"
import MaskText from "@/shared/components/mask"

interface SectionPanelProps {
  title: string
  icon: ReactNode
  content: string
  masked?: boolean
  actionComponents?: ReactNode[]
}

export default function SectionPanel({
  title,
  content,
  masked,
  actionComponents,
  icon,
}: SectionPanelProps) {
  return (
    <section className="grid gap-6 bg-background border-none text-white rounded-lg">
      <div className="flex flex-row items-center justify-between rounded-lg border-none p-4">
        <div className="flex flex-row items-center gap-4">
          {icon}
          <div className="space-y-0.5">
            <p className="text-sm">{title}</p>
            <p className="text-sm text-neutral-300">
              <Show condition={!!masked} fallback={content}>
                <MaskText value={content} />
              </Show>
            </p>
          </div>
        </div>
        <div>
          <Show condition={!!actionComponents?.length}>
            <div className="flex gap-4">
              {actionComponents?.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </Show>
        </div>
      </div>
    </section>
  )
}
