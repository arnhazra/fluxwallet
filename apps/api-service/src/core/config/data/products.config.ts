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
      "A complete tool for organizing, monitoring, and analyzing financial assets. Asset Manager delivers real-time tracking, insightful reports, and simplified management for individuals and organizations managing portfolios, investments, or property efficiently.",
    icon: "Wallet",
  },
  {
    productName: "debttrack",
    displayName: "Debt Track",
    description:
      "Debt Track simplifies loan and liability management by tracking repayments, due dates, and interest rates. It provides clear visibility, progress monitoring, and structured strategies to help users stay organized and debt-free.",
    icon: "CreditCard",
  },
  {
    productName: "goals",
    displayName: "Goals",
    description:
      "Goals empowers users to define, track, and achieve financial objectives. From retirement savings to education funding, it provides predictive analysis, actionable tracking, and discipline to stay aligned with long-term aspirations.",
    icon: "Target",
  },
  {
    productName: "intelligence",
    displayName: "Intelligence",
    description:
      "Intelligence transforms financial data into actionable insights using AI-driven analytics and visual dashboards. It helps uncover opportunities, assess risks, and optimize strategies for smarter, data-backed financial and investment decisions.",
    icon: "Brain",
  },
  {
    productName: "advisorx",
    displayName: "AdvisorX",
    description:
      "AdvisorX connects financial advisors with clients through secure collaboration, personalized recommendations, and real-time updates. It enhances communication, builds trust, and enables advisors to deliver effective, client-focused financial strategies digitally.",
    icon: "Users",
  },
]
