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
    "Priority API response",
    "Unlimited API usage",
    "Great for extensive usage",
    "Includes Pro Models",
  ],
}
