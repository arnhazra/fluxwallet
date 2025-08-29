import { ShieldCheck } from "lucide-react"

export default function FeatureItem({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center">
        <ShieldCheck className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-medium text-primary">{title}</p>
        <p className="text-sm leading-relaxed text-neutral-300">{children}</p>
      </div>
    </li>
  )
}
