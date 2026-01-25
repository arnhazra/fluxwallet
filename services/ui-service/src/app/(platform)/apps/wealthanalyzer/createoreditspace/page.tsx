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
import { Layers2 } from "lucide-react"
import { Space } from "@/shared/constants/types"
import { endPoints } from "@/shared/constants/api-endpoints"
import useQuery from "@/shared/hooks/use-query"
import HTTPMethods from "@/shared/constants/http-methods"
import api from "@/shared/lib/ky-api"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import Show from "@/shared/components/show"
import IconContainer from "@/shared/components/icon-container"

interface SpaceFormData {
  spaceName: string
}

type MessageType = "success" | "error"

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
  const [message, setMessage] = useState<{ msg: string; type: MessageType }>({
    msg: "",
    type: "success",
  })
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
    setMessage({ msg: "", type: "success" })

    if (spaceId) {
      try {
        await api.put(`${endPoints.space}/${spaceId}`, {
          json: formData,
        })
        setMessage({ msg: "Space updated successfully!", type: "success" })
      } catch (error) {
        setMessage({ msg: "Error updating Space", type: "error" })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      try {
        await api.post(endPoints.space, {
          json: formData,
        })
        setMessage({ msg: "Space created successfully!", type: "success" })
        setFormData({ spaceName: "" })
      } catch (error) {
        setMessage({ msg: "Error creating Space", type: "error" })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-background text-white border-border">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <IconContainer>
              <Layers2 className="h-4 w-4" />
            </IconContainer>
            <Show condition={!spaceId} fallback="Edit Space">
              Add Space
            </Show>
          </CardTitle>
          <CardDescription className="text-sm text-primary">
            Fill in the details of your space to track your assets
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
                Save Space
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
  )
}
