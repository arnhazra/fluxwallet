export interface ProductConfig {
  productName: string
  displayName: string
  description: string
  icon: any
}

export const productConfig: ProductConfig[] = [
  {
    productName: "assetmanager",
    displayName: "Asset Manager",
    description:
      "A complete tool for organizing, monitoring, and analyzing financial assets. Delivering real-time tracking and simplified management.",
    icon: "Banknote",
  },
  {
    productName: "debttrack",
    displayName: "Debt Track",
    description:
      "Track your liabilities, repayments, and interest with clarity. Stay organized, monitor progress, and achieve debt-free living.",
    icon: "CreditCard",
  },
  {
    productName: "goals",
    displayName: "Goals",
    description:
      "Define, track, and achieve financial goals with predictive analysis, actionable tracking, and long-term discipline.",
    icon: "Target",
  },
  {
    productName: "intelligence",
    displayName: "Intelligence",
    description:
      "Transform financial data into insights with AI analytics. Uncover opportunities, assess risks, and optimize strategies.",
    icon: "Brain",
  },
  {
    productName: "advisorx",
    displayName: "AdvisorX",
    description:
      "AI-powered advisor offering personalized financial guidance, real-time recommendations, and smart collaboration for clients.",
    icon: "Users",
  },
]
