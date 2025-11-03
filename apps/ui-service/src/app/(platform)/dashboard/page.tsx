"use client"
import { ProductCard } from "@/shared/components/marketing-cards"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { ProductsConfig } from "@/shared/constants/types"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import ky from "ky"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { useRouter } from "nextjs-toploader/app"
import { uiConstants } from "@/shared/constants/global-constants"
import notify from "@/shared/hooks/use-notify"
import StatCardStack from "@/shared/components/stat-card/stat-card-stack"
import { useUserContext } from "@/context/user.provider"

export default function Page() {
  const searchParams = useSearchParams()
  const [{ searchKeyword }] = useUserContext()
  const subscriptionSessionId = searchParams.get("sub_session_id")
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data } = useQuery<ProductsConfig>({
    queryKey: ["getProductConfig"],
    queryUrl: endPoints.getProductConfig,
    method: HTTPMethods.GET,
  })

  const renderProducts = () => {
    if (!data?.products) return null

    const searchPattern = new RegExp(searchKeyword, "i")
    return data.products
      .filter(
        (product) =>
          searchPattern.test(product.displayName) ||
          searchPattern.test(product.productName) ||
          searchPattern.test(product.description)
      )
      .map((product) => (
        <ProductCard key={product.productName} product={product} />
      ))
  }

  const subscribe = async () => {
    try {
      await ky
        .get(`${endPoints.subscribe}?sub_session_id=${subscriptionSessionId}`, {
          timeout: FETCH_TIMEOUT,
        })
        .json()
      queryClient.refetchQueries({ queryKey: ["user-details"] })
      notify(uiConstants.subscriptionSuccess, "success")
    } catch (error: any) {
      const errorMessage = (await error.response.json()).message
      notify(errorMessage, "error")
    }
  }

  useEffect(() => {
    if (!!subscriptionSessionId) {
      subscribe()
      router.replace("/dashboard")
    }
  }, [subscriptionSessionId])

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <StatCardStack />
      <section>
        <div className="mx-auto grid justify-center gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4">
          {renderProducts()}
        </div>
      </section>
    </div>
  )
}
