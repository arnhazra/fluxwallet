import { uiConstants } from "@/shared/constants/global-constants"

interface LinkData {
  displayName: string
  link: string
  external?: boolean
}

export const generalUserLinks: LinkData[] = [
  {
    displayName: "Product",
    link: "/#product",
  },
  {
    displayName: "Safety",
    link: "/#safety",
  },
  {
    displayName: "Pricing",
    link: "/#pricing",
  },
  {
    displayName: "Developer",
    link: uiConstants.linkedinURI,
    external: true,
  },
  {
    displayName: "Get Started",
    link: "/dashboard",
  },
]
