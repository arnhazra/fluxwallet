import Link from "next/link"
import { Wallet, PanelLeft, Play } from "lucide-react"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
import { generalUserLinks } from "./data"
import { appName, uiConstants } from "@/shared/constants/global-constants"
import { cn } from "@/shared/lib/tw-class-util"
import IconContainer from "../icon-container"

export default function MarketingHeader() {
  return (
    <header className="relative z-50 top-0 flex h-[64px] items-center bg-main text-white px-4 md:px-6">
      <div className="flex w-full items-center justify-between lg:container lg:max-w-[90rem]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold me-8"
        >
          <IconContainer>
            <Wallet className="h-4 w-4" />
          </IconContainer>
          {appName}
        </Link>
        <nav className="hidden md:flex items-center justify-start gap-3 flex-1">
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
        <nav className="hidden md:flex items-center justify-end gap-3 flex-1">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({
                variant: "default",
                className:
                  "bg-primary hover:bg-primary text-black rounded-full h-9",
              })
            )}
          >
            {uiConstants.getStartedButton}
          </Link>
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
                  <IconContainer>
                    <Wallet className="h-4 w-4" />
                  </IconContainer>
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
