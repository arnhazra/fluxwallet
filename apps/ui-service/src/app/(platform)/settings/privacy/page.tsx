"use client"
import CopyToClipboard from "@/shared/components/copy"
import SectionPanel from "../../../../shared/components/section-panel"
import { Switch } from "@/shared/components/ui/switch"
import { endPoints } from "@/shared/constants/api-endpoints"
import { uiConstants } from "@/shared/constants/global-constants"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import ky from "ky"
import { PieChart, Fingerprint, ScanFace } from "lucide-react"
import { useUserContext } from "@/context/user.provider"
import notify from "@/shared/hooks/use-notify"
import IconContainer from "@/shared/components/icon-container"

export default function Page() {
  const [{ user }, dispatch] = useUserContext()

  const saveAnalyticsSettings = async (updatedSettings: boolean) => {
    try {
      dispatch("setUser", { analyticsData: updatedSettings })
      await ky.patch(endPoints.updateAttribute, {
        json: {
          attributeName: "analyticsData",
          attributeValue: updatedSettings,
        },
        timeout: FETCH_TIMEOUT,
      })
    } catch (error) {
      notify(uiConstants.genericError, "error")
    }
  }

  return (
    <section className="grid gap-2">
      <SectionPanel
        icon={
          <IconContainer>
            <PieChart className="h-4 w-4" />
          </IconContainer>
        }
        title="Analytics Data"
        content="Choose whether to save the things you do. If disabled, we still collect anonymous analytics data to improve the app."
        actionComponents={[
          <Switch
            checked={user.analyticsData}
            onCheckedChange={(value): Promise<void> =>
              saveAnalyticsSettings(value)
            }
          />,
        ]}
      />
      <SectionPanel
        icon={
          <IconContainer>
            <Fingerprint className="h-4 w-4" />
          </IconContainer>
        }
        title="Access Token"
        content={localStorage.getItem("accessToken") ?? ""}
        masked
        actionComponents={[
          <CopyToClipboard value={localStorage.getItem("accessToken") ?? ""} />,
        ]}
      />
      <SectionPanel
        icon={
          <IconContainer>
            <ScanFace className="h-4 w-4" />
          </IconContainer>
        }
        title="Refresh Token"
        content={localStorage.getItem("refreshToken") ?? ""}
        masked
        actionComponents={[
          <CopyToClipboard
            value={localStorage.getItem("refreshToken") ?? ""}
          />,
        ]}
      />
    </section>
  )
}
