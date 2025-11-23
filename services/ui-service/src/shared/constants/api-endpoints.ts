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
  // Apps Service
  space: `${apiHost}/apps/wealthanalyzer/space`,
  asset: `${apiHost}/apps/wealthanalyzer/asset`,
  debt: `${apiHost}/apps/debttrack/debt`,
  goal: `${apiHost}/apps/wealthgoal/goal`,
  news: `${apiHost}/apps/discover/news`,
  expense: `${apiHost}/apps/expensetrack/expense`,
  taxAdvisor: `${apiHost}/apps/taxadvisor`,
}
