import { config } from "@/config"

export interface SubscriptionConfig {
  price: string
  features: string[]
}

export const subscriptionConfig: SubscriptionConfig = {
  price: config.SUBSCRIPTION_PRICE,
  features: [
    "Unified Financial Dashboard",
    `${config.APP_NAME} Intelligence`,
    "Real-Time Net Worth Tracking",
    "Smart Categorization & Organization",
    "Insightful Reports & Trends",
    "Privacy-First Experience",
  ],
}
