"use client"
import IconContainer from "@/shared/components/icon-container"
import { Progress } from "@/shared/components/ui/progress"
import { appName } from "@/shared/constants/global-constants"
import { Wallet } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-main space-y-4">
      <IconContainer>
        <Wallet className="h-4 w-4" />
      </IconContainer>
      <p className="text-white">Loading {appName}</p>
      <Progress
        indeterminate
        className="xl:w-[20%] lg:w-[25%] md:w-[30%] w-[50%] rounded-3xl"
      />
    </div>
  )
}
