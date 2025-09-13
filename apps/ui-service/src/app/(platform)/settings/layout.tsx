"use client"
import { ReactElement, ReactNode } from "react"
import { CalendarClock, Info, Leaf, ShieldCheck, User } from "lucide-react"
import { Tabs, tabsList } from "./data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { userUser } from "@/context/user.provider"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"

const mapTabIcons: Record<Tabs, ReactElement> = {
  user: <User className="h-4 w-4" />,
  privacy: <ShieldCheck className="h-4 w-4" />,
  subscription: <CalendarClock className="h-4 w-4" />,
  sustainability: <Leaf className="h-4 w-4" />,
  about: <Info className="h-4 w-4" />,
}

export default function SetingsLayout({ children }: { children: ReactNode }) {
  const [{ user }] = userUser()
  const pathname = usePathname()

  const renderTabs = tabsList.map((tab: Tabs) => {
    return (
      <Link
        key={tab}
        className={`cursor-pointer flex capitalize ${
          pathname.includes(tab) ? "text-primary" : "text-neutral-200"
        }`}
        href={`/settings/${tab}`}
      >
        <div className="me-2 mt-0.5">{mapTabIcons[tab]}</div>
        <p>{tab}</p>
      </Link>
    )
  })

  return (
    <>
      <div className="mx-auto grid w-full gap-2">
        <div className="flex justify-between">
          <div className="flex gap-4 mb-4">
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={user.avatar ?? ""} alt={user.name} />
              <AvatarFallback className="bg-neutral-800">
                <User className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
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
