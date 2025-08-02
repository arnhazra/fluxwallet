export const appName = process.env.NEXT_PUBLIC_APP_NAME ?? ""

export const uiConstants = {
  homeHeader: "Invest for future",
  homeIntro:
    "Effortlessly manage your wealth — track assets, monitor net worth, and unlock real-time insights.",
  homePricing: "Enjoy your first year for FREE. Just $29/year afterwards.",
  connectionErrorMessage: "Unable to connect. Please check your internet.",
  authVerificationMessage: "Checking your credentials",
  errorMessage: "Page not found",
  genericError: "Oops! Something went wrong.",
  subscriptionSuccess: "Subscription activated successfully!",
  subscriptionFailed: "Subscription activation failed. Please try again.",
  portfolioDeleteWarning:
    "Please delete all assets within the portfolio before removing it.",
  portfolioDeleteFailed: "Unable to delete the portfolio.",
  notification: "Notification",
  copiedToClipBoard: "Copied to clipboard!",
  invalidOTP: "The OTP you entered is incorrect.",
  getStartedButton: "Start Free",
  assetDeleted: "Successfully deleted the asset",
  linkedinURI: "https://www.linkedin.com/in/arnhazra",
  confirmDescription:
    "This action cannot be undone. Click continue to proceed, or cancel to go back.",
  copyrightText: `${appName} Inc. All rights reserved.`,
  openSourceHeader: `${appName} is built on and contributes to open source.`,
  productHeader: `${appName} brings all your finances together — add and track assets, view your net worth, and gain smart insights. Whether you're planning, growing, or preserving wealth, stay informed with a unified, intuitive experience.`,
  pricingTitle: `${appName} Pricing`,
  privacyPolicyStatement: `By using ${appName}, you agree to our Terms of Service and Privacy Policy.`,
  verifyEmailStatement: `Enter the OTP we’ve sent to your email to verify your identity.`,
  aiSafetyStatement: `${appName} Intelligence is AI-powered and may make mistakes. Please review results carefully.`,
}
