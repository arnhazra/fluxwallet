const apiHost = process.env.NEXT_PUBLIC_API_URL!

export const endPoints = {
  // Auth Service
  requestOTP: `${apiHost}/auth/requestotp`,
  validateOTP: `${apiHost}/auth/validateotp`,
  googleOAuthLogin: `${apiHost}/auth/googleoauth`,
  userDetails: `${apiHost}/auth/userdetails`,
  activateTrial: `${apiHost}/auth/activatetrial`,
  signOut: `${apiHost}/auth/signout`,
  updateAttribute: `${apiHost}/auth/attribute`,
  // Platform Service
  createCheckoutSession: `${apiHost}/platform/subscription/checkout`,
  subscribe: `${apiHost}/platform/subscription/subscribe`,
  getConfig: `${apiHost}/platform/config`,
  intelligence: `${apiHost}/platform/intelligence`,
  // Products Service
  space: `${apiHost}/products/wealthanalyzer/space`,
  asset: `${apiHost}/products/wealthanalyzer/asset`,
  debt: `${apiHost}/products/debttrack/debt`,
  goal: `${apiHost}/products/wealthgoal/goal`,
  news: `${apiHost}/products/discover/news`,
  expense: `${apiHost}/products/expensetrack/expense`,
}
