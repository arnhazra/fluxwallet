import Link from "next/link"
import { Wallet } from "lucide-react"
import HeaderSearch from "./search/header-search"
import { appName } from "@/shared/constants/global-constants"
import { UserNav } from "./user-nav"
import IconContainer from "../icon-container"
import { usePathname } from "next/navigation"
import useQuery from "@/shared/hooks/use-query"
import { ProductsConfig } from "@/shared/constants/types"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import Show from "../show"
import * as Icons from "lucide-react"

export default function PlatformHeader() {
  const pathName = usePathname()
  const products = useQuery<ProductsConfig>({
    queryKey: ["getProductConfig"],
    queryUrl: endPoints.getProductConfig,
    method: HTTPMethods.GET,
  })

  const selectedProduct = products.data?.products.find((product) =>
    pathName.includes(product.productName)
  )

  const ProductIcon = selectedProduct
    ? (Icons as any)[selectedProduct.icon]
    : Icons.HelpCircle
  return (
    <header className="relative z-50 top-0 flex h-[64px] items-center bg-background text-white px-4 md:px-6">
      <div className="flex w-full items-center justify-between lg:container lg:max-w-[95rem]">
        <Show condition={!!selectedProduct}>
          <Link
            href={selectedProduct?.url ?? "/dashboard"}
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <IconContainer>
              <ProductIcon className="h-4 w-4" />
            </IconContainer>
            <span className="hidden md:inline text-sm">
              {selectedProduct?.displayName}
            </span>
          </Link>
        </Show>
        <Show condition={!selectedProduct}>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <IconContainer>
              <Wallet className="h-4 w-4" />
            </IconContainer>
            <span className="hidden md:inline">{appName}</span>
          </Link>
        </Show>
        <HeaderSearch />
        <nav className="flex items-center justify-end flex-1">
          <UserNav />
        </nav>
      </div>
    </header>
  )
}
