"use client"
import Header from "@/shared/components/header"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { SubscriptionConfig } from "@/shared/types"
import { brandName, uiConstants } from "@/shared/constants/global-constants"
import { Check, Play } from "lucide-react"
import Link from "next/link"
import { cn } from "@/shared/lib/tw-class-util"
import { buttonVariants } from "@/shared/components/ui/button"
import Show from "@/shared/components/show"
import Loading from "../loading"
import useQuery from "@/shared/hooks/use-query"
import {
  ControlCard,
  IntelligenceCard,
  OverviewCard,
} from "@/shared/components/safetycard"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const subscriptionPricing = useQuery<SubscriptionConfig>({
    queryKey: ["subscription-pricing"],
    queryUrl: endPoints.getSubscriptionPricing,
    method: HTTPMethods.GET,
    suspense: false,
  })

  const renderHeroSection = (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-28 hero-landing">
      <div className="container max-w-[85rem] text-left">
        <h1 className="text-white text-xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4 max-w-[40rem]">
          {uiConstants.homeHeader}
        </h1>
        <p className="max-w-[35rem] leading-normal text-zinc-300 sm:text-lg sm:leading-8 mb-6">
          {uiConstants.homeIntro}
        </p>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({
              variant: "default",
              className: "bg-primary hover:bg-primary",
            })
          )}
        >
          <Play className="me-2 scale-75" /> {uiConstants.getStartedButton}
        </Link>
      </div>
    </section>
  )

  const renderSubscription = (
    <>
      <div className="grid gap-6">
        <h3 className="text-xl font-bold sm:text-2xl">What's included</h3>
        <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          {subscriptionPricing.data?.features.map((feature) => {
            return (
              <li className="flex items-center" key={feature}>
                <Check className="mr-2 h-4 w-4" /> {feature}
              </li>
            )
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-center">
        <div>
          <h4 className="text-xl font-bold">Free for a year</h4>
          <h4 className="text-2xl font-bold">
            $ {subscriptionPricing.data?.price}
            <span className="text-base font-normal ml-1">/year</span>
          </h4>
          <p className="text-sm font-medium text-muted-foreground">
            From second year
          </p>
        </div>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({
              size: "lg",
              className: "bg-primary hover:bg-primary",
            })
          )}
        >
          <Play className="me-2 scale-75" /> {uiConstants.getStartedButton}
        </Link>
      </div>
    </>
  )

  const renderFooterSection = (
    <footer>
      <div className="text-white">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              © {new Date().getFullYear()} {brandName}{" "}
              {uiConstants.copyrightText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )

  useEffect(() => {
    const token = localStorage.getItem("refreshToken")
    if (token) {
      router.replace("/dashboard")
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return <Loading />

  return (
    <Show condition={!subscriptionPricing.isLoading} fallback={<Loading />}>
      <div className="min-h-screen w-full text-white">
        <Header />
        {renderHeroSection}
        <section
          id="product"
          className="mt-8 container space-y-6 py-8 md:py-12 lg:py-24 lg:rounded-lg"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-xl leading-[1.1] sm:text-2xl md:text-4xl">
              Choose the Right Approach
            </h2>
            <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
              {uiConstants.productHeader}
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-1 md:max-w-[35rem] md:grid-cols-1 lg:max-w-[50rem] lg:grid-cols-2 xl:max-w-[68rem] xl:grid-cols-3">
            <OverviewCard />
            <IntelligenceCard />
            <ControlCard />
          </div>
        </section>
        <section
          id="pricing"
          className="container py-8 md:py-12 lg:py-24 md:max-w-[64rem]"
        >
          <div className="mx-auto flex max-w-[64rem] flex-col items-center justify-center gap-4 text-center mb-8">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              {uiConstants.pricingTitle}
            </h2>
            <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
              {uiConstants.pricingHeader}
            </p>
          </div>
          <div className="grid w-full items-start gap-10 rounded-lg border border-border p-10 md:grid-cols-[1fr_200px]">
            {renderSubscription}
          </div>
        </section>
      </div>
      {renderFooterSection}
    </Show>
  )
}
