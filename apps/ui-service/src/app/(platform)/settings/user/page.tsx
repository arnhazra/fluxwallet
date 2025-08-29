"use client"
import CopyToClipboard from "@/shared/components/copy"
import SectionPanel from "../../../../shared/components/section-panel"
import { Button } from "@/shared/components/ui/button"
import { endPoints } from "@/shared/constants/api-endpoints"
import { appName, uiConstants } from "@/shared/constants/global-constants"
import { useAppContext } from "@/context/appstate.provider"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import ky from "ky"
import {
  User,
  IdCardLanyard,
  AtSign,
  CircleArrowRight,
  Globe,
  Pen,
} from "lucide-react"
import EditCurrency from "@/shared/components/editcurrency"
import { usePromptContext } from "@/shared/providers/prompt.provider"
import notify from "@/shared/hooks/use-notify"
import IconContainer from "@/shared/components/icon-container"

export default function Page() {
  const [{ user }, dispatch] = useAppContext()
  const { prompt } = usePromptContext()

  const editName = async () => {
    const { hasConfirmed, value } = await prompt(false, "Your Name", user.name)

    if (hasConfirmed) {
      try {
        dispatch("setUser", { name: value as string })
        await ky.patch(endPoints.updateAttribute, {
          json: {
            attributeName: "name",
            attributeValue: value,
          },
          timeout: FETCH_TIMEOUT,
        })
      } catch (error) {
        notify(uiConstants.genericError, "error")
      }
    }
  }

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
        icon={
          <IconContainer>
            <User className="h-4 w-4" />
          </IconContainer>
        }
        title="Your Name"
        content={user.name}
        actionComponents={[
          <Button
            onClick={editName}
            className="p-2 bg-primary hover:bg-primary text-black"
            variant="default"
            size="icon"
          >
            <Pen className="h-4 w-4" />
          </Button>,
        ]}
      />
      <SectionPanel
        icon={
          <IconContainer>
            <IdCardLanyard className="h-4 w-4" />
          </IconContainer>
        }
        title={`${appName} ID`}
        content={user._id}
        masked
        actionComponents={[<CopyToClipboard value={user._id} />]}
      />
      <SectionPanel
        icon={
          <IconContainer>
            <AtSign className="h-4 w-4" />
          </IconContainer>
        }
        title="Your Email"
        content={user.email}
        actionComponents={[<CopyToClipboard value={user.email} />]}
      />
      <SectionPanel
        icon={
          <IconContainer>
            <Globe className="h-4 w-4" />
          </IconContainer>
        }
        title="Base Currency"
        content={user.baseCurrency}
        actionComponents={[
          <EditCurrency baseCurrency={user.baseCurrency}></EditCurrency>,
        ]}
      />
      <SectionPanel
        icon={
          <IconContainer>
            <CircleArrowRight className="h-4 w-4" />
          </IconContainer>
        }
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
