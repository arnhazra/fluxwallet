import { config } from "src/config"
import {
  devAPIURI,
  devUIURI,
  prodAPIURI,
  prodUIURI,
} from "@/shared/constants/other-constants"

export function getRediretURIUI(success: boolean) {
  if (success) {
    return config.NODE_ENV === "development"
      ? `${devUIURI}/dashboard?subscriptionSuccess=true`
      : `${prodUIURI}/dashboard?subscriptionSuccess=true`
  } else {
    return config.NODE_ENV === "development"
      ? `${devUIURI}/dashboard?subscriptionSuccess=false`
      : `${prodUIURI}/dashboard?subscriptionSuccess=false`
  }
}

export function getRediretURIAPI(success: boolean) {
  if (success) {
    return config.NODE_ENV === "development"
      ? `${devAPIURI}/subscribe`
      : `${prodAPIURI}/subscribe`
  } else {
    return config.NODE_ENV === "development"
      ? `${devAPIURI}/cancel`
      : `${prodAPIURI}/cancel`
  }
}
