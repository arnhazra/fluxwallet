import { config } from "@/config"

export interface SubscriptionConfig {
  price: string
  features: string[]
  trialSubscription: string
}

export const subscriptionConfig: SubscriptionConfig = {
  price: config.SUBSCRIPTION_PRICE,
  features: [
    "Unified Financial Dashboard",
    `${config.APP_NAME} Intelligence`,
    "Real-Time Net Worth Tracking",
    "Smart Categorization & Organization",
    "Track debts and set financial goals",
    "Privacy-First Experience",
  ],
  trialSubscription: `Try ${config.APP_NAME} FREE for 6 months worth $${Number(config.SUBSCRIPTION_PRICE) / 2}`,
}
