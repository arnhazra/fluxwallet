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
import { Package } from "lucide-react"
import { Space } from "@/shared/constants/types"
import { endPoints } from "@/shared/constants/api-endpoints"
import useQuery from "@/shared/hooks/use-query"
import HTTPMethods from "@/shared/constants/http-methods"
import api from "@/shared/lib/ky-api"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"

interface SpaceFormData {
  spaceName: string
}

export default function Page() {
  const searchParams = useSearchParams()
  const spaceId = searchParams.get("id")
  const router = useRouter()

  const space = useQuery<Space>({
    queryKey: ["get-space", spaceId ?? ""],
    queryUrl: `${endPoints.space}/${spaceId}`,
    method: HTTPMethods.GET,
    suspense: false,
    enabled: !!spaceId,
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
    if (!!space.error || (!space.isLoading && !space.data)) {
      router.push("/apps/wealthanalyzer/createoreditspace")
    }

    if (space.data) {
      setFormData({
        spaceName: space.data?.spaceName,
      })
    }
  }, [space.data, space.error, space.isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlertMessage("")

    try {
      await api.put(`${endPoints.space}/${spaceId}`, {
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
          <CardTitle className="text-2xl flex items-center gap-2">
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
