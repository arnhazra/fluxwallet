"use client"
import { ReactNode } from "react"

const IconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-2 bg-primary text-black rounded-full">{children}</div>
  )
}

export default IconContainer
