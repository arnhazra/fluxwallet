"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import {
  AppsConfig,
  SolutionConfig,
  SubscriptionConfig,
} from "@/shared/constants/types"
import { platformName, uiConstants } from "@/shared/constants/global-constants"
import { BoxIcon, Check, Coins, Lightbulb, Play } from "lucide-react"
import Link from "next/link"
import { cn } from "@/shared/lib/tw-class-util"
import { buttonVariants } from "@/shared/components/ui/button"
import Show from "@/shared/components/show"
import Loading from "../loading"
import useQuery from "@/shared/hooks/use-query"
import { AppCard } from "@/shared/components/app-card"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import HomePageHeader from "@/shared/components/homepage-header"
import { Badge } from "@/shared/components/ui/badge"
import { SolutionCard } from "@/shared/components/solution-card"

export default function Page() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const subscriptionPricing = useQuery<SubscriptionConfig>({
    queryKey: ["subscription-config"],
    queryUrl: `${endPoints.getConfig}/subscription-config`,
    method: HTTPMethods.GET,
    suspense: false,
  })

  const apps = useQuery<AppsConfig>({
    queryKey: ["app-config"],
    queryUrl: `${endPoints.getConfig}/app-config`,
    method: HTTPMethods.GET,
    suspense: false,
  })

  const solutions = useQuery<SolutionConfig>({
    queryKey: ["solution-config"],
    queryUrl: `${endPoints.getConfig}/solution-config`,
    method: HTTPMethods.GET,
    suspense: false,
  })

  const renderHeroSection = (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-28 hero-landing">
      <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 text-left">
        <h1 className="text-white text-xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4 max-w-[40rem]">
          {uiConstants.homeHeader}
        </h1>
        <p className="max-w-[35rem] leading-normal text-neutral-300 sm:text-lg sm:leading-8">
          {uiConstants.homeIntro}
        </p>
        <p className="max-w-[35rem] leading-normal text-primary sm:text-lg sm:leading-8 mb-6">
          {subscriptionPricing.data?.trialSubscription}
        </p>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({
              variant: "default",
              className:
                "bg-primary hover:bg-primary text-black rounded-full h-11 w-40",
            })
          )}
        >
          <Play className="me-2 h-4 w-4" /> {uiConstants.getStartedButton}
        </Link>
      </div>
    </section>
  )

  const renderAppsSection = (
    <section
      id="apps"
      className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 space-y-6 py-8 md:py-12 lg:py-24 lg:rounded-3xl"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <Badge className="p-2 ps-4 pe-4 text-md bg-background text-primary border border-border rounded-full shadow-md shadow-primary/20">
          <BoxIcon className="h-4 w-4 me-2" />
          {apps?.data?.title}
        </Badge>
        <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
          {apps?.data?.description}
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-1 md:max-w-[35rem] md:grid-cols-1 lg:max-w-[50rem] lg:grid-cols-2 xl:max-w-[68rem] xl:grid-cols-3">
        {apps?.data?.apps?.map((app) => (
          <AppCard key={app.appName} app={app} />
        ))}
      </div>
    </section>
  )

  const renderSolutionsSection = (
    <div className="bg-geometric-pattern">
      <section
        id="solutions"
        className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 space-y-6 py-8 md:py-12 lg:py-24 lg:rounded-3xl "
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <Badge className="p-2 ps-4 pe-4 text-md bg-background text-primary border border-border rounded-full shadow-md shadow-primary/20">
            <Lightbulb className="h-4 w-4 me-2" />
            {solutions?.data?.title}
          </Badge>
          <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
            {solutions?.data?.desc}
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-1 md:max-w-[35rem] md:grid-cols-1 lg:max-w-[50rem] lg:grid-cols-2 xl:max-w-[68rem] xl:grid-cols-3">
          {solutions?.data?.solutions?.map((solution) => (
            <SolutionCard
              key={solution.displayName}
              solution={solution}
              ai={solution.displayName.includes("Intelligence")}
            />
          ))}
        </div>
      </section>
    </div>
  )

  const renderPricingSection = (
    <section id="pricing" className="py-8 md:py-12 lg:py-24">
      <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[64rem] flex-col items-center justify-center text-center mb-8">
          <Badge className="mb-4 p-2 ps-4 pe-4 text-md bg-background text-primary border border-border rounded-full shadow-md shadow-primary/20">
            <Coins className="h-4 w-4 me-2" />
            {uiConstants.pricingTitle}
          </Badge>

          <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7 mb-2">
            Your finances deserve both intelligence and protection.{" "}
            {platformName}
            combines real-time tracking, smart categorization, and insightful
            reporting, all built on a privacy-first foundation that respects
            your data and puts you in charge.
          </p>

          <p className="max-w-[85%] text-2xl sm:text-lg sm:leading-7 text-primary">
            {subscriptionPricing.data?.trialSubscription}
          </p>
        </div>

        <div className="grid w-full items-start gap-10 rounded-3xl bg-background border border-border p-10 md:grid-cols-[1fr_200px] hover:shadow-md hover:shadow-primary/20 mx-auto max-w-[64rem]">
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
                <p className="text-sm font-medium text-muted-foreground">
                  {subscriptionPricing.data?.trialSubscription} and then
                </p>
                <h4 className="text-2xl font-bold">
                  ${subscriptionPricing.data?.price}
                  <span className="text-base font-normal ml-1">/year</span>
                </h4>
              </div>

              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({
                    size: "lg",
                    className:
                      "bg-primary hover:bg-primary text-black rounded-full",
                  })
                )}
              >
                <Play className="me-2 h-4 w-4" /> {uiConstants.getStartedButton}
              </Link>
            </div>
          </>
        </div>
      </div>
    </section>
  )

  const renderFooterSection = (
    <footer>
      <div className="text-white">
        <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <p className="text-center text-sm leading-loose md:text-left">
              © {new Date().getFullYear()} {platformName}{" "}
              {uiConstants.copyrightText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )

  useEffect(() => {
    const accessToken = Cookies.get("accessToken")
    if (accessToken) {
      router.replace("/dashboard")
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return <Loading />

  return (
    <Show
      condition={
        !subscriptionPricing.isLoading &&
        !apps.isLoading &&
        !solutions.isLoading
      }
      fallback={<Loading />}
    >
      <div className="min-h-screen w-full text-white">
        <HomePageHeader />
        {renderHeroSection}
        {renderAppsSection}
        {renderSolutionsSection}
        {renderPricingSection}
      </div>
      {renderFooterSection}
    </Show>
  )
}
