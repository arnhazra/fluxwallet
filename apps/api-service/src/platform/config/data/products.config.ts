interface Product {
  productName: string
  displayName: string
  description: string
  icon: string
  url: string
}

export interface ProductsConfig {
  title: string
  desc: string
  products: Product[]
}

export const productConfig: ProductsConfig = {
  title: "Products",
  desc: "Bring all your finances together in one place—add assets, track net worth, and unlock actionable insights. Plan, grow, and preserve wealth with clarity through a unified, intuitive experience.",
  products: [
    {
      productName: "wealthanalyzer",
      displayName: "WealthAnalyzer",
      description:
        "A complete tool for organizing, monitoring, and analyzing financial assets. Delivering real-time tracking and simplified management.",
      icon: "Banknote",
      url: "/products/wealthanalyzer/dashboard",
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
      productName: "wealthgoal",
      displayName: "WealthGoal",
      description:
        "Define, track, and achieve financial goals with predictive analysis, actionable tracking, and long-term discipline.",
      icon: "Goal",
      url: "/products/wealthgoal/dashboard",
    },
    {
      productName: "intelligence",
      displayName: "Intelligence",
      description:
        "Transform financial data into insights with AI analytics. Uncover opportunities, assess risks, and optimize strategies.",
      icon: "Sparkles",
      url: "/products/intelligence",
    },
    {
      productName: "advisorx",
      displayName: "AdvisorX",
      description:
        "AI-powered advisor offering personalized financial guidance, real-time recommendations, and smart collaboration for clients.",
      icon: "Brain",
      url: "/products/advisorx",
    },
  ],
}
