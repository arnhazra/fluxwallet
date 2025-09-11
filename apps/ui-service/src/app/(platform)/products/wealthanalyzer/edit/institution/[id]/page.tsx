"use client"
import type React from "react"
import { use, useEffect, useState } from "react"
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
import { InstitutionType, Institution } from "@/shared/constants/types"
import ky from "ky"
import { endPoints } from "@/shared/constants/api-endpoints"
import useQuery from "@/shared/hooks/use-query"
import HTTPMethods from "@/shared/constants/http-methods"

const institutionTypes = Object.values(InstitutionType)

interface InstitutionFormData {
  institutionName: string
  institutionType: InstitutionType | null
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: institutionId = "" } = use(params)

  const institution = useQuery<Institution>({
    queryKey: ["get-institution", institutionId],
    queryUrl: `${endPoints.institution}/${institutionId}`,
    method: HTTPMethods.GET,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [formData, setFormData] = useState<InstitutionFormData>({
    institutionName: "",
    institutionType: null,
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

  useEffect(() => {
    if (institution.data) {
      setFormData({
        institutionName: institution.data?.institutionName,
        institutionType: institution.data?.institutionType,
      })
    }
  }, [institution.data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlertMessage("")

    try {
      await ky.put(`${endPoints.institution}/${institutionId}`, {
        json: formData,
      })
      setAlertMessage("Institution updated successfully!")
    } catch (error) {
      setAlertMessage("Error updating Institution")
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
            Edit Holding Institution
          </CardTitle>
          <CardDescription className="text-sm text-primary">
            Edit your holding institution to track your investments and assets
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
                value={
                  formData.institutionType ?? institution?.data?.institutionType
                }
                onValueChange={(value) =>
                  handleInputChange("institutionType", value)
                }
              >
                <SelectTrigger className="w-full bg-background text-white border-border">
                  <SelectValue placeholder="Select Holding Institution type">
                    {formData.institutionType}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full bg-background text-white border-border">
                  {institutionTypes.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex">
              <Button
                className="ml-auto bg-primary hover:bg-primary text-black"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Institution"}
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
