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
import { InstitutionType, Institution } from "@/shared/types"
import ky, { KyResponse } from "ky"
import { endPoints } from "@/shared/constants/api-endpoints"
import { useRouter } from "next/navigation"

const institutions = Object.values(InstitutionType)

interface InstitutionFormData {
  institutionName: string
  institutionType: InstitutionType
}

export default function Page() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [formData, setFormData] = useState<InstitutionFormData>({
    institutionName: "",
    institutionType: InstitutionType.BANK,
  })

  const handleInputChange = (
    field: keyof InstitutionFormData,
    value: string
  ) => {
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
      const institution: KyResponse<Institution> = await ky.post(
        endPoints.institution,
        {
          json: formData,
        }
      )
      router.push(`/institution/${(await institution.json())._id}`)
      setAlertMessage("Institution created successfully!")
    } catch (error) {
      setAlertMessage("Error creating institution")
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
            Add Holding Institution
          </CardTitle>
          <CardDescription className="text-sm text-primary">
            Set up a new institution to track your investments and assets. A
            holding institution is similar to a bank or any institution that
            manage assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="institutionName">
                Holding Institution Name <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                id="institutionName"
                placeholder="Enter Holding Institution Name"
                value={formData.institutionName}
                onChange={(e) =>
                  handleInputChange("institutionName", e.target.value)
                }
                className="w-full bg-background text-white border-border focus:border-primary focus:ring-0"
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
                <SelectTrigger className="w-full bg-background text-white border-border">
                  <SelectValue placeholder="Select institution type"></SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full bg-background text-white border-border">
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
                {isSubmitting ? "Adding..." : "Add Institution"}
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
