import { config } from "src/config"

export function getRediretURIUI(success: boolean) {
  if (success) {
    return `${config.UI_URL}/dashboard?subscriptionSuccess=true`
  }
  return `${config.UI_URL}/dashboard?subscriptionSuccess=false`
}

export function getRediretURIAPI(success: boolean) {
  if (success) {
    return `${config.API_URL}/subscribe`
  }
  return `${config.API_URL}/subscribe`
}
