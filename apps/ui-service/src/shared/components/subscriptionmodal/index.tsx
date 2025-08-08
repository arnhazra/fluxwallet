import { Check, WalletMinimal } from "lucide-react"
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
import { appName, uiConstants } from "@/shared/constants/global-constants"
import { useAppContext } from "@/context/appstate.provider"
import notify from "@/shared/hooks/use-notify"
import Show from "../show"
import { useState } from "react"
import LoaderIcon from "../loaderIcon"

export function SubscriptionModal() {
  const [{ isSubscriptionActive, user }, dispatch] = useAppContext()
  const [isLoading, setLoading] = useState(false)
  const subscriptionPricing = useQuery<SubscriptionConfig>({
    queryKey: ["pricing-settings"],
    queryUrl: endPoints.getSubscriptionPricing,
    method: HTTPMethods.GET,
    suspense: false,
  })

  const activateSubscription = async () => {
    if (user.hasTrial) {
      try {
        setLoading(true)
        await ky
          .post(endPoints.activateTrial, {
            timeout: FETCH_TIMEOUT,
          })
          .json()
        dispatch("setSubscriptionActive", true)
        notify(uiConstants.subscriptionSuccess, "success")
      } catch (error) {
        notify(uiConstants.subscriptionFailed, "error")
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const response: any = await ky
          .post(endPoints.createCheckoutSession, {
            timeout: FETCH_TIMEOUT,
          })
          .json()
        window.location = response.redirectUrl
      } catch (error) {
        notify(uiConstants.subscriptionFailed, "error")
      }
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
          <DialogTitle className="flex gap-2">
            <WalletMinimal className="text-primary h-4 w-4" />
            {appName} Subscription
          </DialogTitle>
          <DialogDescription className="text-neutral-300">
            <Show
              condition={!user.hasTrial}
              fallback="Activate your free subscription"
            >
              You need to subscribe before you use
            </Show>
          </DialogDescription>
          <Show condition={!user.hasTrial}>
            <h4 className="text-4xl font-bold text-primary">
              ${subscriptionPricing.data?.price}
              <span className="text-base font-normal ml-1">/year</span>
            </h4>
          </Show>
          <Show condition={user.hasTrial}>
            <h4 className="text-xl font-bold text-primary">
              Free subscription worth ${subscriptionPricing.data?.price}
            </h4>
          </Show>
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
            disabled={isLoading}
          >
            <Show condition={user.hasTrial} fallback="Activate Subscription">
              <Show
                condition={!isLoading}
                fallback={
                  <>
                    <LoaderIcon /> Claim Now
                  </>
                }
              >
                Claim Now
              </Show>
            </Show>
          </Button>
          <Button variant="link" className="text-primary" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
