import { config } from "@/config"

export interface SubscriptionConfig {
  subscriptionName: string
  price: string
  features: string[]
}

export const subscriptionPricing: SubscriptionConfig = {
  subscriptionName: "Pro Subscription",
  price: config.SUBSCRIPTION_PRICE,
  features: [
    "Unified Financial Dashboard",
    `${config.BRAND_NAME} Intelligence`,
    "Real-Time Net Worth Tracking",
    "Smart Categorization & Organization",
    "Insightful Reports & Trends",
    "Privacy-First Experience",
  ],
}
