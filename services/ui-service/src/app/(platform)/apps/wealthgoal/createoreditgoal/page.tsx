"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { CalendarIcon, GoalIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"
import { cn } from "@/shared/lib/utils"
import { endPoints } from "@/shared/constants/api-endpoints"
import useQuery from "@/shared/hooks/use-query"
import { Goal } from "@/shared/constants/types"
import HTTPMethods from "@/shared/constants/http-methods"
import { formatDate } from "@/shared/lib/format-date"
import api from "@/shared/lib/ky-api"
import { normalizeToUTCNoon } from "@/shared/lib/utc-normalize"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import IconContainer from "@/shared/components/icon-container"
import Show from "@/shared/components/show"

interface GoalFormData {
  goalDate?: Date
  goalAmount?: number
}

type MessageType = "success" | "error"

export default function Page() {
  const [formData, setFormData] = useState<GoalFormData>({})
  const searchParams = useSearchParams()
  const goalId = searchParams.get("id")
  const router = useRouter()

  const goal = useQuery<Goal>({
    queryKey: ["get-goal"],
    queryUrl: `${endPoints.goal}/${goalId}`,
    method: HTTPMethods.GET,
    enabled: !!goalId,
    suspense: false,
  })

  useEffect(() => {
    if (!!goal.error || !goal.data) {
      router.push("/apps/wealthgoal/createoreditgoal")
    }

    if (goal.data) {
      const { goalAmount, goalDate } = goal.data
      setFormData({
        goalAmount,
        goalDate,
      })
    }
  }, [goal.data, goal.error])

  const [message, setMessage] = useState<{ msg: string; type: MessageType }>({
    msg: "",
    type: "success",
  })

  const handleInputChange = (field: keyof GoalFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      await api.put(`${endPoints.goal}/${goalId}`, {
        json: formData,
      })
      setMessage({ msg: "Goal added successfully!", type: "success" })
    } catch (error) {
      setMessage({
        msg: "Failed to add goal. Please try again.",
        type: "error",
      })
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-background border-border">
          <CardHeader className="border-b border-neutral-800">
            <CardTitle className="text-2xl flex items-center gap-2 text-neutral-100">
              <IconContainer>
                <GoalIcon className="h-4 w-4" />
              </IconContainer>
              <Show condition={!goalId} fallback="Edit Goal">
                Add New Goal
              </Show>
            </CardTitle>
            <CardDescription className="text-primary">
              Fill in the details for your goal.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-neutral-200">Goal Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-border text-neutral-100 hover:bg-background",
                        !formData.goalDate && "text-neutral-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.goalDate
                        ? formatDate(formData.goalDate)
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      startMonth={new Date()}
                      endMonth={new Date(2100, 0)}
                      selected={formData.goalDate}
                      disabled={(date) => date < new Date()}
                      onSelect={(date) =>
                        handleInputChange("goalDate", normalizeToUTCNoon(date))
                      }
                      showOutsideDays={false}
                      className="bg-background text-neutral-100"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalAmount" className="text-neutral-200">
                  Goal Amount
                </Label>
                <Input
                  required
                  id="goalAmount"
                  type="number"
                  step="0.01"
                  value={formData.goalAmount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "goalAmount",
                      Number.parseFloat(e.target.value)
                    )
                  }
                  placeholder="0.00"
                  className="bg-background border-border text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                />
              </div>

              <div className="flex">
                <Button
                  type="submit"
                  variant="default"
                  className="bg-primary hover:bg-primary ml-auto text-black"
                >
                  Save Goal
                </Button>
              </div>
            </form>

            {message.msg && (
              <div
                className={`mt-4 text-sm ${
                  message.type === "success" ? "text-primary" : "text-secondary"
                }`}
              >
                {message.msg}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
