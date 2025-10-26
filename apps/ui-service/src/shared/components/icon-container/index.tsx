"use client"
import { ReactNode } from "react"

interface IconContainerProps {
  children: ReactNode
  ai?: boolean
}

const IconContainer = ({ ai, children }: IconContainerProps) => {
  if (ai) {
    return (
      <div className="p-2 bg-purple text-white rounded-full hover:opacity-90 transition">
        {children}
      </div>
    )
  }

  return (
    <div className="p-2 bg-primary text-black rounded-full">{children}</div>
  )
}

export default IconContainer
