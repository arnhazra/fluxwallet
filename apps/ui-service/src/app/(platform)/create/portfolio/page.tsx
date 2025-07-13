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
import { Building2, Vault, Landmark, Package } from "lucide-react"
import { Currency, InstitutionType } from "@/shared/types"

const currencies = Object.values(Currency)
const institutions = Object.values(InstitutionType)

interface PortfolioFormData {
  portfolioName: string
  institutionType: InstitutionType
  baseCurrency: string
}

interface FormErrors {
  portfolioName?: string
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PortfolioFormData>({
    portfolioName: "",
    institutionType: InstitutionType.OTHER,
    baseCurrency: "INR",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.portfolioName.trim()) {
      newErrors.portfolioName = "Portfolio name is required"
    } else if (formData.portfolioName.trim().length < 2) {
      newErrors.portfolioName = "Portfolio name must be at least 2 characters"
    } else if (formData.portfolioName.trim().length > 100) {
      newErrors.portfolioName =
        "Portfolio name must be less than 100 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof PortfolioFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      console.log("Portfolio data:", formData)

      // Here you would typically make an API call to create the portfolio
      // await createPortfolio(formData)

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Portfolio created successfully!")
      handleReset()
    } catch (error) {
      console.error("Error creating portfolio:", error)
      alert("Failed to create portfolio. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      portfolioName: "",
      institutionType: InstitutionType.OTHER,
      baseCurrency: "INR",
    })
    setErrors({})
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-background text-white border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create New Portfolio
          </CardTitle>
          <CardDescription className="text-sm text-white">
            Set up a new portfolio to track your investments and assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Portfolio Name */}
            <div className="space-y-2">
              <Label htmlFor="portfolioName">
                Portfolio Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="portfolioName"
                placeholder="Enter portfolio name"
                value={formData.portfolioName}
                onChange={(e) =>
                  handleInputChange("portfolioName", e.target.value)
                }
                className={errors.portfolioName ? "border-red-500" : ""}
              />
              {errors.portfolioName && (
                <p className="text-sm text-red-500">{errors.portfolioName}</p>
              )}
            </div>

            {/* Institution Type */}
            <div className="space-y-2">
              <Label htmlFor="institutionType">Institution Type</Label>
              <Select
                value={formData.institutionType}
                onValueChange={(value) =>
                  handleInputChange("institutionType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select institution type">
                    {/* {selectedInstitutionType && (
                      <div className="flex items-center gap-2">
                        {selectedInstitutionType.label}
                      </div>
                    )} */}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((option) => (
                    <SelectItem key={option} value={option}>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{option}</div>
                          <div className="text-sm text-muted-foreground">
                            {option}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Base Currency */}
            <div className="space-y-2">
              <Label htmlFor="baseCurrency">Base Currency</Label>
              <Select
                value={formData.baseCurrency}
                onValueChange={(value) =>
                  handleInputChange("baseCurrency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select base currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Creating..." : "Create Portfolio"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
