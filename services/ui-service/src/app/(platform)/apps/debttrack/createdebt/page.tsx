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
import { CalendarIcon, BadgeDollarSign } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"
import { cn } from "@/shared/lib/utils"
import { endPoints } from "@/shared/constants/api-endpoints"
import { formatDate } from "@/shared/lib/format-date"
import api from "@/shared/lib/ky-api"

interface DebtFormData {
  debtPurpose: string
  identifier: string
  startDate?: Date
  endDate?: Date
  principalAmount?: number
  interestRate?: number
}

type MessageType = "success" | "error"

export default function Page() {
  const [formData, setFormData] = useState<DebtFormData>({
    debtPurpose: "",
    identifier: "",
  })

  const [message, setMessage] = useState<{ msg: string; type: MessageType }>({
    msg: "",
    type: "success",
  })

  const handleInputChange = (field: keyof DebtFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      await api.post(endPoints.debt, {
        json: formData,
      })
      setMessage({ msg: "Debt added successfully!", type: "success" })
    } catch (error) {
      setMessage({
        msg: "Failed to add debt. Please try again.",
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
              <BadgeDollarSign className="h-6 w-6 text-primary" />
              Add New Debt
            </CardTitle>
            <CardDescription className="text-primary">
              Fill in the details for your debt.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="debtPurpose" className="text-neutral-200">
                    Debt Purpose
                  </Label>
                  <Input
                    id="debtPurpose"
                    value={formData.debtPurpose}
                    onChange={(e) =>
                      handleInputChange("debtPurpose", e.target.value)
                    }
                    placeholder="e.g. Home Loan, Car Loan"
                    className="bg-background border-border text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-neutral-200">
                    Identifier
                  </Label>
                  <Input
                    id="identifier"
                    value={formData.identifier}
                    onChange={(e) =>
                      handleInputChange("identifier", e.target.value)
                    }
                    placeholder="Unique Identifier"
                    className="bg-background border-border text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                    required
                  />
                </div>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-200">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background border-border text-neutral-100 hover:bg-background",
                          !formData.startDate && "text-neutral-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate
                          ? formatDate(formData.startDate)
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background border-border">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        startMonth={new Date(2000, 0)}
                        endMonth={new Date()}
                        selected={formData.startDate}
                        disabled={(date) => date > new Date()}
                        onSelect={(date) =>
                          handleInputChange("startDate", date)
                        }
                        showOutsideDays={false}
                        className="bg-background text-neutral-100"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-200">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background border-border text-neutral-100 hover:bg-background",
                          !formData.endDate && "text-neutral-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate
                          ? formatDate(formData.endDate)
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background border-border">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        captionLayout="dropdown"
                        startMonth={new Date(formData.startDate ?? 2000)}
                        endMonth={new Date(2100, 0)}
                        disabled={(date) =>
                          formData.startDate ? date < formData.startDate : false
                        }
                        onSelect={(date) => handleInputChange("endDate", date)}
                        showOutsideDays={false}
                        className="bg-background text-neutral-100"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Financial Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="principalAmount" className="text-neutral-200">
                    Principal Amount
                  </Label>
                  <Input
                    id="principalAmount"
                    type="number"
                    step="0.01"
                    value={formData.principalAmount || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "principalAmount",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="0.00"
                    className="bg-background border-border text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="text-neutral-200">
                    Interest Rate (%)
                  </Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={formData.interestRate || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "interestRate",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="0.00"
                    className="bg-background border-border text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                  />
                </div>
              </div>

              <div className="flex">
                <Button
                  type="submit"
                  variant="default"
                  className="bg-primary hover:bg-primary ml-auto text-black"
                >
                  Add Debt
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
