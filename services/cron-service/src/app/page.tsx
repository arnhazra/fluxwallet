"use client"
import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    if (process.env.UI_URL) {
      window.location.replace(process.env.UI_URL)
    }
  }, [])
  return null
}
