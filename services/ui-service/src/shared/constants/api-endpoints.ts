const apiHost = process.env.NEXT_PUBLIC_CORE_SERVICE_URL!

export const endPoints = {
  // Auth Service
  requestOTP: `${apiHost}/auth/requestotp`,
  validateOTP: `${apiHost}/auth/validateotp`,
  googleOAuthLogin: `${apiHost}/auth/googleoauth`,
  userDetails: `${apiHost}/auth/userdetails`,
  refresh: `${apiHost}/auth/refresh`,
  signOut: `${apiHost}/auth/signout`,
  updateAttribute: `${apiHost}/auth/attribute`,
  // Platform Service
  getConfig: `${apiHost}/platform/config`,
  intelligence: `${apiHost}/platform/intelligence`,
  widgets: `${apiHost}/platform/widgets`,
  // Apps Service
  space: `${apiHost}/apps/wealthanalyzer/space`,
  asset: `${apiHost}/apps/wealthanalyzer/asset`,
  debt: `${apiHost}/apps/debttrack/debt`,
  goal: `${apiHost}/apps/wealthgoal/goal`,
  news: `${apiHost}/apps/discover/news`,
  expense: `${apiHost}/apps/expensetrack/expense`,
  taxAdvisor: `${apiHost}/apps/taxadvisor`,
  cashflow: `${apiHost}/apps/cashflow`,
}
