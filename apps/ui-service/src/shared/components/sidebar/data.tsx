import { Bookmark, History } from "lucide-react"
import { ReactNode } from "react"

interface LinkData {
  displayName: string
  link: string
  icon: ReactNode
}

export const sidebarLinks: LinkData[] = [
  {
    displayName: "Collections",
    link: "/collections",
    icon: <Bookmark className="scale-75" />,
  },
  {
    displayName: "History",
    link: "/history",
    icon: <History className="scale-75" />,
  },
]
