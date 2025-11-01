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
import { Space } from "@/shared/constants/types"
import ky from "ky"
import { endPoints } from "@/shared/constants/api-endpoints"
import useQuery from "@/shared/hooks/use-query"
import HTTPMethods from "@/shared/constants/http-methods"

interface SpaceFormData {
  spaceName: string
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: spaceId = "" } = use(params)

  const space = useQuery<Space>({
    queryKey: ["get-space", spaceId],
    queryUrl: `${endPoints.space}/${spaceId}`,
    method: HTTPMethods.GET,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [formData, setFormData] = useState<SpaceFormData>({
    spaceName: "",
  })

  const handleInputChange = (field: keyof SpaceFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  useEffect(() => {
    if (space.data) {
      setFormData({
        spaceName: space.data?.spaceName,
      })
    }
  }, [space.data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlertMessage("")

    try {
      await ky.put(`${endPoints.space}/${spaceId}`, {
        json: formData,
      })
      setAlertMessage("Space updated successfully!")
    } catch (error) {
      setAlertMessage("Error updating Space")
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
            Edit Space
          </CardTitle>
          <CardDescription className="text-sm text-primary">
            Edit your space to track your investments and assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="spaceName">
                Space Name <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                id="spaceName"
                placeholder="Enter Space Name"
                value={formData.spaceName}
                onChange={(e) => handleInputChange("spaceName", e.target.value)}
                className="w-full bg-background text-white border-border focus:border-primary focus:ring-0"
              />
            </div>

            <div className="flex">
              <Button
                className="ml-auto bg-primary hover:bg-primary text-black"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Space"}
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
