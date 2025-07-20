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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Package } from "lucide-react"
import { Currency, InstitutionType } from "@/shared/types"
import ky from "ky"
import { endPoints } from "@/shared/constants/api-endpoints"

const currencies = Object.values(Currency)
const institutions = Object.values(InstitutionType)

interface PortfolioFormData {
  portfolioName: string
  institutionType: InstitutionType
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [formData, setFormData] = useState<PortfolioFormData>({
    portfolioName: "",
    institutionType: InstitutionType.BANK,
  })

  const handleInputChange = (field: keyof PortfolioFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlertMessage("")

    try {
      await ky.post(endPoints.portfolio, { json: formData })
      setAlertMessage("Portfolio created successfully!")
    } catch (error) {
      setAlertMessage("Error creating portfolio")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-background text-white border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Create New Portfolio
          </CardTitle>
          <CardDescription className="text-sm text-primary">
            Set up a new portfolio to track your investments and assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="portfolioName">
                Portfolio Name <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                id="portfolioName"
                placeholder="Enter portfolio name"
                value={formData.portfolioName}
                onChange={(e) =>
                  handleInputChange("portfolioName", e.target.value)
                }
                className="w-full bg-main text-white border-border focus:border-primary focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionType">Institution Type</Label>
              <Select
                required
                value={formData.institutionType}
                onValueChange={(value) =>
                  handleInputChange("institutionType", value)
                }
              >
                <SelectTrigger className="w-full bg-main text-white border-border">
                  <SelectValue placeholder="Select institution type"></SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full bg-main text-white border-border">
                  {institutions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex">
              <Button
                className="ml-auto bg-primary hover:bg-primary text-white"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Portfolio"}
              </Button>
            </div>
          </form>
          {alertMessage && (
            <div className="mt-4 text-center text-sm text-primary">
              {alertMessage}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
