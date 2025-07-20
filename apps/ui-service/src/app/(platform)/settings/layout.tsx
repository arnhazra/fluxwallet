"use client"
import { ReactElement, ReactNode } from "react"
import { Button } from "@/shared/components/ui/button"
import { CalendarClock, Info, Leaf, ShieldCheck, User } from "lucide-react"
import { Tabs, tabsList } from "./data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useConfirmContext } from "@/shared/providers/confirm.provider"
import { useAppContext } from "@/context/appstate.provider"

const mapTabIcons: Record<Tabs, ReactElement> = {
  user: <User />,
  privacy: <ShieldCheck />,
  subscription: <CalendarClock />,
  sustainability: <Leaf />,
  about: <Info />,
}

export default function SetingsLayout({ children }: { children: ReactNode }) {
  const [{ user }, dispatch] = useAppContext()
  const pathname = usePathname()
  const { confirm } = useConfirmContext()

  const renderTabs = tabsList.map((tab: Tabs) => {
    return (
      <Link
        key={tab}
        className={`cursor-pointer flex capitalize ${
          pathname.includes(tab) ? "text-primary" : "text-zinc-200"
        }`}
        href={`/settings/${tab}`}
      >
        <div className="me-2 scale-75 -mt-0.5">{mapTabIcons[tab]}</div>
        <p>{tab}</p>
      </Link>
    )
  })

  return (
    <>
      <div className="mx-auto grid w-full gap-2">
        <div className="flex justify-between">
          <div className="flex gap-4 mb-4">
            <Button
              variant="default"
              size="icon"
              className="rounded-full bg-border"
            >
              <User className="scale-75" />
            </Button>
            <div className="text-white">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-sm font-semibold">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full items-start gap-4 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm">{renderTabs}</nav>
        <div>{children}</div>
      </div>
    </>
  )
}
