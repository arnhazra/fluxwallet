import { appName } from "@/shared/constants/global-constants"
import SectionPanel from "../../../../shared/components/sectionpanel"
import { InfoIcon } from "lucide-react"

export default function Page() {
  return (
    <SectionPanel
      icon={<InfoIcon className="h-4 w-4" />}
      title={`${appName} App Version`}
      content="1.6"
    />
  )
}
