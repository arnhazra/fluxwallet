"use client"
import CopyToClipboard from "@/shared/components/copy"
import SectionPanel from "../../../../shared/components/sectionpanel"
import { Button } from "@/shared/components/ui/button"
import { endPoints } from "@/shared/constants/api-endpoints"
import { appName } from "@/shared/constants/global-constants"
import { useAppContext } from "@/context/appstate.provider"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import ky from "ky"
import {
  User,
  IdCard,
  AtSign,
  CircleArrowRight,
  DollarSign,
} from "lucide-react"
import EditCurrency from "@/shared/components/editcurrency"

export default function Page() {
  const [{ user }] = useAppContext()

  const signOut = async () => {
    try {
      await ky.post(endPoints.signOut, { timeout: FETCH_TIMEOUT })
      localStorage.clear()
      window.location.replace("/")
    } catch (error) {
      localStorage.clear()
      window.location.replace("/")
    }
  }

  return (
    <section className="grid gap-2">
      <SectionPanel
        icon={<User className="h-4 w-4" />}
        title="Your Name"
        content={user.name}
      />
      <SectionPanel
        icon={<IdCard className="h-4 w-4" />}
        title={`${appName} ID`}
        content={user._id}
        masked
        actionComponents={[<CopyToClipboard value={user._id} />]}
      />
      <SectionPanel
        icon={<AtSign className="h-4 w-4" />}
        title="Your Email"
        content={user.email}
        actionComponents={[<CopyToClipboard value={user.email} />]}
      />
      <SectionPanel
        icon={<DollarSign className="h-4 w-4" />}
        title="Base Currency"
        content={user.baseCurrency}
        actionComponents={[
          <EditCurrency baseCurrency={user.baseCurrency}></EditCurrency>,
        ]}
      />
      <SectionPanel
        icon={<CircleArrowRight className="h-4 w-4" />}
        title="Sign Out"
        content="Sign out from all logged in devices"
        actionComponents={[
          <Button
            size="icon"
            variant="destructive"
            onClick={(): Promise<void> => signOut()}
          >
            <CircleArrowRight className="h-4 w-4" />
          </Button>,
        ]}
      />
    </section>
  )
}
