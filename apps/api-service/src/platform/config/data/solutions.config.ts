import { config } from "@/config"

interface Solution {
  displayName: string
  description: string
  icon: string
  vector: string
}

export interface SolutionConfig {
  title: string
  desc: string
  solutions: Solution[]
}

export const solutionConfig: SolutionConfig = {
  title: "Solutions",
  desc: `${config.APP_NAME} brings all your finances together — add and track assets, view your net worth, and gain smart insights. Whether you're planning, growing, or preserving wealth, stay informed with a unified, intuitive experience.`,
  solutions: [
    {
      displayName: "Overview",
      description:
        "View your entire financial picture in one place. Track assets, liabilities, and net worth effortlessly, giving you clarity and confidence to plan ahead.",
      icon: "Activity",
      vector: "overview",
    },
    {
      displayName: "Intelligence",
      description:
        "Unlock smarter decisions with AI-powered insights. Discover trends, anticipate risks, and receive personalized suggestions designed to grow and protect your financial future.",
      icon: "Sparkle",
      vector: "intelligence",
    },
    {
      displayName: "Control",
      description:
        "Stay in charge of your portfolio. Add, edit, or remove entries anytime, ensuring your financial records remain accurate, flexible, and always upto date.",
      icon: "Cog",
      vector: "control",
    },
  ],
}
