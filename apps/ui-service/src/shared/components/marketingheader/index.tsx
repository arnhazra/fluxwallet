import Link from "next/link"
import { WalletMinimal, PanelLeft } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
import { generalUserLinks } from "./data"
import { appName } from "@/shared/constants/global-constants"

export default function MarketingHeader() {
  return (
    <header className="relative z-50 top-0 flex h-[64px] items-center bg-background text-white px-4 md:px-6">
      <div className="flex w-full items-center justify-between lg:container lg:max-w-[90rem]">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <WalletMinimal className="text-primary h-6 w-6" />
          {appName}
        </Link>
        <nav className="hidden md:flex items-center justify-end gap-2 flex-1">
          {generalUserLinks.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="text-sm font-medium text-white hover:text-primary mx-3"
              target={item.external ? "_blank" : ""}
              rel={item.external ? "noopener noreferrer" : ""}
            >
              {item.displayName}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-background text-white border-none"
            >
              <SheetTitle></SheetTitle>
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <WalletMinimal className="text-primary h-6 w-6" />
                </Link>
                {generalUserLinks.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="text-white hover:text-primary"
                    target={item.external ? "_blank" : ""}
                    rel={item.external ? "noopener noreferrer" : ""}
                  >
                    {item.displayName}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
