"use client"
import type React from "react"
import { useState } from "react"
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
import { CalendarIcon, PiggyBank } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"
import { cn } from "@/shared/lib/tw-class-util"
import ky from "ky"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { endPoints } from "@/shared/constants/api-endpoints"
import { formatDate } from "@/shared/lib/format-date"
import { ExpenseCategory } from "@/shared/constants/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

interface ExpenseFormData {
  title?: string
  expenseAmount?: number
  expenseCategory?: ExpenseCategory
  expenseDate?: Date
}

type MessageType = "success" | "error"

export default function Page() {
  const [formData, setFormData] = useState<ExpenseFormData>({})

  const [message, setMessage] = useState<{ msg: string; type: MessageType }>({
    msg: "",
    type: "success",
  })

  const handleInputChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      await ky.post(endPoints.expense, {
        timeout: FETCH_TIMEOUT,
        json: formData,
      })
      setMessage({ msg: "Expense added successfully!", type: "success" })
    } catch (error) {
      setMessage({
        msg: "Failed to add expense. Please try again.",
        type: "error",
      })
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-background border-border">
          <CardHeader className="border-b border-neutral-800">
            <CardTitle className="flex items-center gap-2 text-neutral-100">
              <PiggyBank className="h-6 w-6 text-primary" />
              Add New Expense
            </CardTitle>
            <CardDescription className="text-primary">
              Fill in the details for your expense.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-neutral-200">
                  Expense Details
                </Label>
                <Input
                  required
                  id="title"
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g. Groceries"
                  className="bg-background border-border text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenseCategory" className="text-neutral-200">
                  Expense Category
                </Label>
                <Select
                  value={formData.expenseCategory}
                  onValueChange={(value) =>
                    handleInputChange("expenseCategory", value)
                  }
                  required
                >
                  <SelectTrigger className="w-full bg-background text-white border-border">
                    <SelectValue placeholder="Select expense category" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-background text-white border-border">
                    {Object.values(ExpenseCategory).map((item) => (
                      <SelectItem key={item} value={item}>
                        <div className="flex items-center gap-2">
                          {item.replace("_", " & ")}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-200">Expense Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-border text-neutral-100 hover:bg-neutral-700",
                        !formData.expenseDate && "text-neutral-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expenseDate
                        ? formatDate(formData.expenseDate)
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      startMonth={new Date()}
                      endMonth={new Date(2100, 0)}
                      selected={formData.expenseDate}
                      disabled={(date) => date > new Date()}
                      onSelect={(date) =>
                        handleInputChange("expenseDate", date)
                      }
                      showOutsideDays={false}
                      className="bg-background text-neutral-100"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenseAmount" className="text-neutral-200">
                  Expense Amount
                </Label>
                <Input
                  required
                  id="expenseAmount"
                  type="number"
                  step="0.01"
                  value={formData.expenseAmount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "expenseAmount",
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
                  Add Expense
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
