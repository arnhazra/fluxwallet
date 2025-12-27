"use client"
import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_UI_URL) {
      window.location.replace(process.env.NEXT_PUBLIC_UI_URL)
    }
  }, [])

  return null
}
