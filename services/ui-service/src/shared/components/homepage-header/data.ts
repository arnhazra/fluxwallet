import { uiConstants } from "@/shared/constants/global-constants"

interface LinkData {
  displayName: string
  link: string
  external?: boolean
}

export const generalUserLinks: LinkData[] = [
  {
    displayName: "Apps",
    link: "/#apps",
  },
  {
    displayName: "Solutions",
    link: "/#solutions",
  },
  {
    displayName: "Open Source",
    link: "/#opensource",
  },
  {
    displayName: "Developer",
    link: uiConstants.linkedinURI,
    external: true,
  },
]
