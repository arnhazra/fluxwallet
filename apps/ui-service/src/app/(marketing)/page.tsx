"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import {
  ProductsConfig,
  SolutionConfig,
  SubscriptionConfig,
} from "@/shared/types"
import { appName, uiConstants } from "@/shared/constants/global-constants"
import { BoxIcon, Check, Coins, Lightbulb, Play } from "lucide-react"
import Link from "next/link"
import { cn } from "@/shared/lib/tw-class-util"
import { buttonVariants } from "@/shared/components/ui/button"
import Show from "@/shared/components/show"
import Loading from "../loading"
import useQuery from "@/shared/hooks/use-query"
import { SolutionCard, ProductCard } from "@/shared/components/marketing-cards"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useState } from "react"
import MarketingHeader from "@/shared/components/marketing-header"
import { Badge } from "@/shared/components/ui/badge"

export default function Page() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const subscriptionPricing = useQuery<SubscriptionConfig>({
    queryKey: ["subscription-pricing"],
    queryUrl: endPoints.getSubscriptionConfig,
    method: HTTPMethods.GET,
  })

  const products = useQuery<ProductsConfig>({
    queryKey: ["getProductConfig"],
    queryUrl: endPoints.getProductConfig,
    method: HTTPMethods.GET,
  })

  const solutions = useQuery<SolutionConfig>({
    queryKey: ["getSolutionConfig"],
    queryUrl: endPoints.getSolutionConfig,
    method: HTTPMethods.GET,
  })

  const renderHeroSection = (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-28 hero-landing">
      <div className="container max-w-[85rem] text-left">
        <h1 className="text-white text-xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4 max-w-[40rem]">
          {uiConstants.homeHeader}
        </h1>
        <p className="max-w-[35rem] leading-normal text-neutral-300 sm:text-lg sm:leading-8">
          {uiConstants.homeIntro}
        </p>
        <p className="max-w-[35rem] leading-normal text-primary sm:text-lg sm:leading-8 mb-6">
          {uiConstants.homePricing} ${subscriptionPricing?.data?.price}
          /year afterwards.
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

  const renderProductsSection = (
    <section
      id="products"
      className="container space-y-6 py-8 md:py-12 lg:py-24 lg:rounded-3xl"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <Badge className="p-2 ps-4 pe-4 text-md bg-background text-primary border border-border rounded-full shadow-md shadow-primary/20">
          <BoxIcon className="h-4 w-4 me-2" />
          {products?.data?.title}
        </Badge>
        <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
          {products?.data?.desc}
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-1 md:max-w-[35rem] md:grid-cols-1 lg:max-w-[50rem] lg:grid-cols-2 xl:max-w-[68rem] xl:grid-cols-3">
        {products?.data?.products?.map((product) => (
          <ProductCard key={product.productName} product={product} />
        ))}
      </div>
    </section>
  )

  const renderSolutionsSection = (
    <div className="bg-geometric-pattern">
      <section
        id="solutions"
        className="container space-y-6 py-8 md:py-12 lg:py-24 lg:rounded-3xl "
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
            <SolutionCard key={solution.displayName} solution={solution} />
          ))}
        </div>
      </section>
    </div>
  )

  const renderPricingSection = (
    <section
      id="pricing"
      className="container py-8 md:py-12 lg:py-24 md:max-w-[64rem]"
    >
      <div className="mx-auto flex max-w-[64rem] flex-col items-center justify-center gap-4 text-center mb-8">
        <Badge className="p-2 ps-4 pe-4 text-md bg-background text-primary border border-border rounded-full shadow-md shadow-primary/20">
          <Coins className="h-4 w-4 me-2" />
          {uiConstants.pricingTitle}
        </Badge>

        <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
          Your finances deserve both intelligence and protection. FluxWallet
          combines real-time tracking, smart categorization, and insightful
          reporting, all built on a privacy-first foundation that respects your
          data and puts you in charge.
        </p>
        <p className="max-w-[85%] text-2xl sm:text-lg sm:leading-7 text-primary">
          {uiConstants.homePricing} ${subscriptionPricing?.data?.price}
          /year afterwards.
        </p>
      </div>
      <div className="grid w-full items-start gap-10 rounded-3xl bg-background border border-border p-10 md:grid-cols-[1fr_200px] hover:shadow-md hover:shadow-primary/20">
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
              <h4 className="text-lg font-bold">Free for first 3 months</h4>
              <p className="text-sm font-medium text-muted-foreground">
                and then
              </p>
              <h4 className="text-2xl font-bold">
                $ {subscriptionPricing.data?.price}
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
    </section>
  )

  const renderFooterSection = (
    <footer>
      <div className="text-white">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              © {new Date().getFullYear()} {appName}{" "}
              {uiConstants.copyrightText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (refreshToken) {
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
        !products.isLoading &&
        !solutions.isLoading
      }
      fallback={<Loading />}
    >
      <div className="min-h-screen w-full text-white">
        <MarketingHeader />
        {renderHeroSection}
        {renderProductsSection}
        {renderSolutionsSection}
        {renderPricingSection}
      </div>
      {renderFooterSection}
    </Show>
  )
}
