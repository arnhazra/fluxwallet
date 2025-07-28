import { Bell, Check } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import useQuery from "@/shared/hooks/use-query"
import { SubscriptionConfig } from "@/shared/types"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import ky from "ky"
import { toast } from "sonner"
import { appName, uiConstants } from "@/shared/constants/global-constants"
import { useAppContext } from "@/context/appstate.provider"

export function SubscriptionModal() {
  const [{ isSubscriptionActive }] = useAppContext()
  const subscriptionPricing = useQuery<SubscriptionConfig>({
    queryKey: ["pricing-settings"],
    queryUrl: endPoints.getSubscriptionPricing,
    method: HTTPMethods.GET,
    suspense: false,
  })

  const activateSubscription = async () => {
    try {
      const response: any = await ky
        .post(endPoints.createCheckoutSession, {
          timeout: FETCH_TIMEOUT,
        })
        .json()
      window.location = response.redirectUrl
    } catch (error) {
      toast(uiConstants.notification, {
        icon: <Bell className="scale-75" />,
        description: uiConstants.toastError,
      })
    }
  }

  const signOut = async () => {
    localStorage.clear()
    window.location.replace("/")
  }

  return (
    <Dialog open={!isSubscriptionActive} onOpenChange={(): void => undefined}>
      <DialogContent
        className="max-w-[22rem] bg-background border-border text-white -mb-4"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{appName} Subscription</DialogTitle>
          <DialogDescription className="text-zinc-300">
            You need to subscribe before you use
          </DialogDescription>
          <h4 className="text-4xl font-bold">
            ${subscriptionPricing.data?.price}
            <span className="text-base font-normal ml-1">/year</span>
          </h4>
        </DialogHeader>
        <div className="grid gap-6">
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {subscriptionPricing.data?.features.map((feature) => {
              return (
                <li className="flex items-center" key={feature}>
                  <Check className="mr-2 h-4 w-4" /> {feature}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center -mb-2">
          <Button
            className="bg-primary hover:bg-primary focus-visible:outline-none"
            onClick={activateSubscription}
          >
            Activate Subscription
          </Button>
          <Button variant="link" className="text-primary" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
