"use client"
import CopyToClipboard from "@/shared/components/copy"
import SectionPanel from "../../../../shared/components/sectionpanel"
import { Switch } from "@/shared/components/ui/switch"
import { endPoints } from "@/shared/constants/api-endpoints"
import { uiConstants } from "@/shared/constants/global-constants"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import ky from "ky"
import { PieChart, Fingerprint, ScanFace } from "lucide-react"
import { useAppContext } from "@/context/appstate.provider"
import notify from "@/shared/hooks/use-notify"

export default function Page() {
  const [{ user }, dispatch] = useAppContext()

  const saveActivityLogSettings = async (updatedSettings: boolean) => {
    try {
      dispatch("setUser", { activityLog: updatedSettings })
      await ky.patch(endPoints.updateAttribute, {
        json: {
          attributeName: "activityLog",
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
        icon={<PieChart className="h-4 w-4" />}
        title="Activity Log"
        content="Choose whether to save the things you do to get more relevant results"
        actionComponents={[
          <Switch
            checked={user.activityLog}
            onCheckedChange={(value): Promise<void> =>
              saveActivityLogSettings(value)
            }
          />,
        ]}
      />
      <SectionPanel
        icon={<Fingerprint className="h-4 w-4" />}
        title="Access Token"
        content={localStorage.getItem("accessToken") ?? ""}
        masked
        actionComponents={[
          <CopyToClipboard value={localStorage.getItem("accessToken") ?? ""} />,
        ]}
      />
      <SectionPanel
        icon={<ScanFace className="h-4 w-4" />}
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
