import { uiConstants } from "@/shared/constants/global-constants"

interface LinkData {
  displayName: string
  link: string
  external?: boolean
}

export const generalUserLinks: LinkData[] = [
  {
    displayName: "Products",
    link: "/#products",
  },
  {
    displayName: "Solutions",
    link: "/#solutions",
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
]
