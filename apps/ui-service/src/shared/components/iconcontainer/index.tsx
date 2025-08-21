"use client"
import { BanknoteIcon, icons } from "lucide-react"
import { ReactNode } from "react"

const IconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-2 bg-primary/90 text-black rounded-3xl">{children}</div>
  )
}

export default IconContainer
