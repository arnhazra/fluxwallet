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
    "Real-Time Net Worth Tracking",
    "Smart Categorization & Organization",
    `${config.BRAND_NAME} Natural Intelligence ™`,
    "Insightful Reports & Trends",
    "Privacy-First Experience",
  ],
}
