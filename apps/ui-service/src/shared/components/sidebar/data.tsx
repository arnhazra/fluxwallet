import { BookA, CalendarClock, Key, Newspaper, ShieldCheck } from "lucide-react"
import { ReactNode } from "react"

interface LinkData {
  displayName: string
  link: string
  icon: ReactNode
}

export const sidebarLinks: LinkData[] = [
  {
    displayName: "Privacy",
    link: "/settings/privacy",
    icon: <ShieldCheck className="scale-75" />,
  },
  {
    displayName: "Subscription",
    link: "/settings/subscription",
    icon: <CalendarClock className="scale-75" />,
  },
  {
    displayName: "API Key",
    link: "/settings/apikey",
    icon: <Key className="scale-75" />,
  },
  {
    displayName: "API Reference",
    link: "/apireference",
    icon: <BookA className="scale-75" />,
  },
  {
    displayName: "Finance NewsRoom",
    link: "/newsroom",
    icon: <Newspaper className="scale-75" />,
  },
]
