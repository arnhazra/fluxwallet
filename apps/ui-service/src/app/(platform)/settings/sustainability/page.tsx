"use client"
import SectionPanel from "../../../../shared/components/sectionpanel"
import { Switch } from "@/shared/components/ui/switch"
import { endPoints } from "@/shared/constants/api-endpoints"
import { appName, uiConstants } from "@/shared/constants/global-constants"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import ky from "ky"
import { Leaf } from "lucide-react"
import { useAppContext } from "@/context/appstate.provider"
import notify from "@/shared/hooks/use-notify"
import IconContainer from "@/shared/components/iconcontainer"

export default function Page() {
  const [{ user }, dispatch] = useAppContext()

  const saveSustainabilitySettings = async (updatedSettings: boolean) => {
    try {
      dispatch("setUser", { reduceCarbonEmissions: updatedSettings })
      await ky.patch(endPoints.updateAttribute, {
        json: {
          attributeName: "reduceCarbonEmissions",
          attributeValue: updatedSettings,
        },
        timeout: FETCH_TIMEOUT,
      })
    } catch (error) {
      notify(uiConstants.genericError, "error")
    }
  }

  return (
    <SectionPanel
      icon={
        <IconContainer>
          <Leaf className="h-4 w-4" />
        </IconContainer>
      }
      title="Reduce Carbon Emissions"
      content={`Turn this settings on to reduce carbon footprints inside ${appName}`}
      actionComponents={[
        <Switch
          checked={user.reduceCarbonEmissions}
          onCheckedChange={(value): Promise<void> =>
            saveSustainabilitySettings(value)
          }
        />,
      ]}
    />
  )
}
