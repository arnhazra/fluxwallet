export interface TechnologyConfig {
  title: string
  desc: string
  cardTitle: string
  cardDesc: string
  cards: {
    title: string
    desc: string
  }[]
}

export const technologyConfig: TechnologyConfig = {
  title: "Technology",
  desc: `Protect your data and apps with HyperSec™ our next-generation security layer delivering real-time encryption, and automatic isolation with near-zero latency.`,
  cardTitle: "HyperSec™ Encryption Layer",
  cardDesc:
    " A lightweight, high-assurance layer that encrypts data in transit and at rest with minimal overhead.",
  cards: [
    {
      title: "End-to-end coverage",
      desc: "Encrypt data at the boundary: in transit and at rest, across services.",
    },
    {
      title: "Fast by default",
      desc: " Built for low latency with modern ciphers (e.g., AES-256-GCM,TLS 1.3).",
    },
  ],
}
