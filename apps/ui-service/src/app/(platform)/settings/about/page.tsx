import { appName } from "@/shared/constants/global-constants"
import SectionPanel from "../../../../shared/components/section-panel"
import { GitCompare } from "lucide-react"
import IconContainer from "@/shared/components/icon-container"

export default function Page() {
  return (
    <SectionPanel
      icon={
        <IconContainer>
          <GitCompare className="h-4 w-4" />
        </IconContainer>
      }
      title={`${appName} App Version`}
      content="1.3"
    />
  )
}
