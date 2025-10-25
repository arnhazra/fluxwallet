"use client"
import { Badge } from "@/shared/components/ui/badge"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { ProductsConfig } from "@/shared/constants/types"
import useQuery from "@/shared/hooks/use-query"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode } from "react"

export default function ProductLayout({ children }: { children: ReactNode }) {
  const pathName = usePathname()
  const router = useRouter()
  const products = useQuery<ProductsConfig>({
    queryKey: ["getProductConfig"],
    queryUrl: endPoints.getProductConfig,
    method: HTTPMethods.GET,
    suspense: false,
  })

  const selectedProduct = products.data?.products.find((product) =>
    pathName.includes(product.productName)
  )

  return (
    <>
      <Badge
        className="mb-4 p-1 ps-4 pe-4 text-sm cursor-pointer hover:shadow-md hover:shadow-primary/20"
        onClick={(): void => router.push(selectedProduct?.url || "/dashboard")}
      >
        {selectedProduct?.displayName}
      </Badge>
      {children}
    </>
  )
}
