export interface ProductConfig {
  productName: string
  displayName: string
  description: string
  icon: string
  url: string
}

export const productConfig: ProductConfig[] = [
  {
    productName: "assetmanager",
    displayName: "Asset Manager",
    description:
      "A complete tool for organizing, monitoring, and analyzing financial assets. Delivering real-time tracking and simplified management.",
    icon: "Banknote",
    url: "/products/assetmanager/dashboard",
  },
  {
    productName: "debttrack",
    displayName: "DebtTrack",
    description:
      "Track your liabilities, repayments, and interest with clarity. Stay organized, monitor progress, and achieve debt-free living.",
    icon: "CreditCard",
    url: "/products/debttrack/dashboard",
  },
  {
    productName: "goals",
    displayName: "Goals",
    description:
      "Define, track, and achieve financial goals with predictive analysis, actionable tracking, and long-term discipline.",
    icon: "Target",
    url: "/products/goals/dashboard",
  },
  {
    productName: "intelligence",
    displayName: "Intelligence",
    description:
      "Transform financial data into insights with AI analytics. Uncover opportunities, assess risks, and optimize strategies.",
    icon: "Brain",
    url: "/products/intelligence",
  },
  {
    productName: "advisorx",
    displayName: "AdvisorX",
    description:
      "AI-powered advisor offering personalized financial guidance, real-time recommendations, and smart collaboration for clients.",
    icon: "Users",
    url: "/products/advisorx",
  },
]
