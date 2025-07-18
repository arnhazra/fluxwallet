import Link from "next/link"
import { WalletMinimal } from "lucide-react"
import { brandName } from "@/shared/constants/global-constants"
import { UserNav } from "./user-nav"

export default function Header() {
  return (
    <header className="relative z-50 top-0 flex h-[64px] items-center bg-main text-white px-4 md:px-6">
      <div className="flex w-full items-center justify-between lg:container lg:max-w-[95rem]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <WalletMinimal className="text-primary h-6 w-6" />
          {brandName}
        </Link>
        <nav className="flex items-center justify-end flex-1">
          <UserNav />
        </nav>
      </div>
    </header>
  )
}
