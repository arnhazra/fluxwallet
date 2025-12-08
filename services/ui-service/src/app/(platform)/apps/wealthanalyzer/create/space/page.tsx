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
import { Space } from "@/shared/constants/types"
import ky, { KyResponse } from "ky"
import { endPoints } from "@/shared/constants/api-endpoints"
import { useRouter } from "nextjs-toploader/app"

interface SpaceFormData {
  spaceName: string
}

export default function Page() {
  const router = useRouter()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlertMessage("")

    try {
      const space: KyResponse<Space> = await ky.post(endPoints.space, {
        json: formData,
      })
      router.push(`/apps/wealthanalyzer/space/${(await space.json())._id}`)
      setAlertMessage("Space created successfully!")
    } catch (error) {
      setAlertMessage("Error creating space")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-background text-white border-border">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Add Space
          </CardTitle>
          <CardDescription className="text-sm text-primary">
            Set up a new space to track your investments and assets. A space is
            similar to a bank or any financial institution that store or manage
            assets.
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
                placeholder="e.g. HSBC"
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
                {isSubmitting ? "Adding..." : "Add Space"}
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
