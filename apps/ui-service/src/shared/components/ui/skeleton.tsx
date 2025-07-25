import { cn } from "@/shared/lib/tw-class-util"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
