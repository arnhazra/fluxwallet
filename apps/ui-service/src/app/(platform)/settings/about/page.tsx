import { appName } from "@/shared/constants/global-constants"
import SectionPanel from "../../../../shared/components/sectionpanel"
import { InfoIcon } from "lucide-react"

export default function Page() {
  return (
    <SectionPanel
      icon={<InfoIcon className="scale-75" />}
      title={`${appName} Ecosystem Version`}
      content="0.1.0"
    />
  )
}
